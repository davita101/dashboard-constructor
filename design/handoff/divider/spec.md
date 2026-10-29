# Divider — handoff spec

- Page: `7060:312915` (REST id `7060-312915`), component name Divider, slug `divider`
- Component sets:
  - `Divider-Horizontal` `7060:313004` (340x521 frame, 7 variants)
  - `Divider-Vertical` `11946:3596` (711x360 frame, 7 variants)
- Maps to the existing shadcn `Separator` (`src/components/ui/separator.tsx`), see `graph-context.md` in this folder.
- Exports viewed (PNG) for both sets. REST dump not available (429 after 2 tries), so no token names.

## Variant property

Single property `Type` with 7 values, identical in both sets:
`Default`, `Text Center`, `Left Center` (Vertical: text at top, line below), `Icon`, `Button`, `Button Group`, `Button Icon`.

## Parts

Line (all variants)
- Rectangle, fill `#d9d9d9` (token unknown; likely base-100/150 range, Light), thickness 1px.
- Horizontal: height 1, width fills container (180 in the component frames). Vertical: width 1, height 200 in the frames.
- Segments next to a center element are separate Line rectangles (no gap/padding readable; measured gaps below).

Horizontal variants (component size 180 wide)
| Type | Height | Contents |
|---|---|---|
| Default | 1 | single line 180 |
| Text Center | 16 | line 59 / text 22 / line 59; gap between line and text 20 |
| Left Center | 16 | text 22 at left / line 138; gap 20 |
| Icon | 16 | line 62 / `material-add_circle` icon 16x16 (fill `#808080`) / line 62; gap 20 |
| Button | 24 | line 45.5 / Outline-Button instance (49x24, r6) / line 45.5; gap 20 |
| Button Group | 24 | Buttons-Pilled-Group instance 169x24 (r32, 3 buttons of 57 wide) with a 1x1 Line at each end (x offsets 65.5 and 275.5, i.e. lines are effectively hidden/placeholder); no visible line in export |
| Button Icon | 24 | line 58 / Outline-Button icon-only (24x24, r32, 12px icon) / line 58; gap 20 |

Vertical variants (component height 200): same as above rotated; centered element sits at y 172..188 (middle), lines 72 long above and below with 20 gap (Button: lines 68, button 57x24; Button Icon: lines 68, button 24x24). Left Center becomes "Top": text 22x16 on top then line 164 (gap 20). Default is a single 1x200 line. Vertical Button Group is 169x200 with the same 3-button group in the middle and 68px lines above/below.

Text
- Inter Bold 700, 10px, line-height 16, letter-spacing 0, color `#4d4d4d` (token unknown, probably base-700).

Embedded instances (reuse existing components)
- Outline-Button: fill gradient `#ffffff` to `#fafafa`, stroke gradient `#ededed` to `#e6e6e6` (bound variables, aliases `3876:14031` / `3876:14028`), label Inter Bold 10/16 `#333333`, icons `#808080`, Counter = Badge-Square-Pilled 16 (fill `#fff`, stroke `#e6e6e6`, text 8/12 bold `#4d4d4d`). Button size ~ Button 24 (radius 6 for default, 32 for pilled/icon).
- Buttons-Pilled-Group: 169x24, r32, same gradient stroke; Content slot with Button 1/2/3 (57x24 each, 1px overlap).
- Icon: `material-add_circle` 16x16, grey `#808080`.

## States

None in Figma (only `Type`). No hover/focus/disabled.

## Assets

- `material-add_circle` icon (check `public/icons/` for an existing add_circle, otherwise fetch via `pnpm figma:fetch 7060-312915` once the rate limit clears; `design/figma-dump/7060-312915/assets/` does not exist yet).
- Button icons inside Outline-Button are generic (dot icon placeholders), not part of the divider.

## Implementation hint

Orientation is `Divider-Horizontal` / `Divider-Vertical` = Separator `orientation`. Types with a center element are slots (label, icon, button, button group) composed around two Separator lines; flex layout with gap-5 (20px).

## Gaps

- No token names (REST 429 twice): line `#d9d9d9`, text `#4d4d4d` are hex only.
- Line thickness assumed 1px (bounding boxes show 1); no stroke/effect data.
- Gap between line and center element is derived from bounding boxes (20px), not auto-layout data; padding unreadable.
- Layer visibility unknown: the Button Group variant has 1x1 end "Line" rectangles at x 65.5 and 275.5 (outside the 180 frame), the export shows only the group.
- Left Center vertical position: text on top, not center (per export).
