# Checkbox spec

Page `8985:336791` (Figma "❖ Forms: Checkbox"), slug `checkbox`. Channel u23opgkh.
Token names unresolved (REST dump 429 after retry): colors are hex, "token unknown". Match to Light tokens.

Exports (PNG, scale 1, saved by TalkToFigma under `C:\Users\grdze\.claude\projects\E--Girhub-ecormce-webstie\81ea6dc2-6725-490c-8d06-d1d5e3fc6fb7\tool-results\`):
- 457:37 Checkbox: `mcp-TalkToFigma-blob-1793288531025-ko1d66.png`
- 9433:3484 Checkbox-Text: `mcp-TalkToFigma-blob-1793288537668-0c3i4f.png`
- 9435:3667 Checkbox-Text-Card: `mcp-TalkToFigma-blob-1793288538054-shg5u4.png`
- 9427:3669 Checkbox-Card: `mcp-TalkToFigma-blob-1793288538405-kf3eb7.png`

## Component sets

### 1. Checkbox (457:37), 840x224 sheet
Variant axes (Figma spellings kept):
- Style: `Primary` (blue), `Primary Dark` (black)
- Status: Checked, Indeterminate, Default, Focus, `Dislabled`, `Dislabled Cheked`
- Size: `Default (20)`, `Small (16)`
- Small/Primary has Dislabled Cheked (14042:96906); every Style x Size has all 6 statuses.

Box: 20x20 radius 6 (Default), 16x16 radius 4 (Small). Stroke weight unknown (likely 1, inside).

| Style | Status | Fill | Stroke | Glyph |
|---|---|---|---|---|
| Primary | Checked | #2563eb | #2563eb | white check |
| Primary | Indeterminate | #ffffff | #e6e6e6 | blue minus (see export) |
| Primary | Default | #ffffff | #e6e6e6 | none |
| Primary | Focus | #ffffff | #2563eb | none |
| Primary | Dislabled | #f7f7f7 | #f0f0f0 | none |
| Primary | Dislabled Cheked | #f7f7f7 | #f0f0f0 | grey check |
| Primary Dark | Checked | #010101 | #333333 | white check |
| Primary Dark | Indeterminate | #ffffff | #e6e6e6 | black minus |
| Primary Dark | Default | #ffffff | #e6e6e6 | none |
| Primary Dark | Focus | #ffffff | #010101 | none |
| Primary Dark | Dislabled / Cheked | #f7f7f7 | #f0f0f0 | none / grey check |

Node ids (Default 20): Primary Checked 457:38, Indeterminate 2745:140324, Default 457:52, Focus 2745:140141, Dislabled 4294:23088, Dislabled Cheked 14042:96903. Small 16 Primary: 9444:50804/06/08/09/10, 14042:96906. Dark 20: 8985:471778/80/82/83/84, 14042:25354. Dark 16: 9444:50811/13/15/16/17, 14042:75336.
Glyphs are not child layers in the info output (children empty): check/minus are vectors not readable; see exports. No focus ring seen beyond the colored stroke (Focus = stroke color change). Disabled opacity: none, colors are solid.

### 2. Checkbox-Text (9433:3484)
Axes: Type = Horizontal | Vertical; State = Default | Active | `Dislabled`.
Parts: `Checkbox` instance (20x20, r6; Active = Primary Dark Checked), `Content` frame (157 wide) with `Main Text` + `Additional Text`.
- Horizontal: 189x20, content is a row (Main Text 57x20, Additional Text 88x20; gap ~12 from export: box right edge 20, text at 32).
- Vertical: 189x44, content column, texts 20 high each, no gap (44 = 20+4+20 likely; gap unknown).
- Gap checkbox to content: 12 (189-157-20 = 12).
- Text colors: Main Text Default #333333, Active #010101, Dislabled Horizontal #999999 / Vertical #808080 (inconsistent in Figma). Additional Text #808080 always.
- Typography: line height 20; size 14, Main Text appears medium weight, Additional Text medium (from export). Exact font props unread.
- Dislabled Horizontal uses the Default (white/#e6e6e6) box; Vertical uses disabled box (#f7f7f7/#f0f0f0).

### 3. Checkbox-Text-Card (9435:3667)
Axes: Type = Horizontal | Vertical; State = Default | Active | `Dislabled`.
- Card: Horizontal 280x36, Vertical 280x68, radius 12, padding ~ 8 horizontal (box at x=8 in export), Vertical ~ 12 padding (derived: 68 = 44 + 24; width 216 content = 280-20-12-32 => padding 16 left/right? unverified).
- Card fills/strokes: Default #ffffff / #e6e6e6; Active #ffffff / #808080 at 50% opacity; Dislabled #fafafa / #e6e6e6.
- Inner Checkbox as in set 2 (Active = Dark checked; Dislabled = #f7f7f7/#f0f0f0).
- Text colors as set 2 (Dislabled Main Text #999999). Vertical content 216x44.

### 4. Checkbox-Card (9427:3669)
Axis: State = Default | Active | `Dislabled`. Card 320x108, radius 16, same card fills/strokes as set 3 (Active stroke #808080 at 50%).
Parts: left leading icon slot (material-default-icon 24x24; the Figma variants also contain hidden alternatives: Badge-Icon-Pilled 32, Visa-Rounded 38x24, Avatar-Image 32, Avatar-Text 32, BTC-Bitcoin 28, United-Kingdom 28, Outline-Button 40 on Active/Disabled), `Content` frame 204x76 (Main Text, Additional Text, `Links` row with Link 1, Link 2), `Checkbox` instance 20x20 top-right.
- Only the material-default-icon (a grey #808080 radio-like ring 12px) is visible in the export; the others are toggled hidden (visibility unreadable).
- Main Text: Default #333333, Active #010101, Dislabled #808080. Additional #808080. Links #010101 (disabled shown grey in export, hex reads #010101: likely opacity).
- Checkbox: Default white box, Active dark checked, Dislabled #f7f7f7/#f0f0f0.
- Disabled card shows whole content faded in export (opacity not readable).

## Mapping notes
- Base: shadcn `checkbox` (Base UI), plus `Field`/`Label` for Text variants. Card variants = Field with bordered card styling (Label wrapping), not new wrappers.
- Hex to Light-token guesses: #2563eb primary-600?, #010101 base-900?, #e6e6e6 base-100/150, #333333 base-800, #808080 base-500, #f7f7f7 base-50?, #f0f0f0 base-100. Verify against the dump.

## Icons needed
Check and minus glyphs (white/black/blue, grey when disabled): not available as assets (dump unfetched, no `design/figma-dump/8985-336791/assets/`). No check/minus in `public/icons/`.

## Gaps
- Dump `pnpm figma:fetch 8985-336791` hit 429 twice (once after a 120s wait): no token names, paddings, font specs, stroke weights, effects, visibility.
- Check/minus vectors unreadable; Focus ring (if any outside the box) unknown.
- Text typography (size/weight) inferred from export: 14/20.
- Checkbox-Card hidden leading-content alternatives (which are visible by default) from export only.
