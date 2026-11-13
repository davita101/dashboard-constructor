# Report 7g
Changed `src/components/ui/chart-parts.tsx` only: `chartProgressCardVariants` head type now `border-b pb-3.75` (bottom-only 1px stroke, 15px pad + 1px = Figma 32px height) plus `appearance` variant via compoundVariants (`border-background-100` default, `border-white-alpha-20` image). Removed the 4-side `outline` from the head render in `ChartProgressCard`; `progress` type untouched.

Figma (Progress-Card-Component, Type=Head, 108x32): stroke background-100 (white-alpha-20 for Image), pad 0 0 16 0. The PNG shows a faint line under the labels only, so it is a bottom divider.

Decision: used `border-b` in the cva variant instead of `Separator`, since Separator is fixed to base-150 and Figma uses background-100 / white-alpha-20.

Commands:
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 existing warning in command.tsx)
- `pnpm build`: PASS
- `grep -n outline chart-parts.tsx`: remaining matches are other components (chart dot, comments), none in head.
- Not visually checked in the browser (no dev server run).
