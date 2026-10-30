# Loader — graph context (graphify query, budget 1500)

No `Loader` / `Spinner` / `Skeleton` node exists in the graph or in `src/components/ui/`. Closest existing pieces:

- **Progress family** — `src/components/ui/progress.tsx` (`progressTrackVariants`, `progressIndicatorVariants`, `progressValueVariants`, `progressDotVariants`, `ProgressDot`), `progress-circle.tsx` (`ProgressCircle`, `ProgressHalf`, `ProgressArcValue`, `ProgressArcLabel`, SVG arcs, `ProgressCircleSize`), `progress-colors.ts` (`progressColors` / `ProgressColor` list: primary, primary-dark, palette colors). Reuse the color list and arc/stroke conventions (2px stroke, 12 o'clock start, `<color>-alpha-10` track, 600 arc) for circular spinners; reuse `ProgressDot` sizing for dot loaders.
- **Preview page pattern** — `src/app/design-system/progress/page.tsx` (`Section`, `ColorName`, `circleSizes`, `lineColors`): copy layout for `/design-system/loader`.
- **shadcn** — check registry for `spinner` (shadcn has `spinner`) and `skeleton`; add base, fix `cn` import to `@/lib/utils`.
- **Button** — `button.tsx` may want a loading slot later; don't modify unless spec needs it.
- **Icons** — `public/icons/` has no loader glyph; export from Figma if spinner is a vector, else build in SVG/CSS with tokens (mask approach per CLAUDE.md for single-color).
- **Utils** — `cn` from `@/lib/utils`.
