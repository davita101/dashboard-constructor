# Task
9d-3: small code-only fixes — UploadFilesDialog uses `Link`, project dates locale-formatted, Sidebar `shadow-lg` → shadow token.

## TODO item
  - [ ] 9d-3 blur/shadow constants, date formatting (ProjectPage), UploadFilesDialog link, Dialog Black Cancel, Sidebar shadows

## Goal
Three tiny gap fixes from `design/known-gaps-triage.md` batch B3 (rows L52/L74/L95/L105). Blur/shadow literals (L13, Figma values unverified) and Dialog Black Cancel (no Figma-verified variant to pick) are skipped.

## Files
- `src/components/projects/UploadFilesDialog.tsx` (line ~169 `<a href="/api/files/..." className="hover:underline">`)
- `src/components/ui/link.tsx` (existing `Link`, variants/size)
- `src/components/projects/ProjectStagesCard.tsx` (line ~15 `ISO date -> dd.MM` helper) and any other dd.MM(.yyyy) formatter (grep `getDate`, `padStart`, `split("-")` in `src/components/projects`, `src/lib/projects`)
- Sidebar component using `shadow-lg` (grep `shadow-lg` in `src`), `src/styles/color-mode.css` (`--shadow-base`), `src/styles/tailwind-theme.css`
- `design/known-gaps.md`, `design/known-gaps-triage.md` (drop fixed lines)

## Steps
1. Upload link: replace the plain `<a>` with `Link` (`render`-less is fine, `href` to `/api/files/<id>`, keep `download`/target attrs if present). Pick variant `900`, size `14`.
2. Dates: replace hand-built dd.MM / dd.MM.yyyy strings with `Intl.DateTimeFormat` using the active locale (client: `useLocale()` from next-intl if already used in the repo; server: `getLocale()`); fall back `en`. Use `{day:"2-digit",month:"2-digit"}` / plus `year:"numeric"`. Keep output identical for `en` as far as reasonable (en gives MM/dd — if that changes the Figma look, use `en-GB` for `en`). Use a UTC timezone so ISO dates don't shift a day.
3. Sidebar: change `shadow-lg` to the token shadow (`shadow-base` utility if defined in tailwind-theme.css; if not, add `--shadow-base` mapping to `@theme inline` in `tailwind-theme.css`'s generator `scripts/build-tokens.mjs` is NOT to be edited — use `shadow-[0_8px_16px_var(--shadow-base)]`-style arbitrary value only if no utility exists).
4. Remove/adjust the matching lines in known-gaps.md; mark the three rows done in the triage doc.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- `grep -n "<a " src/components/projects/UploadFilesDialog.tsx` shows no plain file link.
- `grep -rn "shadow-lg" src/components` has no sidebar hit.
- No hex colors, `space-[xy]-`, `dark:` in changed lines.

## Decisions
- Skipped blur/shadow constants (Figma values unverified, risk of visual drift) and Dialog Black Cancel (needs a Figma-verified variant): stays in gaps.
- Tooltip/Counter/Double Input/CheckboxCard don't exist in code, BreadcrumbLink keeps its own Figma colors (9d-2 closed as moot).

## Don't
- No new UI, no visual redesign, no edits to generated `src/styles/*`, no new deps.
