# Task
Make the live "Revenue lines" (metric-line-2) card fill its board slot: fluid plot, no dead space.

## TODO item
  - [ ] 8c Supervisor browser check: "Revenue lines" (metric-line-2) on the live board is a full-row card but its plot is ~250px wide and the card has a large empty area below it: make the plot fill the card width (fluid like the other cards) and remove the dead space. Also verified OK in Chrome: 7e, 7f (one row fits at 1600), 7g, table widget

## Goal
On `/dashboard` the metric-line-2 widget (board slot = 360-408 x 540, `lg` size, `row-span-3`) shows a card that is the slot's full width and height; the line chart grows to take the free vertical + horizontal space. The picker preview keeps the Figma size (320 card, 280x96 plot).

## Files
- `src/components/dashboard/widgets/catalog.tsx` (`MetricLine2Preview`, ~line 363; see how `useWidgetFluid()` is used by other cards, e.g. line 108 CartesianChart and `MetricTile`)
- `src/components/ui/chart-metric.tsx` (`chartMetricCardVariants` size lg = `w-80`; `ChartMetricPlot` = fixed `h-24 w-70`) — only if a cva variant is needed
- `src/components/dashboard/widgets/widget-board.tsx` (read only: slot sizing, `WidgetFluid`)

## Steps
1. Read `MetricLine2Preview`, how other cards use `useWidgetFluid()` (e.g. the cartesian chart card, MetricTile `className="h-auto"` / `lg:max-w-none`), and `widget-board.tsx` around line 399 (what wraps the board child; does it have a height?).
2. In `MetricLine2Preview` call `useWidgetFluid()`. When fluid AND live data: card `className="w-full h-full"` (use `className` for layout only; if the width must change, add a `fluid` size/variant to `chartMetricCardVariants` in `chart-metric.tsx`, e.g. `size: "fluid"` = `w-full min-w-0 rounded-r20`, not a `w-full` override fighting `w-80`); body wrapper `flex-1 min-h-0`; plot wrapper grows (`flex-1`, `min-h-24`, `w-full`) and the CartesianChart gets `className="h-full w-full"` (or the chart's fluid prop if it has one, as other live cards do). Footer `ChartMetricActions` stays at the bottom.
3. Not fluid (picker preview) and no data: render exactly as today (w-80 card, h-24 w-70 plot).
4. Keep both income/cost lines, tooltip, CSV download, View More unchanged.

## Acceptance
- `pnpm exec tsc --noEmit` 0 errors; `pnpm lint` 0 errors; `pnpm build` passes.
- grep new/changed lines: no hex colors, `space-[xy]-`, `dark:`, no `w-N h-N` pairs (use `size-N`).
- Code reading: with fluid=true the card has `w-full` (and `h-full`), plot has `flex-1` + `w-full`; with fluid=false classes equal the old ones (diff shows picker branch unchanged).
- If a browser/dev server is available, load `/dashboard` with a metric-line-2 widget: card width = slot width, plot fills, no empty gap above footer; picker preview unchanged. If not available, say so in the report.

## Decisions
- Fluid only when `useWidgetFluid()` is true (board); the picker preview keeps Figma 320x? size so Figma fidelity stays.
- Prefer a cva variant in `chart-metric.tsx` over className overrides of size (CLAUDE.md rule).

## Don't
- No changes to data, queries, other widgets, translations, or other cards' sizes.
- Don't change `WidgetSize` of metric-line-2 or the board grid.
