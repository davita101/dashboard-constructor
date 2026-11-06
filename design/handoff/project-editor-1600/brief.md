# Brief: Project page `/dashboard/projects/[slug]` (Figma Projects (1600) 14061:76419)

Desktop only (1600). Look once at `img/project-1600.png`. Layer data: `tree.txt` (read only the line ranges below). No 360 frame read yet: below `lg` just stack everything in one column.

## Build
1. Route `src/app/dashboard/projects/[slug]/page.tsx` (Server Component). `const { slug } = await params` (Next 16: params is a Promise). `getProjectDetail(slug)` from `@/lib/projects/data`; `notFound()` if undefined. `generateStaticParams` from `getProjects()`. Also `getProjectEvents()` + `getProjects()` for the events card (filter events to this project).
   Use `DashboardPage` like `src/app/dashboard/projects/page.tsx`: `topBar="full" panel={false} head={<ProjectPageHead …/>}`.
2. `src/components/projects/ProjectPageHead.tsx` — Head-Dashboard-17 (tree 152-164, 1128x84): logo tile (Avatar frame variant, reuse what ProjectsGreeting/sidebar use) + "Project Name" 14/700 | "Save Project" dark pill button with download/save icon. Bottom Separator.
3. Main card (tree 165-551, 1128x1176 r20): `Card variant="panel"`. Head 64: `Tabs` pill (size 32) with 9 tabs: Dashboard, Stages, Tasks, Messages, Chat, Members, Customer, Files, Activity — only Dashboard has content; others are links-to-be (Tabs with Dashboard selected, no panels needed for the rest). Separator under head.
4. `src/components/projects/ProjectStatTile.tsx` — tree 224-369. Grid: row 1 = "Project implementation" (340x160, more menu, value `56%`) + 4 small tiles (Messages, Stages, Members, Files with icon + label head, big number); row 2 = "Deadline" (340x160, more menu, date) + New Tasks (primary/blue), Task In Work (warning/yellow), Done Tasks (success/green), Faild Tasks [sic, write "Failed Tasks"] (danger/red). Value color via a `cva` `tone` variant on the tile. One component, two sizes (`wide` 340, default). Tiles are `Card` with r16 outline — add a `Card` variant if none fits.
5. Lower group (tree 370-551, 1088x728): left column 712 = `CompanyCard` (full width, tree 376-393) above a 2-col row `ProjectStagesCard` (352x504, tree 394-…) + existing `ProjectMembersCard` (do NOT change it); right column = existing `ProjectEventsCard` (reuse; pass this project's events + projects, title "Latest events").
6. `src/components/projects/CompanyCard.tsx`: head Text-Cell "Company" + more | logo tile 96 (outline r12, company.logo) + name 13/700 + description paragraph (base-600, 11-12 size per tree).
7. `src/components/projects/ProjectStagesCard.tsx`: head "Project Stages" + more; ScrollArea list of stage items (outline r12): number badge (Badge pill, tone cycles blue/green/purple/sky/orange) + name 11/700, Separator, bottom row: flag+tasks, group+members, cloud+files | alarm start date | alarm end date (short `dd.MM`). Data: `ProjectStage`.
8. i18n: add `projectPage.head.*`, `projectPage.tabs.*`, `projectPage.stats.*`, `projectPage.company.*`, `projectPage.stages.*` to `messages/en.json` (keep existing `projectPage.members`). Dates/numbers via next-intl formatter.

## Reuse (run `pnpm -s ui:index` on these, don't read whole files)
card, tabs, table-cell, badge, button, avatar, separator, scroll-area, dropdown-menu, member-row. The more-menu pattern = copy the head from `ProjectMembersCard.tsx` (Text-Cell + DropdownMenu with "View all").

## Icons
Use existing `public/icons/material-*.svg`. Missing ones: reference the path anyway and list them in `design/known-gaps.md` (one line `- ProjectPage: missing icons …`). Never write SVGs.

## Rules
Tokens only, no hex, no `space-x/y`, no `w-N h-N`, no `dark:`. className = layout only. Server Components unless interactivity needed (Tabs may need a client wrapper). Don't commit.

## Done
`pnpm exec tsc --noEmit --incremental false`, `pnpm exec eslint` on new files, `pnpm build`. Reply ≤10 lines.
