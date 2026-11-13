# Report: 9f-1 Tabs pill icon + counter slots

## Changed
- `src/components/ui/tabs.tsx`: added `TabsIcon` (wraps `Icon`, `src`, `position` start|end, sets `data-icon=inline-*`, `data-slot=tabs-icon`) and `TabsCounter` (`Badge` pill, default `square-16`, variant `gray`, `data-slot=tabs-counter`). Both exported. Trigger base and size variants got `[&_[data-slot=icon]:not([class*='size-'])]:size-N` (4 default, 3 xs/micro, 5 xl/lg, 6 2xl). Sizes `28` and `32` got icon-side padding tweaks (28: px-2.5 -> 1.5 on icon side; 32: px-5 -> 4).
- `design/known-gaps.md`: "- Tabs:" line updated.
- No domain files touched (no existing tab has icon/count data).

## Decisions
- Counter variant `gray` (bg-gray-50 text-gray-800) instead of `white-soft`: white-soft is white on 20% white, unreadable on the light pill group. Same variant for idle and active.
- Icon sizing comes from the trigger rules; `Icon` has no default size so the trigger rule applies.
- `TabsCounter` has no extra margin: trigger `gap-1` handles spacing.

## Commands
- `pnpm exec tsc --noEmit`: PASS (0 errors)
- `pnpm lint`: PASS (0 errors, 1 known command.tsx warning)
- `pnpm build`: PASS
- `grep -nE "TabsIcon|TabsCounter" src/components/ui/tabs.tsx`: PASS (both defined and exported)
- hex / `space-[xy]-` / `dark:` in new code: none
- Existing usages: no diff to ProjectTabs / ProjectListCard / widget picker.

## Undone
- No browser check (no preview page by task rule).
