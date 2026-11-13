# Report: 5a chat schema

## Changed
- new `src/db/schema/chat.ts`: enum `conversation_kind`, tables `conversations`, `conversation_members`, `messages` (checks, partial unique index, composite PK, indexes, SELECT policies, RLS on).
- `src/db/schema/rls.ts`: `isConversationViewer()` helper (calls `public.viewer_conversation_ids()`).
- `src/db/schema/index.ts` export chat; `relations.ts` relations for the 3 tables.
- new `src/db/migrations/0003_chat.sql` (+ `meta/0003_snapshot.json`, `_journal.json`): drizzle output + hand-added SECURITY DEFINER `viewer_conversation_ids()` (before policies, revoke from public, grant to authenticated) + guarded `alter publication supabase_realtime add table public.messages`.
- new `scripts/chat-schema-smoke.mjs`.
- `design/backend/TODO.md` shows modified in git; not by me (untouched).

## Decisions
- Messages index given explicit name `messages_conversation_id_created_at_idx` (drizzle needs a name for desc expressions).
- Extra check: direct kind rejects project_id (follows from the kind/project_id CHECK).
- Smoke script uses plain `postgres` + `process.loadEnvFile` (no tsx/@next/env).

## Commands
- `pnpm exec drizzle-kit generate --name chat`: PASS (0003_chat.sql)
- `pnpm db:migrate`: PASS applied
- `node scripts/chat-schema-smoke.mjs`: PASS x10 lines, exit 0; rerun PASS, 0 leftover `smoke_%` users
- pg_tables.rowsecurity true for all 3; messages in `supabase_realtime`: PASS
- `pnpm db:generate`: "No schema changes": PASS
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 pre-existing warning in command.tsx)
- `pnpm build`: PASS

## Undone
Nothing.
