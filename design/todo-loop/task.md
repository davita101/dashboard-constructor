# Task
Phase 5b: chat queries, Zod schemas, mutations and Server Actions (no UI: no chat Figma frame).

## TODO item
  - [ ] 5b Queries (`src/lib/chat/queries.ts`) + Zod schemas + Server Actions (start direct conversation, send message, mark read)

## Goal
Server-side chat API on top of migration 0003 tables (`conversations`, `conversation_members`, `messages`), scoped to the Clerk viewer. Drizzle bypasses RLS, so code must do the access check.

## Files
Read: `src/db/schema/chat.ts`, `src/db/schema/relations.ts`, `src/lib/projects/actions.ts`, `mutations.ts`, `queries.ts`, `schemas.ts`, `src/lib/auth/viewer.ts`, `scripts/chat-schema-smoke.mjs`.
Create: `src/lib/chat/{schemas,queries,mutations,actions,types,tags}.ts`, `scripts/chat-actions-smoke.mts` (or .mjs via tsx).

## Steps
1. `schemas.ts` (Zod): `startDirectInput {userId}`, `sendMessageInput {conversationId uuid, body trimmed 1..4000}`, `markReadInput {conversationId}`.
2. `tags.ts`: `userChatTag(userId)`, `conversationTag(id)`. Do NOT cache messages with "use cache" (realtime will read them live); cache only the conversation list per user if simple, otherwise skip caching and read uncached.
3. `queries.ts` (server-only, take viewer id as arg):
   - `getConversations(userId)`: visible conversations (direct where member; project where project member) with title (project name, or other participant's name/avatar for direct), last message preview, `lastMessageAt`, unread count (messages by others after `lastReadAt`; null lastReadAt = all by others). Sorted by lastMessageAt desc nulls last.
   - `getMessages(userId, conversationId, {before?, limit=50})`: access check, newest-first page returned oldest-first, with author name/avatar; empty/NotFound if no access.
   - `getProjectConversationId`-style helper not needed; project chat is created lazily in `sendMessage`/`ensureProjectConversation(userId, projectId)` (membership check, insert on conflict do nothing on unique project_id).
4. `mutations.ts` (transactions, `ChatError` like `MutationError`):
   - `startDirect(userId, otherId)`: other must exist in `users`, not self; reuse existing 2-member direct conversation if present, else create conversation + 2 members. Returns id.
   - `sendMessage(userId, {conversationId, body})`: access check (direct: member; project: project member, ensure conversation_members row not required), insert message, set `conversations.lastMessageAt`, set sender's `lastReadAt` for direct members row if exists. Returns message.
   - `markRead(userId, conversationId)`: access check; upsert `conversation_members` row (project chats: insert row for viewer if missing) with `lastReadAt = now()`.
5. `actions.ts` ("use server"): `startDirectAction`, `sendMessageAction`, `markReadAction` — `getViewerId()` → parse → mutation → `updateTag` for affected users' chat tags; return plain result objects (`{status:"ok", ...}` / error state, reuse `ActionState` from projects).
6. Smoke test script against Supabase (temp rows with `smoke_<tag>` prefix, remove only those at end), PASS lines for: direct start creates + is idempotent, self/unknown user refused, send by member ok, send by non-member refused, project chat lazily created & non-member refused, unread count 1 for recipient then 0 after markRead, pagination order, body length 0 / 4001 rejected.
7. Tick 5b in TODO.md is reviewer's job; do not edit TODO.md.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` ok.
- Smoke script (`pnpm exec tsx scripts/chat-actions-smoke.mts` or node) prints all PASS lines above and exits 0; leaves no `smoke_` rows.
- No UI files changed.

## Decisions
- One shared conversations table already; project chat lazily created on first send/read (no backfill migration, no new migration).
- Messages not cached (realtime later); conversation list read uncached to avoid stale unread counts.
- Unread = messages by others after `lastReadAt`.
- Any project member may post in project chat (same permission model as the rest).
- Writes only through the server (no RLS write policies).

## Don't
- No schema/migration changes, no UI, no Realtime subscription (next TODO item), no deleting non-smoke rows.
- Don't edit `.env.local`.
