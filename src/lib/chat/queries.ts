import "server-only"

import { and, desc, eq, inArray, lt, ne, or, sql } from "drizzle-orm"

import { db } from "@/db"
import { conversationMembers, conversations, messages, projectMembers, projects, users } from "@/db/schema"
import type { ChatAuthor, ChatMessage, ConversationSummary } from "@/lib/chat/types"

// Chat reads, scoped to the viewer. Drizzle bypasses RLS: `canAccess` / the visibility filter is the access control.
// Not cached: unread counts must be fresh and messages are read live (Realtime comes later).

export type Executor = Pick<typeof db, "select">

/** Direct: the user is a participant. Project: the user is a member of the project. */
const visibleTo = (userId: string) =>
  or(
    and(
      eq(conversations.kind, "direct"),
      sql`exists (select 1 from ${conversationMembers} cm where cm.conversation_id = ${conversations.id} and cm.user_id = ${userId})`,
    ),
    and(
      eq(conversations.kind, "project"),
      sql`exists (select 1 from ${projectMembers} pm where pm.project_id = ${conversations.projectId} and pm.user_id = ${userId})`,
    ),
  )

/** The conversation row when `userId` may read/write it, else undefined (a non-member must not learn it exists). */
export async function canAccess(ex: Executor, userId: string, conversationId: string) {
  const [row] = await ex
    .select({ id: conversations.id, kind: conversations.kind, projectId: conversations.projectId })
    .from(conversations)
    .where(and(eq(conversations.id, conversationId), visibleTo(userId)))
    .limit(1)
  return row
}

export async function getConversations(userId: string): Promise<ConversationSummary[]> {
  const rows = await db
    .select({
      id: conversations.id,
      kind: conversations.kind,
      projectId: conversations.projectId,
      projectName: projects.name,
      lastMessageAt: conversations.lastMessageAt,
    })
    .from(conversations)
    .leftJoin(projects, eq(projects.id, conversations.projectId))
    .where(visibleTo(userId))
    .orderBy(sql`${conversations.lastMessageAt} desc nulls last`, desc(conversations.createdAt))
  if (rows.length === 0) return []
  const ids = rows.map((r) => r.id)

  const [peers, last, unread] = await Promise.all([
    db
      .select({ conversationId: conversationMembers.conversationId, id: users.id, name: users.name, avatar: users.avatar })
      .from(conversationMembers)
      .innerJoin(users, eq(users.id, conversationMembers.userId))
      .where(and(inArray(conversationMembers.conversationId, ids), ne(conversationMembers.userId, userId))),
    db
      .selectDistinctOn([messages.conversationId], {
        conversationId: messages.conversationId,
        body: messages.body,
        authorId: messages.authorId,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(inArray(messages.conversationId, ids))
      .orderBy(messages.conversationId, desc(messages.createdAt)),
    db
      .select({ conversationId: messages.conversationId, n: sql<number>`count(*)::int` })
      .from(messages)
      .leftJoin(
        conversationMembers,
        and(eq(conversationMembers.conversationId, messages.conversationId), eq(conversationMembers.userId, userId)),
      )
      .where(
        and(
          inArray(messages.conversationId, ids),
          sql`${messages.authorId} is distinct from ${userId}`,
          or(sql`${conversationMembers.lastReadAt} is null`, sql`${messages.createdAt} > ${conversationMembers.lastReadAt}`),
        ),
      )
      .groupBy(messages.conversationId),
  ])

  const lastBy = new Map(last.map((l) => [l.conversationId, l]))
  const unreadBy = new Map(unread.map((u) => [u.conversationId, u.n]))
  const peerBy = new Map<string, ChatAuthor>()
  for (const p of peers) if (!peerBy.has(p.conversationId)) peerBy.set(p.conversationId, { id: p.id, name: p.name, avatar: p.avatar })

  return rows.map((r) => {
    const peer = r.kind === "direct" ? (peerBy.get(r.id) ?? null) : null
    const l = lastBy.get(r.id)
    return {
      id: r.id,
      kind: r.kind,
      projectId: r.projectId,
      title: r.kind === "project" ? (r.projectName ?? "Project") : (peer?.name ?? "Unknown"),
      peer,
      lastMessage: l ? { body: l.body, authorId: l.authorId, createdAt: l.createdAt } : null,
      lastMessageAt: r.lastMessageAt,
      unreadCount: unreadBy.get(r.id) ?? 0,
    }
  })
}

/** Newest-first page returned oldest-first. Empty when the user has no access. */
export async function getMessages(
  userId: string,
  conversationId: string,
  { before, limit = 50 }: { before?: Date; limit?: number } = {},
): Promise<ChatMessage[]> {
  if (!(await canAccess(db, userId, conversationId))) return []
  const rows = await db
    .select({
      id: messages.id,
      conversationId: messages.conversationId,
      body: messages.body,
      createdAt: messages.createdAt,
      editedAt: messages.editedAt,
      authorId: users.id,
      authorName: users.name,
      authorAvatar: users.avatar,
    })
    .from(messages)
    .leftJoin(users, eq(users.id, messages.authorId))
    .where(and(eq(messages.conversationId, conversationId), before ? lt(messages.createdAt, before) : undefined))
    .orderBy(desc(messages.createdAt), desc(messages.id))
    .limit(Math.min(Math.max(limit, 1), 100))
  return rows.reverse().map((r) => ({
    id: r.id,
    conversationId: r.conversationId,
    body: r.body,
    createdAt: r.createdAt,
    editedAt: r.editedAt,
    author: r.authorId ? { id: r.authorId, name: r.authorName!, avatar: r.authorAvatar } : null,
  }))
}
