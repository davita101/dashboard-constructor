# Progress — graph context

Query: "Progress: which ui primitives, cva variants, icons and design-system pages already exist that this should reuse" (graphify BFS, budget 1500)

## Existing, reuse/extend

- `src/components/ui/progress.tsx` — stock shadcn (base-nova, Base UI `@base-ui/react/progress`): `Progress`, `ProgressTrack`, `ProgressIndicator`, `ProgressLabel`, `ProgressValue`. Uses stock shadcn classes (`bg-muted`, `bg-primary`, `text-muted-foreground`), which do NOT follow the design tokens yet → move colors/sizes into `cva` variants with design-token utilities (`bg-primary-500`, `bg-base-100`, …). No preview page yet.
- Consumer: `src/components/activity/ActivityContent.tsx` (lines ~80, ~109) renders `<Progress …>` — keep its API working (or update the call sites) after adding variants.
- cva patterns to copy: `separatorVariants` / `separatorGroupVariants` (`ui/separator.tsx`), `badgeVariants` (`ui/badge.tsx`), `checkboxVariants` (`ui/checkbox.tsx`), `buttonVariants` (`ui/button.tsx`), `avatarVariants` (`ui/avatar.tsx`).
- Related slots likely useful for labels/percent/badges: `Badge` (`ui/badge.tsx`), `Tooltip` (`ui/tooltip.tsx`, with `TooltipLabel`/`TooltipValue` rows) for a value bubble, `Avatar` for avatar-annotated progress, `Separator`.
- Design-system preview pages to mirror structure: `src/app/design-system/divider/page.tsx`, `text-area/page.tsx`, `button-group/page.tsx`, `tooltip/page.tsx`.
- Icons: none Progress-specific in `public/icons/`; Material-path SVGs (`material-check.svg`, `material-add.svg`, …) rendered as CSS mask (see `AlertIcon`).
- Known gap from Avatar: Figma "Progress" ring on avatars is not implemented (no arc/stroke data) — a circular Progress variant, if in Figma, could later serve it.
