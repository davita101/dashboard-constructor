# Input — Figma handoff

- Page: `8928:37150` ("Forms: Inputs"), slug `input`, route `/design-system/input`
- Component sets: `Input-Rounded` `358:528`, `Input-Pilled` `10464:507752` (30 variants each, 1820x1152 frame)
- Reference images (PNG @0.5): `design/handoff/input/ref-input-rounded.png`, `design/handoff/input/ref-input-pilled.png`
  (grid: columns = XL60, L48, D40, S32, Micro24; rows = Default, Filled, Active, Error, Success, Disabled)
- Source: TalkToFigma `get_nodes_info` (REST `figma:fetch` was rate-limited, 429; no `design/figma-dump/8928-37150`, so token names are NOT resolved: hex only, "token unknown", match to Light-mode tokens as in Badge).

## Variant axes (both sets)
- `Size`: Extra Large (60), Large (48), Default (40), Small (32), Micro (24)
- `State`: Default, Filled, Active, Error, Succes (sic, = success), Disabled
- Shape = which set: Rounded (radius per size) vs Pilled (r32 always).
- Figma component frame width 300; total height = 20 (Top) + gap + input + gap + 20 (Bottom): XL 132, L 112, D 96, S 80, Micro 64. (Gap Top->Input: XL16, L12, D8, S8, Micro4; same below.)

## Parts (all variants share this tree)
```
Component (300 wide, vertical stack)
  Top (300x20)
    Label frame: Label TEXT "Label" + material-help icon (16, Micro/Small 12)   [frame fill hidden]
    "Add Text" frame: TEXT right-aligned (hint/counter)
  Input frame (300 x H)            fill, stroke 1px inside, radius
    Left (auto, hugs content, horizontal): optional slots, all hidden by default except Center
      Tags (Badge-Default-Rounded instances), Button (Left Button), Checkbox, Radio, Switcher,
      Left Icon (24), Payment (Mastercard-Rounded 38x24), Avatar (32), Country (flag 24), Colors (24 swatch r6),
      Center > Text TEXT "Text" (the value/placeholder)
    Right: Add Text, Button, Right Icon, Command Keys, Select (all optional, hidden by default)
  Bottom (300x20): Label TEXT "Add Text Bottom" (helper / error message)
```
Active/Error/Succes variants wrap `Input` in a focus-ring frame named Active/Error/Danger/Succes (same size and radius as Input, no fill, stroke 20% opacity = the outer ring).
Optional-slot visibility is not readable: in all exports only Label+icon, Add Text, Text, Bottom text are visible. Slot sizes (Right): see Gaps/slots table.

## Input frame by Size (Rounded / Pilled)
| Size | Height | Radius Rounded | Radius Pilled | Text px | Text size/lh | Text inset x (Rounded / Pilled) | Top/Bottom label size/lh |
|---|---|---|---|---|---|---|---|
| Extra Large (60) | 60 | 16 | 32 | 12 w600 | 12/20 | 20 / 32 | 12/20 |
| Large (48) | 48 | 12 | 32 | 12 w600 | 12/20 | 20 (label 16) / 24 | 12/20 |
| Default (40) | 40 | 8 | 32 | 11 w600 | 11/20 | 12 / 20 | 11/20 |
| Small (32) | 32 | 8 | 32 | 10 w600 | 10/16 | 12 / 16 | 10/16 |
| Micro (24) | 24 | 6 | 32 | 9 w600 | 9/16 | 8 / 12 | 9/16 |
All Inter, letter-spacing 0. Label text Bold (700), "Add Text" and bottom text SemiBold (600). Label icon (material-help) 16 for XL/L/D, 12 for S/Micro. Rounded Large text inset is 20 at the value but 16 at the Top label; Pilled Large Left frame starts 4px in.
Top/Bottom labels inset x equals the Text inset above (Top label x), Bottom text x = 0 (flush left, no inset).
Right-slot widths (hugged): Rounded XL: Add Text 42, Button 77, Right Icon 36, Command Keys 80, Select 36; L: 34/67/24/60/24; D: 32/53/26/64/26; S: 30/45/20/45/20; Micro: 27/42/18/43/18. Pilled XL: 46/77/36/88/36; L: 42/75/32/68/32; D: 36/59/26/68/26; S: 34/51/24/67/22; Micro: 31/46/20/51/22.
Left icon slot: 24 icon (36 wide with padding) at XL/L; Avatar 32; Color swatch 24 r6; tags badge 32 high at XL.

## Colors per state (hex only, token unknown; likely base-* / danger-* / success-* Light)
| State | Input fill | Input stroke (1px inside) | Ring (outer wrapper stroke, opacity .2) | Value text | Label | Add Text | Bottom text |
|---|---|---|---|---|---|---|---|
| Default | #ffffff | #e6e6e6 | none | #4d4d4d | #4d4d4d | #999999 | #999999 |
| Filled | #ffffff | #d9d9d9 | none | #010101 | #4d4d4d | #999999 | #999999 |
| Active | #ffffff | #cccccc | #808080 | #010101 | #4d4d4d | #999999 | #999999 |
| Error | #ffffff | #ef4444 (Rounded) / #dc2626 (Pilled) | #ef4444 | #dc2626 | #4d4d4d | #999999 | #dc2626 |
| Succes | #ffffff | #16a34a | #22c55e | #16a34a | #4d4d4d | #999999 | #16a34a |
| Disabled | #fafafa | #e6e6e6 | none | #b3b3b3 (XL/L/D Rounded and all Pilled); #666666 on Rounded S and Micro | #4d4d4d | #999999 | #999999 |
Disabled in the export renders label/add/bottom lighter (opacity not readable from nodes; see image: whole block faded). Likely the component has reduced opacity, see Gaps.
Placeholder: the "Text" layer in Default is the placeholder (#4d4d4d) and in Filled is the typed value (#010101).
Slot colors seen: Checkbox/Radio/Switcher #2563eb (primary-600), Badge tags #fff fill/#e6e6e6 stroke r8, tag text #333333 11/20 w600, icon #808080, Color swatch #fff/#e6e6e6 r6.

## States
Default, Filled (darker stroke + dark text), Active (focus: stroke #ccc + 20% gray outer ring, ~3-4px visible in export), Error (red stroke + ring + red value + red bottom text), Succes (green), Disabled (#fafafa fill, faded text). No separate Hover state in Figma.

## Icons / assets
- `material-help` (label hint, 12/16px) is an INSTANCE, gray #808080: not downloaded (no dump). Figma icons are material set; fetch via `pnpm figma:fetch 8928-37150` once the REST rate limit clears (assets/ will have it), or reuse `public/icons/` if present.
- Optional slot icons (Left/Right Icon 24px, Select chevron, Command keys, flags, Mastercard) are instances; not needed for the base text input.

## Gaps
- REST rate limited (429): no token names, no `assets/`; re-run `pnpm figma:fetch 8928-37150` for tree.txt.
- Ring stroke weight and exact Left/Right padding (auto-layout) not exposed by TalkToFigma; insets above were measured from absolute positions. Right slot padding not measured (assume mirror of left inset).
- Optional slot visibility and Disabled opacity not readable; behavior inferred from the exports.
- Disabled text color differs (#666 vs #b3b3b3) across sizes: probably a Figma inconsistency, use #b3b3b3.
- Pilled Error stroke (#dc2626) differs from Rounded (#ef4444): probably inconsistency, use #ef4444.
- Pilled has no extra variant types beyond shape; Micro Rounded has the same states.
