# Report 7a progress-half

## Changed
- `src/components/charts/radial-chart.tsx`: optional `ratio` prop (progress-half). Clamp 0..0.9999; omitted = old 0.97 card / 0.56. Arc path not drawn at ratio 0 (empty arc, no round-cap dot).
- `src/components/dashboard/widgets/catalog.tsx` (`RadialCardPreview`): with provider, progress-half gets ratio = tasksDone/tasks, total "NN%", label "Completed", title "Task completion", legend Done (blue) / Remaining (gray); switcher/metrics hidden. No provider: unchanged demo.
- `messages/en.json` `widgets.data`: `taskCompletion`, `completed`, `done`, `remaining` (existing `status.done` is nested, new `done` is a separate key; no duplicate path).

## Commands
- `pnpm exec tsc --noEmit` PASS
- `pnpm lint` PASS (0 errors, 1 pre-existing warning in command.tsx)
- `pnpm build` PASS

## Not done
- Browser check of /dashboard not run (unattended, auth needed); logic is by code: 0 tasks → ratio 0 → "0%", no arc. Picker previews take the no-data path, so unchanged.
- No smoke script (clamp is trivial).
