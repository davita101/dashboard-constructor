# Report 7b-2

## Changed
- `src/components/charts/chart-data.ts`: `ChartCategory`, `categoriesMax`, `toStackRows`.
- `src/components/charts/cartesian-chart.tsx`: prop `categories`; live `bar` (single series, gradient cells, nice X axis), live `bar-stacked` (4 status series, fixed blue/green/orange/sky, `stackOffset="expand"`, tooltip with `seriesLabels`); `column-5` live via `points` (`columnKeys[5]=["v"]`, `barSize=2`, thin demo kept when no `points`).
- `src/components/dashboard/widgets/catalog.tsx`: `column-5` in `liveCartesianKinds`; `bar`/`bar-stacked` use `charts.tasksByProject`; titles, legends (stacked = status items, bar = none, column-5 = income only); switcher and metrics hidden when live for these kinds.
- `messages/en.json` (path is `messages/`, not `src/messages/`): `widgets.data.tasksByProject`, `incomePerMonth`.
- `scripts/chart-data-smoke.mts`: tests for new helpers.

## Decisions
- Live bar keeps data order (not reversed like the demo), so the biggest project is on top.
- Bar X ticks use `niceTicks(top, top < 4 ? top : 4)` so small counts get integer ticks.
- Demo column-5 tooltip behaviour unchanged (was already rendered).
- `ChartCardLegend` also renders when `legend="none"` but live items exist (stacked bar).

## Commands
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 existing warning in command.tsx)
- `pnpm build`: PASS
- `pnpm exec tsx scripts/chart-data-smoke.mts`: PASS (all lines, exit 0)
- `pnpm exec tsx --conditions=react-server scripts/dashboard-charts-smoke.mts`: PASS
- Grep diff for hex / `space-[xy]-` / `dark:`: none

## Not done
- Not browser-checked.
