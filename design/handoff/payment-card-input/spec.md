# Payment Card Input — spec

| Item | Value |
|---|---|
| Page | 12008:2462 (`❖ Forms: Payment Card Input`) |
| Sets | `Input-Payment-Rounded` 11999:48375, `Input-Payment-Pilled` 12012:1345 |
| Slug | `payment-card-input` |
| Other page nodes | 2x Playground frames (12012:1209, 16065:337496), Head-Design-System instance, 2x Base rect (ignore) |
| Dump | none (no tree.txt, REST not tried). Colors = hex, token unknown; see Gaps |

## Variants (each set 30 comps)

| Prop | Values |
|---|---|
| Size | Extra Large (60), Large (48), Default (40), Small (32), Micro (24) — number = height of each input row |
| State | Default, Filled, Active, Success, Error, Disabled |
| Set (shape) | Rounded = card brand logo tile radius 6; Pilled = logo tile radius 72 (full pill) |

Rounded vs Pilled differ ONLY in brand logo tile (`Base` rect radius + dims). Else identical, except Default-state text color (below). Variant = prop `shape`: `rounded` | `pilled`.

Comp ids: Rounded XL Default 11999:48376; Pilled XL Default 12012:1346.

## Layout (vertical stack, same all sizes)

Comp width 300 (Micro 200). Comp height XL 191 / L 159 / D 135 / S 111 / M 95.

| Part | Name | XL | L | D | S | M |
|---|---|---|---|---|---|---|
| Top row (label line) | Top | h20 | h20 | h20 | h16 | h16 |
| Gap Top→Content | | 16 | 12 | 8 | 8 | 8 |
| Card number row | Content/Input | h60 | h48 | h40 | h32 | h24 |
| Row 2 (3 cells) | Content/Bottom | h60 | h48 | h40 | h32 | h24 |
| Row overlap | row2 y = row1 y + h − 1 (1px stroke overlap, grid look) | | | | | |
| Gap Content→Bottom | | 16 | 12 | 8 | 8 | 8 |
| Bottom row (hint) | Bottom | h20 | h20 | h20 | h16 | h16 |
| Input x padding | | 20 | 16 | 12 | 12 | 8 |
| Text font size | Inter SemiBold 600 | 12 | 12 | 11 | 10 | 9 |
| Text line height | | 20 | 20 | 20 | 16 | 16 |

Content = 2 rows: row 1 full width `Input` (card number left + brand logo right); row 2 `Bottom` frame = 3 equal cells (each 1/3 width, 100.7 @300) `00 / 00` (expiry), `CSV`, `Zip Code`. Cell edges overlap 1px (x 99.7, 199.3).

## Parts

| Part | Node name | Detail |
|---|---|---|
| Label | Top/Label (TEXT "Label") | Inter Bold 700 12 (Micro/Small likely 10/9 not verified; label text size XL/L 12, D 11, S 10, M 9 inferred from row text; M measured top-right text 10), color #4d4d4d, x pad = input x pad |
| Help icon | `material-help` instance | 16x16, 8px right of label, y +2. Icon asset: not exported (see Gaps). Existing lucide `CircleHelp` OK-ish, Field has `FieldLabelIcon` |
| Top-right text | Top/Label (TEXT "Add Text") | Inter SemiBold 600 12, #999999, right aligned, container w72 (XL) |
| Card number | Input/Left/Text "Card Number" | placeholder, SemiBold, color per state |
| Brand logo | Right → `Mastercard-Rounded` / `Mastercard-Pilled` instance | tile (Base rect fill #ffffff, stroke #e6e6e6) + Mastercard glyph group (circles #ed0006, #f9a000, overlap #ff5e00). Right edge inset = input x pad + 4 (e.g. XL right gap 16 from edge) |
| Cells | Bottom/Input x3 | fill #ffffff, stroke #e6e6e6, text left-aligned, x pad as above |
| Bottom hint | Bottom/Label "Add Text Bottom" | SemiBold 600, #999999, x pad = input x pad |

Logo tile dims (w x h):

| Size | Rounded | Pilled |
|---|---|---|
| XL | 51x32 | 50x28 |
| L | 38x24 | 43x24 |
| D | 32x20 | 36x20 |
| S | 32x20 | 29x16 |
| M | 26x16 | 29x16 |

Mastercard glyph XL: Rounded 31.2x19.2, Pilled 27.8x17.2; scales ~ with tile height (L 23x14, D/S 20x12 (Rounded 19.6x12), M 16x9.6). Logo is multi-color brand art: render as `Image`/svg, not mask. Logo inside input is right-aligned, vertically centered.

Row 1 container: `Left` (flex-1, text) + `Right` (logo, gap ~ 8-10).

## States (Input row 1 + cell text; stroke weight not readable, assume 1; Active/Success/Error look 2-3px thick ring in export — see Gaps)

| State | Row 1 fill | Row stroke | Card Number text | Cell text (00/00, CSV, Zip) | Logo | Notes |
|---|---|---|---|---|---|---|
| Default | #ffffff | #e6e6e6 | #4d4d4d | Rounded #666666; Pilled #4d4d4d (inconsistent, pick one) | full | |
| Filled | #ffffff | #e6e6e6 | #333333 | #333333 | full | all text darker |
| Active | #ffffff | #cccccc | #333333 | #666666 | full | thick grey ring around row 1 (focus) |
| Success | #ffffff | #16a34a | #16a34a | #666666 | full | green ring + green text row 1 only |
| Error | #ffffff | #dc2626 | #dc2626 | #666666 | full | red ring (+ light red outer ring) + red text row 1 only |
| Disabled | #fafafa | #e6e6e6 | #666666 | #666666 | faded | whole comp ~ half opacity incl. logo, label, hints (opacity prop not readable) |

Active/Success/Error ring applies to row 1 only (cells keep #e6e6e6). Ring = outline over the row, extends beyond; likely `ring` (focus ring from base token) — not read.

## Token guess (hex → closest Light token, verify against src/styles/color-mode.css)

| Hex | Guess |
|---|---|
| #ffffff | background / base-0 |
| #fafafa | base-50 |
| #e6e6e6 | base-100/200 |
| #cccccc | base-300 |
| #999999 | base-400/500 |
| #666666 | base-600 |
| #4d4d4d | base-700 |
| #333333 | base-800 |
| #16a34a | success-600 (tailwind green-600) |
| #dc2626 | danger-600 (tailwind red-600) |

## Existing code to reuse

`src/components/ui/input-group.tsx` (InputGroup, InputGroupSegment, InputGroupJoin, InputGroupAddon — join cells), `field.tsx` (FieldHeader, FieldLabel, FieldLabelIcon, FieldHint, FieldDescription — Top/Bottom rows), `input.tsx` (size variants 24/32/40/48/60, status), `double-input.tsx` (multi-cell layout), `avatar.tsx` frame variants (pill/rounded tile for logo). Map: Top = FieldHeader, Bottom hint = FieldDescription/FieldHint, row1+cells = InputGroupJoin of Input/segments, logo tile = new slot `PaymentCardBrand` in ui (cva shape rounded|pilled).

## Icon assets

- Mastercard: nested vector group in the Figma instance (`Mastercard-Rounded` 11999:49888, `Mastercard-Pilled` 12012:1357). Not exported to file. Needs `pnpm figma:fetch 12008-2462` or hand-made SVG (3 circles #ed0006 / #f9a000 / #ff5e00).
- `material-help` 16x16 (12434:269259).
- Other brands (Visa etc.) not on page.

## Gaps

- No dump / REST not attempted: colors are hex only, token names guessed.
- Stroke weight, corner radius of Input frames, ring/shadow effects, disabled opacity not exposed by TalkToFigma. Export shows Rounded & Pilled outer container radius ~ r12 (XL) top row and rounded bottom corners on row 2; Pilled looks same radius (only logo tile differs).
- Label font size per size (Small/Micro) inferred.
- Default-state cell text color differs Rounded (#666666) vs Pilled (#4d4d4d): likely Figma inconsistency.
- No hover/focus states in Figma beyond Active.
- Playground frames 12012:1209 / 16065:337496 not inspected (compositions).
