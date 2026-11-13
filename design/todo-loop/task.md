# Task
Phase 7c-3: metric-card (wide KPI strip) shows live totals: projects, tasks, members, files, income.

## TODO item
    - [ ] 7c-3 metric-card live: KPI strip (projects, tasks, members, files, income)

## Goal
On the live dashboard board, the `metric-card` widget renders one KPI cell per metric (Projects, Tasks, Members, Files, Income with 30-day trend) from `useWidgetData()`. Picker preview (no provider) stays the Figma sample, unchanged.

## Files
- `src/components/ui/chart-metric.tsx` (`ChartMetricWideBody`, ~line 497)
- `src/components/dashboard/widgets/catalog.tsx` (`MetricWidePreview`, ~line 411; helpers `formatCount`, `formatUsd`, `trendOf` already there)
- `messages/en.json` (`widgets.data`: add `projects`, `tasks`, `members`, `files` if missing; `income` exists)
- read: `src/components/dashboard/widgets/widget-data.tsx`, `src/lib/projects/types.ts` (`ProjectTotals` already has projects/tasks/tasksDone/members/files)

## Steps
1. `ChartMetricWideBody`: add optional `items?: { heading: string; value: string; delta?: string; deltaDirection?: "up"|"down"; additionalText?: string }[]`. Without `items` render exactly as today. With `items` render one existing cell layout per item (same markup/tokens: icon, heading, value, `ChartTrend` only when `delta` set, additional text), cells in a row, `flex-wrap` / equal widths so 5 cells fit the "full" width and wrap on small screens. Use `Separator` between cells if Figma sample has none: NO, just gap; do not add dividers.
2. `MetricWidePreview`: when `useWidgetData()` is non-null pass items: Projects (`totals.projects`), Tasks (`totals.tasks`), Members (`totals.members`), Files (`totals.files`), Income (`formatUsd(finance.income)`, delta from `trendOf(finance.incomeTrend)`, additionalText `t("last30")`). Footer unchanged.
3. Add missing en.json keys (other locales have no `widgets` keys; leave).
4. Make sure only one cell gets the trend; no empty `ChartTrend` rendered for cells without delta.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- Grep new/changed code: no hex colors, no `space-[xy]-`, no `dark:`.
- `ChartMetricWideBody` with no `items` produces identical markup to before (picker preview untouched).
- Reviewer reads diff: live branch only when `data` exists; values come from `totals`/`finance`.

## Decisions
- KPI set fixed as in the TODO line; income uses the same 30-day trend as other widgets; no new query (totals already carry members/files).
- Generalize the existing Figma cell via an `items` prop rather than a new component (variant of same shape).

## Don't
- No new Figma-less UI, no new queries/migrations, no changes to other widgets, no edits to the picker preview or to non-en locales.
