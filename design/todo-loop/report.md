# Report 9d-3
Changed:
- `src/components/projects/UploadFilesDialog.tsx`: file `<a>` -> `Link` (variant 900, size 14).
- `src/lib/projects/dates.ts` (new): `formatIsoDate` via `Intl.DateTimeFormat`, UTC, `en` -> `en-GB` (dd.MM look kept), "/" -> ".".
- `ProjectStagesCard.tsx`, `ProjectDashboardCard.tsx`: use it with `getLocale()`.
- `design/known-gaps.md`, `known-gaps-triage.md`: dropped/marked done.
Decisions: Sidebar `shadow-lg` already absent from `src` (grep empty), nothing to change; gap line removed.
Commands: `pnpm exec tsc --noEmit` PASS; `pnpm lint` PASS (0 errors, 1 pre-existing warning); `pnpm build` PASS; grep `shadow-lg` src: none; `<a ` in UploadFilesDialog: none.
