# Status: graph context

graphify query "Status: which ui primitives, cva variants, icons and design-system pages already exist that this should reuse" --budget 1500
(BFS landed on generic design-system nodes; no Status node yet. Relevant existing pieces, confirmed in code:)

- `src/components/ui/avatar.tsx` has a Figma "Status" online dot slot (`AvatarStatus`-style, line ~152): `bg-success-500` dot, size/inset via `--avatar-status` / `--avatar-status-inset` CSS vars per avatar size. A standalone Status component should share/extend this (and Avatar should keep working).
- `src/components/ui/badge.tsx`: `BadgeDot` (Figma "Dot", 6px status dot in the text color), soft/solid color styles. Reuse for status labels/pills if the Figma Status has text.
- `src/components/ui/tooltip.tsx`: `TooltipDot` (600 shade per color).
- `src/components/ui/progress-colors.ts`: shared color list (primary, base, danger, warning, success, info, palette colors).
- Pattern: cva + cn from `@/lib/utils`, colors via semantic tokens (`success-500`, `base-300`, `danger-500`, `warning-500`), stroke via `outline -outline-offset-1`.
- Icons: CSS mask pattern (`AlertIcon`); existing icons in `public/icons/` (material-check, material-help, material-verified, ...).
- Preview pages: `src/app/design-system/<slug>/page.tsx` (see avatar, badge for status dot usage).
