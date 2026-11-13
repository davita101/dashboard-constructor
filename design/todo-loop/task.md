# Task
Phase 6a: user-scoped dashboard chart data query (monthly income/cost, tasks by status) + smoke script. No UI.

## TODO item
  - [ ] 6a Query `queryDashboardCharts` (monthly income+cost, tasks by status) in `src/lib/projects/queries.ts` + `getDashboardCharts` in data.ts + types + smoke script

## Goal
Server-side data for chart widgets, scoped to the signed-in user's projects, cached like the other queries.

## Files
- `src/lib/projects/types.ts` (add `DashboardCharts`)
- `src/lib/projects/queries.ts` (add `queryDashboardCharts(userId)`; follow `queryProjectFinance`: `"use cache"`, `cacheLife("hours")`, `cacheTag(userProjectsTag(userId))`, `memberProjectIds`)
- `src/lib/projects/data.ts` (add `getDashboardCharts()` wrapper with `getViewerId()`)
- `scripts/dashboard-charts-smoke.mts` (model on `scripts/chat-actions-smoke.mts`)

## Steps
1. Type: `DashboardCharts = { months: { month: string /* "YYYY-MM" */; label: string /* "Jan" */; income: number; cost: number }[]; tasksByStatus: { new: number; inWork: number; done: number; failed: number } }`.
2. Query: exactly 9 months ending with the current month (oldest first, zero-filled via `generate_series`), income/cost = sum of `projects.income` / `projects.cost` grouped by `date_trunc('month', created_at)`, only the user's projects. `tasksByStatus` = sums from `projectStats` (tasksNew, tasksInWork, tasksDone, tasksFailed) for the user's projects.
3. Wrapper in data.ts.
4. Smoke script: calls the uncached SQL logic or the query for a seed user (pattern from existing smokes; if `"use cache"` blocks running under tsx, extract the SQL into a plain exported `loadDashboardCharts(userId)` that the cached query calls, and test that). Asserts 9 months, ascending, numbers finite, tasksByStatus sum equals `queryProjectTotals`-style total from `project_stats`, and a user with no projects gets zeros.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- `pnpm exec tsx scripts/dashboard-charts-smoke.mts` prints PASS lines and exits 0.
- No UI files changed; no migration needed.

## Decisions
Charts show the user's projects: months = income vs cost by project start month; share charts = tasks by status. Nine months matches the Figma x axis (Jan–Sep). Wiring into widgets is 6b.

## Don't
Touch widgets/chart components, add tables/migrations, or edit `.env*`.
