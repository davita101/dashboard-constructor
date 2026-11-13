# Report: 9c-1 shared Icon

## Changed
- new `src/components/ui/icon.tsx`: `Icon` (span, `data-slot="icon"`, aria-hidden, `bg-current` + mask classes, inline `maskImage`/`WebkitMaskImage` from `src`), `iconVariants` cva sizes 4/5/6, no default size.
- `chart-metric.tsx`: all 8 spans -> `Icon`, `maskIcon` const removed.
- `chart-parts.tsx`: chevron + `ChartTrend` glyph -> `Icon` (class ternaries became `src`/`size` ternaries).
- `breadcrumb.tsx`: separator + ellipsis -> `Icon`.
- `native-select.tsx`, `field.tsx` (`FieldLabelIcon`) -> `Icon`.
- `design/known-gaps.md`: removed 3 lines, added Icon line at end.

## Decisions
- `breadcrumbSeparatorVariants` (still exported, unused elsewhere) now only holds color/opacity; mask + size moved to `Icon`.
- `BreadcrumbIcon` uses `mask-(--breadcrumb-icon)` (CSS var, not `mask-[url`), left as is (not in task list).
- `Icon` spreads `...props` after style, so callers can override `data-slot` (native-select, field keep theirs).

## Commands
- `pnpm exec tsc --noEmit` PASS
- `pnpm lint` PASS (0 errors, 1 known command.tsx warning)
- `pnpm build` PASS
- grep `mask-[url` in the 5 files: PASS (none)
- grep hex/space-xy/dark: in icon.tsx: PASS (none)
- grep `<img` in src: PASS (only notification.tsx, task.tsx)
- Visual: code-read only.

## Undone
Nothing.
