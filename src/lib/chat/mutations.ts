import "server-only"

import { and, eq, sql } from "drizzle-orm"
import type { z } from "zod"

import { db } from "@/db"
import { conversationMembers, conversations, messages, projectMembers, projects, users } from "@/db/schema"
import { canAccess } from "@/lib/chat/queries"
import type { sendMessageInput } from "@/lib/chat/schemas"
import type { ChatMessage, WriteResult } from "@/lib/chat/types"

// Chat writes: signed-in user id from auth() + validated input, one transaction, access check in code
// (Drizzle bypasses RLS and the tables have no write policies).

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

export class ChatError extends Error {
  constructor(
    readonly code: "not_found" | "invalid",
    message: string,
  ) {
    super(message)
    this.name = "ChatError"
  }
}

/** Everyone who sees the conversation: its participants, or the project's members. */
async function viewerIds(tx: Tx, c: { id: string; kind: "project" | "direct"; projectId: string | null }) {
  if (c.kind === "project") {
    const rows = await tx.select({ id: projectMembers.userId }).from(projectMembers).where(eq(projectMembers.projectId, c.projectId!))
    return rows.map((r) => r.id)
  }
  const rows = await tx.select({ id: conversationMembers.userId }).from(conversationMembers).where(eq(conversationMembers.conversationId, c.id))
  return rows.map((r) => r.id)
}

async function requireAccess(tx: Tx, userId: string, conversationId: string) {
  const c = await canAccess(tx, userId, conversationId)
  if (!c) throw new ChatError("not_found", "Conversation not found")
  return c
}

export async function startDirect(userId: string, otherId: string): Promise<WriteResult> {
  if (otherId === userId) throw new ChatError("invalid", "You can't message yourself")
  return db.transaction(async (tx) => {
    const [other] = await tx.select({ id: users.id }).from(users).where(eq(users.id, otherId)).limit(1)
    if (!other) throw new ChatError("not_found", "User not found")

    // Serialize concurrent starts of the same pair so we don't create two threads.
    const [a, b] = [userId, otherId].sort()
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`chat-direct:${a}:${b}`}))`)

    const [existing] = await tx
      .select({ id: conversations.id })
      .from(conversations)
      .where(
        and(
          eq(conversations.kind, "direct"),
          sql`(select count(*) from ${conversationMembers} cm where cm.conversation_id = ${conversations.id}) = 2`,
          sql`exists (select 1 from ${conversationMembers} cm where cm.conversation_id = ${conversations.id} and cm.user_id = ${userId})`,
          sql`exists (select 1 from ${conversationMembers} cm where cm.conversation_id = ${conversations.id} and cm.user_id = ${otherId})`,
        ),
      )
      .limit(1)
    if (existing) return { conversationId: existing.id, userIds: [userId, otherId] }

    const [created] = await tx.insert(conversations).values({ kind: "direct", createdBy: userId }).returning({ id: conversations.id })
    await tx.insert(conversationMembers).values([
      { conversationId: created.id, userId },
      { conversationId: created.id, userId: otherId },
    ])
    return { conversationId: created.id, userIds: [userId, otherId] }
  })
}

/** Project chat is created on first use. Any project member may open it. */
export async function ensureProjectConversation(userId: string, projectId: string): Promise<WriteResult> {
  return db.transaction(async (tx) => {
    const [member] = await tx
      .select({ id: projects.id })
      .from(projects)
      .innerJoin(projectMembers, and(eq(projectMembers.projectId, projects.id), eq(projectMembers.userId, userId)))
      .where(eq(projects.id, projectId))
      .limit(1)
    if (!member) throw new ChatError("not_found", "Project not found")

    await tx.insert(conversations).values({ kind: "project", projectId, createdBy: userId }).onConflictDoNothing()
    const [c] = await tx.select({ id: conversations.id }).from(conversations).where(eq(conversations.projectId, projectId)).limit(1)
    const ids = await viewerIds(tx, { id: c.id, kind: "project", projectId })
    return { conversationId: c.id, userIds: ids }
  })
}

export async function sendMessage(userId: string, input: z.output<typeof sendMessageInput>): Promise<WriteResult> {
  return db.transaction(async (tx) => {
    const c = await requireAccess(tx, userId, input.conversationId)
    const [row] = await tx.insert(messages).values({ conversationId: c.id, authorId: userId, body: input.body }).returning()
    await tx.update(conversations).set({ lastMessageAt: row.createdAt }).where(eq(conversations.id, c.id))
    // The sender has read everything up to their own message (no-op when they have no members row).
    await tx
      .update(conversationMembers)
      .set({ lastReadAt: row.createdAt })
      .where(and(eq(conversationMembers.conversationId, c.id), eq(conversationMembers.userId, userId)))

    const [author] = await tx.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, userId)).limit(1)
    const message: ChatMessage = {
      id: row.id,
      conversationId: row.conversationId,
      body: row.body,
      createdAt: row.createdAt,
      editedAt: row.editedAt,
      author: author ?? null,
    }
    return { conversationId: c.id, userIds: await viewerIds(tx, c), message }
  })
}

export async function markRead(userId: string, conversationId: string): Promise<WriteResult> {
  return db.transaction(async (tx) => {
    const c = await requireAccess(tx, userId, conversationId)
    await tx
      .insert(conversationMembers)
      .values({ conversationId: c.id, userId, lastReadAt: sql`now()` })
      .onConflictDoUpdate({
        target: [conversationMembers.conversationId, conversationMembers.userId],
        set: { lastReadAt: sql`now()` },
      })
    return { conversationId: c.id, userIds: [userId] }
  })
}
