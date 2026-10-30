# Color Input (Forms: Color)

Page 12053:26144 (`Forms: Color`), slug `color-input`. Page also holds `Base` rectangle 16206:95865 and `Head-Design-System` instance (ignore).
Exports: `color.png` (set 12053:26145), `colors-item.png` (set 4558:5182), same folder.

## Set 1: Color (12053:26145), 48 variants, 732x219 frame
Props: `Style` x 24, `Cornet` (sic) = Pilled | Rounded.
Style values and Base hex (same for both Cornet):
Primary #2563eb, Warning #d97706, Success #16a34a, Danger #dc2626, Info #0284c7, Orange #ea580c, Yellow #eab308, Cyan #06b6d4, Lime #84cc16, Emerald #10b981, Rose #f43f5e, Fuchsia #d946ef, Violet #8b5cf6, Indigo #6366f1, Blue #3b82f6, Teal #14b8a6, Amber #f59e0b, Pink #ec4899, Sky #0ea5e9, Green #22c55e, Red #ef4444, Purple #a855f7, White #ffffff, Black #000000.
(Hex are Tailwind 600 for Primary/Warning/Success/Danger/Info/Orange, 500 for the rest.)

Parts (each variant 20x20 swatch):
- Root: 20x20, fill #ffffff, stroke #e6e6e6 (weight unreadable, looks 1px), radius Pilled 1600 (full), Rounded 6.
- Base: 12x12 child, centered (4px inset), fill = Style hex, no stroke, radius Pilled 1000 (full), Rounded 4.
Frame order in the export: row 1 Pilled, row 2 Rounded, gap between swatches 4px. White swatch Base is white on white (only root stroke visible).
States: none (no hover/focus/selected variants).

## Set 2: Colors/Item (4558:5182), 144 variants, 656x264 frame
Props: `Style` x 24 (Primary, Gray 250, Orange, Purple, Red, Yellow, Green, Sky, Pink, Amber, Teal, Lime, Cyan, Emerald, Rose, Fuchsia, Violet, Indigo, Blue, Success, Error, Info, Black, White), `Corner` = Rounded | Rectangle, `Size` = Large | Default | Small. (Gray 250 exists only for Large/Default/Small too; Primary = Blue values.)
Parts: Root 24x24 fill #ffffff, no stroke, no radius. Child `Icon`: Large 10px, Default 6px, Small 4px (width from bounding box; the export shows it larger because of a stroke, stroke weight unreadable, looks 1px), fill = main hex, stroke = darker hex.
Corner radius of Icon: Rounded 7 (all sizes, i.e. circle); Rectangle Large 2, Default 1, Small 1.

Fill / stroke per Style:
Primary/Blue #3b82f6 / #1d4ed8; Gray 250 #bfbfbf / #bfbfbf; Orange #f97316 / #ea580c; Purple #a855f7 / #9333ea; Red/Error #ef4444 / #dc2626; Yellow #eab308 / #ca8a04; Green/Success #22c55e / #16a34a; Sky/Info #0ea5e9 / #0284c7; Pink #ec4899 / #db2777; Amber #f59e0b / #d97706; Teal #14b8a6 / #0d9488; Lime #84cc16 / #65a30d; Cyan #06b6d4 / #0891b2; Emerald #10b981 / #059669; Rose #f43f5e / #dd0042; Fuchsia #d946ef / #c026d3; Violet #8b5cf6 / #7c3aed; Indigo #6366f1 / #4f46e5; Black #000000 / #000000; White #ffffff / #f2f2f2.
Style Primary/Blue, Success/Green, Error/Red, Info/Sky pairs are identical (aliases).

## Component ids (samples)
Color: Primary Pilled 12053:26146, Primary Rounded 12053:26176. Colors/Item: Primary Rounded Large 4558:5181, Primary Rectangle Large 5089:1513.

## Gaps
- Token names unknown (REST dump not fetched; no `figma-dump` for this page). Hex values match Tailwind palette: map to Light tokens in `src/styles/color-mode.css` (e.g. palette colors 500/600, `primary-600` for Primary).
- Stroke weights, auto-layout padding/gap, selected/hover/focus states not in node data; no "color input" text field exists on the page, only swatches. A color input would be a swatch grid (radio-group-like selection) built by composition.
- Visibility of hidden layers unreadable; no icon assets needed.
