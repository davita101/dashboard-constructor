# Task
Hide demo-only widgets (candle, metric-map) from the live widget picker.

## TODO item
  - [ ] 7d candle + metric-map: hide from live picker or note why they keep demo

## Goal
`candle-chart` and `metric-map` have no meaningful project data. Users can't add them from the picker; layouts that already contain them still render (demo data) so nothing breaks.

## Files
- `src/components/dashboard/widgets/catalog.tsx` (`WidgetDef`, `widgetCatalog`)
- `src/components/dashboard/widgets/widget-picker-dialog.tsx` (filter at ~line 59)
- `design/known-gaps.md` (append)
- grep other users of the picker (design-system pages) before changing

## Steps
1. Add optional `demoOnly?: boolean` to `WidgetDef`; set it on `candle-chart` and `metric-map` (comment: no project data source).
2. In the picker filter, skip `demoOnly` widgets. `getWidget` / board rendering unchanged (saved layouts keep working).
3. If a design-system preview page lists the whole catalog and should still show them, keep that working (use `widgetCatalog` directly there).
4. Append one line to `design/known-gaps.md`: `- Widgets: candle chart and metric map are demo data (no project data source); hidden from the picker, still render if already on a board.`

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- grep: picker filter references `demoOnly`; exactly two catalog entries have it.
- No hex colors, `space-[xy]-`, `dark:` in diff.

## Decisions
Hide instead of invent data: a candle chart needs OHLC prices and a map needs geo data, neither exists for projects. Keep render path so saved layouts don't break.

## Don't
- No new UI, no data queries, no removal of the widgets or their previews/components.
