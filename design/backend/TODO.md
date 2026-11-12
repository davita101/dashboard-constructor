# Backend TODO

Stack: Next.js (Server Components + Server Actions + Route Handlers) · Supabase (Postgres, Storage, Realtime) · Drizzle ORM · Clerk auth · Zod.
Branching: feature branch per phase off `development`, merge back when done.
Source of truth for what the UI needs: `pnpm schema:analyze` → `design/backend/schema-analysis.md`.

## Phase 0 — Tooling (`feat/backend-db-setup`)
- [x] Schema analyzer script (`scripts/analyze-schema.mjs`, `pnpm schema:analyze`)
- [x] Install deps: drizzle-orm, postgres, @supabase/supabase-js, zod, server-only
- [x] Install dev deps: drizzle-kit, supabase CLI, tsx
- [x] Allow supabase CLI postinstall (`pnpm.onlyBuiltDependencies`: supabase, esbuild) → `pnpm exec supabase --version` works
- [x] DB target: Supabase cloud only (project eubbwrwicuqmasvsnjzo)
- [x] `.env.example` (DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, CLERK_WEBHOOK_SIGNING_SECRET); real values in `.env.local`
- [x] `drizzle.config.ts` (loads env via `@next/env`) + scripts: `db:generate`, `db:migrate`, `db:studio`, `db:seed`
- [x] `src/db/index.ts` — server-only Drizzle client (postgres-js, `prepare: false` for Supabase pooler)
- [x] `src/lib/supabase/` — server + browser clients using Clerk session token (`accessToken`)
- [x] Fill `DATABASE_URL` in `.env.local` (Supabase → Connect → Transaction pooler)
- [x] Supabase dashboard: add Clerk as third-party auth provider (Clerk dev instance `divine-whippet-6483.clerk.accounts.dev`; Supabase integration activated in Clerk)

## Phase 1 — Core schema (`feat/backend-schema`)
- [x] `users` (id = Clerk user id, name, avatar, email) + Clerk webhook `app/api/webhooks/clerk/route.ts` (`verifyWebhook`) to sync create/update/delete; `/api/webhooks(.*)` public in `src/proxy.ts`
- [x] `clients` (company: name, logo, description) — from ProjectDetail.company
- [x] `projects` (slug unique, name, logo, client_id, income, cost, deadline, owner_id, timestamps)
- [x] `project_members` join (project_id, user_id, role, joined_at) — covers Member + TeamMember
- [x] `project_stages` (project_id, position, name, start_date, end_date)
- [x] `tasks` (project_id, stage_id, title, description, status enum new/in_work/done/failed, position, dates, cover, created_by) + `task_assignees`, `labels` (per project) + `task_labels`
- [x] `project_events` (project_id, actor_id, kind enum, title, at) — activity feed
- [x] `files` (project_id, stage_id?, task_id?, uploader_id, name, storage_path unique, size, mime)
- [x] Counts as views, not columns: `project_stats` (stages/members/files/tasks by status/progress = done÷all) and `stage_stats` (tasks/assignees/files), both `security_invoker`
- [x] First migration `src/db/migrations/0000_core_schema.sql` applied to Supabase
- [x] Seed `pnpm db:seed` (`src/db/seed.ts`) from `src/lib/projects/data.ts`; idempotent, only touches `seed_` users / seed slugs / seed client
- [x] RLS on every table, SELECT-only policies: member of project via `auth.jwt()->>'sub'` (needs the Clerk third-party provider from Phase 0). No write policies: writes go through the server. Drizzle bypasses RLS → scope queries in code
- [ ] Clerk dashboard: add webhook endpoint `<origin>/api/webhooks/clerk` (user.created/updated/deleted), put its signing secret in `CLERK_WEBHOOK_SIGNING_SECRET` (needs a public URL: deployed site or a tunnel for local)

## Phase 2 — Wire existing pages (`feat/backend-projects-read`)
- [ ] Replace bodies in `src/lib/projects/data.ts` with Drizzle queries, keep signatures
- [ ] getProjects / getProjectDetail / getProjectEvents / getProjectTotals / getProjectFinance
- [ ] Scope all queries to current Clerk user (`auth()`)
- [ ] Caching: `cacheTag` per project + revalidate on writes
- [ ] Remove unused `getProject` or use it
- [ ] Verify pages in browser + `pnpm build`

## Phase 3 — Mutations (`feat/backend-projects-write`)
- [ ] Server Actions + Zod: create project (`/dashboard/projects/new`), update, delete
- [ ] Members: invite/remove/change role
- [ ] Stages: create/reorder/edit
- [ ] Tasks: create/move (dnd-kit order → position)/assign/status
- [ ] Each write appends a `project_events` row
- [ ] QuickAddCard actions wired

## Phase 4 — Files (`feat/backend-files`)
- [ ] Supabase Storage bucket `project-files` + policies
- [ ] Upload (file-upload component) → `files` row; download via signed URL
- [ ] Project logos / client logos to storage

## Phase 5 — Chat & realtime (`feat/backend-chat`)
- [ ] `conversations`, `conversation_members`, `messages` (project chat + direct Messenger)
- [ ] Supabase Realtime subscription for new messages
- [ ] Live task board updates (optional)

## Phase 6 — User settings (`feat/backend-settings`)
- [ ] `user_settings` (theme, language, dashboard widget layout) — move from localStorage (`dashboard-theme`, `dashboard-widget-layout`)
- [ ] Dashboard widgets data: product table (`products` + stats) and chart widgets from real aggregates

## Later — unbuilt sections (need Figma pages first)
- [ ] Notes · Mail · Calendar (events) · Knowledge Base (articles) · Clients page · Users page
- [ ] Project tabs: stages, tasks, messages, chat, members, customer, files, activity (UI + data)

## Every phase
- [ ] `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`
- [ ] Re-run `pnpm schema:analyze` after UI changes
- [ ] Never commit `.env.local` / service role key
