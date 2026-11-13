# Task
Wire dashboard chart widgets in `catalog.tsx` to the real chart data (6b-2).

## TODO item
- [ ] 6b-2 Wire the widgets in `catalog.tsx` to those props (income vs cost per month, tasks by status)

## Goal
On `/dashboard` (inside `WidgetDataProvider`) the chart widgets show the user's data; in the widget picker (no provider, `useWidgetData()` = null) they keep the Figma demo data, unchanged.

## Files
- `src/components/dashboard/widgets/catalog.tsx` (main change: `CartesianCardPreview`, `RadialCardPreview`)
- `src/components/dashboard/widgets/widget-data.tsx` (`useWidgetData`, `DashboardCharts` in `src/lib/projects/types.ts`)
- `src/components/charts/cartesian-chart.tsx`, `radial-chart.tsx`, `chart-data.ts` (props added in 6b-1; read, change only if a bug blocks)
- `src/components/charts/` ChartCard parts (find with Glob `**/chart-card*`) for legend `items`
- i18n messages (`widgets.data` namespace; grep `"widgets"` in `messages/` or `src/i18n`) if labels need translating

## Steps
1. In `CartesianCardPreview`: `const data = useWidgetData()`. When `data` is set and kind is a supported live kind (`line`, `line-area`, `line-step`, `line-gradient`, `column-1`, `column-2`, `column-3`, `column-6`; NOT `column-5`, `bar`, `bar-stacked`, `candle`), pass `points = data.charts.months.map(m => ({ label: m.label, values: [m.income, m.cost] }))` and `seriesLabels={[Income, Cost]}` (translated). Unsupported kinds keep demo data.
2. Legend of those cartesian cards (when live): two items Income / Cost with the tones of the first two series (match the existing `labelLegend` tones primary/orange or whatever matches the series colours); keep the demo legend otherwise.
3. In `RadialCardPreview`: when `data` set, `donut` and `pie` get `values = [new, inWork, done, failed]` (from `tasksByStatus`), `total = sum`, `totalLabel` = "Tasks" (translated; donut only if the prop applies). Legend items = four statuses (New / In work / Done / Failed) with four tones matching the slice colours (check how `RadialChart` colours slices by index and which legend tones map to those).
4. `progress` (concentric rings): `progress = [{color, value}]` one ring per status share (value = count ÷ total, 0-1), same colours/order as step 3 legend; legend vertical with the same statuses. `progress-half`: show done ÷ all as a single gauge if `RadialChart` supports it through `progress`/`total` props; if not, leave demo data and say so in the report.
5. Empty data (all zero) must not crash: donut/pie draw no slices (already handled), cartesian zero-filled.
6. Translate new labels in every locale file that has the `widgets.data` keys (en + the rest).

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- `node`/`tsx` smoke not required (UI wiring); instead run `pnpm dev` and open `/dashboard`, add the line, column, donut, pie, progress widgets: they show 9 months of income/cost and the task status shares; picker previews still show demo values. Report what was seen (no console errors).
- Grep new/changed code: no hex colors, `space-[xy]-`, `dark:`.
- Picker/demo (`/design-system/chart-card`) unchanged visually.

## Decisions
- Cartesian widgets (line/area/step/gradient/column 1,2,3,6) all show monthly income vs cost, last 9 months: the dashboard is projects-based, income/cost are the only monthly series available.
- Share charts show tasks by status. Bar/stacked/candle/column-5/progress-half-if-unsupported keep demo data (no matching data source).
- No UI invented: same cards, same Figma layout; only data and legend labels change.

## Don't
- No new components, layouts or Figma-less UI. No DB/schema changes. Don't touch metric tiles (already live). Don't change chart visuals when no data is provided.
