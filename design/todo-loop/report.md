# Report 9f-5 WidgetBoard layout fixes

## Changed
- `src/components/dashboard/widgets/widget-board.tsx`: mobile 1-track chart-to-chart gap 24 (`chartGap` prop, `@max-xl:mt-3` on chart/wide-chart cells following another chart; tiles keep 12). Already in working tree from an earlier pass; verified, no change at @xl and up.
- `design/known-gaps.md` (WidgetBoard line): dropped the "mobile done" sentence; only remaining gaps listed.
- `design/known-gaps-triage.md` (line 212): dropped "(mobile gap 24 done)".

## Decisions
- 540 vs 528: 540 is `row-span-3` in `SPAN` (3x164 + 2x24), shared by all wide charts and charts; not a single constant, left and noted. catalog.tsx untouched.
- Odd chart count: no simple `placements()` fix (a lone chart beside tiles has no Figma width to fill the gap); left, noted.
- 5-tile rows, 768 rail: left per task.
- No DnD changes.

## Commands
- `pnpm exec tsc --noEmit`: PASS (0 errors)
- `pnpm lint`: PASS (0 errors; 1 existing warning in ui/command.tsx)
- `pnpm build`: PASS
- grep widget-board.tsx for `space-[xy]-`, `dark:`, hex: PASS (none)

## Undone
- 528 height, odd-chart gap, 5-tile rows, 768 rail (need design decision).
- Re-verified in final pass: tsc, lint, build, grep all PASS.

## Final re-verify (this pass)
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 existing warning ui/command.tsx)
- `pnpm build`: PASS
- grep widget-board.tsx hex/space-[xy]-/dark:: PASS (none)
