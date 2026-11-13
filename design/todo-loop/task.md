# Task
7g: Metric chart live list header ("Tasks by project / Tasks") must be a plain list header, not an empty bordered box.

## TODO item
  - [ ] 7g Metric chart: the "Tasks by project / Tasks" list header sits in an empty bordered box: make it a plain list header like the Figma ChartMetricList head

## Goal
In the live metric-chart widget the Head row of `ChartMetricList` renders with an outline box (`outline outline-background-100`, `pb-4`) around only the two labels. Make it read as a plain header row like Figma's ChartMetricList head (labels left/right, no visible empty box).

## Files
- `src/components/ui/chart-parts.tsx` (`ChartProgressCard` type="head", ~line 377; `chartProgressCardVariants`)
- `src/components/ui/chart-metric.tsx` (`ChartMetricList`, ~line 310)
- `design/handoff/chart-metric/figma.md` + `img/metric-chart-card.png` (compare the Head row; check whether Figma Head really has a stroke and where it sits)
- `src/components/dashboard/widgets/catalog.tsx` (live metric-chart usage; only if needed)
- `src/app/design-system/chart-metric/page.tsx` (preview, if exists)

## Steps
1. Read figma.md Head frame of the chart-metric list + the PNG. Determine what the stroke is in Figma (likely a bottom divider under the head, or none).
2. Fix the `head` variant so the stroke matches Figma: if Figma has only a bottom line, render it as a bottom-only divider (use `Separator` below the labels, or a bottom border-equivalent via variant) instead of a full 4-side outline box; if no stroke, drop it. Keep spacing identical otherwise.
3. Do it inside the `cva` variant / slot in `ui/`, not via consumer className. Keep picker preview and other uses (`ChartProgressCard type="head"` elsewhere: grep) visually unchanged unless Figma says otherwise.
4. Check `/design-system/chart-metric` renders (dev server or just build).

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- `grep -n "outline" src/components/ui/chart-parts.tsx` shows the head variant no longer draws a full 4-side outline (unless Figma proves it does; then explain in report).
- No new hex colors, `space-[xy]-`, `dark:` in changed lines.
- Report states what Figma showed for the Head stroke.

## Decisions
- Header = plain row; a bottom divider only if Figma has one. Decided because the user complaint is the empty box, and Figma is source of truth.

## Don't
- No new UI or Figma-less features; don't touch other widgets, data, or queries.
- Don't change the `progress` type of ChartProgressCard.
