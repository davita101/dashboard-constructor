# Report 7c-3
Changed: `src/components/ui/chart-metric.tsx` (optional `items` prop + `ChartMetricWideItem` type; no `items` = old markup), `src/components/dashboard/widgets/catalog.tsx` (`MetricWidePreview` live items from totals/finance), `messages/en.json` (`widgets.data.members`, `files`).
Decisions: cell = icon + heading + value row (ChartTrend only if delta) + additional text only if set; cells `flex-1 min-w-40` in `flex-wrap`, no dividers. Duplicate Figma caption dropped in items mode.
Commands: tsc PASS; lint PASS (0 errors, 1 pre-existing warning in command.tsx); build PASS.
Not done: no browser check of the live board.
