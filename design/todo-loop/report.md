# Report 7c-2 metric-chart live

## Changed
- `src/components/dashboard/widgets/catalog.tsx`: `MetricLargePreview` early-returns live JSX for `kind="chart"` when provider data exists: title `incomeCost`, Income amount (purple, `formatUsd`, `trendOf` 30-day trend, `last30`), Cost amount (orange, `formatUsd(finance.cost)`, no delta, empty additionalText; finance has no cost trend), list of tasks by project (bar = total / max project %, count label = total). Empty list -> list hidden. Old JSX untouched for picker and `kind="map"`.
- `src/components/ui/chart-metric.tsx`: `ChartMetricList` optional `items`, `heading`, `countHeading`; colors cycle `listColors`; demo rows remain default.
- `src/components/ui/chart-parts.tsx`: `ChartProgressCard` head row optional `countHeading` (default "Views") so right label can read "Tasks".
- No new i18n keys (reused `incomeCost`, `income`, `cost`, `last30`, `tasksByProject`, `tasks`).

## Commands
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 pre-existing warning in command.tsx)
- `pnpm build`: PASS
- grep new code for hex / `space-[xy]-` / `dark:`: none added.
- Browser check: not done.
