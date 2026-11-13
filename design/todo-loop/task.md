# Task
7c-1: make the live `metric-line-2` widget show real income/cost data.

## TODO item
- [ ] 7c-1 metric-line-2 live: income amount + 30-day trend, income vs cost plot from `charts.months`

## Goal
On the live board (WidgetDataProvider present) `MetricLine2Preview` in `src/components/dashboard/widgets/catalog.tsx` shows: `ChartMetricAmount` heading "Income", value `formatUsd(finance.income)`, delta = income 30-day trend (same helper `trendOf` as CartesianCardPreview), additionalText "last 30 days" (existing i18n `widgets.data.last30`); plot = income vs cost per month (last 9 months) from `data.charts.months`. Picker preview (no provider) stays the Figma demo, unchanged.

## Files
- src/components/dashboard/widgets/catalog.tsx (MetricLine2Preview, `trendOf`, `useWidgetData`, `formatUsd`)
- src/components/charts/cartesian-chart.tsx (reuse `points` / `seriesLabels` props, kind "line" or "line-area", preset "card"; check that it fits the 280x96 `ChartMetricPlot`)
- src/components/ui/chart-metric.tsx (only if a prop is needed on ChartMetricAmount, e.g. hide delta when trend is 0)
- messages/en.json (only if a new label key is needed; other locales have no `widgets` keys)

## Steps
1. Read MetricLine2Preview, `trendOf`, CartesianChart props.
2. In live mode (data present) replace the static `ChartLineArea`/`ChartLine` art inside `ChartMetricPlot` with `CartesianChart` fed from `data.charts.months` (series income, cost; tones purple/orange like the other live cards), sized to the plot (h-24 w-70, or fluid if the plot allows). Axis labels/legend only if they fit; otherwise none.
3. Amount values from `data.finance`; no delta text when trend is 0 (no fake "+0%").
4. Leave the `ChartMetricActions` footer as is (7-phase item "footers" handles dead controls later).
5. Picker preview: no provider => identical to today.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` ok.
- grep new code: no hex colors, `space-[xy]-`, `dark:`.
- Code review: with provider, metric-line-2 reads only `data.finance` / `data.charts.months`; without provider the old JSX is rendered.
- Report says whether browser check was done (not mandatory; dev server may be unavailable).

## Decisions
- Reuse CartesianChart (real data) instead of the static Figma SVG lines, which cannot take data.
- Amount = all-time income with the 30-day trend, consistent with the other live cards.
- No new Figma UI; no new components.

## Don't
- Don't touch metric-chart / metric-card / candle / metric-map.
- Don't change the picker preview or Figma component defaults.
- No DB or schema changes. No hand-written SVG.
