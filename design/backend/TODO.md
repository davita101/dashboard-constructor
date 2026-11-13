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
- [x] Clerk dashboard: webhook endpoint `https://dashboard-constructor.vercel.app/api/webhooks/clerk` (user.created/updated/deleted), signing secret in Vercel `CLERK_WEBHOOK_SIGNING_SECRET` (production + preview); test event delivered OK. Old `http://localhost:3000` endpoint still listed in Clerk (unreachable, can be deleted)
- [x] Vercel project `dashboard-constructor` (https://dashboard-constructor.vercel.app; old ecormce-webstie.vercel.app 307-redirects) (CLI-linked, env from `.env.local`), production deployed from `feat/backend-projects-read`

## Phase 2 — Wire existing pages (`feat/backend-projects-read`)
- [x] `src/lib/projects/data.ts` bodies → user-scoped Drizzle queries (`src/lib/projects/queries.ts`), signatures kept; mocks moved to `src/db/mock-data.ts` (seed only)
- [x] getProjects / getProjectDetail / getProjectEvents / getProjectTotals / getProjectFinance
- [x] Scope all queries to current Clerk user: `getViewerId()` (`src/lib/auth/viewer.ts`, `auth.protect()` + creates the `users` row if the webhook hasn't)
- [x] Caching: `"use cache"` per query, keyed by user id; tags `user-projects:<userId>` + `project:<id>` (`src/lib/projects/tags.ts`). Dashboard layout streams the shell in Suspense (auth = runtime data)
- [x] Removed unused `getProject`; `generateStaticParams` uses unscoped `getProjectSlugs()` (route shells only)
- [x] Seed adds every Clerk user (CLERK_SECRET_KEY) as member of the seed projects
- [x] Verified in browser (projects list, KPIs, events, project dashboard, 404) + `pnpm build`
- [x] Finance trends: income/profit of projects started in the last 30 days vs the 30 before (proper history would need a ledger/snapshots)
- [x] Note: re-seeding changes project ids; cached reads stay stale until `cacheLife` expires (dev: hard reload). Phase 3 writes `updateTag(userProjectsTag(...))` for every affected member

## Phase 3 — Mutations (`feat/backend-projects-write`)
- [x] Zod input schemas (`src/lib/projects/schemas.ts`), user-scoped transactional writes (`src/lib/projects/mutations.ts`, membership check = access control), Server Actions (`src/lib/projects/actions.ts`: auth → parse → write → `updateTag` for every member before/after + `project:<id>` + `project-slugs`)
- [x] Projects: create (slug from name, unique, never `new`; creator = owner + first member), update (rename moves the slug and redirects; shared client is copied, unused client pruned), delete (cascade, redirect)
- [x] Members: add by email (only people with a `users` row), change role (job title), remove (also drops their task assignments; can't remove the last member; leaving redirects)
- [x] Stages: create (appended), edit, delete (renumber), reorder (full id list, one CASE update)
- [x] Tasks: create (bottom of column, assignees must be members, stage must be in project), edit, delete, move (dnd-kit `{status, index}` → renumber both columns), status, assignees. UI only for create: the Tasks tab/board has no Figma frame yet
- [x] Creates append a `project_events` row (project → owner "member", member, stage, task). Edits/deletes/reorders don't: the feed kinds all read "Added …"; needs new kinds + Figma rows
- [x] UI: Quick Add Stages/Task/Member dialogs (project picker), Save Project = create/edit/delete form, Stages card menu "Add stage" + click a stage to edit/move/delete, Members card menu "Manage members"
- [x] Permissions: every member may edit everything (no permission model in schema). Decide owner/admin rules before inviting real teams
- [x] Verified: mutation smoke test against Supabase (auth, slugs, reorder, move, events, cleanup) + browser (task create, project edit/create/delete, stage reorder, member errors)
- [x] Seed shifts the Figma 2078 dates so the newest mock event is one day ago (deadlines/stages keep their spacing); re-seeded
- [x] ProjectSummaryCard "+" opens Add Member for that project (no project picker)
- [ ] Task board actions once the Tasks tab is designed (blocked: needs Figma Tasks tab/board)

## Phase 4 — Files (`feat/backend-files`)
- [x] Custom migration `0001_storage_buckets.sql`: buckets `project-files` (private, 50 MB) and `logos` (public read, 2 MB, png/jpeg/webp/gif) + storage.objects RLS (select/insert/delete for project members via `viewer_project_ids()` / `viewer_client_ids()`, Clerk JWT `sub`). No service-role key needed
- [x] Upload: Quick Add "File" → `UploadFilesDialog` (FileUpload + FileUploadItem rows). Browser uploads to `<projectId>/<uuid>/<name>` with the Clerk token, then `registerFileAction` checks path + membership, reads size/mime from `storage.objects`, inserts `files` + "file" event; failed register removes the object. Remove = `deleteFileAction` (row + object in one tx)
- [x] Download: `GET /api/files/<id>` → membership check → 60 s signed URL (`download` = original name)
- [x] Logos: Project form "Project logo" / "Client logo" (FileUpload images, posted through the Server Action, `bodySizeLimit` 5 MB) → `logos/projects|clients/<id>/<uuid>.<ext>`; replaced/pruned logos deleted when no row uses them; `images.remotePatterns` allows the bucket
- [x] Project delete removes its storage objects (inside the tx, while the storage policy still sees the member)
- [x] Verified: storage policy smoke test with a real Clerk session JWT (member upload/download/remove, non-member + wrong mime refused, logo public read), tsc/lint/build
- [x] Browser check: Quick Add → upload (row + object + "file" event), download link (signed URL, original content), remove (row + object gone), project logo upload in Save Project (stored, shown in head + sidebar via next/image)
- [ ] Files list UI (project "files" tab, task attachments) once designed (blocked: needs Figma project files tab)

## Phase 5 — Chat & realtime (`feat/backend-chat`)
- [ ] `conversations`, `conversation_members`, `messages` (project chat + direct Messenger)
  - [x] 5a Schema: tables + RLS select policies + migration `0003_chat.sql` applied + smoke test — one shared `conversations` (kind project|direct), project chat access via project membership, SELECT-only RLS through SECURITY DEFINER `viewer_conversation_ids()`, `messages` in supabase_realtime, `scripts/chat-schema-smoke.mjs`
  - [x] 5b Queries (`src/lib/chat/queries.ts`) + Zod schemas + Server Actions (start direct conversation, send message, mark read) — built `src/lib/chat/{schemas,tags,types,queries,mutations,actions}.ts` + `scripts/chat-actions-smoke.mts`; uncached reads, project chat lazily created via `ensureProjectConversation`, advisory lock on direct start, access checked in code (Drizzle bypasses RLS)
- [ ] Supabase Realtime subscription for new messages
- [ ] Live task board updates (optional)

## Phase 6 — User settings (`feat/backend-settings`)
- [x] `user_settings` (user_id PK → users cascade, theme enum, locale, widget_layout jsonb; RLS select self), migration `0002_user_settings.sql`
- [x] `getUserSettings` ("use cache", tag `user-settings:<id>`) + `updateSettingsAction` (partial upsert; no-op when signed out). Theme toggle, language menu and widget board (800 ms debounce) save on change
- [x] localStorage / locale cookie stay as this device's copy (no flash before paint). `SettingsSync` in the dashboard shell applies the account's settings once per visit (account wins); a device's pre-Phase-6 choices are uploaded when the account has none
- [x] Verified in browser: first visit uploads theme/locale/layout, toggle saves, wiped local storage restores dark theme + 3-widget layout from the account
- [x] Fixed `/dashboard/projects/new` prerender error (`new Date()` → hour-cached `cachedNow()`)
- Sidebar collapsed state stays per device (localStorage `dashboard-sidebar-collapsed`): it depends on screen size
- [x] Dashboard metric tiles show the user's project numbers: Projects, Income (30-day trend), Tasks, Tasks done (ring = done ÷ all). `/dashboard` reads totals + finance and provides them through `WidgetDataProvider`; picker previews keep the Figma placeholders. `ProjectTotals.tasksDone` added
- [ ] Chart / large metric widgets and the product table still show Figma demo data. The app has no products and the 21 chart templates have no data source: needs a per-widget "what does it show" decision (e.g. income vs cost per month, tasks by status) and data props on `CartesianChart` / `RadialChart`

## Later — unbuilt sections (need Figma pages first)
- [ ] Notes · Mail · Calendar (events) · Knowledge Base (articles) · Clients page · Users page
- [ ] Project tabs: stages, tasks, messages, chat, members, customer, files, activity (UI + data)

## Every phase
- [ ] `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`
- [ ] Re-run `pnpm schema:analyze` after UI changes
- [ ] Never commit `.env.local` / service role key
