# Task
8b: hide the head "…" action on live dashboard widgets; keep it in picker previews.

## TODO item
  - [ ] 8b Head "…" `ChartCardAction`: hide on live widgets (no menu content exists), keep in picker preview

## Goal
On the live board (WidgetData provided) chart cards and metric cards show no dead "…" control in the head. Picker previews (no provider data) look exactly as before.

## Files
- `src/components/dashboard/widgets/catalog.tsx` (lines ~162 and ~244 `<ChartCardAction data-soon />`; `ChartMetricHead` uses at ~338, ~433, ~465)
- `src/components/ui/chart-metric.tsx` (`ChartMetricHead`, line ~64-83: decorative aria-hidden more icon)
- `src/components/ui/card.tsx` (`ChartCardAction`, no change expected)

## Steps
1. In `CartesianCardPreview` (`data`/`isLive` known) render `<ChartCardAction data-soon />` only when not live: use `isLive ? null : <ChartCardAction data-soon />`.
2. In `RadialCardPreview` render it only when `!live`.
3. `ChartMetricHead`: add optional prop `action?: boolean` (default `true`); when false, do not render the trailing more icon span. Document in the JSDoc comment.
4. In catalog.tsx pass `action={false}` on the `ChartMetricHead` calls when the widget is live (`data` / `live` truthy for that widget; for the metric-line-2 / metric-chart / map cards use the `data` from `useWidgetData()` — read each component to find the right flag; Map stays demo-only: leave its head as is unless `data` is present, in which case hide too).
5. Do not touch auth-showcase (it keeps the default).

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` ok.
- `grep -n "ChartCardAction" src/components/dashboard/widgets/catalog.tsx` shows both uses guarded by the live flag.
- `ChartMetricHead` calls in catalog.tsx for live cards pass `action={false}`; auth-showcase unchanged (`git diff --stat` shows it untouched).
- No hex colors, `space-[xy]-`, `dark:` in the diff.

## Decisions
- Hide, not wire: no menu content exists for these cards (View More / Download already live in footers via 8a).
- Metric head icon is purely decorative, so a boolean prop on the existing ui component (no new wrapper) is enough.

## Don't
- No new menus, no new UI, no i18n changes, no change to picker previews or the 8c plot-size issue.
