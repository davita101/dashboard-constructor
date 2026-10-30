# Slider — graph context (graphify query, budget 1500)

Query: "Slider: which ui primitives, cva variants, icons and design-system pages already exist that this should reuse"

Graph has no Slider node yet. Closest reusable pieces:

## ui primitives (src/components/ui)
- No `slider.tsx` yet → add shadcn `slider` (Base UI) and extend with `cva`; fix its `cn` import to `@/lib/utils`.
- `progress.tsx` — Line track/indicator cva (`ProgressTrack`, `ProgressIndicator`, `ProgressLabel`), track `<color>-alpha-10`, 700→600 gradient fill; color list in `progress-colors.ts`. Reuse the color list/track tokens for the slider range.
- `progress-percent.tsx` — track + Dot + always-open `Tooltip`: same pattern as a slider thumb value label.
- `tooltip.tsx` — Base UI tooltip with cva `variant` (default / black / white) and arrow; use for thumb value bubbles.
- `field.tsx` / `label.tsx` — label + helper text sizes for a labelled slider.
- `input.tsx` / `input-group.tsx` — if the Figma slider has min/max number inputs.
- `separator.tsx`, `badge.tsx`, `kbd.tsx` available for marks/labels.
- `cn()` from `@/lib/utils` (token-aware tailwind-merge).

## Patterns (CLAUDE.md)
- Sub-parts are slots in the ui file (e.g. `SliderThumb`, `SliderMark`, `SliderValue`), cva variants for colors/sizes.
- Strokes inside: `outline -outline-offset-1 outline-<token>`.
- Focus ring: `base-alpha-20` like Checkbox/Radio/Switch.
- Colors: Figma hex matched to Neutral Light tokens; record guesses in CLAUDE.md Known gaps.

## Design-system pages
- Pattern pages: `src/app/design-system/progress/page.tsx`, `tooltip/page.tsx`, `switcher/page.tsx`. New page: `src/app/design-system/slider/page.tsx`.

## Icons
- `public/icons/material-*.svg` (add, close, check, expand-more/less, …), render via CSS mask for token color.
