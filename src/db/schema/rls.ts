import { sql, type SQL } from "drizzle-orm"
import type { AnyPgColumn } from "drizzle-orm/pg-core"

// RLS guards the Supabase clients (browser Realtime/Storage with the Clerk token).
// Drizzle connects as the table owner and bypasses these: server code scopes queries itself.
// Only SELECT policies: every write goes through the server.

/** Clerk user id from the Supabase JWT (Clerk third-party auth puts it in `sub`). */
export const clerkUserId = sql`(select auth.jwt() ->> 'sub')`

/** True when the signed-in user is a member of the project in `projectId`. */
export const isProjectMember = (projectId: AnyPgColumn): SQL =>
  sql`${projectId} in (select project_id from project_members where user_id = ${clerkUserId})`

/**
 * True when the signed-in user can see the conversation in `conversationId`. Uses the SECURITY DEFINER helper
 * `public.viewer_conversation_ids()` (migration 0003) so conversation_members policies don't recurse.
 */
export const isConversationViewer = (conversationId: AnyPgColumn): SQL =>
  sql`${conversationId} in (select public.viewer_conversation_ids())`
