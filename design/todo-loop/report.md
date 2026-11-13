# Report 8b
Changed: `src/components/ui/chart-metric.tsx` (ChartMetricHead `action` prop, default true, JSDoc), `src/components/dashboard/widgets/catalog.tsx` (ChartCardAction hidden when live in Cartesian (`isLive`) and Radial (`live`); ChartMetricHead `action={false}` on MetricTile (`!live`), chart card live branch; map/sample head `action={!data}`).
Decision: map head hidden when widget data present, else kept.
Commands: tsc --noEmit PASS; pnpm lint 0 errors (1 pre-existing a11y warning in command.tsx); pnpm build PASS; auth-showcase untouched.
Undone: nothing.
