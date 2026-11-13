# Task
7b-2: live data for bar, bar-stacked and column-5 widgets (tasks per project / income per month).

## TODO item
    - [ ] 7b-2 data props on bar / bar-stacked / column-5 in `CartesianChart`, wired in `catalog.tsx`

## Goal
On the live dashboard board (when `useWidgetData()` is present) `stacked-bar-chart` shows tasks per project stacked by status, `bar-chart` shows total tasks per project, `column-type-5-chart` shows income per month (thin bars). Picker previews (no provider data) keep the Figma demo exactly as now.

## Files
- `src/components/charts/cartesian-chart.tsx` (add props, live branches for `bar`, `bar-stacked`, `column-5`)
- `src/components/charts/chart-data.ts` (helpers if needed) + `scripts/chart-data-smoke.mts`
- `src/components/dashboard/widgets/catalog.tsx` (wire in `CartesianCardPreview`; `liveCartesianKinds`)
- `src/messages/en.json` (`widgets.data.*` labels; en only, like earlier tasks)
- Read: `src/lib/projects/types.ts` (`DashboardCharts.tasksByProject`: `{name,new,inWork,done,failed,total}[]`, top 6), `src/components/dashboard/widgets/` provider.

## Steps
1. Add optional prop `categories?: { name: string; values: number[] }[]` to `CartesianChart` (horizontal kinds) plus reuse `seriesLabels`. When given:
   - `bar`: single series = `values[0]`, rows `{name, v}`; X axis domain `[0, niceMax(max)]` with `niceTicks`; keep gradient Cells (hues cycle by index), bar label on right shows value. Keep demo path untouched when absent.
   - `bar-stacked`: rows `{name, p0..p3}` from the 4 status values (new, inWork, done, failed), absolute counts, `stackOffset="expand"` kept (percent share per project, axis `%`). Colors fixed per status, same tones as donut: blue, green, orange, sky (use `var(--blue-500)` etc. via palette tokens). Tooltip: add `tip` with config labels from `seriesLabels`; do not change demo tooltip behavior.
   - Empty `categories` (user has no tasks): render the chart with no rows, no crash.
2. `column-5` live: use existing `points` (single series, income). Treat column-5 like other live columns: `live` must include colT 5, dataKeys `["v"]` (columnKeys[5] = ["v"]), data = `liveRows`, Y axis from data, thin bars keep `barSize={2}`; keep `thin` demo when `points` absent. Add tooltip (`tip`) for column-5 only when live.
3. `catalog.tsx`: `liveCartesianKinds` add `column-5`. For `bar` and `bar-stacked` use `data.charts.tasksByProject`; titles `t("tasksByProject")`; legend: bar → none; bar-stacked → legend items with status labels (`t("status.new")` etc, tones blue green orange sky) instead of "none". column-5 title `t("income")`-based: legend items income only (purple tone) and metrics: reuse the finance metrics only for the income+cost kinds; for column-5 and bar kinds pass no metrics strip (`ChartCardMetrics` not rendered when live and kind is bar/bar-stacked/column-5), switcher hidden when live.
4. en.json: add `widgets.data.tasksByProject` ("Tasks by project"), `incomePerMonth` ("Income per month"). Reuse existing keys otherwise (check `widgets.data` for status.*, income).
5. Extend `scripts/chart-data-smoke.mts` for any new pure helper (e.g. `categoriesMax`, `toStackRows`). Keep pure logic in `chart-data.ts` so it is testable.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` OK.
- `pnpm exec tsx scripts/chart-data-smoke.mts` prints PASS lines only (includes new helpers), exit 0.
- `pnpm exec tsx --conditions=react-server scripts/dashboard-charts-smoke.mts` still PASS.
- Grep new/changed lines: no hex colors, no `space-[xy]-`, no `dark:`.
- Picker preview JSX for bar/bar-stacked/column-5 unchanged in demo output (no props passed when `data` null).
- Report: say whether browser-checked (optional; dev server `/dashboard` with the three widgets added).

## Decisions
- bar = total tasks per project (single series); bar-stacked = share by status per project (keeps Figma percent axis); column-5 = income per month (9 months, single series): tasks-per-project does not suit 30 thin columns, monthly income does and reuses `charts.months`.
- Only en.json labels (other locales have no `widgets` keys).
- bar-double, bar-negative, candle untouched (not in catalog / demo).

## Don't
- No new Figma UI, no changes to data queries or DB, no changes to demo data constants, no other widgets (7c/7d).
