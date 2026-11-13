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
- [x] `conversations`, `conversation_members`, `messages` (project chat + direct Messenger)
  - [x] 5a Schema: tables + RLS select policies + migration `0003_chat.sql` applied + smoke test — one shared `conversations` (kind project|direct), project chat access via project membership, SELECT-only RLS through SECURITY DEFINER `viewer_conversation_ids()`, `messages` in supabase_realtime, `scripts/chat-schema-smoke.mjs`
  - [x] 5b Queries (`src/lib/chat/queries.ts`) + Zod schemas + Server Actions (start direct conversation, send message, mark read) — built `src/lib/chat/{schemas,tags,types,queries,mutations,actions}.ts` + `scripts/chat-actions-smoke.mts`; uncached reads, project chat lazily created via `ensureProjectConversation`, advisory lock on direct start, access checked in code (Drizzle bypasses RLS)
- [x] Supabase Realtime subscription for new messages — `useMessageStream` hook + `parseMessageRow` in `src/lib/chat/realtime.ts`; raw row, no author join. Live delivery/RLS not proven (Clerk token minting denied); smoke asserts parser only
- [ ] Live task board updates (optional) (blocked: needs Figma Tasks tab/board)

## Phase 6 — User settings (`feat/backend-settings`)
- [x] `user_settings` (user_id PK → users cascade, theme enum, locale, widget_layout jsonb; RLS select self), migration `0002_user_settings.sql`
- [x] `getUserSettings` ("use cache", tag `user-settings:<id>`) + `updateSettingsAction` (partial upsert; no-op when signed out). Theme toggle, language menu and widget board (800 ms debounce) save on change
- [x] localStorage / locale cookie stay as this device's copy (no flash before paint). `SettingsSync` in the dashboard shell applies the account's settings once per visit (account wins); a device's pre-Phase-6 choices are uploaded when the account has none
- [x] Verified in browser: first visit uploads theme/locale/layout, toggle saves, wiped local storage restores dark theme + 3-widget layout from the account
- [x] Fixed `/dashboard/projects/new` prerender error (`new Date()` → hour-cached `cachedNow()`)
- Sidebar collapsed state stays per device (localStorage `dashboard-sidebar-collapsed`): it depends on screen size
- [x] Dashboard metric tiles show the user's project numbers: Projects, Income (30-day trend), Tasks, Tasks done (ring = done ÷ all). `/dashboard` reads totals + finance and provides them through `WidgetDataProvider`; picker previews keep the Figma placeholders. `ProjectTotals.tasksDone` added
- [x] (done via 6a/6b; bar/candle/column-5/progress-half and product table intentionally keep demo data: no products in app) Chart / large metric widgets and the product table still show Figma demo data. The app has no products and the 21 chart templates have no data source: needs a per-widget "what does it show" decision (e.g. income vs cost per month, tasks by status) and data props on `CartesianChart` / `RadialChart`
  - Decision: charts show the user's projects. Monthly series (last 9 months by `projects.created_at`): income and cost per month. Share charts (donut/pie/progress): tasks by status (new / in work / done / failed). Others keep demo data.
  - [x] 6a Query `queryDashboardCharts` + `getDashboardCharts` + `DashboardCharts` type — uncached SQL in `loadDashboardCharts` (generate_series 9 months, zero-filled), cached wrapper; `scripts/dashboard-charts-smoke.mts` (run with `tsx --conditions=react-server`)
  - [x] 6b Provide it via `WidgetDataProvider`; add data props to `CartesianChart` / `RadialChart`; wire line/area/column/donut/pie/progress widgets
    - [x] 6b-1 Provide `charts` via `WidgetDataProvider` (+ `/dashboard` page); optional data props on `CartesianChart` (line/area/column) and `RadialChart` (donut/pie/progress); defaults = current demo data, no visual change — built: `chart-data.ts` helpers (niceMax, toRows) + smoke; `points`/`seriesLabels` on CartesianChart, `values`/`progress`/`total`/`totalLabel` on RadialChart; provider carries `charts`
    - [x] 6b-2 Wire the widgets in `catalog.tsx` to those props (income vs cost per month, tasks by status) — built: line/area/step/gradient/column-1,2,3,6 show income vs cost (9 months); donut/pie/progress show tasks by status; bar/candle/column-5/progress-half keep demo; picker unchanged; labels only in en.json (other locales have no `widgets` keys)

## Phase 7 — Finish and harden what exists (`feat/backend-polish`, no new Figma needed)
- [x] Remaining demo widgets show real project data (split into 7a-7d):
  - [x] 7a progress-half = overall task completion % — built: `RadialChart` `ratio` prop; live card shows tasksDone÷tasks, "Completed", Done/Remaining legend; picker keeps demo
  - [x] 7b bar + stacked bar = tasks per project (stacked by status), column-5 (split 7b-1 data, 7b-2 wiring)
    - [x] 7b-1 `tasksByProject` (top 6 projects by task count, per-status counts) added to `DashboardCharts` + smoke; no UI change — built: per-project query from project_stats (tasks>0, total desc then name, limit 6) in Promise.all with stats; smoke covers empty, 0-task, counts, non-member, cap and sort
    - [x] 7b-2 data props on bar / bar-stacked / column-5 in `CartesianChart`, wired in `catalog.tsx` — bar = total tasks per project, bar-stacked = status share per project, column-5 = income per month; picker demo unchanged; en.json only
  - [x] 7c metric-line-2 / metric-chart / metric-card = real totals (income vs cost, KPI strip) (split 7c-1..3)
    - [x] 7c-1 metric-line-2 live: income amount + 30-day trend, income vs cost plot from `charts.months` — built: with provider shows Income amount + trend (hidden when 0) and CartesianChart line (income purple, cost orange, last 9 months); `ChartMetricAmount` got `deltaDirection`, empty delta hides trend; picker demo unchanged
    - [x] 7c-2 metric-chart live: Income / Cost amounts + list of tasks by project — built: with provider shows "Income & cost" title, Income (30-day trend) + Cost (all-time, no trend) amounts, tasks-by-project list (bar relative to largest); `ChartMetricList` got `items`/`heading`/`countHeading`, `ChartProgressCard` got `countHeading`; picker + map unchanged
- [x] 7c-3 metric-card live: KPI strip (projects, tasks, members, files, income). `ChartMetricWideBody` got optional `items` (no items = Figma sample); live cells from totals + income with 30-day trend.
  - [x] 7d candle + metric-map: hidden from live picker via `demoOnly` on WidgetDef (no project data source); still render if already on a board
  Original scope: progress-half (overall task completion %), bar + stacked bar (tasks per project, stacked by status), column-5, metric-line-2 / metric-chart (income vs cost, real totals), metric-card (wide KPI strip: projects, tasks, members, files, income). Candle and metric-map have no meaningful project data: keep demo but hide them from the picker on the live board, or keep and note why
- [x] Browser review fixes for 7a-7d (found by the supervisor in Chrome, signed in, /dashboard):
  - [x] 7e Stacked bar + bar ("Tasks by project"): project names render on BOTH y axes (left and right) and are clipped ("Banner evelopment", "Banner Developmen"); show names once (left axis, or above each bar), give the axis enough width or truncate with an ellipsis + full name in the tooltip; add a legend for the status colors (new / in work / done / failed, reuse `widgets.data.status.*`) — DONE: live bar+stacked show left axis only (96px, 14-char ellipsis tick), tooltip full name; legend already via status tones.
  - [x] 7f Wide metric (metric-card): 5 items wrap the 5th (Income) onto a second row: fit all KPIs on one row at desktop width (or drop to 4 and move Income into the footer); the footer still shows the Figma placeholder "Heading · Text · Text · Heading": put real content (e.g. profit + its 30-day trend, link "View projects" → /dashboard/projects) or hide it; the item icons are empty placeholder circles: use the existing icons (projects/tasks/members/files/income like ProjectStats) — DONE: one non-wrapping row (flex-1 cells, truncate), 5 distinct icons via inline maskImage, live footer = Profit + amount + trend + link "View projects" → /dashboard/projects; picker preview unchanged. One-row fit not visually verified.
  - [x] 7g Metric chart: the "Tasks by project / Tasks" list header sits in an empty bordered box: make it a plain list header like the Figma ChartMetricList head — Head is now a bottom-only 1px divider (cva `border-b pb-3.75`, background-100 / white-alpha-20 for image); 4-side outline removed (Figma: stroke only on Type=Head).
- [x] Table widget: replace the product table on the live board with the user's projects (name + logo, progress, deadline, income, cost, members) using the existing Figma table component (`src/components/table/`); picker preview may keep the Figma sample — built: `ProjectsTable` (select, logo+name link, progress, deadline, income, cost, members; sortable via shared `SortHead`; empty row), wired via `ProjectsTableWidget` reading `WidgetData.projects`; preview keeps Figma sample
- [x] Chart cards' "Download" / "View More" footers and the head "…" action on live widgets: make them do something real (View More → /dashboard/projects; Download → CSV of the plotted data) or hide them; no dead controls
  - [x] 8a View More + Download in `ChartCardFooter` / `ChartMetricActions` on live widgets (props `viewMoreHref`, `onDownload`; CSV helper `src/lib/csv.ts`); picker previews keep the Figma look — built: `src/lib/csv.ts` (`toCsv`, `downloadCsv`), footers take `viewMoreHref`/`onDownload`; live widgets link to `/dashboard/projects` and download plotted CSV; picker previews unchanged; smoke `scripts/csv-smoke.mts`.
  - [x] 8b Head "…" `ChartCardAction`: hide on live widgets (no menu content exists), keep in picker preview — hidden when live (ChartCardAction guarded by live flag; ChartMetricHead `action` prop, false on live tiles/income-cost, map when data present); picker previews unchanged.
  - [x] 8c Supervisor browser check: "Revenue lines" (metric-line-2) on the live board is a full-row card but its plot is ~250px wide and the card has a large empty area below it: make the plot fill the card width (fluid like the other cards) and remove the dead space. Also verified OK in Chrome: 7e, 7f (one row fits at 1600), 7g, table widget — built: new `fluid` size in chart-metric.tsx; MetricLine2Preview stretches (w-full h-full, flex-1 plot) on the board when live data exists, picker unchanged; code-read only, no browser check.
- [x] Quick Add "Message" tile: open a dialog that sends a message to the project chat (Phase 5 actions), built from existing Modal + Input/Textarea parts like the other Quick Add dialogs; record in known-gaps that there is no chat screen to read replies yet — built: `SendMessageDialog` (project picker if >1 project, Textarea) + `sendProjectMessageAction` (ensure project conversation, send, expire); tile live; no chat screen yet (known-gaps).
- [x] Supervisor browser check of Send message (sending works, message row saved): submitting empty shows raw Zod text ("Invalid input: expected string, received undefined", "Too small: expected string to have >=1 characters") instead of "Required" like the other dialogs. `src/lib/chat/actions.ts` calls `z.flattenError(parsed.error)` without the friendly mapper: move `fieldMessage` from `src/lib/projects/actions.ts` into a shared non-"use server" module (e.g. `src/lib/forms/field-message.ts`) and use it in both action files; also use the "Check the highlighted fields" summary message — built `src/lib/forms/field-message.ts` (`fieldMessage` + `FORM_ERROR_MESSAGE`), used by project and chat actions with `reportInput: true`
- [x] Supervisor browser check: `/dashboard/projects/new` logs on every load (dev, signed in): `Route "/dashboard/projects/new": Next.js encountered uncached data during prerendering or a navigation. fetch(...) or connection() accessed outside of <Suspense>` (component stack: DashboardLayout). Other dashboard routes are clean. `connection()` is no longer used (`getNewProjectDetail` uses hour-cached `cachedNow()`), so find the uncached read the /new page (or something it renders: ProjectPageView, ProjectPageHead/ProjectFormDialog, chat/settings reads) does outside Suspense and either cache it ("use cache" + tag) or wrap it in Suspense. Acceptance: load /new in the dev server with `curl` is not enough (needs the client navigation check) — run `pnpm build` (must not report it) and check `next dev` server output while requesting /new Fixed 1f1ba2e: page reads searchParams + projects inside Suspense; console clean on reload, build ok.
- [ ] Triage `design/known-gaps.md`: list the gaps that are code-only (wrong token, missing state, a11y, dead control, console warning) and fix them in batches of related items; leave Figma-dependent ones, note each decision
  - [x] 9a Write `design/known-gaps-triage.md`: classify every line of known-gaps.md (code-only / needs Figma / needs user asset), propose fix batches; no code changes — done: design/known-gaps-triage.md, 105 bullets → 222 rows, 6 batches (9b–9g)
  - [x] 9b Theme wiring: shadcn vars + fonts (split 9b-1 / 9b-2)
    - [x] 9b-1 Fonts: load Inter/Playfair Display/Roboto/Merriweather/Ms Madi/Source Code Pro via next/font onto `--font-family-*` (replace Geist) (no design-system pages exist: skip the font-sans part) — next/font loads all 6 families, `:root` overrides in globals.css, Geist removed, `--font-mono` = Source Code Pro
    - [x] 9b-2 Map shadcn vars (`--background`, `--primary`, `--border`, `--radius`…) to Color Mode tokens in globals.css — `:root` vars are `var(--token)` refs (card=base-0, primary/ring=primary-500, border=base-100, radius=r-10), `.dark` block removed (tokens flip)
  - [x] 9c Icon dark mode: shared token-colored mask Icon component (finding: no `<img>` icons left, all masked already; so dedupe + gaps cleanup)
    - [x] 9c-1 `ui/icon.tsx` + adopt in chart-metric, chart-parts, breadcrumb, native-select, field; drop stale known-gaps lines — built: shared `Icon` (mask, cva sizes 4/5/6) adopted in 5 files, stale gaps removed
  - [x] 9d Token/variant fixes: Badge/Button/Textarea/Tooltip/Counter/Link/Double Input small Figma value fixes, shadow/blur constants, date formatting
    - [x] 9d-1 Badge sq-rounded 60 text + icon-rounded 16 radius, Button icon-16 radius, Button Group 60 gap, Textarea default helper text 12/20 — Badge sq-60 text + sq-16 radius, Button icon-16 r6 + new icon-16-round (Alert close); Button Group (no component) and Textarea helper (no hook) skipped
    - [x] 9d-2 Tooltip dot shades, Counter Micro icon, Link reuse (Breadcrumb/CheckboxCard), Double Input tokens — moot: Tooltip/Counter/Double Input/CheckboxCard components don't exist in code; BreadcrumbLink keeps its own Figma colors (differs from Link)
    - [x] 9d-3 UploadFilesDialog uses Link, dates via Intl (lib/projects/dates.ts, en→en-GB dd.MM), Sidebar shadow-lg already gone; blur/shadow constants + Dialog Black Cancel left in gaps (Figma unverified)
  - [x] 9e Dead controls and flows (split 9e-1..3)
    - [x] 9e-1 Verify Night Mode switch, footer back-to-top, QuickAddCard tiles, forgot-password/verify routes are already wired in code; drop stale lines from known-gaps.md; fix whatever is still dead — verified all wired (Night Mode, back-to-top, QuickAddCard, forgot-password); no /verify route needed; stale gaps removed, 2FA stays a gap
    - [x] 9e-2 Non-Dashboard project tab panels: empty state — already built in `ProjectDashboardCard` (`Empty` + tab name + "empty" text for every tab except dashboard); verified by code read
    - [x] 9e-3 ProjectFormDialog logo area: compact drop areas, current-logo preview, remove logo (split 9e-3a backend / 9e-3b UI)
      - [x] 9e-3a `removeLogo` / `removeClientLogo` flags in `projectFields` (form "on"/"true"/"1") + `setLogos` clears the column, upload wins over remove, client remove without client ignored, unused object deleted in same tx; smoke `scripts/logo-remove-smoke.mts` 8 PASS; no UI
      - [x] 9e-3b `FileUpload` compact size (cva), current-logo preview + "Remove logo" checkbox/button in `LogoField`, pass `values.logo` / `values.clientLogo` from ProjectPageView — built: FileUpload `size` cva (default unchanged, compact), LogoField shows current logo + "Remove logo" checkbox (applied on Save), DEFAULT_LOGO moved to types.ts so placeholder is not "current"
  - [x] 9f Missing variants and slots: Avatar ring + counter overlay, size/shape context, Tabs pill slots, Calendar year view, Date-Range/Select in Modal, Dropdown slots, WidgetBoard layout (split by component)
    - [x] 9f-1 Tabs pill icon + counter slots (`TabsIcon`, `TabsCounter` in `ui/tabs.tsx`): Icon/Badge-pill composed, trigger size rules size the icon, counter default `square-16` + `gray` (assumed)
    - [x] 9f-2 Avatar progress ring + counter overlay: `Avatar progress` (0-100 conic ring, wins over story) + `AvatarCounter` slot (Badge red, square-16/12); no ContentCard in src/, nothing to adopt
    - [x] 9f-3 Size/shape context: `FieldProvider`/`useFieldContext` (field-context.tsx), InputGroup + Input inherit size/shape (prop > Join > Field > default), group slots Button/Tag/Avatar/Swatch inherit shape; cva split to input-variants.ts; ButtonGroup not in repo, skipped
- [x] 9f-4 Dropdown lead/trail slots (DropdownMenuItemAvatar/Flag/Checkbox/Radio/Switch/Payment wrap Addon; added ui/radio-group; end frames +8px guess)
- [x] 9f-5 WidgetBoard layout: mobile 1-track chart-to-chart gap 24 (`@max-xl:mt-3`, tiles keep 12); 528 height, odd-chart gap, 5-tile rows, 768 rail left in known-gaps (no simple code fix)
    - [x] 9f-6 Calendar year view; Date-Range calendar + Select in Modal — closed as moot: Modal was removed in a9183ee (no consumer for range Calendar/Select); EventCalendar only used decoratively in auth showcase slides, year view waits for the Calendar page (Later, blocked: needs Figma)
  - [x] 9g Previews and browser checks — previews moot (design-system pages dropped in a9183ee); Chrome 2026-11-13: RadialChart progress-half (Task completion widget) and FileUpload in ProjectFormDialog render, no console errors (Clerk dev-key warning only); `ui/file-input.tsx` gone, gap dropped; Input OTP not checked (reachable only after Clerk emails a real code, signed out) — check by hand on sign-up/reset
- [ ] `design/pages-queue.md` statuses are stale (auth pages 3-8 marked todo but routes exist): verify each route renders and fix the statuses
- [ ] Integration smoke script for the whole backend (projects CRUD, members, stages, tasks, files register/delete, settings upsert, chat send/read) against Supabase with cleanup; one command, PASS/FAIL lines
- [ ] Re-check every `(blocked: needs Figma …)` item against the Figma file through TalkToFigma (`curl http://127.0.0.1:3055/figma-channel` must return a channel; if not, mark this item `(blocked: TalkToFigma plugin not running)`); for any page that does exist, unblock its item with the Figma node ids

## Later — unbuilt sections (need Figma pages first)
- [ ] Notes · Mail · Calendar (events) · Knowledge Base (articles) · Clients page · Users page (blocked: needs Figma pages for each)
- [ ] Project tabs: stages, tasks, messages, chat, members, customer, files, activity (UI + data) (blocked: needs Figma project tabs)

## Every phase
- [x] `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`
- [x] Re-run `pnpm schema:analyze` after UI changes
- [x] Never commit `.env.local` / service role key
