# Task
Provide dashboard chart data through WidgetDataProvider and add optional data props to CartesianChart / RadialChart (no widget wiring yet).

## TODO item
  - [ ] 6b-1 Provide `charts` via `WidgetDataProvider` (+ `/dashboard` page); optional data props on `CartesianChart` (line/area/column) and `RadialChart` (donut/pie/progress); defaults = current demo data, no visual change

## Goal
Charts accept real data when given; render identical to today when not given. Provider carries `charts: DashboardCharts`. Catalog untouched (6b-2 wires it).

## Files
- `src/components/dashboard/widgets/widget-data.tsx` (add `charts: DashboardCharts` to `WidgetData`)
- `src/app/dashboard/page.tsx` (fetch `getDashboardCharts()` in the Promise.all, pass in value)
- `src/components/charts/cartesian-chart.tsx`
- `src/components/charts/radial-chart.tsx`
- `src/lib/projects/types.ts` (read `DashboardCharts`); check other `WidgetDataProvider` users compile (`grep -rn WidgetDataProvider src`)

## Steps
1. WidgetData gets `charts`; page provides it. Fix any other provider usage.
2. CartesianChart: new optional prop `series?: { label: string; data: { label: string; values: number[] } ... }` — simpler: `data?: { label: string; values: Record<string, number> }[]`-style is up to you, but keep it small: `points?: { label: string; values: number[] }[]` (one entry per x tick, `values[k]` = series k) plus `seriesLabels?: string[]`. Used by kinds line, line-gradient, line-step, line-area and column-1..4,6 (map values onto the dataKeys those kinds use: lines `s0..`, columns use `v`/`v2,v3`/`a,b,c`/`p1..p3` — pick: when `points` given, build rows for the kind's keys from `values` in order). XAxis uses point labels. When points given, Y axis domain/ticks derive from data max (nice rounding, `formatK`-style compact ticks) instead of fixed 0–80000. Tooltip `defaultIndex` stays valid (clamp to length-1). Other kinds ignore `points`.
3. RadialChart: optional `values?: number[]` for donut/pie (slice sizes; zero-sum → render nothing but center label, no NaN) and `progress?: { color; value(0-1) }[]` for kind=progress. Donut center label total: optional `total?: string|number` and `totalLabel?: string` replacing the hardcoded "56"/"Total" when given.
4. Keep existing exports (`months`, `RingItem`). No new hex, no `dark:`, no `space-[xy]-`.

## Acceptance
- `pnpm exec tsc --noEmit` 0 errors; `pnpm lint` 0 errors; `pnpm build` ok.
- `/design-system` chart pages and `/dashboard` render unchanged when no data props passed (code review: defaults branch identical to old consts).
- Grep: `grep -nE "#[0-9a-fA-F]{3,8}\b|space-[xy]-|dark:" ` on the changed files adds no new matches.
- Smoke (optional but preferred): a tiny `scripts/chart-props-smoke.mts` is NOT required; instead a pure helper (e.g. `niceMax`, `toRows`) exported from a `src/components/charts/chart-data.ts` and tested with `pnpm exec tsx scripts/chart-data-smoke.mts` printing `PASS ...` lines (nice max for 0, 1234, 80000; rows mapping; empty values).

## Decisions
- Charts show user's projects: monthly income/cost (line/area/column), tasks by status (donut/pie/progress). Chosen at Phase 6 earlier; data props are generic so 6b-2 maps them.
- Axis derived from data when data given; demo axes kept otherwise.

## Don't
- Don't touch `catalog.tsx` (except if tsc forces a type fix), no new Figma-less UI, no DB changes.
- Don't change demo visuals.
