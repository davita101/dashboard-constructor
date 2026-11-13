# Task
Phase 5a: chat schema (conversations, conversation_members, messages) with RLS select policies and migration 0003 applied to Supabase.

## TODO item
- [ ] 5a Schema: tables + RLS select policies + migration `0003_chat.sql` applied + smoke test

## Goal
Backend tables for project chat and direct Messenger. No UI, no queries/actions (that is 5b). Writes go through the server later; RLS is SELECT-only so Supabase Realtime (browser, Clerk token) can deliver new messages only to participants.

## Files
- read: `src/db/schema/files.ts`, `events.ts`, `settings.ts`, `rls.ts`, `relations.ts`, `index.ts`, `src/db/migrations/0000_core_schema.sql`, `0002_user_settings.sql`, `drizzle.config.ts`, `src/db/index.ts`
- new: `src/db/schema/chat.ts`, `src/db/migrations/0003_chat.sql` (+ drizzle `meta/` snapshot/journal via `pnpm db:generate`), `scripts/chat-schema-smoke.mjs` (or `.ts` run with `tsx`)
- change: `src/db/schema/index.ts`, `src/db/schema/relations.ts`, `src/db/schema/rls.ts` (helper), `design/backend/TODO.md` is NOT yours to edit

## Steps
1. `conversation_kind` enum: `project`, `direct`.
2. `conversations`: id uuid pk, kind, project_id (uuid, nullable, FK projects cascade; set only for kind=project; unique partial: one project conversation per project), created_by (text → users set null), created_at, `last_message_at` (timestamptz nullable, for sorting; updated by the server on send). CHECK: `(kind='project') = (project_id is not null)`.
3. `conversation_members`: conversation_id (FK cascade), user_id (FK users cascade), joined_at, `last_read_at` (timestamptz nullable, for unread counts). Composite PK (conversation_id, user_id); index on user_id. For kind=project conversations rows are optional (access = project membership); for direct they are the participants.
4. `messages`: id uuid pk, conversation_id (FK cascade), author_id (text → users set null), body text not null (CHECK length 1..4000), created_at, edited_at nullable. Index (conversation_id, created_at desc).
5. RLS (enableRLS + SELECT policies to `authenticated`, no write policies). Use a SECURITY DEFINER helper `viewer_conversation_ids()` (stable, `set search_path = ''`, returns uuid set: direct conversations the viewer is a member of + project conversations whose project the viewer is a member of), modelled on existing `viewer_project_ids()` in `0001_storage_buckets.sql` — avoids recursive RLS on conversation_members. Policies: conversations `id in (select viewer_conversation_ids())`; messages `conversation_id in (…)`; conversation_members `conversation_id in (…)`. Grant execute to `authenticated`.
6. Add Drizzle relations in `relations.ts`; export from `schema/index.ts`.
7. `pnpm db:generate` (name `chat`), rename/check output is `0003_chat.sql`; hand-append the helper function (custom SQL, like 0001) ahead of the policies if drizzle does not emit it; keep Drizzle's policy defs in `chat.ts` so snapshot stays consistent. Apply with `pnpm db:migrate`.
8. Realtime: `ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;` in the migration (guard with DO block if publication missing/already contains it).
9. Smoke script (loads `.env.local` via `@next/env`, uses Drizzle/postgres): insert a temp user pair, a direct conversation + 2 messages, a project conversation for a temp project, assert: CHECK constraints reject bad rows (project kind without project_id; empty body), unique project conversation, cascade delete from conversation removes messages; then clean up ONLY the rows it created. Optionally assert `viewer_conversation_ids()` with `set local request.jwt.claims` for a member vs non-member inside a rolled-back tx. Print `PASS <name>` lines.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- `pnpm db:generate` afterwards reports "No schema changes".
- `node`/`pnpm exec tsx scripts/chat-schema-smoke.*` prints all PASS lines and exits 0; rerun leaves no rows behind.
- Supabase has `conversations`, `conversation_members`, `messages` with RLS enabled (check `pg_tables.rowsecurity`) and `messages` in publication `supabase_realtime` (check `pg_publication_tables`).
- Existing tables untouched (migration purely additive).
- Grep new files: no hex colors, `space-[xy]-`, `dark:` (none expected).

## Decisions
- One shared `conversations` table with `kind` (project chat + direct) rather than two table sets: Messenger and project chat share message shape and Realtime channel logic.
- Project conversation access derives from project membership (no member rows needed), so adding/removing project members needs no chat sync.
- No read receipts per message; `last_read_at` per member gives unread counts cheaply.
- No attachments/reactions/threads: no Figma frame defines them.
- Message edit/delete not exposed yet (`edited_at` column only).

## Don't
- No UI, no queries/actions/Zod (5b), no Realtime client hook yet.
- Never drop/alter existing tables or touch non-seed data. Don't edit `.env.local`.
- Don't edit TODO.md (reviewer ticks it).
