# Report: metric-line-2 fluid

## Changed
- `src/components/ui/chart-metric.tsx`: new `size: "fluid"` in `chartMetricCardVariants` (`w-full min-w-0 rounded-r20`).
- `src/components/dashboard/widgets/catalog.tsx` `MetricLine2Preview`: calls `useWidgetFluid()`. `stretch = fluid && live data`. When stretch: card `size="fluid"` + `h-full`, body `min-h-0 flex-1`, plot `h-auto min-h-24 w-full flex-1`, chart `h-full w-full`. Otherwise the old classes (w-80 card, h-24 w-70 plot).

## Decisions
- Stretch needs live data (months). Without data the placeholder SVGs stay in the picker size, as the task says.
- No `board` variant added; the existing context handles it.

## Commands
- `pnpm exec tsc --noEmit`: PASS (0 errors)
- `pnpm lint`: PASS (0 errors, 1 existing warning in command.tsx)
- `pnpm build`: PASS
- Grep of the changed lines: no hex, `space-[xy]`, `dark:` or `w-N h-N` pairs.

## Not done
- No browser check of `/dashboard`: it needs auth and live data, and no browser was available. The check was by code reading only.
