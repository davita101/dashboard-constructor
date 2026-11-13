# Task
Live `progress-half` widget shows overall task completion % from the user's projects.

## TODO item
- [ ] 7a progress-half = overall task completion %

## Goal
On `/dashboard` (inside `WidgetDataProvider`) the progress-half chart card draws an arc of `tasksDone ÷ tasks` and centre text "NN%" + label "Completed". Legend: Done (blue) / Remaining (gray). Title "Task completion". Picker previews (no provider) keep the Figma demo exactly as now.

## Files
- `src/components/dashboard/widgets/catalog.tsx` (`RadialCardPreview`, `halfLegend`, `live` logic: currently `live = counts && kind !== "progress-half"`)
- `src/components/charts/radial-chart.tsx` (progress-half branch hardcodes 0.97 / 0.56 → add optional prop)
- `messages/en.json` (`widgets.data.*` keys; only en has them)
- `src/components/dashboard/widgets/widget-data.tsx` (read-only; `totals.tasks`, `totals.tasksDone`)

## Steps
1. RadialChart: add optional `ratio?: number` (0-1) used by kind="progress-half" for the filled arc (clamp 0..1, cap just under 1 like progress does; default = current 0.97 card / 0.56 non-card). No visual change when omitted.
2. catalog.tsx: for progress-half with data, pass `ratio={tasks ? tasksDone/tasks : 0}`, `total={`${pct}%`}`, `totalLabel={t("completed")}`; title `t("taskCompletion")`; hide ChartCardSwitcher/Metrics like other live radial cards; legend items from new keys `done` (blue) / `remaining` (gray) via `t(...)`.
3. Add en.json keys under `widgets.data`: `taskCompletion`, `completed`, `done`, `remaining` (check existing `status.done` first; reuse if fine, no duplicates).
4. Smoke: extend or add `scripts/` check only if cheap (e.g. unit-style tsx test of the ratio→arc clamp); otherwise verify in browser.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` ok.
- Grep new/changed lines: no hex colors, `space-[xy]-`, `dark:`.
- `/design-system` radial chart page (if exists) and widget picker previews unchanged (no provider → demo values, "Views/Visits" legend).
- Browser `/dashboard` with progress-half widget added: arc matches done÷all of the Tasks / Tasks-done tiles, centre shows same %, 0 tasks → 0% and empty arc, no console errors.

## Decisions
- Metric: overall completion = tasksDone ÷ tasks (same as the "Tasks done" ring), rounded %.
- Reuse `RadialChart` `total`/`totalLabel` props; add one `ratio` prop rather than a new component.
- Label text only in en.json, like earlier 6b-2.

## Don't
- No new UI frames/layout; don't touch other widgets (bar, column-5, metric tiles, candle, map).
- No DB/schema changes. Don't edit `.env*`.
