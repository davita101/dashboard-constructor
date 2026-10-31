# Misc spec (REBUILD; Scroll already built)
Page `460:6121` "❖ Misc", slug `misc`. Page-level 3 `Base` rects (16259:100961/100965/100966) = doc backdrops, ignore. Instance `13784:91387` = Head-Design-System usage, ignore.

## Sets (all read + exported)
| Set | Node | Variant props | Values | Status |
|---|---|---|---|---|
| Map | 4120:45264 | Style | Light (1043:92601), Dark (13536:17017) | read, exported |
| Scroll | 4293:18196 | Type, Size, State | Type Vertical/Horizontal; Size 32,60,92,120,160,256,512 (V) and 92,120,160,256,512 (H); State Default/Active (24 variants) | read, exported (built already) |
| Close | 11956:33166 | Type, Style | Default/Base 11956:33165; Hover/Base 11956:33167; Active/Base 11956:33170; Active/Disabled 11956:33173 | read, exported |
| Upload | 11956:33373 | Type | Default 11956:33372; Hover 11956:33374; Active 11956:33377; Active 2 11956:33402; Active 3 11956:33417 | read, exported |
| Head-Design-System (header) | 13771:13296 | Size | 84 (13771:10332), 72 (13771:13297), 64 (13771:13300), 52 (13771:13305), 40 (13771:13311) | read, exported |
| Dark-Mode | 15607:648872 | Type | Default 12780:35733 | read, exported |

## Map
- Light 1600x1145 fill `#ffffff` = `background`. No children (map bitmap, no layers). Dark same size, same 1600x1145; fill hex not read, gap.
- Static map images; builder exports each as PNG (`export_node_as_image`) to `public/`, render `next/image` in Card-like frame. No interaction.

## Scroll (scrollbar thumb)
- Vertical: w4, h=Size. Horizontal: h4, w=Size. cornerRadius 8 (`rounded-r8`). No children, no stroke.
- Fill Default `#d9d9d9` = `base-150`. Fill Active `#808080` = `base-500`.
- Sizes checked: V32, V60, H512 default; V32, V60 active. Others same pattern (sizes from bbox).

## Close
- 20x20 frame, 1 child instance `material-close`, vector 10.99x10.99 at (4.5,4.5) inside. Icon asset: instance 11956:33161 (vector `I11956:33161;10503:131763`), export SVG.
- Colors per state NOT read (nested instance read timed out). From export, visual: Default grey (~`base-500`), Hover blue (~`primary-500`), Active dark (~`base-700`/`base-800`), Disabled light grey (~`base-300`). Builder: verify.
- States: Default, Hover, Active, Disabled (Style=Disabled only with Type=Active).

## Upload (reload/refresh icon)
- 20x20 frame, child `Icon` instance (11956:33368 etc) vector 13.32x13.34 at (3.34,3.33). Active 2 / Active 3 (11956:33402 / 11956:33417): child is FRAME `Icon` with vector (11956:33408 / 11956:33419) offset/rotated = loading animation frames (spinner rotation steps). Visual: Default grey, Hover blue, Active dark; Active 2 and 3 dark, arrows differ (spinner states).
- Icon assets: 11956:33368 (Default), 11956:33375 (Hover), 11956:33378 (Active), 11956:33407, 11956:33418 (frames). Export SVG.
- Colors not read, same gap as Close.

## Head-Design-System (header title block)
Common: fill `#ffffff` = `background`, stroke `#e6e6e6` = `background-100` (weight not read), width 918, 2 text children, font Inter SemiBold(600), letterSpacing 0. Title color `#010101` = `base-900`; subtitle `#808080` = `base-500`. Title "Avatars", subtitle "One Design System". Padding left = text x - frame x; padding top; gap title→subtitle in table.
| Size | frame HxW | radius | pad | title fs/lh | sub fs/lh | gap (title bottom→sub top) |
|---|---|---|---|---|---|---|
| 84 | 918x432 | 72 | 120 | 84/92 | 40/60 | 40 |
| 72 | 918x408 | 72 | 108 | 72/92 | 36/60 | 40 |
| 64 | 918x360 | 72 | 92 | 64/92 | 28/44 | 40 |
| 52 | 918x248 | 56 | 60 | 52/72 | 24/36 | 20 |
| 40 | 918x172 | 36 | 48 | 30/48 | 20/28 | 16 |
Size=40 title fs is 30 (not 40). Pad: same all sides (top = text y - frame y). Frame heights = hug.

## Dark-Mode (instruction card)
- Frame 900x1345, fill `#ffffff` = `background`, radius 40, pad 80. Children: title "Enable Dark Theme" Inter SemiBold 48/72 `#010101` = `base-900`; caption "Select the desired screen and find the section in the right sidebar Appearance" Inter Bold 700 12/20 `#666666` = `base-600`, 740 wide; image rect 740x1037 radius 20 (`def 1`, IMAGE fill, FILL) at y+269-41. Gap title→caption 28; caption→image 28.
- Image: builder exports node `12780:35731` as PNG. Static content.

## Tokens summary
`#d9d9d9` base-150; `#808080` base-500; `#ffffff` background; `#e6e6e6` background-100 (also base-100); `#010101` base-900; `#666666` base-600.

## Gaps
- Close/Upload icon fill hex per state: nested instance reads timed out; visual guesses only above.
- Map Dark fill hex, Map child layers: not read.
- Head stroke weight, effects, Dark-Mode shadow: not read.
- Dark mode (`.dark`) values of Scroll/Header not read.
- Paddings in Head table derived from bbox deltas, not auto-layout props.
