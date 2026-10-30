# Slider handoff spec

Page: 4313:51976 ("❖ Slider"), slug `slider`. Read via TalkToFigma (page opened with `set_focus`; `currentPage` confirmed). REST dump not used (no `design/figma-dump/4313-51976/`).

Component sets on the page (plus `Base` rectangle 16238:639071 and `Head-Design-System` instance 13775:6387, both ignorable):

| Set | Node id | Size |
|---|---|---|
| Slider | 502:7159 | 862x224 |
| Runner-Component | 12191:4063 | knob only |
| Slider-Percent | 12193:6459 | 22 per style + 22 Dark (44 variants) |

Exports (PNG, TalkToFigma blob files, not copied into the repo):
- Slider: `C:\Users\grdze\.claude\projects\E--Girhub-ecormce-webstie\f5eeb0d0-77af-4cc1-9115-2825cc3f8019\tool-results\mcp-TalkToFigma-blob-1793334460954-tk0u27.png` (scale 0.5)
- Runner-Component: `...\mcp-TalkToFigma-blob-1793334460982-j0g47a.png`
- Slider-Percent: `...\mcp-TalkToFigma-blob-1793334461523-1gfnni.png`
- Raw node JSON: `...\mcp-TalkToFigma-get_nodes_info-1793334460915.txt` (same folder)

## 1. Runner-Component (12191:4063) — the thumb
Variants: `Type` = Default | Hover | Active; `Style` = Primary | Dark (6 variants). All 8x8, fully round (r20), 1px-ish stroke (weight unreadable).

| Type / Style | Fill | Stroke | Likely token (Light) |
|---|---|---|---|
| Default / Primary | #ffffff | #2563eb | white fill, primary-600 stroke |
| Hover / Primary | #2563eb | #2563eb | primary-600 |
| Active / Primary | #1e40af | #1e40af | primary-800 (token unknown, hex match) |
| Default / Dark | #ffffff | #333333 | base-800 stroke (hex match) |
| Hover / Dark | #010101 | #010101 | base-900 |
| Active / Dark | #4d4d4d | #4d4d4d | base-700 |

## 2. Slider (502:7159)
Variant properties:
- `Type`: Default (single thumb) | Range (two thumbs)
- `Size`: Default | Small
- `Style`: Primary | Dark

8 variants. Sizes (frame): Default Type 76x12, Small 76x8; Range Default 200x12, Range Small 200x8. Frame width is only the sample width, the track is fluid in use.

Parts:
- Track: the line is not in the node data (layer not returned; export shows a thin rounded line). From the export: Default size track ~4px high, Small ~2px, track in Slider-Percent is the exact measure (see below). Unselected track = style color at 15% alpha (blue #3b82f6 / grey #808080 per Slider-Percent); Selected range = solid style color (#2563eb Primary, black/#010101-ish Dark per export; hex not read).
- Thumb(s): `Runner-Component` instance 8x8, Default state. Default size frame is 12px high with the 8px thumb at y+2 (2px margin top/bottom); Small is 8px high, thumb flush.
- Range Small variants (502:7229 Primary) use two `Base` rectangles 8x8 r16 fill #2563eb (solid filled dots, no white fill/stroke) instead of Runner instances. Export shows the Range Small Primary thumbs as solid blue dots. Treat as Figma inconsistency; use the Runner default look unless told otherwise.
- Range example thumb positions: Default size thumbs at x=62 and x=127 of 200 (31% and 64%), Small at 126 and 66 (order swapped in layer list).

States: Default only on the Slider set; Hover/Active exist on Runner-Component only (apply to the thumb).

## 3. Slider-Percent (12193:6459)
Variant properties:
- `Type`: Default (Primary blue) | Dark
- `Size`: Default (track 4px) | Small (track 2px)
- `Start`: 0% | 10% | 25% | 35%
- `End`: 100% | 90% | 75% | 60% | 50% | 35% | 25% | 10%
- Combinations present per Type+Size (22): Start=0% with all 8 Ends, plus Start 10%/End 100%, 25%/90%, 35%/75%. Total 44.

Track: 239 wide, 4px (Default) or 2px (Small), r8, fill `#3b82f6` at 15% alpha (Default type; maps to primary-alpha-15 / blue-500 15%, not an existing token) or `#808080` at 15% (Dark; base alpha, hex only). Selected range between the two thumbs in solid style color (see export).

Parts per variant, two `Dot` frames (start thumb, end thumb), each:
- `Tooltip` instance (white pill), always visible above the thumb: content 18..54 wide (hugs text) x 32 high, r10, fill #ffffff, stroke #e6e6e6 (base-100 hex match), text Inter Bold 700 11px / 20px, centered, color #4d4d4d (base-700), horizontal padding ~12 (42 wide for "0%", text 18). Tooltip has a downward arrow notch (frame 52 high = 32 tooltip + ~12 arrow/gap + 8 dot). Tooltip is the existing Tooltip component, White variant.
- `Dot` 8x8: `Runner-Component` Default instance (white fill, style-color stroke).
- Tooltip is centered over the thumb, thumb center at the percentage along the 239px track (thumb x = 76 start, 315 end for 0%..100%: thumb positions span the full 239 width with the 8px thumb inside the track bounds ends).
- When thumbs are close (Start=0/End=10, 25, 35) tooltips overlap; the export shows them overlapping, no collision handling designed.
- Text value labels are literal percentages ("0%", "100%").

## 4. Icons / assets
None. No SVG assets needed.

## 5. Mapping notes for code
- shadcn `slider` (Base UI) with `cva` variants `style` (primary | dark) and `size` (default 4px | small 2px). Thumb as `SliderThumb` slot with Default/Hover/Active states (hover/active via `:hover`/`data-[dragging]`). Track `SliderTrack`, range `SliderRange`. Value bubble = existing `Tooltip` White variant (see `progress-percent.tsx` pattern).
- Range = two thumbs (`value={[a,b]}`).

## Gaps
- Track line and selected-range layers are missing from the node data (TalkToFigma returned only thumbs for the Slider set); selected-range colors for Dark and Primary are inferred from exports, hex unread. Track thickness for the plain Slider set is inferred from Slider-Percent (4/2px).
- Thumb stroke weight, effects (shadows), and layer visibility unreadable.
- Token names not resolved (no REST dump, no 429-free access attempted): all colors are hex matches. Verify `#2563eb` = primary-600, `#1e40af` = primary-800, `#333333`, `#4d4d4d`, `#e6e6e6`, `#808080@15%` against `src/styles/color-mode.css`.
- Tooltip arrow dimensions and exact tooltip-to-dot gap unread (estimated from 52px dot-frame height).
- Auto-layout paddings of the Tooltip content unreadable (estimated 12 horizontal).
- Hover/Active only defined for the thumb; the Slider sets show Default only. Hover/Active stroke widths unknown.
- Slider-Percent label text for each variant is the literal Start/End percentage; no min/max labels or step marks exist in Figma.
