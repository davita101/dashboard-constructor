# Report 7f

## Changed
- `src/components/ui/chart-metric.tsx`: `ChartMetricWideItem.icon`; items branch is `flex` with no wrap, cells `min-w-0 flex-1 p-4`, icon via inline `maskImage` style, heading and additionalText truncate, value row `whitespace-nowrap`. Footer gets `linkHref` (next/link) and `amount`. Empty `up`/`down` hide that trend. Defaults are unchanged, so the picker preview and `/design-system` render as before. The non-items branch is untouched.
- `src/components/dashboard/widgets/catalog.tsx`: `MetricWidePreview` passes 5 distinct existing icons. With data the footer shows "Profit", `formatUsd(profit)`, the profit trend (`finance.profitTrend` already exists) and a link "View projects" to /dashboard/projects. Without data it renders the old Figma footer.
- `messages/en.json`: `widgets.data.viewProjects`. `profit` already existed.

## Decisions
- Income cell keeps `additionalText` (truncates if it overflows).
- Footer trend: only one is shown, up or down, and none when it is 0.

## Commands
- `pnpm exec tsc --noEmit`: PASS (0 errors)
- `pnpm lint`: PASS (0 errors, 1 existing warning in command.tsx)
- `pnpm build`: PASS
- grep for hex, `space-[xy]-`, `dark:` on the diff: PASS (matches only in task.md)
- Icon files checked with `ls`: all 5 exist.
- No browser check (unattended), so the one-row fit at ~1128px is unverified visually.
