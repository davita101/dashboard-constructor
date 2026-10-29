# Tooltip spec

- Page: 4313:31796 (Tooltip). Slug: `tooltip`.
- Component sets: **Tooltip** 462:38 (36 variants, 1552x882 frame) and **Dot** 4317:18176 (146 variants, 6x6 color dots used in the Multilines Icon rows).
- Source: TalkToFigma `get_nodes_info` + PNG exports. REST dump not fetched (`pnpm figma:pages` returned 429), so no token names; hex only, "token unknown".

## Variant properties (Tooltip 462:38)
- Type: `Default` (62x32, single label), `2 Lines` (89x48 Default style / 99x50 White: two rows "Tooltip | 1", "Tooltip | 2"), `Multilines Icon` (104x204: Heading + 6 rows, each with Dot, label, right-aligned number 1-6).
- Arrow: `Bottom`, `Left`, `Top`, `Right` (position of the pointer notch).
- Style: `Default` (white + stroke), `Black`, `White` (white, no stroke).
- 3 types x 4 arrows x 3 styles = 36.
- Dot 4317:18176: `Style` = {Primary, Orange, Purple, Red, Yellow, Green, Sky, Pink, Amber, Teal, Lime, Cyan, Emerald, Rose, Fuchsia, ...} x {600,500,400,300,200,100,50}, plus `White`, `Black`, Base 600..50. Dot is 6x6, radius 8 (circle). Tooltip uses `Primary 600` (#2563eb).

## Parts
- Component root: transparent (fill hidden). Size = Content size.
- `Content` frame: radius 10. 
  - Default: fill #ffffff, 1px stroke #e6e6e6 (weight not readable; assumed 1, inside), shadow visible in the export (soft drop shadow; effect data unreadable).
  - Black: fill #000000, no stroke. Text #ffffff.
  - White: fill #ffffff, no stroke, no visible shadow in export. Text #000000.
- Label text: Inter Bold 700, 11/20, color #4d4d4d (Default), #ffffff (Black), #000000 (White).
- Padding (measured): horizontal 12 (text at x+12), vertical 6 (single line: 32 = 20 + 6 + 6). 2 Lines: each row 24 tall (text 20 + 2 top/bottom, rows start at x+8: row left text x+8), horizontal padding 8 on rows; overall 89x48. Number column right-aligned, row min gap about 1-2px between label group and number (label group 58 wide + number, total row 89 with 8px left/right).
- Multilines Icon: `Heading` frame 62x32 (text at x+8,y+8, so p 8/12 approx), then 6 `Line` frames 104x28 (label group 80x20 at x+0..., dot at x+8, 6x6, vertical center; label at x+22, gap 8 between dot and label; number right-aligned ending x+88, i.e. 16 from the right edge); text row y offset 4 within the 28 line.
- Arrow: a small notch (~6-8px) on the chosen edge, visible in the exports on Black and Default; **not present as a layer in the node data** (likely a hidden/outside vector). See Gaps.
- Number text: same 11/20 bold, same color as label.

## States
- None (no hover/focus/disabled); Style and Arrow are the only variations.

## Icon assets
- None. Dot is a component (circle 6x6, fill by Style) -> render as a span via a `Dot`-like badge/`bg-primary-600 rounded-full size-1.5`; check whether Badge `dot` already exists.
- `design/figma-dump/4313-31796/` does not exist (REST 429); no assets.

## Hex to likely token (unverified)
- #ffffff background-0 / white, #e6e6e6 base-100 (Neutral Light), #4d4d4d base-700/800 (guess), #000000 base-1000/black, #2563eb primary-600.

## Exports saved
- Tooltip set PNG (scale 0.5): `C:\Users\grdze\.claude\projects\E--Girhub-ecormce-webstie\d44ab493-6e6f-4707-9886-9e5d9d9c6c44\tool-results\mcp-TalkToFigma-blob-1793301340762-hb884f.png`
- Dot set PNG: `...\tool-results\mcp-TalkToFigma-blob-1793301340808-c804le.png`
- Layout of the Tooltip export: 3 rows (Default, Black, White) x 12 columns (Default x4 arrows, 2 Lines x4, Multilines Icon x4; arrow order Bottom, Left, Top, Right for Default; 2 Lines/Multiline order Bottom, Left, Right, Top).

## Gaps
- Arrow notch size/position/shape not in node data; the PNG shows it on Black/Default only (about 6px, centered on the edge, though some appear offset on Multilines). Read it from the export or REST dump when available.
- Token names, stroke weight, drop-shadow effect values, exact auto-layout padding/gap unreadable (REST 429).
- Multilines Icon Black/Default Left/Right variants show the notch at different offsets; not measured.
