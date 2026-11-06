# Projects (1600) — Architecture Audit & Roadmap

Figma: page "Dashboard: Projects", frame **Projects (1600)** `14061:68482` (1600x1268). Layer tree read through TalkToFigma (628 layers), PNG export checked.
Code: `src/app/dashboard/*`, `src/components/dashboard/*`, `src/components/ui/*` at commit `90c49c2`.
Not checked live: `/dashboard/projects` redirects to sign-in (Clerk), so the current state comes from reading the code, not from a screenshot.

---

## 1. Executive Summary

- The page is a **Projects overview dashboard**. Top to bottom: greeting head, 4 KPI pills, then 3 columns. The columns are: quick-add plus 3 finance cards; a tabbed, scrollable project list; a scrollable timeline of events grouped by project.
- **The shell can be reused** (navbar, head-top, footer, page column, Card panel, i18n, size hook). **The page content is 0% built.** Today `/dashboard/projects` falls into `src/app/dashboard/[section]/page.tsx` and renders an empty `Card variant="panel"`.
- **Most of the building blocks already exist** as shadcn-style primitives: `TableCell*` (= Text-Cell, Icon-Cell, Brand-Cell, Progress-Horizontal-Cell), `Badge`/`BadgeIcon`, `Tabs` pill, `Progress`, `AvatarGroup`, `ScrollArea`, `Button` (dark/ghost/outline pill), `Separator`, `Sidebar*` incl. `SidebarItemIndent`.
- **Biggest decision: the sidebar.** The Projects frames use **Sidebar-Dashboards-04**: 296 wide, a nested project tree, and no settings/user footer. The shell renders **Sidebar-01** (248, flat, with footer) for every route. That needs a decision before layout work.
- **No data layer exists** (no API, no store, no `src/lib` data). The page needs typed mock data behind async getters, so it can be swapped for an API later.
- The other **15 Projects (1600) frames** are sibling screens: Timeline, Statistic, Projects list, Activity, Members, Project editor, Stages, Tasks, Task detail, Articles, Chat. They are out of scope for this build, but they shape the route and data model now.

## 2. Page Structure (Figma, 1600)

```
Projects (1600) 1600x1268
├─ Sidebar-Dashboards-04 296x1268  (16 inset → 264 content)
│   ├─ Logo-Head-Sidebar 264x32: logo 32 + "New Project" 13/700 | bolt 16, sidebar-toggle 16
│   ├─ Menu "Navigate" (Head-Item 44 + chevron-up)
│   │   └─ Navigate-List-Group: 18 List Items x40
│   │       Dashboard (chevron-right)
│   │       Projects (expanded, chevron-up, active-parent)
│   │         └─ 12 projects, each brand logo + name (City Advertising Campaign, File transfer application, …)
│   │             └─ "Develop Chat Application" expanded → Dashboard (ACTIVE), Stages, Tasks, Messages, Chat
│   │                (vertical guide lines = indent levels 2 and 3)
│   ├─ Menu "More" (collapsed)   └─ Menu "Links" (collapsed)
│   └─ (no settings / language / night mode / user card)
└─ Content 1304x1268
    ├─ Navigate-Dashboard 1304x64: search pill 200x32 "Search …" ⌘K | menu Dashboard·News·Support·More (11/700)
    │    | notifications, help, settings (ghost 32) | Upgrade (dark pill 99x32) | avatar 32 | outline icon button 32 (close)
    ├─ Top 1304x56 (20 side inset, bottom divider)
    │   └─ Head-Dashboard-01 1264x32: breadcrumb [home] Dashboard | Help Chat · Docs · Print (ghost 32)
    ├─ Content 1304x1084 → column 1128 centered (88 sides)
    │   ├─ Head-Dashboard-11 1128x56 (bottom divider): Badge-Icon 32 waving-hand + "Hi, John Smith" 14/700 | "Add New Project" dark pill 142x32
    │   └─ Content 1128x876 (gap 24)
    │       ├─ KPI Grid 1128x64: 4 × Item 264x64 r36 (outline pill, gap 24)
    │       │     value 20/500 · label 11/700 · Badge-Icon-Pilled 32 (blue assignment / green restore_page / purple account_circle / cyan download)
    │       │     21 Projects · 145 Tasks · 12 Members · 432 Files
    │       └─ Columns 1128x788: 264 | 456 | 360 (gap 24)
    │           ├─ Col A 264 (stack, gap 24)
    │           │   ├─ Quick Add 264x116 r20: 2×3 grid of icon(20)+label(10/700): Project, Stages, Task, Member, Message, File
    │           │   ├─ Income 264x120 r20: Head = Text-Cell "Incoming income" + Icon-Cell (more_horiz) | "$ 14.000" 24/500 green | trend_up +23%
    │           │   ├─ Profit 264x120 r20: "Profit from income" | "$ 4.560" 24/500 purple | trend_down -11% red
    │           │   └─ Financial Statistics 264x360 r20: head + 3 concentric rings 207/144/90 (Income blue, Cost orange, Profit green) + 3 Badge-Default-Pilled labels
    │           ├─ Col B 456x788 r20: Head = Tab-Cell (Tab-Group-Pilled: Last Projects · On Deadline · Costs) + Icon-Cell more
    │           │   └─ scroll list 436 + scrollbar 20 (thumb 4x96 r30): Project Item 424x152 r12 (gap ~12)
    │           │        Brand-Cell (logo 24 + name) | Avatars-Group (4 × 24 + outline "+" 24)
    │           │        Progress-Horizontal-Cell (line 354x2 + "89%")
    │           │        2×2 Text-Cells: "5 Stages" · "Deadline: 09.25.2078" · "Income: $ 5000" · "21 tasks"
    │           └─ Col C "Latest events" 360x788 r20: Head = Text-Cell + Icon-Cell more
    │               └─ scroll list 340 (content 780 > 728): per project group
    │                    Group head: Brand-Cell 48 (logo 28) + "Develop Chat Application" + "3 Events"
    │                    connector (1x12 line) between rows
    │                    Event row 332x48: Badge-Icon-Feature-Cell (colored icon 32) | Text-Line-Cell (title / subtitle) | Badge-Cell "12:00" (outline pill 52x24)
    └─ Footer 1304x64: "© 2078 Global Inc." | 4 social outline 32 | "English Language" outline pill | chat + scroll-top outline 32
```

Layout systems: the shell is flex (sidebar + column). The page column is flex-col. The KPI row is a 4-col grid. The body is a fixed 3-col grid `264px 456px 360px` (= 1128). Col A is a flex-col stack. Cols B and C are fixed-height (788) cards with an internal scroll area.

## 3. Component Inventory

| Figma part | Maps to (existing) | Status |
|---|---|---|
| Navigate-Dashboard | `dashboard/dashboard-navbar.tsx` (Navigate-01) | **Exists** — verify trailing outline "close" button and logo slot (Figma hides logo, sidebar owns it) |
| Head-Dashboard-01 | `DashboardHeadTop` | **Exists** — placement differs (see §6) |
| Head-Dashboard-11 (greeting) | `NavigateHead` + `Badge` icon + `Button dark pill` | **Missing** variant; compose, no new primitive |
| KPI Item (pill 264x64) | none (closest `Badge`/`Card`) | **Missing** → `Card` variant `stat` (r36 outline) or new `ui/stat-pill.tsx` |
| Badge-Icon-Pilled 32 | `BadgeIcon` / `Badge size="square-32"` | Exists — verify color set (blue/green/purple/cyan soft) |
| Quick Add card | `Card` + `Button` ghost (icon+label) | **Missing** composition |
| Text-Cell / Icon-Cell (card heads) | `TableCell`, `TableCellTitle`, `TableCellIcon` | Exists |
| Income/Profit card | `ChartMetricCard` *maybe* (amount + trend) / `Card` + `TableCell` | **Missing** — check ChartMetric fit first, else compose |
| Financial Statistics rings | `charts/radial-chart.tsx` (donut/pie/progress) | **Missing kind** → add `rings` (concentric) kind |
| Badge-Default-Pilled labels | `Badge` pill | Exists |
| Tab-Cell / Tab-Group-Pilled | `Tabs` variant `pill` (known gap: only Small 32 built; Figma here is 28) | Exists — **needs size 28** |
| Project Item (424x152) | `Card` + `TableCellLogo`, `AvatarGroup`/`AvatarGroupCount`, `TableCellProgress`/`Progress`, `TableCell` | **Missing** composition (`ProjectSummaryCard`) |
| Brand logos | `public/icons/logotypes/{adobe,zoom}-color.svg` | Adobe, Zoom exist; **Apple, Kickstarter, WeChat missing** |
| Scrollbar (4x96 r30) | `ui/scroll-area.tsx` | Exists — verify thumb size/radius |
| Event group head / row / connector | `TableCell*` + `BadgeIcon` + `Badge` outline + `Separator` vertical | **Missing** composition (`ProjectEventTimeline`); `activity/ActivityFeed` is a different Figma component, don't force it |
| Sidebar-Dashboards-04 | `ui/sidebar.tsx` (`SidebarItemIndent`, `SidebarGroupHead`) + `dashboard-sidebar.tsx` | **Missing tree**; primitives exist |
| Footer | `dashboard-footer.tsx` | Exists |

Problematic or duplicated:
- `[section]/page.tsx` serves Projects as a placeholder. It has to give way to a real `src/app/dashboard/projects/` folder (its own comment already says so).
- `DashboardPage` puts `HeadTop` *inside* the 1128 column. The Projects frame puts it in a full-width 56px bar with a divider. One of the two is wrong for some pages (see §6).
- `DashboardHeadMain` (Head-Dashboard-02) is hard-wired. This page needs Head-Dashboard-11 instead, so `DashboardPage` needs a head slot.

## 4. Functional Analysis

| Element | Behaviour | Evidence |
|---|---|---|
| Search ⌘K, Upgrade, notifications, avatar | Already wired in navbar | code |
| Help Chat / Docs / Print | Static buttons today. Print → `window.print()` is the only self-evident action | Figma label |
| "Add New Project" | Navigate to the project editor (Figma frames 76419, "Project Name / Save Project") | sibling frame |
| Quick Add ×6 | Each opens its create flow (Project → editor; Stages/Task → stage/task pages; Member/Message/File → ?) | **Open question** |
| Card "…" menus (Income, Profit, Financial, Projects, Events) | DropdownMenu; items not drawn | **Open question** (suggest: Refresh, View all) |
| Tabs Last Projects / On Deadline / Costs | Client-side re-sort of the same list: recent first / deadline asc / income desc | **Assumption** |
| Project item | Click → project dashboard; avatar "+" → add member | Assumption |
| Events list | Scroll; group by project; time badge is static | Figma |
| Financial rings | Ring size ∝ value; hover tooltip optional | Assumption (no hover state drawn) |
| Sidebar project tree | Expand/collapse groups and projects; active route highlighted; vertical guides | Figma |
| States | No loading/empty/error states drawn → reuse `dashboard/loading.tsx` skeleton pattern + `ui/empty.tsx` | **Gap**, propose |
| Decorative | Greeting waving-hand, ring labels, trend icons | static |

No drag-and-drop, widget positioning or resize on this page. The WidgetBoard is **not** used here.

## 5. Data & State Architecture

No backend exists, so add one module. It is server-safe, typed, and returns async so a real API can replace it 1:1.

```ts
// src/lib/projects/types.ts
type Member  = { id: string; name: string; avatar: string }
type Project = { id: string; slug: string; name: string; logo: string; members: Member[]; progress: number; stages: number;
                 tasks: number; income: number; deadline: string /* ISO */; updatedAt: string }
type ProjectEvent = { id: string; projectId: string; kind: "member"|"comment"|"stage"|"file"|"task"; title: string; subtitle: string; at: string }
type ProjectTotals = { projects: number; tasks: number; members: number; files: number }
type Finance = { income: number; incomeTrend: number; profit: number; profitTrend: number; cost: number }
// src/lib/projects/data.ts → getProjects(), getProjectEvents(), getProjectTotals(), getFinance()
```

- **Server Component page** fetches all four and passes props down. No client store is needed.
- **Local client state only**: active tab (Projects card), sidebar expanded nodes (persist like `dashboard-sidebar-collapsed` in localStorage), dropdown open state.
- **Derived**: sorted lists per tab, events grouped by `projectId` with counts ("3 Events"), totals (or served precomputed), and currency/date formatting through next-intl.
- **Shared**: the project list is used by both the sidebar tree and the page. The sidebar is a client component in the layout, so it gets `projects` from the `projects/layout.tsx` server layout as a prop. No global store.
- i18n: all labels go into `src/messages/en.json` (+ ka). Numbers and dates go through `useFormatter`.

## 6. Figma Comparison (current `/dashboard/projects` vs frame)

**Missing implementation:** the whole content area (greeting head, KPI row, 3 columns), the sidebar project tree, and the data.

**Architectural:**
1. Sidebar variant: the Figma uses Sidebar-Dashboards-04 (296, tree, no footer). Code always uses Sidebar-01 (248, flat, footer).
2. Head layout: in Figma, Head-Dashboard-01 sits in a full-width 1304x56 bar (20 inset, divider) and only the greeting head is inside the 1128 column. Code puts both heads inside the 1128 column with 48 top padding.
3. `DashboardPage` cannot take a different main head (it has Head-02 hard-wired).
4. Projects routes are served by the generic `[section]` catch-all.

**Visual (to confirm on build):** content width 1304 vs 1352 (follows from the sidebar width), Tabs pill size 28 (not built), KPI pill r36 outline (no existing style), scrollbar 4x96.

**Functional:** no tab sorting, quick-add, card menus, or sidebar expand/collapse for projects.

## 7. Architectural Recommendations

**Keep unchanged:** `DashboardShell` structure, `DashboardNavbar`, `DashboardFooter`, `LanguageProvider`, `useDashboardSize`, all `ui/*` primitives except the additions below, and WidgetBoard (not involved).

**Update:**
- `dashboard-page.tsx`: add a `head` slot (default = Head-02, so other pages stay the same) and a `topBar` placement option (full-width Head-01) **if** the Figma check confirms the New Page frame also wants it.
- `dashboard-sidebar.tsx` + `nav.ts`: support optional `children` per nav item (data-driven tree via `SidebarItemIndent`). Projects gets its children from the project list.
- `ui/tabs.tsx`: add the pill size 28.
- `charts/radial-chart.tsx`: add the `rings` kind (concentric circles + legend badges).
- `ui/card.tsx`: add a `stat` variant (pill r36 outline, 64 high) **or** a new `ui/stat-pill.tsx`. Prefer a Card variant.

**Create:**
- `src/app/dashboard/projects/layout.tsx` (loads projects for the sidebar tree) and `page.tsx`.
- `src/lib/projects/{types,data}.ts`.
- `src/components/projects/`: `ProjectsGreeting`, `ProjectStats` (KPI row), `QuickAddCard`, `FinanceMetricCard` (Income/Profit, one component with two configs), `FinancialStatsCard`, `ProjectListCard` (tabs + list), `ProjectSummaryCard` (one item), `ProjectEventsCard` (+ group/row parts). All are compositions of `ui/*`.

**Don't:** build a client store, reuse WidgetBoard, or force `ActivityFeed` (a different Figma component) onto the events rows.

## 8. Implementation Roadmap

| # | Task | Why | Files | C/U/R | Depends | Priority | Complexity |
|---|---|---|---|---|---|---|---|
| **P1 Foundations** |
| 1.1 | Resolve open questions Q1–Q3 (sidebar, head placement, routes) | They block layout | — | — | — | Critical | Low |
| 1.2 | Data types + mock getters | Every section needs data | `src/lib/projects/*` | C | — | Critical | Low |
| 1.3 | `projects/` route folder (layout + page), drop Projects from `[section]` static params | Real route | `src/app/dashboard/projects/*`, `[section]/page.tsx` | C/U | 1.1 | Critical | Low |
| 1.4 | `DashboardPage` head slot (+ top-bar option) | Head-11 on this page | `dashboard-page.tsx` | U | 1.1 | Critical | Low |
| **P2 Core layout** |
| 2.1 | Page grid: KPI row + 3-col `264/456/360` + Col A stack | Skeleton of the page | `projects/page.tsx` | C | 1.3 | High | Low |
| 2.2 | Sidebar project tree (data-driven children, indent, expand state) | Figma Sidebar-04 | `nav.ts`, `dashboard-sidebar.tsx` | U | 1.1, 1.2 | High | Medium |
| **P3 Components** (each: shadcn skill → figma:spec of its set → build → audit) |
| 3.1 | `Card` stat variant + `ProjectStats` | KPI row | `ui/card.tsx`, `projects/ProjectStats.tsx` | U/C | 2.1 | High | Low |
| 3.2 | `ProjectsGreeting` (Head-11) | Page head | `projects/ProjectsGreeting.tsx` | C | 1.4 | High | Low |
| 3.3 | `FinanceMetricCard` ×2 (check `ChartMetricCard` first) | Col A | `projects/FinanceMetricCard.tsx` | C | 2.1 | High | Low |
| 3.4 | `QuickAddCard` | Col A | `projects/QuickAddCard.tsx` | C | 2.1 | Medium | Low |
| 3.5 | `Tabs` pill size 28 | Col B head | `ui/tabs.tsx` | U | — | High | Low |
| 3.6 | `ProjectSummaryCard` + `ProjectListCard` (ScrollArea) | Col B | `projects/*` | C | 3.5, 1.2 | Critical | Medium |
| 3.7 | `ProjectEventsCard` (group head, connector, row) | Col C | `projects/*` | C | 1.2 | High | Medium |
| 3.8 | RadialChart `rings` kind + `FinancialStatsCard` | Col A | `charts/radial-chart.tsx`, `projects/*` | U/C | 2.1 | Medium | Medium |
| **P4 Functionality** |
| 4.1 | Tab sorting (derived) | Tabs do something | `ProjectListCard` | U | 3.6 | High | Low |
| 4.2 | Card "…" DropdownMenus | Figma affordance | cards | U | Q5 | Low | Low |
| 4.3 | Add New Project / Quick Add / project item links | Navigation | cards, head | U | Q4 | Medium | Low |
| 4.4 | Loading (`projects/loading.tsx`) + empty states | No states drawn | `projects/*`, `ui/empty` | C | 2.1 | Medium | Low |
| 4.5 | i18n strings + number/date formatting | Existing i18n setup | `messages/*.json` | U | P3 | Medium | Low |
| **P5 Visual** |
| 5.1 | Match spacing/typography/colors per `figma.md` of each set; dark mode check | Fidelity | P3 files | U | P3 | High | Medium |
| **P6 Responsive** |
| 6.1 | Read Projects (768)/(360) frames (`figma:responsive`), adapt grid/stack, sidebar Sheet | Breakpoints | page + cards | U | P5 | Medium | Medium |
| **P7 Validation** |
| 7.1 | Browser check vs export at 1600 (signed in), console clean, tsc/lint/build, known-gaps lines | Done criteria | — | — | all | High | Low |

## 9. Dependencies & Risks

- **Sidebar width change (248 → 296)** shifts every dashboard page if applied globally. If it's applied per section, the content jumps when you navigate between sections.
- **Head placement** change in `DashboardPage` can regress Home/widgets pages. Keep the default behaviour and opt in per page.
- **Missing assets** (you supply them; I won't draw SVGs): logos `apple`, `kickstarter`, `wechat`; icons `material-assignment`, `material-restore_page`, `material-waving_hand`, `material-print` (already in known-gaps), `material-history`/tasks, `material-person_add`, `material-message`/sms, stages icon, and the event-kind icons. Until they arrive, placeholders go in known-gaps.
- **Tabs pill** has a known gap: only Small 32 is built and the full Switcher is unread. Size 28 needs a figma:spec of Tab-Group-Pilled.
- **TalkToFigma limits**: no auto-layout gaps or stroke widths, so card paddings and item gaps (~12) are read from images.
- **Auth**: browser validation needs a signed-in session (Clerk redirect).
- The page is mostly static mock data. Real data (API, auth-scoped) is a future swap behind `src/lib/projects`.

## 10. Recommended Starting Point

**Task 1.1, then 1.2 + 1.3.** First answer the sidebar, head and route questions, because every layout task depends on them. Then add `src/lib/projects` (types + mock data) and the `src/app/dashboard/projects` route. This is low risk and touches no existing visuals, and every later component plugs into it. The first visible component after that should be **3.6 ProjectListCard**: it is the centre of the page and exercises the most primitives (TableCell, AvatarGroup, Progress, Tabs, ScrollArea).

## Build Order (to-do)

- [x] 1. Answer Q1–Q3 → Q1: keep Sidebar-01, add project tree under Projects · Q2: full-width Head-01 bar on Projects only · Q3: `/dashboard/projects` = global overview
- [x] 2. Data: `src/lib/projects/types.ts` + `data.ts` (mock projects, events, totals, finance)
- [x] 3. Route: `src/app/dashboard/projects/layout.tsx` + `page.tsx`; remove Projects from `[section]`
- [x] 4. `DashboardPage` head slot + `topBar="full"` + `panel={false}`
- [x] 5. Page grid: KPI row + 3 columns 264 / 456 / 360, empty placeholders
- [x] 6. Greeting head (Head-Dashboard-11) + "Add New Project" button
- [x] 7. KPI pills: `Card` stat variant + `ProjectStats` (4 items)
- [x] 8. `Tabs` pill size 28
- [x] 9. `ProjectSummaryCard` (one project item)
- [x] 10. `ProjectListCard`: tabs + scroll list + tab sorting
- [x] 11. `ProjectEventsCard`: group head, connector, event row, scroll
- [x] 12. `FinanceMetricCard` (Income + Profit)
- [x] 13. `QuickAddCard` (6 actions)
- [x] 14. `RadialChart` rings kind + `FinancialStatsCard`
- [x] 15. Sidebar project tree (expand/collapse, active project)
- [ ] 16. Links + actions: Add New Project, Quick Add, project click, "…" menus
- [x] 17. Loading + empty states
- [ ] 18. i18n strings + number/date formatting
- [ ] 19. Visual pass vs Figma (spacing, type, colors, dark mode) — known: sidebar indent shows ↳ arrows (Figma: vertical guide lines); Stages/Tasks sidebar icons unverified (list/check stand-ins); brand logos are wordmarks (need square icons); FinancialStats rings fixed size (finance prop unused)
- [ ] 20. Responsive: Projects (768) + (360)
- [ ] 21. Validate: browser vs export, console, tsc, lint, build, known-gaps

## Open Questions

- **Q1 Sidebar:** should Projects use Sidebar-Dashboards-04 (296, project tree, no footer), or should we add the project tree to the existing Sidebar-01 (248, keeps settings/user footer)?
- **Q2 Head-Dashboard-01:** should it be a full-width top bar with a divider on all dashboard pages (as in this frame) or only on Projects?
- **Q3 Routes:** this frame is `/dashboard/projects`, while the sidebar highlights *Develop Chat Application → Dashboard*. Should it be `/dashboard/projects/[slug]` with the overview as that project's dashboard, or the global overview?
- **Q4 Quick Add:** where do Member, Message and File go? Is it a dialog or a page?
- **Q5 "…" menus:** which items? None are drawn.
- **Q6 Tabs:** what does "Costs" sort by: income, cost, or a filter?
