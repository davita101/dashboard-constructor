# Task
Run "Every phase" checks: tsc, lint, build, schema:analyze, secrets scan.

## TODO item
- [ ] `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`
- [ ] Re-run `pnpm schema:analyze` after UI changes
- [ ] Never commit `.env.local` / service role key

## Goal
All remaining unblocked items are checks. Run them, fix small errors if any, record results.

## Files
- design/backend/schema-analysis.md (regenerated)
- design/backend/TODO.md (tick/notes)
- any file with a tsc/lint/build error

## Steps
1. `pnpm exec tsc --noEmit`; fix errors.
2. `pnpm lint`; 0 errors (known `command.tsx` combobox warning OK).
3. `pnpm build`; must succeed.
4. `pnpm schema:analyze`; regenerated file left in the working tree.
5. `git ls-files | grep -E "^\.env"` must list only `.env.example`; grep tracked files for `SUPABASE_SERVICE_ROLE_KEY=` / `sk_` / `eyJ` secrets-looking values (none).
6. Write design/todo-loop/report.md with results.

## Acceptance
- tsc exits 0; lint 0 errors; build exits 0.
- `pnpm schema:analyze` exits 0.
- No tracked `.env.local`; no secret values in tracked files.

## Decisions
- Items 98-100 are checks; every feature phase is done or blocked, so run them now. Tick all three once they pass.
- Phase 6 chart parent ticked: bar/candle/column-5/progress-half and product table keep demo data (app has no products).
- Later sections blocked: no Figma pages.

## Don't
- No feature work, no new UI, no DB changes.
- Do not edit `.env.local`; no deploys.
