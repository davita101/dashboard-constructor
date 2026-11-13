# Report 9d-1

## Changed
- `src/components/ui/badge.tsx`: `square-60` text 11/20; `square-16` radius r4.
- `src/components/ui/button.tsx`: `icon-16` now r6; new size `icon-16-round` (r4), added to icon compound variant.
- `src/components/ui/alert.tsx`: `AlertClose` uses `icon-16-round` (Round-type consumer, keeps r4).
- `design/known-gaps.md`: Badge and Button lines trimmed/updated.

## Skipped
- Item 4 (Button Group 1px gap): no Button Group component exists in `src/` (only mentioned in comments). Nothing to change; gap line left as is.
- Item 5 (Textarea helper 12/20): no `textareaFieldSize` exists. Textarea uses `inputSizeVariants`, and the helper text is in `field.tsx` with no size-specific hook. The Textarea gap line doesn't mention it either. Not feasible without Figma, so left.

## Commands
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 existing warning)
- `pnpm build`: PASS
- grep of changed lines: no hex, `space-[xy]-` or `dark:`.
