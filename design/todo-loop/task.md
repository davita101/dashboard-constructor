# Task
9e-3a: backend flags to remove a project / client logo (no UI).

## TODO item
      - [ ] 9e-3a `removeLogo` / `removeClientLogo` flags in `projectFields` + `setLogos` clears the column and deletes the unused object; smoke `scripts/logo-remove-smoke.mts`; no UI

## Goal
Update project action can clear `projects.logo` and/or `clients.logo`. Old storage object removed when no row uses it (existing `removeLogoIfUnused`).

## Files
- `src/lib/projects/schemas.ts` (projectFields; read `fromForm` in `actions.ts` for how checkbox/boolean strings arrive)
- `src/lib/projects/mutations.ts` (`setLogos`, ~line 546)
- `src/lib/projects/actions.ts` (create/update actions)
- new `scripts/logo-remove-smoke.mts` (pattern: `scripts/chat-actions-smoke.mts`)

## Steps
1. Schema: add `removeLogo` and `removeClientLogo` optional booleans to `projectFields` (form value "on"/"true"/"1" → true, absent → false). A new upload for the same slot wins over remove.
2. `setLogos`: early return only when no upload and no remove flag. Remove flag sets column to null (client: only if project has a client; else ignore silently or MutationError "invalid" on field `clientLogo` — pick ignore). Call `removeLogoIfUnused(tx, old)` for the old URL after the update, same tx.
3. Update action passes input through unchanged (already does). Create action: flags ignored (nothing to remove).
4. Smoke script: temp `smoke_<tag>` user/project/client with fake logo URLs (non-storage URL so no storage call), call `setLogos` with remove flags, assert columns are null; assert upload+remove conflict keeps upload not testable without storage → only test schema parse for that. Cleanup rows at end. Print `PASS <name>` lines.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` ok.
- `pnpm exec tsx --conditions=react-server scripts/logo-remove-smoke.mts` prints only PASS lines, exit 0, covers: flag parse (absent=false, "on"=true), project logo cleared, client logo cleared, other logo untouched, non-member refused, no-client + removeClientLogo ignored.
- No hex colors / `space-[xy]-` / `dark:` in changed files.

## Decisions
- Remove via boolean flags (not empty-file magic): explicit, works with the existing FormData action.
- Client remove without client = ignored (no error): UI only shows the control when a client logo exists.
- Split from UI (9e-3b) to keep sessions small.

## Don't
- No UI, no i18n changes, no migrations. Don't touch other tables. Never delete non-smoke rows; smoke cleans only its own `smoke_` rows.
