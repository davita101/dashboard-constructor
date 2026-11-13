# Task
9f-4 Dropdown typed lead/trail slots (Avatar, Flag, Checkbox, Radio, Switcher, Payment) in `ui/dropdown-menu.tsx`.

## TODO item
    - [ ] 9f-4 Dropdown lead/trail slots

## Goal
`DropdownMenuItemAddon` (generic start/end frame) already exists. Add thin typed slot parts so domain code composes Figma's slots without hand-styling: lead frames (`side="start"`, +8px after control) and trail frames (`side="end"`). Compose existing primitives only; sizes from `design/handoff/dropdown/spec.md` lines 72-93.

## Files
- `src/components/ui/dropdown-menu.tsx` (change)
- `src/components/ui/{avatar,checkbox,switch}.tsx`, `icon.tsx` (read; reuse)
- `src/components/dashboard/language.tsx` (read: existing flag use via Addon; optionally adopt `DropdownMenuItemFlag`)
- `design/known-gaps.md` line "- Dropdown:" (edit: drop "lead/trail slots not built" part, keep asset/guess notes)
- new `scripts/dropdown-slots-smoke.mts` (optional if no pure logic; skip if nothing testable)

## Steps
1. Read spec.md lines 60-100 and the existing Addon/cva in dropdown-menu.tsx.
2. Add slots, each a wrapper over `DropdownMenuItemAddon` taking `side` (default "start"):
   - `DropdownMenuItemAvatar`: Avatar size 24, rounded shape (32 in double layout via `useDropdownMenuLayout()`; shape from `useDropdownMenuShape()`: pilled → circle). Pass-through Avatar props.
   - `DropdownMenuItemFlag`: 24x24 box (rounded-full image child: children are provided by caller, e.g. `next/image`); frame 32x24 start / 32x24 end.
   - `DropdownMenuItemCheckbox`, `DropdownMenuItemRadio`, `DropdownMenuItemSwitch`: wrap `Checkbox` (20), Switch (36x20 track), and a Radio. If no Radio primitive exists in `src/components/ui`, check with shadcn skill (`pnpm dlx shadcn@latest docs radio-group`, add base if reasonable: `pnpm exec shadcn add radio-group`, fix `cn` import to `@/lib/utils`); if too heavy, skip Radio and record in known-gaps. Invoke the shadcn skill before writing (CLAUDE.md rule).
   - `DropdownMenuItemPayment`: 32x20 frame, bg-background-0, outline base-100 (-outline-offset-1), rounded-r6, `children` = logo (no assets exist; do not create SVGs).
   - Controls are non-interactive visuals inside a menuitem: pass `tabIndex={-1}`, `aria-hidden`/`pointer-events-none` so the item click handles toggling (caller controls `checked`).
3. Export them. Keep all colors as tokens; no `space-*`, no `dark:`, no hex.
4. Update known-gaps Dropdown line.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` OK.
- `grep -nE "space-[xy]-|dark:|#[0-9a-fA-F]{3,6}" src/components/ui/dropdown-menu.tsx` → no new hits (existing comments with hex excluded).
- Every new slot exported from dropdown-menu.tsx; each composes an existing ui primitive (no styled bare span for the control).
- Language menu in `language.tsx` still works (type-checks; adoption of `DropdownMenuItemFlag` optional).

## Decisions
- Slots are thin wrappers over the existing Addon so existing callers do not change.
- Payment logos/flags assets are not created (user asset); slot takes children.
- Radio: add shadcn radio-group only if it is a clean base; otherwise gap.
- No preview page (design-system routes do not exist in src/app).

## Don't
- No new SVG files. No edits outside the files above. No Figma changes. No DB changes.
