# Text Area — handoff spec

- Page id: 8985:334025 (Forms: Text Area)
- Slug: text-area (`/design-system/text-area`)
- Component sets (2):
  - Text-Area-Rounded: 10461:655695 (1080x1560)
  - Text-Area-Pilled: 10926:63289 (1080x1560)
- Source: TalkToFigma `get_nodes_info` + exports. REST dump NOT available (figma:pages returned 429, `design/figma-dump/8985-334025` missing): no token names, no auto-layout paddings. Colors are hex only, "token unknown".

## Variant properties (both sets, 24 variants each)
- Size: Extra Large, Large, Default, Small
- State: Default, Disabled, Filled, Active, Error, Succes (sic, Success)
- Shape: separate sets (Rounded vs Pilled)

## Component frame
Every variant is 200 wide; total variant height 200 (fixed frame); vertical stack: Top, Text Area, Bottom.

| Size | Box (Text Area) height | Rounded radius | Pilled radius | Label/text font | Top/Bottom row h | help icon |
|---|---|---|---|---|---|---|
| Extra Large | 128 | 16 | 16 | Inter 12/20 | 20 | 16 |
| Large | 136 | 12 | 20 | Inter 12/20 | 20 | 16 |
| Default | 144 | 8 | 16 | Inter 12/20 | 20 | 16 |
| Small | 152 | 6 | 12 | Inter 10/16 | 16 | 12 |

(Box height + rows are inside the fixed 200 frame; the box shrinks as the text rows grow, so treat heights as the Figma preview, real box is resizable.)

## Parts
1. Top (row 200xH): left group Label frame = `Label` text (Bold) + `material-help` icon instance (16, Small 12); right group `Add Text` (optional hint, right aligned, Semi Bold, #999999). Label text #4d4d4d.
2. Text Area box (frame, fill + 1px inside stroke, radius per table above):
   - `Text` frame (200 x 44 XL, 32 Default, 28 Small / 32 Pilled Small): `Text Area` text, Inter Semi Bold, #4d4d4d (placeholder/value; Default and Filled data are identical, see Gaps).
   - `Icon` frame (200 x 75 XL, 32 others): 24x24 Icon instance, the resize grip at the bottom-right corner (see export).
3. Bottom row: `Add Text Bottom` helper text, Inter Semi Bold, #999999, same size as Top row.
   Top/Bottom Label frame widths vary (124/76 XL) only because of content.

## States (colors, hex only)
- Default: fill #ffffff, stroke #e6e6e6 (1px inside), text #4d4d4d.
- Filled: same as Default in the data (fill #ffffff, stroke #e6e6e6, text #4d4d4d).
- Disabled: fill #fafafa, stroke #e6e6e6, text `Text Area` #b3b3b3; Top/Bottom texts unchanged in data (export shows them faded: likely node opacity, unreadable).
- Active: extra wrapper frame `Active` (same size/radius as box) with stroke #808080 at 20% alpha (ring), box inside keeps default fill/stroke. Ring appears ~4px thick in export.
- Error: wrapper `Error`, stroke #ef4444 at 20% (ring); export also shows an inner red stroke (box stroke not readable, probably danger-500).
- Succes: wrapper `Succes`, stroke #22c55e at 20% (ring); inner green stroke in export.
- Hover/focus: not present in Figma.

## Token hints (matched to Light tokens, unverified)
#e6e6e6 -> base-100/150 range, #4d4d4d -> base-700/800, #999999 -> base-400, #b3b3b3 -> base-300, #fafafa -> background-20/base-20, #808080 alpha 20 -> base-alpha-20, #ef4444 -> danger-500 (alpha 20 -> danger-alpha-20), #22c55e -> success-500 (alpha 20 -> success-alpha-20). Same mapping family as Input in CLAUDE.md.

## Icon assets
- `material-help` (help icon next to the Label): already `public/icons/material-help.svg` (Material path).
- Resize grip `Icon` 24x24 instance (bottom-right): vector not exported; no `assets/` available (dump missing). Re-run `pnpm figma:fetch 8985-334025` after the rate limit clears.

## Exports (visual reference, scale 0.5, PNG)
- Rounded: C:\Users\grdze\.claude\projects\E--Girhub-ecormce-webstie\3236ab20-c678-4ade-9a70-ca0173a7424b\tool-results\mcp-TalkToFigma-blob-1793300081914-t40md8.png
- Pilled: C:\Users\grdze\.claude\projects\E--Girhub-ecormce-webstie\3236ab20-c678-4ade-9a70-ca0173a7424b\tool-results\mcp-TalkToFigma-blob-1793300082058-zn5lnb.png
(Grid: columns = XL, Large, Default, Small; rows = Default, Disabled(second row looks like Filled)... order in export: Default, Filled-like, Active, Error, Success, Disabled.)
In the export the Pilled text values look bolder/darker than Rounded's placeholder style in the first row.

## Gaps
- REST dump 429: no variable names, no paddings/gaps (Top-to-box and box-to-Bottom spacing, box inner padding), no stroke weights (ring ~4px, normal 1px assumed), no effects, no opacity values for Disabled.
- Default vs Filled data are identical; export row 1 text looks lighter (placeholder look) vs row 2 darker. Treat Default = placeholder (lighter) and Filled = value as in Input, unverified.
- Visibility of optional parts (help icon, Add Text, Add Text Bottom) unreadable; all shown in every variant.
- Text Area box fixed heights above come from the 200x200 preview frame, not real min-heights.
- Figma state typo "Succes".
- `set_focus` not needed: the open page is Forms: Radio, not Text Area.
