# Task
Make "View More" and "Download" in chart card footers work on live dashboard widgets (8a).

## TODO item
  - [ ] 8a View More + Download in `ChartCardFooter` / `ChartMetricActions` on live widgets (props `viewMoreHref`, `onDownload`; CSV helper `src/lib/csv.ts`); picker previews keep the Figma look

## Goal
On the live board (inside `WidgetDataProvider`, `useWidgetData()` non-null):
- View More = real link to `/dashboard/projects`.
- Download = browser downloads a CSV of the data the widget plots.
Outside the provider (picker preview) footers look and behave as now (`data-soon` stays).

## Files
- `src/lib/csv.ts` (new): `toCsv(rows: (string|number)[][]): string` (RFC 4180 quoting, `\n`, escape `"`, prefix BOM not needed) and `downloadCsv(filename, rows)` (client only: Blob + temporary `<a download>`).
- `src/components/ui/card.tsx`: `ChartCardFooter` gets optional `viewMoreHref?: string` and `onDownload?: () => void`. With them: View More `Link href={viewMoreHref}` (next/link-based `Link` ui comp, check it supports href), Download rendered as a `button type="button"` with the same Link look (check `Link` ui part for a `render`/`asChild` or build the button using the same cva classes; no hand-styled new div). Without them: current markup unchanged.
- `src/components/ui/chart-metric.tsx`: `ChartMetricActions` same two optional props; when set, View More is an `<a>`/next Link and the buttons lose `data-soon`.
- `src/components/dashboard/widgets/catalog.tsx`: pass props from `CartesianPreview` (line ~172), `RadialCardPreview` (~242), `MetricLine2Preview` (~358), `MetricLargePreview` live branch (~394). Not the demo branch at ~414.
- `messages/en.json` (find via `grep -rn '"widgets"' src messages`): add `widgets.data.viewMore`? Only if text is wired through i18n; footer labels are currently hard-coded English, keep that.

## Steps
1. Read `card.tsx` ChartCardFooter, `ui/link.tsx`, `ChartMetricActions`.
2. Write `src/lib/csv.ts`.
3. Add the optional props to both footers.
4. In catalog build rows per widget:
   - Cartesian live months (line/area/step/gradient/column-1,2,3,6): header `Month,Income,Cost`, one row per `data.charts.months` item (`label, income, cost`); column-5: `Month,Income`.
   - Bar / bar-stacked (`liveBars`): `Project,New,In work,Done,Failed,Total` from `tasksByProject` (`statusKeys` order, `total`). Use the translated status labels as header like the legend.
   - Radial (donut/pie/progress): `Status,Tasks` from `tasksByStatus` (statusKeys); progress-half: `Metric,Tasks` rows Done = `totals.tasksDone`, Remaining = `totals.tasks - totals.tasksDone`.
   - metric-line-2: same as line (Month,Income,Cost). metric-chart live: `Project,Tasks` from `tasksByProject` plus nothing else.
   File names: `income-cost.csv`, `income-per-month.csv`, `tasks-by-project.csv`, `tasks-by-status.csv`, `task-completion.csv`.
5. Live detection = `data` non-null; pass `viewMoreHref="/dashboard/projects"` and `onDownload` only then. Widgets are client components already (hooks used); `downloadCsv` runs in the click handler only.
6. Add a node smoke script `scripts/csv-smoke.mts` (run with `pnpm exec tsx scripts/csv-smoke.mts`) testing `toCsv`: plain row, value with comma, with quote (`"` → `""`), with newline, numbers; print PASS/FAIL lines, exit 1 on failure. Put pure `toCsv` in a file with no DOM access at import time.

## Acceptance
- `pnpm exec tsx scripts/csv-smoke.mts` prints only PASS lines, exit 0.
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors (known `command.tsx` warning only); `pnpm build` ok.
- Grep of new/changed lines: no hex colors, `space-[xy]-`, `dark:`.
- Read-through: with provider, footer View More has `href="/dashboard/projects"` and Download has an onClick; picker preview (no provider) footers unchanged (`data-soon`, `href="#"`).
- `/design-system` pages using these cards still compile (default props unchanged).

## Decisions
- View More goes to `/dashboard/projects` (the only place the plotted data lives).
- CSV = exactly the plotted series, English headers (status headers translated via existing `widgets.data.status.*`), no locale number formatting (raw numbers) so it opens anywhere.
- Head "…" action is a separate task (8b).

## Don't
- Don't touch the head `ChartCardAction`, the demo-only widgets, DB, or other widgets' footers (`ChartMetricFooter` in metric-card is already live).
- No new UI design, no new dependency, no new menu.
