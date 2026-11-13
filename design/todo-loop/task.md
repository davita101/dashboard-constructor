# Task
7e: fix "Tasks by project" bar + stacked bar axes (names once, not clipped) and legend.

## TODO item
- [ ] 7e Stacked bar + bar ("Tasks by project"): project names render on BOTH y axes (left and right) and are clipped ("Banner evelopment", "Banner Developmen"); show names once (left axis, or above each bar), give the axis enough width or truncate with an ellipsis + full name in the tooltip; add a legend for the status colors (new / in work / done / failed, reuse `widgets.data.status.*`)

## Goal
Live bar and bar-stacked widgets: project names appear once (left y axis), wide enough or ellipsis-truncated, full name visible in tooltip; stacked shows a status legend. Picker/demo previews (no `categories`) unchanged.

## Files
- src/components/charts/cartesian-chart.tsx (bar `categories` branch ~L368, bar-stacked branch ~L426)
- src/components/dashboard/widgets/catalog.tsx (CartesianCardPreview ~L95-175: pass `yAxis`, legend)
- src/components/charts/chart-data.ts (helpers, if needed)

## Steps
1. In the `categories` branches only (bar live + bar-stacked live): render only the left category YAxis (`yAxis="left"` effective), no right axis. For stacked pass `yAxis="left"` from catalog when `liveBars`; for bar live ignore the right axis when `categories` set.
2. Axis width ~ 96 px with a custom `tick` that truncates names to ~14 chars with "…" (SVG `<text>`, token fill via className e.g. `fill-base-600`; no hex). Full name in tooltip: add `ChartTooltip` + `ChartTooltipContent` to live `bar` too (name as label), and make stacked tooltip show full project name as label (use `labelFormatter` or the row `name` payload); keep full name in row data, truncate only in tick.
3. Legend: stacked already passes `legendItems` (status keys); confirm it renders below the plot and is visible with correct tones (matching `statusColors` used by the bars). Fix if it does not render or colors mismatch. `bar` live (total tasks) needs no legend.
4. Check in browser /dashboard (signed-in needed; if unavailable, check by a small render test or by reasoning and state it in report).

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- grep new/changed code: no hex colors, `space-[xy]-`, `dark:`.
- Live bar & stacked: one y axis only (code review: no `yAxisId="r"` YAxis rendered when `categories` set); tick truncation function present; tooltips show full name.
- Demo previews (no `categories`) render identical to before (their branches untouched).
- Existing smoke: `pnpm exec tsx --conditions=react-server scripts/dashboard-charts-smoke.mts` still passes.

## Decisions
- Left axis only, ellipsis truncation at ~14 chars + tooltip with full name: simplest, keeps Figma look for the demo branches.

## Don't
- Don't touch 7f/7g, demo (non-live) chart branches, or Figma-specified sizes of other kinds. No new UI elements beyond tooltip/legend.
