# Task
Live dashboard "table" widget shows the user's projects instead of the Figma product sample.

## TODO item
- [ ] Table widget: replace the product table on the live board with the user's projects (name + logo, progress, deadline, income, cost, members) using the existing Figma table component (`src/components/table/`); picker preview may keep the Figma sample

## Goal
On `/dashboard`, the board's `table` widget lists the signed-in user's projects (columns: select, Project = logo + name, Progress, Deadline, Income, Cost, Members). The picker preview keeps `<ProductTable />` unchanged.

## Files
- `src/components/table/product-table.tsx` (read: pattern to copy)
- new `src/components/table/projects-table.tsx`
- `src/components/dashboard/widgets/widget-data.tsx` (add `projects: Project[]` to `WidgetData`)
- `src/app/dashboard/page.tsx` (call `getProjects()` in the Promise.all, pass in `value`)
- `src/components/dashboard/widgets/catalog.tsx` (table `board:` uses a small `ProjectsTableWidget` that reads `useWidgetData()`; falls back to `<ProductTable />` when no provider)
- `src/components/ui/table-cell.tsx` (has TableCellImage, TableCellLogo, TableCellProgress; reuse, extend with a variant only if needed)
- `src/lib/projects/types.ts` (`Project` type), existing money/date formatters used by the projects list page (grep `income` in `src/components/projects`)
- `src/i18n` / `messages/en.json` if widget labels live there (en only)

## Steps
1. Add `projects` to `WidgetData`; fetch via `getProjects()` in `/dashboard/page.tsx`.
2. Create `ProjectsTable` (client) mirroring ProductTable structure: same `Table*` parts, header sort (`SortHead` logic: first click asc, second desc, third clear; sort numerically on raw numbers/dates, name by localeCompare), select-all checkbox + row checkboxes (no default selection). Project cell = `TableCellLogo`/`TableCellImage` with project logo + `TableCellTitle` name, row name links to `/dashboard/projects/<slug>` if a link-capable slot exists, else plain title. Progress = `TableCellProgress` (0–100). Deadline, Income, Cost formatted with the same formatters the projects list uses. Members = avatar stack or count via existing member/avatar-group component used on project cards (reuse, do not invent).
3. Share the `SortHead` helper: export it from `product-table.tsx` (or move to its own file) instead of copying it.
4. Empty state: no projects → a single row/message using existing empty-state pattern (grep "empty" in components); keep it text-only with tokens.
5. Wire in `catalog.tsx`: `board: <ProjectsTableWidget />`; preview unchanged.
6. Add a line to `design/known-gaps.md`: Projects table widget: reuses product-table frame (14055:68891) columns swapped; no Figma frame for projects columns.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- grep new/changed files for hex colors, `space-[xy]-`, `dark:` → none.
- Picker preview still renders `ProductTable` (grep catalog.tsx: `preview: <div className="w-210"><ProductTable />` unchanged).
- Dev server `/dashboard` (if you can sign in; otherwise state it could not be checked): table widget shows project rows with real names, no console errors.
- Report lists files changed.

## Decisions
- Separate `ProjectsTable` rather than generalizing `ProductTable` generics: smaller diff, picker sample untouched.
- No default selected row (Figma sample preselects row 4 only as demo).
- Columns fixed as in the TODO line; no pagination (users have few projects; cap at what getProjects returns).

## Don't
- No new UI patterns without an existing component; no hand-written SVGs; no hardcoded colors.
- No DB/schema changes. Don't touch other widgets.
