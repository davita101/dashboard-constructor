import { desc, sql } from "drizzle-orm"
import {
  check,
  index,
  pgEnum,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import { authenticatedRole } from "drizzle-orm/supabase"

import { projects } from "./projects"
import { isConversationViewer } from "./rls"
import { users } from "./users"

export const conversationKind = pgEnum("conversation_kind", ["project", "direct"])

/** Project chat (one per project) and direct Messenger threads share this table. */
export const conversations = pgTable(
  "conversations",
  {
    id: uuid().primaryKey().defaultRandom(),
    kind: conversationKind().notNull(),
    /** Set only for kind=project. */
    projectId: uuid().references(() => projects.id, { onDelete: "cascade" }),
    createdBy: text().references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    /** Sort key for the conversation list; the server updates it on send. */
    lastMessageAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    uniqueIndex("conversations_project_id_unique").on(t.projectId).where(sql`${t.projectId} is not null`),
    check("conversations_kind_project_check", sql`(${t.kind} = 'project') = (${t.projectId} is not null)`),
    pgPolicy("conversations_select_viewer", { for: "select", to: authenticatedRole, using: isConversationViewer(t.id) }),
  ],
).enableRLS()

/**
 * Participants. Required for direct conversations; optional for project ones (access = project membership).
 * `lastReadAt` drives unread counts.
 */
export const conversationMembers = pgTable(
  "conversation_members",
  {
    conversationId: uuid()
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    lastReadAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    primaryKey({ columns: [t.conversationId, t.userId] }),
    index().on(t.userId),
    pgPolicy("conversation_members_select_viewer", {
      for: "select",
      to: authenticatedRole,
      using: isConversationViewer(t.conversationId),
    }),
  ],
).enableRLS()

export const messages = pgTable(
  "messages",
  {
    id: uuid().primaryKey().defaultRandom(),
    conversationId: uuid()
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    authorId: text().references(() => users.id, { onDelete: "set null" }),
    body: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    editedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    index("messages_conversation_id_created_at_idx").on(t.conversationId, desc(t.createdAt)),
    check("messages_body_length_check", sql`char_length(${t.body}) between 1 and 4000`),
    pgPolicy("messages_select_viewer", { for: "select", to: authenticatedRole, using: isConversationViewer(t.conversationId) }),
  ],
).enableRLS()
