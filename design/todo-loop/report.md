# Report: 9a known-gaps triage

## Changed
- NEW `design/known-gaps-triage.md`: summary table, 222-row gap table (105 bullets, all L-refs covered), 6 batches B1–B6.
- EDIT `design/backend/TODO.md`: replaced `9b..` with 9b–9g (one per batch B1–B6).
- No source files touched.

## Decisions
- Added a 4th class `none` (informational/decision, no action) for rows that need no fix.
- Mixed bullets split per gap; ambiguous "hex-matched, no variable names" rows classed `figma`.
- Queue #5 auth items (/verify) put in B4 with a note to skip if queue #5 covers them.

## Commands
- class counts via grep: code 57, figma 70, asset 44, none 51 — PASS
- all 105 bullet line refs `(L<n>)` present in the doc (105 distinct) — PASS
- `git status --short`: only TODO.md, triage doc, todo-loop files — PASS
- `pnpm exec tsc --noEmit` — PASS

## Left undone
- Lint/build not run (no code changes).
