# Task
Add `tasksByProject` (per-project task counts by status) to `DashboardCharts`; query + smoke only, no UI change.

## TODO item
    - [ ] 7b-1 `tasksByProject` (top 6 projects by task count, per-status counts) added to `DashboardCharts` + smoke; no UI change

## Goal
`loadDashboardCharts(userId)` also returns `tasksByProject: { name: string; new: number; inWork: number; done: number; failed: number; total: number }[]`: the user's member projects with at least 1 task, ordered by total desc then name asc, max 6. Cached wrapper and `/dashboard` provider already pass the whole object, so the data reaches `useWidgetData().charts` untouched. 7b-2 (later) will draw it.

## Files
- `src/lib/projects/types.ts` (`DashboardCharts`: add `tasksByProject`)
- `src/lib/projects/queries.ts` (`loadDashboardCharts`: extra select from `projectStats` joined with `projects` for the name, `where projectId in memberProjectIds`, `orderBy`, `limit 6`)
- `scripts/dashboard-charts-smoke.mts` (extend)
- Read-only check: any place that builds a `DashboardCharts` literal (grep `tasksByStatus`) must still type-check; fix defaults/mocks if any.

## Steps
1. Add the type field (`TASKS_BY_PROJECT_LIMIT = 6` const next to `CHART_MONTHS`).
2. In `loadDashboardCharts` run the extra query (same pattern as `stats`; use `projectStats` columns `tasksNew/tasksInWork/tasksDone/tasksFailed` and a total; check actual column names in `src/db/schema`). Cast ints with `::int`. Run both queries with `Promise.all`.
3. Return it. Keep existing fields identical.
4. Extend the smoke: user with a project that has 0 tasks → `tasksByProject` is `[]`; insert 2 tasks (one `new`, one `done`) in a smoke project → entry with `new:1, done:1, total:2`; user with no projects → `[]`; a second user not a member never sees it. Insert >6 projects optional (assert length <= 6 if cheap). Clean up in the existing `finally`.

## Acceptance
- `pnpm exec tsc --noEmit` → 0 errors
- `pnpm lint` → 0 errors (known `command.tsx` warning ok)
- `pnpm exec tsx --conditions=react-server scripts/dashboard-charts-smoke.mts` → all PASS lines, including new ones for tasksByProject, exit 0
- `pnpm build` passes
- `git diff` touches no component/UI files; no hex colors, `space-[xy]-`, `dark:` in new code

## Decisions
- Top 6 projects by task count: bar charts in the Figma cards show ~6 rows; more would not fit. Projects with 0 tasks are skipped (an empty bar is noise).
- Per-project data computed in the same cached query (one cache entry, one tag), not a new action.
- Names are full project names; truncating for the axis is 7b-2's job.

## Don't
- No changes to `CartesianChart`, `catalog.tsx`, messages, or the provider.
- No migrations (the `project_stats` view already has the counts).
- Don't cache separately or add new Server Actions.
