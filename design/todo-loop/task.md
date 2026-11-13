# Task
7c-2: make the live `metric-chart` widget show real income/cost amounts and tasks by project.

## TODO item
- [ ] 7c-2 metric-chart live: Income / Cost amounts + list of tasks by project

## Goal
On the live board (WidgetDataProvider present) the `kind="chart"` branch of `MetricLargePreview` in `src/components/dashboard/widgets/catalog.tsx` shows:
- head title "Income & cost" (`t("incomeCost")`) instead of "Line Chart Sample";
- two `ChartMetricAmount size="lg"`: Income (tone purple, `formatUsd(finance.income)`, 30-day trend like MetricLine2Preview, additionalText `t("last30")`) and Cost (tone orange, `formatUsd(<total cost>)`, trend only if finance exposes a cost trend, else delta "" ; additionalText: a short existing label or none-needed text e.g. `t("last30")` only if a trend exists, else empty string);
- list = tasks by project from `data.charts.tasksByProject` (name, bar = total tasks as % of the max project; value shown as in `ChartProgressCard`); empty list -> render no list rows (head row still ok or hide the whole list).
Picker preview (no provider) and `kind="map"` stay identical to today.

## Files
- src/components/dashboard/widgets/catalog.tsx (MetricLargePreview, MetricLine2Preview as pattern, `useWidgetData`, `formatUsd`)
- src/components/ui/chart-metric.tsx (`ChartMetricList`: add optional `items?: {name, value(0-100), label?}[]` prop; without it the demo list stays. Keep hardcoded demo default.)
- src/components/charts/ (ChartProgressCard: read its props: `type="head"`, `heading`, `value`, `color`; extend only if a value label is needed)
- src/lib/dashboard / widget-data provider type (read `finance` fields: check whether cost and cost trend exist; do not change DB)
- messages/en.json (only if a new label key is needed; other locales have no `widgets` keys)

## Steps
1. Read MetricLargePreview, ChartMetricList, ChartProgressCard, the provider's `finance` type and `tasksByProject` type.
2. Add optional `items` prop to `ChartMetricList` (colors cycle `listColors`); default = current demo rows.
3. In MetricLargePreview chart kind: if `data`, render live head title, amounts and list; else old JSX.
4. No delta text when trend is 0 (hide, as `ChartMetricAmount` supports empty delta).
5. Leave `ChartMetricActions` footer as is.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` ok.
- grep new code: no hex colors, `space-[xy]-`, `dark:`.
- Code review: with provider metric-chart reads only `data.finance` / `data.charts.tasksByProject`; without provider old JSX rendered; `kind="map"` untouched.
- Report says whether a browser check was done (optional).

## Decisions
- Amounts = all-time income / cost with trend, consistent with other live cards; list = tasks by project (data already exists from 7b-1), bar relative to the largest project.
- Reuse ChartMetricList via an optional prop rather than a new component.

## Don't
- Don't touch metric-card / candle / metric-map / metric-line-2.
- Don't change picker preview or Figma component defaults.
- No DB/schema changes. No hand-written SVG. No new UI beyond Figma parts.
