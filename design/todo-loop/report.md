# Report 7e
Changed `src/components/charts/cartesian-chart.tsx` only.
- Added `TruncatedTick` (14 chars + "…", `fill-base-600 text-11`, no hex).
- Live `bar` (`categories`): right YAxis removed, left width 96, truncated tick, added ChartTooltip (+ config `v` label = series name). Full name stays in row data -> tooltip label.
- Live `bar-stacked`: when `categories`, only left YAxis (width 96, truncated tick); bars always on `l`. Demo branch unchanged. No catalog change needed (the chart ignores `yAxis` when `categories`).
- Legend: catalog already passes status legendItems with `donutTones` (blue/green/orange/sky) = `statusColors`; matches, no change.
## Commands
- `pnpm exec tsc --noEmit` PASS
- `pnpm lint` PASS (0 errors, 1 pre-existing warning)
- `pnpm build` PASS
- `pnpm exec tsx --conditions=react-server scripts/dashboard-charts-smoke.mts` PASS
## Not done
Browser check at /dashboard skipped (auth needed); verified by code review.
