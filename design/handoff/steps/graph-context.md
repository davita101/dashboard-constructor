# Steps — graph context (graphify query, budget 1500)

Query: "Steps: which ui primitives, cva variants, icons and design-system pages already exist that this should reuse"

## Graph hits
- `src/components/ui/separator.tsx`: `Separator`, `separatorVariants`, `SeparatorGroup` / `separatorGroupVariants`, `SeparatorLabel`, `SeparatorIcon` — use for connector lines between steps (CLAUDE.md: dividers are `Separator`, never border divs).
- `src/lib/utils.ts` `cn()` — class merging (rewrite shadcn `cn` import to `@/lib/utils`).
- `src/components/ui/slider.tsx`, `progress.tsx` / `progress-circle.tsx` / `progress-colors.ts` — progress-style cva patterns (color list, `primary-dark` variant naming) if Steps has a progress bar / ring.
- Preview page pattern: `src/app/design-system/divider/page.tsx` (`Section()` helper).

## Other existing primitives worth reusing (from `src/components/ui`)
- `badge.tsx` — numbered step counters / status pills (`Badge size="square-12"` etc.).
- `avatar.tsx` — if steps show avatars/icons in frames.
- `button.tsx` — Next/Back actions.
- `checkbox.tsx` + `public/icons/material-check.svg` — completed-step check glyph (CSS mask pattern, see `AlertIcon`).
- `tooltip.tsx`, `kbd.tsx`, `label.tsx`, `field.tsx`.

## Icons in `public/icons/`
material-check, material-close, material-chevron-right, material-add, material-default-icon, material-info2, material-help, breadcrumb-dot.

## Preview pages existing
accordion, activity, alert, avatar, badge, banner, breadcrumb, button, button-group, calendar, checkbox, divider, input, progress, radio, slider, switcher, text-area, tooltip. New page: `src/app/design-system/steps/`.
