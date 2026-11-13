# Report

## Changed
- new `src/components/table/projects-table.tsx` (ProjectsTable: select, Project logo+link, Progress, Deadline, Income, Cost, Members avatars; sort; empty row)
- `src/components/table/product-table.tsx`: `SortHead` made generic + exported (no copy)
- `src/components/dashboard/widgets/widget-data.tsx`: `projects: Project[]`
- `src/app/dashboard/page.tsx`: `getProjects()` in Promise.all
- `src/components/dashboard/widgets/catalog.tsx`: `ProjectsTableWidget` (falls back to `<ProductTable />` w/o provider); preview unchanged
- `messages/en.json`: widgets.data keys project/progress/deadline/noProjects/selectAll/selectRow
- `design/known-gaps.md`: line added

## Decisions
- Formatters: next-intl `useFormatter` like ProjectSummaryCard (USD no decimals, dd.mm.yyyy UTC).
- Name links to `/dashboard/projects/<slug>/dashboard` (same as card).
- Empty state: one muted text row (no Empty component inside table).

## Checks
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 pre-existing warning in command.tsx)
- `pnpm build`: PASS
- grep hex / space-x/y / dark: in new file: none
- `/dashboard` curl: 307 (auth redirect); could not sign in, so live render not checked in browser.
