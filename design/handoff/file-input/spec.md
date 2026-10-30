# File Input spec

Page 12015:2400. Slug `file-input`. Sets: `File-Input-Rounded` 12015:19184, `File-Input-Pilled` 12015:25962. Also Playground frames 12015:28328, 13784:119295 (not read).
Source: TalkToFigma only (no tree.txt, no REST). Colors = hex, token unknown (see Gaps).

## Variants (both sets)
| Prop | Values |
|---|---|
| Size | Extra Large (60), Large (48), Default (40), Small (32), Micro (24) (= input height) |
| State | Default, Hover, Active, Disabled |
| Shape | set: Rounded / Pilled |

20 variants per set. Width 300 all. Total height = top + input + bottom.

## Structure (vertical, 3 rows, full width 300)
1. `Top` row: left `Label` (text "Label" Bold + `material-help` icon 16x16, 12x12 Micro) ; right "Add Text" (Semi Bold, #999999), right-aligned.
2. `Input` row: 2 frames side by side, stroke 1 inside. Left = button part "Select File" (fill #f7f7f7, text #666666). Right = value "No files selected" (fill #ffffff, text #4d4d4d, fills rest).
3. `Bottom` row: "Add Text Bottom" (Semi Bold, #999999).
Label text #4d4d4d. Row gaps = size gaps below. Row bg frames #ffffff (page bg, ignore).

## Size table
| Size | Input h | Top/Bottom h | Row gap | Font (Inter, lh) | padX | Rounded radius | Pilled radius | help icon | Total h |
|---|---|---|---|---|---|---|---|---|---|
| XL 60 | 60 | 20 | 16 | 12/20 | 20 | 16 | 32 | 16 | 132 |
| Large 48 | 48 | 20 | 12 | 12/20 | 20 (pilled 24) | 12 | 32 | 16 | 112 |
| Default 40 | 40 | 20 | 8 | 11/20? | 12 (pilled 20) | 8 | 32 | 16 | 96 |
| Small 32 | 32 | 20 | 8 | 10/20? | 12 (pilled 16) | 8 | 32 | 16 | 80 |
| Micro 24 | 24 | 16 | 4 | 9/16 | 8 (pilled 12) | 6 | 32 | 12 | 64 |
Pilled XL padX 32. Pilled = full radius (32 > h/2). Default/Small line-height not read (assume 20, from Large layout; Top/Bottom heights are 20 from total heights).
XL padX Rounded 20, Pilled 32. Select File part width XL Rounded 101 (61 text + 2x20), Pilled 113 (61+2x32). Value part fills rest. Micro: 62 / 239.
Outer container clips children to radius (outer corner radius only visible on Active frame; assume overflow hidden on Input row).

## Typography
Inter. Label: Bold. All others Semi Bold. Sizes per table. Label text 12 Bold (9 Micro).

## Colors by state (hex)
| Part | Default | Hover | Active | Disabled |
|---|---|---|---|---|
| Select File fill | #f7f7f7 | #f0f0f0 | #f0f0f0 | #f7f7f7 (dimmed) |
| Select File stroke | #e6e6e6 | #d9d9d9 | #cccccc | #e6e6e6 |
| Select File text | #666666 | same | same | #666666 (dimmed) |
| Value fill | #ffffff | #fcfcfc | #fcfcfc | #ffffff |
| Value stroke | #e6e6e6 | #d9d9d9 | #cccccc | #e6e6e6 |
| Value text | #4d4d4d | #666666 | #666666 | #666666 |
| Outer ring | none | none | stroke #808080 @ 20% opacity, radius = radius col above (Pilled 32) | none |
Active ring: focus ring outside input, visible as thick grey ring in export (~3-4px, weight unread).
Disabled: whole component visibly faded (label, add text, input all lighter in export). Node opacity not exposed; likely ~50% or opacity token.
Label / Add Text / Bottom colors same across states per read (label #4d4d4d, add text #999999).

## Hex to token guess
#ffffff = background-0 likely; #4d4d4d/#666666/#999999/#e6e6e6/#f7f7f7 gray scale, check Light mode in `src/styles/color-mode.css` (`--base-*` / `--background-*`). Not resolved.

## Icons
`material-help` instance 16x16 (12x12 Micro), circle-question. No assets dump. Need SVG via `pnpm figma:fetch 12015-2400` (not run).

## Gaps
- No tree.txt; REST fetch not tried; token names unresolved (hex only).
- Default/Small font size per Active read (11, 10) but line-height unread.
- Active ring width, Disabled opacity, hover transitions unread.
- Select File gap/divider between parts: adjacent frames, stroke each (double stroke at seam? 1px overlap probable).
- Icon color, help icon asset unread.
- Playground frames not inspected. Auto-layout padding/alignment props unavailable (derived from positions).
- Pilled Hover/Disabled colors assumed same as Rounded (only Default read for pilled; image consistent).
