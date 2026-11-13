# Task
Avatar: add Figma "Progress" ring (`progress` prop) and `AvatarCounter` overlay slot in `src/components/ui/avatar.tsx`.

## TODO item
    - [ ] 9f-2 Avatar progress ring + counter overlay (+ ContentCard)

## Goal
Figma Avatar-Image/Avatar-Text (60px) carry a 66x66 `Progress` frame (track ellipse blue-alpha-20 + arc blue-600, same 66 box as `Story`: 2px stroke, 1px gap) and a `Badge-Square-Pilled` counter (16x16, danger gradient, text "1"). Make both available as shadcn-style parts of `Avatar`, no new wrappers.

## Files
- `src/components/ui/avatar.tsx` (change)
- `src/components/ui/badge.tsx` (read: `square-16`/`square-12` sizes, danger/red variant name)
- `design/handoff/card-content/figma.md` lines ~125-145 (Figma layers)
- `design/known-gaps.md` (edit lines 5, 58: remove the Progress/counter parts)
- NO ContentCard exists in `src/` (grep) → nothing to adopt there; note it in the TODO line.

## Steps
1. `Avatar` gets optional `progress?: number` (0-100). When set, render ring as an absolutely positioned overlay (`-inset-1.5`, `pointer-events-none`, `aria-hidden`, rounded-[inherit] or full for circle; shape rounded uses `--avatar-r` + 2px) using: track = `outline-primary-alpha-20`-style ring, arc = `conic-gradient(var(--primary-600) calc(var(--avatar-progress)*1%), transparent 0)` masked to a 2px ring via `mask: radial/ (mask-composite exclude)` — or an inline SVG circle with `stroke-dasharray` using token colors via `stroke-primary-600` / `stroke-primary-alpha-20` classes. Prefer SVG for circle; for rounded shape use conic mask. Start at 12 o'clock, clockwise. Clamp 0-100. Expose via `role`-less decorative element; set `data-progress`.
   Story and progress share the 66px box: if both set, progress wins (Figma shows them as alternatives); document in a comment.
2. Add `AvatarCounter` (slot, `data-slot="avatar-counter"`): wraps existing `Badge` (shape square, red/danger gradient variant already in badge.tsx; size `square-16`, `square-12` when avatar size <= 32 via `group-data-[size=...]/avatar`), absolutely positioned top-right (`-top-1 -right-1`, `z-10`) — position is assumed (Figma image hides it); record in known-gaps as assumed. Export it.
3. Update known-gaps lines: remove "Progress ring and counter not implemented" parts; add one short line "- Avatar: counter overlay position top-right assumed; progress ring stroke 2px assumed (arc ends not rounded verified?)".
4. Smoke usage: temporarily none. No design-system page exists, so verify by a tsc + a tiny render check in node is not needed; just ensure types and build.

## Acceptance
- `pnpm exec tsc --noEmit` → 0 errors
- `pnpm lint` → 0 errors (command.tsx warning known)
- `pnpm build` → success
- `grep -nE "#[0-9a-fA-F]{3,8}\b|space-[xy]-|dark:" src/components/ui/avatar.tsx` → no matches
- `grep -n "progress\|AvatarCounter" src/components/ui/avatar.tsx` shows prop, ring, slot, export
- Existing Avatar usages unchanged (no new required props).

## Decisions
- Progress ring is a prop on `Avatar` (variant-like), counter is a slot, per CLAUDE.md shadcn rules.
- Progress beats story when both set. Ring/counter geometry from Figma layer sizes (66 box, 16 badge); counter corner assumed top-right.
- ContentCard component does not exist in code: that part of the item is moot.

## Don't
- Don't create a design-system page or new domain components.
- Don't hand-write icon SVGs files; inline ring SVG circle is fine (geometry, not an icon).
- Don't change Avatar's existing variants/sizes.
