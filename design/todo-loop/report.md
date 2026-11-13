# Report 6a

## Changed
- `src/lib/projects/types.ts`: `DashboardCharts`.
- `src/lib/projects/queries.ts`: plain exported `loadDashboardCharts(userId)` (SQL: generate_series 9 months, left join user's projects, sums by month; task sums from `projectStats`) + cached `queryDashboardCharts` (`use cache`, hours, `userProjectsTag`).
- `src/lib/projects/data.ts`: `getDashboardCharts()`.
- `scripts/dashboard-charts-smoke.mts`: temp user + project (income 100, cost 40) and empty user; cleans up.

## Decisions
- Cache directive blocks tsx, so SQL extracted to `loadDashboardCharts` as the task allowed.
- Smoke needs `--conditions=react-server` (`server-only`), same as chat smoke; plain `pnpm exec tsx` without it fails on `server-only`.
- Labels from a JS month array (en short names), not locale-dependent.

## Commands
- `pnpm exec tsx --conditions=react-server scripts/dashboard-charts-smoke.mts`: 4 PASS, exit 0
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 existing warning in command.tsx)
- `pnpm build`: PASS

## Undone
Nothing. No UI, no migration.
