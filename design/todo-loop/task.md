# Task
9d-1: fix four small Figma value gaps (Badge, Button icon-16, Button Group, Textarea text size).

## TODO item
  - [ ] 9d Token/variant fixes: Badge/Button/Textarea/Tooltip/Counter/Link/Double Input small Figma value fixes, shadow/blur constants, date formatting
(planned sub-item: 9d-1 Badge/Button/Button Group/Textarea values)

## Goal
Match Figma values already recorded in known-gaps.md for:
1. Badge-Square-Rounded size 60: text 11/20 (now 14/24).
2. Badge-Icon-Rounded size 16: radius r4 (now r6).
3. Button `icon-16`: radius r6 (now r4) — Figma Icon-type 16 uses r6. Check that no Round-type consumer relies on r4; if `icon-16` is the Round type used elsewhere, add a distinct variant/size instead of changing it.
4. Button Group Rounded Default 60: 1px gap instead of 1px overlap (group 10px narrower).
5. Textarea Default size Top/Bottom helper text 12/20 (now 11/20 via `textareaFieldSize`).

## Files
src/components/ui/badge.tsx, button.tsx, button-group.tsx (find it), textarea.tsx, design/known-gaps.md; usages via grep.

## Steps
1. Read each gap line (`grep "^- Badge:" design/known-gaps.md` etc.) and the code.
2. Apply fixes via `cva` variants/compound variants, tokens only (no hex, no `space-[xy]-`, no `dark:`).
3. If a fix is not feasible without Figma (ambiguous), skip that one and say so in the report.
4. Remove/trim fixed sentences from the gap lines in known-gaps.md.
5. Write design/todo-loop/report.md.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- grep new/changed lines: no hex, `space-[xy]-`, `dark:`.
- Gap lines updated for fixed items.

## Decisions
- Only values stated in the gap text are applied (no Figma re-read: TalkToFigma may be down). Other 9d items (Tooltip, Counter, Link, Double Input, blur/shadow constants, dates) become 9d-2/9d-3 later.

## Don't
- No new UI, no unrelated refactors, no SVG creation, no touching other 9d items.
