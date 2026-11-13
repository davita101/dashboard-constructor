# Report 7c-1 metric-line-2 live

## Changed
- `src/components/dashboard/widgets/catalog.tsx`: `MetricLine2Preview` with provider data shows `ChartMetricAmount` (Income, `formatUsd(finance.income)`, 30-day trend from `finance.incomeTrend`, `widgets.data.last30`) and a `CartesianChart` (kind line, preset card, no y axis/grid, h-24 w-70) of the last 9 months of `charts.months` (income purple, cost orange). No provider: old JSX unchanged.
- `src/components/ui/chart-metric.tsx`: `ChartMetricAmount` got `deltaDirection` prop (default "up"); empty `delta` hides the trend. Defaults unchanged, so Figma demo is identical.

## Decisions
- Trend computed inline (`Math.abs(trend)%`, direction by sign) rather than `trendOf`, because that helper returns ChartCardMetrics fields, not `delta`; same logic.
- Kind "line" (not line-area): CartesianChart's area kind not needed; no new i18n keys (reused income/cost/last30).
- X-axis month labels stay (component always renders them); fits in 96px.

## Commands
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 pre-existing warning in command.tsx)
- `pnpm build`: PASS
- grep new code for hex / `space-[xy]` / `dark:`: none added.
- Browser check: NOT done.
