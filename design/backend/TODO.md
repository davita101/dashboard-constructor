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
- [ ] Fill `DATABASE_URL` in `.env.local` (Supabase → Connect → Transaction pooler)
- [ ] Supabase dashboard: add Clerk as third-party auth provider

## Phase 1 — Core schema (`feat/backend-schema`)
- [ ] `users` (id = Clerk user id, name, avatar, email) + Clerk webhook `app/api/webhooks/clerk/route.ts` (`verifyWebhook`) to sync create/update/delete
- [ ] `clients` (company: name, logo, description) — from ProjectDetail.company
- [ ] `projects` (slug unique, name, logo, client_id, income, cost, deadline, owner_id, timestamps)
- [ ] `project_members` join (project_id, user_id, role) — covers Member + TeamMember
- [ ] `project_stages` (project_id, position, name, start, end)
- [ ] `tasks` (project_id, stage_id, title, status enum new/in_work/done/failed, position, dates, cover) + `task_assignees`, `task_labels`
- [ ] `project_events` (project_id, actor_id, kind enum, title, at) — activity feed
- [ ] `files` (project_id, stage_id?, uploader_id, name, storage_path, size, mime)
- [ ] Counts (stages/tasks/members/files/progress) as SQL aggregates/views, not stored columns
- [ ] First migration + seed script from current mock data (`src/lib/projects/data.ts`)
- [ ] RLS policies: user sees projects where they are a member (protects Supabase client: Realtime/Storage; Drizzle bypasses RLS → scope queries in code)

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
