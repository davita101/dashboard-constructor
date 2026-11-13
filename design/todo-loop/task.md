# Task
Triage `design/known-gaps.md` into a classification doc (no code changes).

## TODO item
  - [ ] 9a Write `design/known-gaps-triage.md`: classify every line of known-gaps.md (code-only / needs Figma / needs user asset), propose fix batches; no code changes

## Goal
One doc that tells later tasks exactly which gaps can be fixed in code now, grouped in small batches.

## Files
- read: `design/known-gaps.md` (~110 lines), CLAUDE.md
- write: `design/known-gaps-triage.md`
- edit: `design/backend/TODO.md` (only add 9b.. sub-items, see Steps)

## Steps
1. Read every line of known-gaps.md. For each gap/component line, classify:
   - **code-only**: wrong/unmapped token, missing state or variant that Figma shows, a11y, dead control, console warning, unloaded font, shadcn var mapping, hardcoded fill that ignores dark mode, hand-chosen value that can be fixed from tokens.
   - **needs Figma**: values unreadable via TalkToFigma / page missing / needs re-read.
   - **needs user asset**: icons/logos/images the user must write or export (never create SVGs).
2. Doc layout: a short summary table (counts per class), then a table `Component | Gap | Class | Batch | Note`, one row per gap sentence-group (split lines that hold several gaps). Then `## Batches`: 3–6 batches of related code-only items (e.g. "theme wiring: shadcn vars + fonts", "icon dark-mode"), each ≤ ~6 files, ordered by value/risk, with the files likely touched.
3. In TODO.md replace the `9b..` line with one sub-item per batch: `  - [ ] 9b <batch name>: <one-line scope>`, `9c`, ...
4. Do not change any source file.

## Acceptance
- `design/known-gaps-triage.md` exists; every non-blank bullet of known-gaps.md appears in the table (check: count of bullets in known-gaps.md ≤ count of distinct components/gaps covered; spot-check 10 random lines).
- TODO.md has 9b.. batch sub-items matching the doc's Batches section.
- `git status` shows only those two files plus design/todo-loop/*.
- `pnpm exec tsc --noEmit` still passes.

## Decisions
- Triage is its own task: the original item is too big for one session; fixes follow as batches.
- Known-gaps text stays unchanged; fixed lines get removed in the batch that fixes them.

## Don't
- No code/CSS edits, no new icons/SVGs, no Figma calls, no DB changes.
