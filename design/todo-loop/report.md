# Report: 7b-1 tasksByProject

## Changed
- `src/lib/projects/types.ts`: `DashboardCharts.tasksByProject`.
- `src/lib/projects/queries.ts`: `TASKS_BY_PROJECT_LIMIT = 6`; `loadDashboardCharts` runs stats + per-project query via `Promise.all` (`project_stats` join `projects`, member filter, `tasks > 0`, order total desc / name asc, limit 6, `::int`). Existing fields unchanged.
- `scripts/dashboard-charts-smoke.mts`: new asserts (empty user, 0-task project skipped, counts new:1/done:1/total:2, non-member `[]`, 7 extra projects capped at 6 and sorted); extra projects cleaned in `finally`.

## Decisions
- Only `catalog.tsx` reads `charts` (tasksByStatus); no literals to fix.

## Commands
- `pnpm exec tsc --noEmit`: PASS (0 errors)
- `pnpm lint`: PASS (0 errors, 1 known command.tsx warning)
- `pnpm exec tsx --conditions=react-server scripts/dashboard-charts-smoke.mts`: PASS all 9 lines, exit 0
- `pnpm build`: PASS

## Undone
Nothing.
