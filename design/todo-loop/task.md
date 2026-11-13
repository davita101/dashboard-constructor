# Task
Add icon and counter slots to the Tabs pill items (`ui/tabs.tsx`), plus a demo use.

## TODO item
    - [ ] 9f-1 Tabs pill icon + counter slots (`TabsIcon`, `TabsCounter` in `ui/tabs.tsx`)

## Goal
Figma Tab-Group-Pilled items can have a left/right icon and a Badge-Square-Pilled counter. Today items are text only (known-gaps line "- Tabs:"). Build the slots in shadcn style so domain code just composes them.

## Files
- `src/components/ui/tabs.tsx` (change)
- `src/components/ui/icon.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/button.tsx` (`ButtonIcon`, `ButtonCounter`: pattern to copy, read only)
- `src/components/projects/ProjectTabs.tsx` or `ProjectListCard.tsx` (only if an existing tab already has an icon/count in Figma data; otherwise do not touch)
- `design/known-gaps.md` (edit the "- Tabs:" line)

## Steps
1. Read `button.tsx` `ButtonIcon` / `ButtonCounter`, `badge.tsx` sizes.
2. In `tabs.tsx` add `TabsIcon` (mask icon via `Icon` from `@/components/ui/icon`, props `src`, `position` start|end, sets `data-icon="inline-start|end"`, size follows the trigger's `[&_svg]` size rule: use `size-4` default, `size-3` for xs/micro via the trigger cva, e.g. add `[&_[data-slot=icon]:not([class*='size-'])]:size-4` to trigger base and size-3 / size-5 / size-6 in the size variants next to the existing svg rules).
3. Add `TabsCounter` = `Badge` with `shape="pill"`, default `size="square-16"` and `variant` suited to active/idle (pick one existing Badge variant, e.g. `white-soft`), `data-slot="tabs-counter"`, `mx-0.5`-like gap handled by trigger `gap-1`.
4. Add `has-data-[icon=inline-start]:pl-*` / `inline-end:pr-*` padding tweaks for the pill sizes `28` and `32` (reduce side padding by 4px on the icon side, as in `default` variant).
5. Export both from `tabs.tsx`.
6. Update the known-gaps "- Tabs:" line: remove the "left/right icon and badge slots are not built" sentence, say slots exist.
7. Do not invent a new page. If a preview is wanted, no `/design-system/tabs` page exists: skip it.

## Acceptance
- `pnpm exec tsc --noEmit` → 0 errors
- `pnpm lint` → 0 errors (known `command.tsx` warning ok)
- `pnpm build` → success
- `grep -nE "TabsIcon|TabsCounter" src/components/ui/tabs.tsx` shows both exported
- grep new code: no hex colors, no `space-[xy]-`, no `dark:`
- Existing tab usages (ProjectTabs, ProjectListCard, widget picker) unchanged visually: their diff is empty or className-free.

## Decisions
- Slots are composed from existing `Icon` and `Badge` (shadcn rule: no styled spans in domain code).
- Counter uses Badge `shape="pill"` like Button's `ButtonCounter`; exact Figma badge size for the Tab-Group-Pilled unreadable, assume `square-16`, record in known-gaps.
- No new UI/page: only the slots.

## Don't
- No new Figma-less pages, no hand-written SVGs (use existing `public/icons/`).
- Don't change other Tabs variants' look.
- Don't touch the DB or other batches (9f-2..6).
