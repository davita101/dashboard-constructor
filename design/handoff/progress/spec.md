# Progress spec

- Figma page: 4313:34129 ("Progress"), slug: `progress`
- Component sets (5): Progress-Line `492:6995`, Progress-Circular `494:102`, Progress-Dot `12176:1600`, Progress-Percent `12178:534`, Progress-Circle-Half `12184:1922`
- Source: TalkToFigma get_nodes_info + exports. REST dump NOT available (`pnpm figma:pages` and `pnpm figma:fetch 4313-34129` hit 429), so all colors are hex, token unknown. Hex values are Tailwind palette (blue-600 #2563eb etc.), likely Default Colors 600 shade.

## Style values (shared by Line, Circular, Half; Line/Circular text color shown below)
Primary(#2563eb Line / #1d4ed8 Circ+Half text, stroke #3b82f6), Dark/Black (#4d4d4d Line text; Circular/Half have `Black`, Line has `Dark`), White (#fff), Orange #ea580c, Purple #9333ea, Red #dc2626, Yellow #ca8a04, Green #16a34a, Sky #0284c7, Pink #db2777, Amber #d97706, Teal #0d9488, Blue #2563eb, Lime #65a30d, Cyan #0891b2, Emerald #059669, Rose #dd0042, Fuchsia #c026d3, Violet #7c3aed, Indigo #4f46e5.
Line has 20 styles (no Black; has Dark). Circular and Half have 21 (Black AND Dark).
Note: the Line text color equals the 600 shade; the Circular text color is a darker shade (Primary #1d4ed8 = blue-700); only Primary Circular read in full.

## 1. Progress-Line (492:6995) - 440 variants
Props: Size = Default | Small; Style = 20 above; Fill = 0%, 3%, 5%, 10%, 25%, 35%, 50%, 60%, 75%, 90%, 100%.
Parts per variant:
- `Content` frame (the bar): Default 200x4, Small 30x2. Children empty (fill/track not readable; export shows solid colored filled portion + same-hue very light track, ~10% alpha). Radius: Indigo/50% group says r4 (Default), otherwise unreadable.
- `100%` TEXT label (text always reads "100%" in the component, a placeholder), right-aligned at end of bar, overlapping the bar's end region (x = bar end - 28): Default Inter Bold 10/16, 28x16; Small Inter Bold 8/12, 22x12 (x offset +8 from bar start of 30 wide). Color = style color.
- Whether the label is visible at each Fill is not readable (Gap). Export shows bar only.
## 2. Progress-Circular (494:102) - 147 variants
Props: Size = Micro (16) | Extra Small (24) | Small (36) | Default (48) | Large (56) | Extra Large (72) | 2 Extra Large (128) (square, w=h=size); Style = 21.
Parts: root has stroke #3b82f6 (Primary; the track ring, stroke weight unreadable), cornerRadius 540. Children: 9 ELLIPSEs named `100%, 90%, 75%, 60%, 50%, 35%, 25%, 10%, 5%` each full size, fill #2563eb (Primary; arc progress layers, only one shown per usage; arc geometry/visibility not readable), plus TEXT `100%` (Large 56: Inter Bold 11/20, 30x20, #1d4ed8) and (larger sizes) a `Description` text. Export: 2XL/XL/L show "100%" + "Description" lines; smaller sizes show % only; Micro/XS ring only.
## 3. Progress-Dot (12176:1600) - 3 variants, 8x8, r20
Type=Default: fill #fff, stroke #2563eb. Type=Hover: fill #2563eb, stroke #2563eb. Type=Active: fill #1e40af, stroke #1e40af. (Stroke weight unreadable; export ~1px.)
## 4. Progress-Percent (12178:534) - 2 variants
Type=Default: track 239x4; Type=Small: 239x2. Contains group `10%` (44x48): `Dot` frame (Progress-Dot instance at the bar end) with a `Tooltip` instance above it (Tooltip: 47x32, fill #fff, stroke #e6e6e6, r10, text Inter Bold 11/20 #4d4d4d centered "10%", drop shadow in export). Bar is blue (#2563eb), light track. Use existing Tooltip component. It is a slider-like progress with thumb dot + tooltip; Small uses a smaller dot (export ~6px).
## 5. Progress-Circle-Half (12184:1922) - 189 variants
Props: Style = 21; Size = 20 | 24 | 32 | 40 | 48 | 60 | 72 | 96 | 128 (width; height = half: 128x64, 96x48, 72x36, 60x30, 48x24, 40x20, 32x16, 24x12, 20x10).
Parts (128): `Content` frame 128x64 with TEXT `100%` (Inter Bold 18/28, #1d4ed8, 50x28) + TEXT `Description` (Inter Bold 10/16, 57x16, #1d4ed8); GROUP `Progress` 128x64 (the semicircular arcs). Smaller sizes: text shrinks/hides (export shows text only down to ~48; 40 and below arcs only, unreadable detail).

## States
Only Dot has Default/Hover/Active. No disabled/focus.

## Icons
None.

## Gaps
- REST dump unavailable (429): no token names, no padding/gap, no stroke weights.
- Track vs fill colors and alpha, arc stroke width, arc visibility per percent, label visibility per Fill, text of smaller Circular/Half sizes: not readable via TalkToFigma.
- Circular/Half text colors verified only on Primary.
- Line "Fill" 0%/3%: bar fill widths presumably = Fill% of 200/30 (confirm in export; layers are empty frames).
- Existing code idea: shadcn `progress` (Base UI) for Line; Circular/Half/Dot/Percent are custom in `src/components/ui`.
