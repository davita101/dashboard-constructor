# Links (Figma page 12123:27015)

- Page: `❖ Links`, id 12123:27015. Slug: `link`.
- Component set: `Link` 12123:27019 (COMPONENT_SET, 288 variants = 4 State x 8 Size x 9 Style; some combinations missing, see below). Other page nodes: `Base` rectangle 16125:139978, `🎮 Playground` frame 12123:27510, `Head-Design-System` instance (ignore).
- Export: `design/handoff/links/link-set.png` (whole set, scale 1). Not exported per variant.
- Source: TalkToFigma `get_nodes_info` (hex values exact; no token/variable names, REST dump not fetched). Hex matched below to Tailwind palette / Light tokens.

## Variant properties
| Property | Values |
|---|---|
| State | Default, Hover, Active, Active 2 |
| Size | 24, 20, 16, 15, 14, 13, 12, 11 |
| Style | 900, 700, 500, White, White 50%, White 30%, Danger, Primary, Succes (sic) |

All 288 variants exist (4 x 8 x 9). In the export image the White, White 50% and White 30% styles are white text on a white canvas, so they look empty; they are for dark backgrounds.

## Typography (text layer "Link", Inter, letter spacing 0, left aligned)
| Size | Font px | Line height | Weight |
|---|---|---|---|
| 24 | 24 | 36 | 600 Semi Bold |
| 20 | 20 | 28 | 600 |
| 16 | 16 | 24 | 600 |
| 15 | 15 | 24 | 700 Bold |
| 14 | 14 | 24 | 700 |
| 13 | 13 | 24 | 700 |
| 12 | 12 | 20 | 700 (Danger, Primary, Succes: 600) |
| 11 | 11 | 20 | 700 |
No underline (textDecoration absent).

## Colors (hex) per Style and State (text color)
| Style | Default | Hover | Active | Active 2 text | Active 2 fill |
|---|---|---|---|---|---|
| 900 | #010101 (base-900) | #3b82f6 (blue-500) | #1d4ed8 (blue-700) | #1d4ed8 | #f2f2f2 (base-50?) |
| 700 | #4d4d4d (base-700); size 11: #666666 | #3b82f6 | #1d4ed8 | #1d4ed8 | #f2f2f2 |
| 500 | #808080 (base-500) | #3b82f6 | #1d4ed8 | #1d4ed8 | #f2f2f2 |
| White | #ffffff | #3b82f6 | #1d4ed8 | #1d4ed8 | #ffffff |
| White 50% | #ffffff (layer opacity not readable, 50% expected) | #3b82f6 | #1d4ed8 | #1d4ed8 | #ffffff |
| White 30% | #ffffff (30% expected) | #3b82f6 | #1d4ed8 | #1d4ed8 | #ffffff |
| Danger | #dc2626 (danger-600) | #f87171 (-400) | #b91c1c (-700) | #b91c1c | #ef4444 (-500) |
| Primary | #2563eb (primary-600) | #3b82f6 (-500) | #1d4ed8 (-700) | #1d4ed8 | #3b82f6 (-500) |
| Succes | #16a34a (success-600) | #22c55e (-500) | #15803d (-700) | #15803d | #22c55e (-500) |
Active 2 fills are probably low-opacity tints (export shows pale tint: gray, red, blue, green); node data returns the solid base color, opacity unreadable (Gaps). Primary hex are the Blue theme values; map via `primary-*` tokens, not blue.

## Structure / parts (all sizes)
Auto layout row (padding/gap unreadable, Gaps). Children, in order:
1. `Left Icon` instance 20x20 (hidden by default? unknown)
2. `Link` text
3. `Badge-Square-Pilled` instance: 24 (sizes 24, 20), 20 (16, 15), 16 (14, 13, 12, 11); radius 16, fill #fff, stroke #e6e6e6 (hidden by default? unknown; not visible in export)
4. `Right Icon` instance 20x20
5. `Dropdown` instance 24 (sizes 24, 20), 16 (others) (chevron; not visible in export)
Only the text is visible in every exported variant, so the icon/badge/dropdown are toggled-off optional slots.

## Frame size (text only) and radius
| Size | Width x height | Radius Default/Hover/Active | Radius Active 2 |
|---|---|---|---|
| 24 | 49 x 36 | 20 | 8 |
| 20 | 41 x 28 | 20 | (8 expected) |
| 16 | 33 x 24 | 20 | 4 |
| 15 | 31 x 24 | 20 | |
| 14 | 29 x 24 | 20 | |
| 13 | 27 x 24 | 20 | |
| 12 | 25 x 20 | 20 | |
| 11 | 23 x 20 | 20 | 4 |
Active 2 is the pill/background hover highlight; in the export its frame is padded (about 8px horizontal at 24, 4px at 11; read from image, not node data). Radius 8 for 24/20, 4 for 16 and smaller (measured for 24/16/11).

## States
Default, Hover (lighter shade), Active (darker shade, pressed), Active 2 (pressed color text on a tinted rounded background, e.g. "current/selected" or focus look). No disabled and no focus variant.

## Icons
No icon asset is visible. Left/Right Icon and Dropdown are instances (not exported, TalkToFigma exports SVG as PNG). No `assets/` dump (no REST fetch run). Use Material or existing `public/icons/` chevrons if needed.

## Match with existing code
- `BreadcrumbLink` (src/components/ui/breadcrumb.tsx:70): text-base-700, hover text-primary-600, focus ring primary-alpha-30, rounded-r4, disabled base-200. Does NOT match the Links component: Figma hover is a lighter blue (#3b82f6, primary-500), Active is #1d4ed8 (primary-700), no Active 2 tint, 8 sizes and 9 styles. Reasonable breadcrumb Default (base-700) equals Style 700, but breadcrumb size/weight come from its own Figma set. Needs a general `Link` ui component (cva: style x size, state via hover/active/`data-state`), then BreadcrumbLink could reuse it.
- `CheckboxCardLink` (checkbox-card.tsx:96): 12/20 semibold, base-900, underline on hover, rounded-r4. Closest to Link Style 900 Size 12 Default but Figma hover is #3b82f6 color change without underline, and Size 12 bold is 700 (600 only for Danger/Primary/Succes). Figma Links row of the card may be a separate usage; code differs on hover and weight. Not an exact match.

## Gaps
- Padding, gap, auto-layout and layer visibility of icon/badge/dropdown slots unreadable.
- Active 2 fill opacity and exact padding unreadable; White 50% / 30% text opacity unreadable.
- No token names (REST not fetched); colors are hex-matched.
- No per-variant export images (only whole set). Playground frame 12123:27510 not inspected.
- Exact Succes/White variant counts per size not verified one-by-one.
