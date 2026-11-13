# Report 8a

## Changed
- `src/lib/csv.ts` (new): `toCsv`, `downloadCsv` (no DOM at import).
- `scripts/csv-smoke.mts` (new): 6 toCsv cases.
- `src/components/ui/card.tsx`: `ChartCardFooter` props `viewMoreHref`, `onDownload`. Download = `Link` with `render={<button type="button" onClick/>}`; without props unchanged (`href="#"`).
- `src/components/ui/chart-metric.tsx`: `ChartMetricActions` same props; View More = next `Link` when href set, Download loses `data-soon` when `onDownload` set.
- `src/components/dashboard/widgets/catalog.tsx`: rows + props in Cartesian, Radial, MetricLine2, MetricLarge live branch (demo branch untouched).

## Decisions
- No "Total" i18n key exists; header "Total" is English literal (headers English per task).
- Live detection = `data` non-null (cartesian: only when live/liveBars rows exist).

## Commands
- `pnpm exec tsx scripts/csv-smoke.mts` PASS (6 PASS, exit 0)
- `pnpm exec tsc --noEmit` PASS
- `pnpm lint` PASS (0 errors, only command.tsx warning)
- `pnpm build` PASS

## Not done
- No browser click test of download (no auth session); verified by read-through.
