# Task
Add a client hook `useMessageStream` that subscribes to new chat messages via Supabase Realtime (no UI).

## TODO item
- [ ] Supabase Realtime subscription for new messages

## Goal
A reusable hook for the future chat UI: given a conversation id, it delivers newly inserted `messages` rows live (RLS applies via the Clerk token), cleans up on unmount. Plus a node smoke test proving realtime delivery and RLS filtering.

## Files
- read: `src/lib/supabase/client.ts` (`useSupabase`), `src/lib/chat/{types,queries,actions}.ts`, `src/db/migrations/0003_chat.sql` (messages in `supabase_realtime`, RLS), `scripts/chat-schema-smoke.mjs`
- new: `src/lib/chat/realtime.ts` (client-only, `"use client"`): `useMessageStream(conversationId, onMessage)` + exported pure `parseMessageRow(row)`
- new: `scripts/chat-realtime-smoke.mjs`

## Steps
1. `parseMessageRow(payload.new)`: maps snake_case row (`id, conversation_id, author_id, body, created_at, edited_at`) to `{ id, conversationId, authorId, body, createdAt: Date, editedAt: Date|null }`. Author name/avatar are NOT in the row; the consumer resolves via a members list or refetches (document in a comment). Export type `StreamedMessage`.
2. `useMessageStream(conversationId: string | null, onMessage: (m: StreamedMessage) => void)`: `useSupabase()`; effect creates channel `messages:<conversationId>` with `postgres_changes` INSERT on `public.messages` filter `conversation_id=eq.<id>`; subscribes; cleanup `supabase.removeChannel`. Keep `onMessage` in a ref so the effect depends only on client + id. Skip when id null. Also handle Clerk token refresh: `supabase.realtime.setAuth()` is handled by `accessToken` option; do not add extra code unless needed.
3. Smoke script (node, `.env.local` via `process.loadEnvFile`): create temp users/project/conversation with unique `smoke_<tag>` prefix via `postgres` (like chat-schema-smoke). Two supabase-js clients with `accessToken` returning a JWT. Mint the JWT the same way earlier smoke tests did for Phase 4 (Clerk Backend API session token using `CLERK_SECRET_KEY`: create a session + token for a real Clerk user who is a temp member) — if that is impractical for temp `smoke_` users, use a real existing Clerk user and add them as temp conversation member, removed at the end. Assert: member client receives INSERT within 10 s (PASS); a client for a non-member user receives nothing within 3 s (PASS). Clean up only its own rows.
4. Do not add UI. Do not touch existing chat files except exporting types if needed.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` ok
- `node scripts/chat-realtime-smoke.mjs` prints `PASS member receives insert` and `PASS non-member receives nothing`, exits 0, leaves no `smoke_` rows
- grep new files: no hex colors, `space-[xy]-`, `dark:`
- If realtime delivery cannot be proven (token minting impossible), report exactly why in report.md and still ship the hook with a `parseMessageRow` unit-style assertion in the script.

## Decisions
- Hook delivers raw row (no author join): realtime payloads carry only the table row; chat UI will merge author info from the already-loaded members. Chosen over a refetch-per-message for fewer round trips.
- Filter by conversation_id server-side in the channel; RLS still enforces access.
- Lives in `src/lib/chat/realtime.ts` (no `src/hooks` dir in repo).

## Don't
- No chat UI, no new Figma-less components, no migration (messages already in `supabase_realtime`), no service-role key in the browser, no edits to `.env.local`.
