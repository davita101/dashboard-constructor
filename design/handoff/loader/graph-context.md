# Loader — graph context (graphify query, budget 1500)

Query: "Loader: which ui primitives, cva variants, icons and design-system pages already exist that this should reuse"

No existing `Loader`/`Spinner` node in the graph. Closest existing code to reuse:

- `src/components/ui/progress.tsx` — cva `progressTrackVariants`, `progressIndicatorVariants`, `progressValueVariants`, `progressDotVariants`; `ProgressContext`; Base UI Progress on shadcn `progress`. Line-style loaders (bar) should reuse these variants.
- `src/components/ui/progress-circle.tsx` — `ProgressCircle`, `ProgressHalf`, `ProgressArcValue`, `ProgressArcLabel` (SVG arcs, 2px stroke, 12 o'clock clockwise start). Ring/arc spinners should reuse its arc drawing approach rather than a new SVG.
- `src/components/ui/progress-colors.ts` — `progressColors` / `ProgressColor` list (primary, primary-dark, palette colors). Reuse for loader color variants.
- `src/components/ui/progress-percent.tsx` — track + Dot + always-open Tooltip (percentage pill pattern).
- `src/components/ui/tooltip.tsx`, `badge.tsx`, `button.tsx` (`ButtonCounter`), `separator.tsx` — available slots if Loader variants include labels/pills.
- Design-system pages: `src/app/design-system/progress/page.tsx` (Section, ColorName, `fills`, `circleSizes`, `halfSizes` helpers) is the closest preview template.
- Icons: none loader-specific in `public/icons/`. Material paths are used for glyphs (`material-check.svg`, `material-help.svg`, `material-verified.svg`); single-color icons as CSS mask (see `AlertIcon`).

shadcn: registry has a `spinner` component (lucide `Loader2Icon` + `animate-spin`); check it first and prefer the Figma vector/arc over lucide if the design differs.
