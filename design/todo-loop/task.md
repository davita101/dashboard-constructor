# Task
7f: live metric-card (wide KPI strip) fits one row, real footer, real icons.

## TODO item
  - [ ] 7f Wide metric (metric-card): 5 items wrap the 5th (Income) onto a second row: fit all KPIs on one row at desktop width (or drop to 4 and move Income into the footer); the footer still shows the Figma placeholder "Heading · Text · Text · Heading": put real content (e.g. profit + its 30-day trend, link "View projects" → /dashboard/projects) or hide it; the item icons are empty placeholder circles: use the existing icons (projects/tasks/members/files/income like ProjectStats)

## Goal
On `/dashboard` the live `metric-card` widget shows 5 KPIs on ONE row at desktop width, each with its own icon; footer shows real data (profit + 30-day trend, link "View projects" to /dashboard/projects) instead of Figma placeholders. Picker preview (no provider data) stays the Figma sample, unchanged.

## Files
- `src/components/ui/chart-metric.tsx` (`ChartMetricWideItem` add `icon?: string`; `ChartMetricWideBody` items branch; `ChartMetricFooter`)
- `src/components/dashboard/widgets/catalog.tsx` (`MetricWidePreview`)
- `src/messages/en.json` (or wherever `widgets.data.*` lives: add keys `profit`, `viewProjects`)
- `src/lib/projects/*` only to read: `finance.income/cost/incomeTrend`, `trendOf`, `formatUsd`

## Steps
1. `ChartMetricWideItem`: add `icon?: string`. In items branch use `item.icon ?? "/icons/material-default-icon.svg"` in the mask class (`mask-[url(...)]` needs a static string: set via inline `style={{ maskImage: \`url(${icon})\`, WebkitMaskImage: ... }}` or a CSS var `[--icon:url(...)]` + `mask-(image:--icon)`; no hex, no dark:).
2. One row: items branch container `flex-nowrap`, items `min-w-0 flex-1`, shrink padding (`p-4`) and drop `pr-3` if needed; the widget is "full" size (~1128px) so 5 cells ≈ 225px each. Value + trend must not wrap (`whitespace-nowrap`, truncate heading). Income cell: keep value + trend, drop `additionalText` for that cell if it overflows (it moves to the footer).
3. Icons (existing files only): projects `/icons/material/material-assignment.svg`, tasks `/icons/material/material-restore-page.svg`, members `/icons/material-account-circle.svg`, files `/icons/material-file-download.svg`, income `/icons/material-account-balance-wallet.svg` (same as ProjectStats). Verify each file exists with `ls`.
4. Footer: `ChartMetricFooter` size="wide" currently always renders two `ChartTrend` "Text" placeholders. Add optional props so live use renders only: primary = "Profit" label + amount (`income - cost`, `formatUsd`) + one trend (reuse `trendOf` on profit trend if `finance` has one; else hide trend) and `link` = "View projects" as a real `<Link href="/dashboard/projects">` (next/link). Add a `hideTrends`/`trends` prop (default shows placeholders, so the picker preview and `/design-system` stay identical).
5. i18n: add `profit`, `viewProjects` to `widgets.data` in en.json only (other locales have no `widgets` keys).
6. Smoke in browser not possible unattended: rely on build + reading code. Don't change `design-system` pages.

## Acceptance
- `pnpm exec tsc --noEmit` 0 errors; `pnpm lint` 0 errors; `pnpm build` passes.
- `grep -nE "#[0-9a-fA-F]{3,8}\b|space-[xy]-|dark:" ` on changed files: no new matches.
- Without `items` prop `ChartMetricWideBody` and default `ChartMetricFooter` render exactly as before (diff shows the old branches untouched).
- Live branch: container has no `flex-wrap`; five icons reference five distinct existing files; footer has no "Heading"/"Text" strings and a link to `/dashboard/projects`.

## Decisions
- Keep 5 KPIs on one row (not drop to 4): the strip is full-width; Income stays with its trend.
- Footer content = profit (income − cost) + link "View projects": cheapest real data already in `WidgetData.finance`; trend only if already computed, else omitted (no new queries).
- Icons reuse ProjectStats set for consistency.

## Don't
- No new queries, no schema change, no new Figma-less UI beyond these tweaks.
- Don't touch 7g, picker preview, other widgets.
- Don't create SVG files.
