# Task
Verify "dead control" gaps are already fixed in code, remove stale lines from known-gaps.md, fix any still dead.

## TODO item
    - [ ] 9e-1 Verify Night Mode switch, footer back-to-top, QuickAddCard tiles, forgot-password/verify routes are already wired in code; drop stale lines from known-gaps.md; fix whatever is still dead

## Goal
Planner's read: Night Mode (`src/components/dashboard/theme.ts`, sidebar row), back-to-top (`dashboard-footer.tsx` onClick), QuickAddCard (all 5 tiles open dialogs), `/forgot-password` + `/check-email` pages exist. known-gaps.md still lists them as gaps (L84, L89, L97 area, L81-83). Confirm each by reading code, then correct known-gaps.md. Fix real remaining dead ends only if small (≤ 3 files).

## Files
- design/known-gaps.md (lines mentioning Night Mode, back-to-top, QuickAddCard "no click handlers", Forgot password link, /verify)
- src/components/dashboard/{theme.ts,dashboard-sidebar.tsx,dashboard-footer.tsx}
- src/components/projects/QuickAddCard.tsx
- src/app/(auth)/* (forgot-password, check-email, password-reset, set-new-password, sign-up)
- design/known-gaps-triage.md (mark B4 rows done/stale)

## Steps
1. Read each file; confirm Night Mode switch toggles `.dark`, back-to-top scrolls, tiles open dialogs, forgot-password link target exists.
2. Check `/verify` : does sign-up email-code step redirect to an existing route? Check what route it uses; if it points at a missing page, note it (do not build auth pages here; queue #5 owns that).
3. Edit known-gaps.md: remove or rewrite only lines now false. Keep true remainders (chat screen, DM picker, 2FA if truly unwired, /verify if truly missing).
4. Report what stayed dead.

## Acceptance
- `pnpm exec tsc --noEmit` passes; `pnpm lint` 0 errors; `pnpm build` passes.
- `grep -n "Night Mode switch in Sidebar-01 is not wired" design/known-gaps.md` → no match.
- `grep -n "back-to-top button still has no action" design/known-gaps.md` → no match.
- `grep -n "no click handlers except Project" design/known-gaps.md` → no match.
- Any remaining "page not built" claim in known-gaps matches reality (route absent in src/app).

## Decisions
Pure verification/doc task: the code was fixed in earlier phases, only docs lag. Auth flow pages are out of scope.

## Don't
- No new UI, no new SVGs, no Figma invention.
- Don't touch DB or migrations.
- Don't rewrite known-gaps lines about unrelated components.
