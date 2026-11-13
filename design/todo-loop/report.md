# Report 6b-1

## Changed
- `src/components/charts/chart-data.ts` (new): `niceMax`, `niceTicks`, `formatCompact`, `toRows`, `pointsMax`, `ChartPoint`.
- `scripts/chart-data-smoke.mts` (new).
- `cartesian-chart.tsx`: props `points?: ChartPoint[]`, `seriesLabels?: string[]`. Live for line kinds + column-1,2,3,4,6 (column-5 ignores). Keys: lines `s0..`, c1 `b,a,c`, c2/c3 `v`, c4 `p1..p3`, c6 `v2,v3`. Y axis ticks/domain/format from data (column-4 uses stacked sum). Tooltip defaultIndex clamped. Column-1/2 background bar `bg` = axis top when live. Without `points` same code path as before.
- `radial-chart.tsx`: `values`, `progress`, `total`, `totalLabel`. Zero-sum -> no slices, no NaN. Progress value clamped 0..0.9999 (full arc degenerate).
- `widget-data.tsx`: `charts: DashboardCharts`. `dashboard/page.tsx`: fetches `getDashboardCharts()`. Only one provider user.

## Commands
- `pnpm exec tsc --noEmit`: PASS (0 errors)
- `pnpm lint`: PASS (0 errors, 1 pre-existing warning in ui/command.tsx)
- `pnpm build`: PASS
- `pnpm exec tsx scripts/chart-data-smoke.mts`: PASS (all 8 lines)
- Grep hex / space-x|y / dark: on diff: no new matches.

## Notes
- Browser check not run; defaults branch is code-reviewed identical.
- niceMax(0) = 10, steps 1,1.5,2,2.5,3,4,5,6,8,10 x 10^k (1234 -> 1500).
