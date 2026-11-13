# Report 9e-1
Verified by reading code: all wired, only docs stale.
- Night Mode: `useNightMode` toggles `.dark` + localStorage + user_settings; sidebar Switch/row call setDark.
- Back-to-top: footer onClick scrolls ScrollArea viewport (or window on mobile).
- QuickAddCard: stages/task/member/message/file open dialogs, project links to /projects/new (to /new when no projects).
- Forgot password: /forgot-password, /check-email, /set-new-password, /password-reset pages exist; sign-in link targets /forgot-password.
- /verify: no route and none needed; reset-code and sign-up-code steps live in check-email form. Stale claim removed.
- 2FA (second factor) truly unwired: kept as gap.
## Changed
- design/known-gaps.md: removed 4 stale claims (Night Mode, back-to-top, QuickAddCard handlers, /verify), reworded Sign In and Check Your Email lines.
- design/known-gaps-triage.md: 6 B4 rows marked "B4 done (stale, verified wired)".
No code changes. Left: chat screen, DM picker, 2FA gap, project tab panels (untouched, out of scope).
## Commands
- tsc --noEmit: PASS
- pnpm lint: PASS (0 errors, warnings only)
- pnpm build: PASS
- 3 grep acceptance checks: PASS (no match)
