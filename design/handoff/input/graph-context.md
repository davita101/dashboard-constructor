# Input — graph context (graphify query, BFS, budget 1500)

Query: "Input: which ui primitives, cva variants, icons and design-system pages already exist that this should reuse"

No `input.tsx` / Input node exists in the graph yet. Closest reusable pieces:

## ui primitives (src/components/ui)
- `textarea.tsx` — shadcn Textarea (sibling form field; share field styles with Input, keep consistent tokens).
- `button.tsx` — `buttonVariants` (cva, L14), `ButtonIcon()` (L135), `ButtonCounter()` (L155). Reuse for trailing/leading actions inside the field (e.g. clear, password toggle, submit).
- `badge.tsx` — `badgeVariants` (L16), `Badge()` (L111). Reuse for tags/chips or counters inside inputs.
- `separator.tsx` — Separator for any divider between input addons.
- `alert.tsx` — `AlertIcon()` (L140) shows the CSS-mask icon pattern (`bg-<token> mask-[url(/icons/x.svg)]`) — use it for input leading/trailing icons that follow state color.
- `breadcrumb.tsx` — `BreadcrumbIcon()` (L118), another mask-icon slot example.
- `avatar.tsx` — Avatar/AvatarImage, if Figma input has an avatar addon.
- `card.tsx`, `progress.tsx` — not directly relevant.

## Helpers
- `cn` in `src/lib/utils.ts` (L7) — must be used (knows token font sizes).

## Design-system pages (pattern to follow)
- `src/app/design-system/button/page.tsx` (variants/shapes/size matrices, `Section()` pattern from avatar page)
- `src/app/design-system/avatar/page.tsx` — `Section()` helper (L30).

## Recommendations
- shadcn base: `input` (and possibly `input-group` for addons/icons, `field`/`label` for label + helper/error text).
- Keep sizes/states (default/hover/focus/error/disabled) in `cva` variants in `ui/input.tsx`; addons as slots.
