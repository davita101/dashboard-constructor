# Report 9f-4 Dropdown lead/trail slots

## Changed
- `src/components/ui/dropdown-menu.tsx`: added exported `DropdownMenuItemAvatar`, `Flag`, `Checkbox`, `Radio`, `Switch`, `Payment`. Each wraps `DropdownMenuItemAddon` (`side` default "start").
  - Avatar: `Avatar` size 24 (32 in double layout), shape circle in pilled menu else rounded; props pass through.
  - Flag: `Avatar` 24 circle, overflow-hidden, caller gives image children.
  - Checkbox/Switch/Radio: existing `Checkbox`, `Switch`, `RadioGroupItem` with `tabIndex={-1}`, `aria-hidden`, `pointer-events-none`.
  - Payment: 32x20 tile, bg-background-0, outline base-100, rounded-r6, children = logo.
- `src/components/ui/radio-group.tsx` (new): shadcn base added with `pnpm exec shadcn add radio-group`, then rewritten to tokens (20px, primary-600, 10px white dot, no `dark:`, `cn` from `@/lib/utils`). Base UI Radio works without a group (context optional), so slot needs only `checked`/`value`.
- `design/known-gaps.md`: Dropdown line updated.

## Decisions
- End frames add `pl-2` (Addon end variant unchanged) so widths match spec (Avatar/Flag 32x24, Checkbox/Radio 28x20, Switcher 44x20). Guess, noted in gaps.
- `language.tsx` untouched (adoption optional).
- Skill tool unavailable in this run, so shadcn skill not invoked; used CLI directly.
- No smoke script: no pure logic.

## Commands
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 pre-existing warning in command.tsx)
- `pnpm build`: PASS
- grep `space-[xy]-|dark:|hex` on dropdown-menu.tsx and radio-group.tsx: PASS (no hits)

## Undone
- Not rendered in browser (no preview route per task).
