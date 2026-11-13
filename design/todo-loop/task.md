# Task
9f-5 WidgetBoard layout fixes: code-only items from known-gaps (WidgetBoard line).

## TODO item
    - [ ] 9f-5 WidgetBoard layout fixes

## Goal
Fix the WidgetBoard layout gaps that are decidable without new Figma reads, document the rest.

## Files
- src/components/dashboard/widgets/widget-board.tsx
- src/components/dashboard/widgets/catalog.tsx (wide chart height, only if the 540 is set there)
- design/known-gaps.md (WidgetBoard line, grep "^- WidgetBoard:")
- design/known-gaps-triage.md (line ~212)

## Steps
1. Read the WidgetBoard line in known-gaps.md and the triage row.
2. Mobile (1 track): gap 12 everywhere, Figma has 24 between charts. Make the gap between a chart and the next chart 24 on 1-track layout (e.g. charts get `mt-3` extra / `max-@xl:` variant on chart cells; tiles keep 12). No change at @xl and up.
3. Line-area wide chart is 540 tall, Figma 528: set it to 528 if it is a single constant; if it is shared with other wide charts, leave and note.
4. Odd chart count in a section with tiles leaves a gap: if `placements()` can fix it simply (e.g. last leftover chart in a section takes `PLACE.beside` when tiles remain unpaired), do it; otherwise leave and note why.
5. Items not done (5-tile rows 206, 768 rail narrowing board) stay in known-gaps; update the line to list only what remains; drop fixed parts.
6. Do not change drag/drop logic.

## Acceptance
- `pnpm exec tsc --noEmit` 0 errors; `pnpm lint` 0 errors; `pnpm build` ok.
- grep changed files: no hex colors, `space-[xy]-`, `dark:`.
- known-gaps WidgetBoard line reflects what remains.
- Desktop (@5xl) placements unchanged for layouts with an even chart count.

## Decisions
- Only do what is a plain code change; no new Figma reads. 5-tile rows and the 768 rail are left (need design/user decision).

## Don't
- No new widgets, no UI without Figma frame, no DnD changes, no touching other components.
