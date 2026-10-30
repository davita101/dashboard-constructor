# Double Input

- Page id: 11956:50138 ("Forms: Double Inputs"), slug `double-input`
- Source: TalkToFigma (`get_nodes_info`, export of Input-Vertical-Double-Rounded). No REST dump, so colors are Figma hex only (token unknown; match to Light tokens, see Gaps).

## Component sets (6)

| Set | Node | Variants | Layout |
|---|---|---|---|
| Input-Double-Rounded | 11956:50142 | 30 | Two full-width inputs stacked and joined (second at y+39, 1px overlap) |
| Input-Double-Pilled | 11984:34041 | 30 | Same, pilled |
| Input-Horizontal-Double-Rounded | 15941:60824 | 35 | Two inputs side by side, gap 8 (fields 146 wide at 300) |
| Input-Horizontal-Double-Pilled | 15909:16155 | 35 | same, pilled (r32) |
| Input-Vertical-Double-Rounded | 15963:162530 | 35 | Two separate inputs stacked, gap 8 |
| Input-Vertical-Double-Pilled | 15962:19281 | 35 | same, pilled |

Variant props:
- Size: Extra Large (60), Large (48), Default (40), Small (32), Micro (24) (the input height).
- State: Default, Filled, Active, Succes (sic), Error, Disabled in the joined sets (Pilled joined has no Disabled gaps: all 5 sizes x 6 states). Horizontal/Vertical sets: Default, Filled, Active 1 (first input focused), Active 2 (second focused), Error, Success, Disabled.
- Joined set Rounded: Size x State = 30 (all present). Pilled the same.

## Overall frame (width 300)
Top (label row) / Content / Bottom (helper text), as the existing Input.
- Heights: joined = Top 20 + Content (2*input - 1) + Bottom 20 (XL 191, Default 135, Micro 87 with 16px rows). Horizontal XL 132 / Default 96. Vertical XL 204 / Default 144 (content = 2*input + 8).
- Top: left Label (bold 700) + help icon (`material-help`, 16, Micro 12), right "Add Text" (600, #999999). Label #4d4d4d.
- Bottom: "Add Text Bottom", 600, #999999 (colored per state, see below).
- Text sizes: XL 12/20, Large/Default/Small 11/20 (Default confirmed 11/20), Micro 9/16. Row heights Top/Bottom: 20, Micro 16.

## Input part (each of the two)
- Size 300 x {60,48,40,32,24} (joined/vertical), 146x40 or 144x60 each (horizontal, gap 8 at Default, 12 at XL).
- Fill #ffffff, stroke #e6e6e6 (inside).
- Radius: Rounded horizontal/vertical r8 at Default, r16 at XL (others not read); Pilled r32. Joined sets: radius not reported (likely only outer corners).
- Left group: Left Icon (26x20 slot, icon 20; XL 36x24 / 24; Micro 22x16 / 16), Payment (Mastercard, 38x20 pilled / 34x20 rounded), Avatar (24x24), Country flag (22x20, 20), Colors swatch (20 circle, r1600 pilled / r6 rounded, stroke #e6e6e6), Center text. Only one of these left slots is meant to be visible at a time (visibility not readable; Input component has the same slots).
- Right group: Add Text (#808080 600), Button (Right Button, 57x24 pilled / 49x24 rounded), Right Icon, Select (chevron up/down, 20).
- Text: placeholder #4d4d4d (Default) 600; Filled text #666666 on Input 2, #333333 on Input 1 (value), Add Text #808080 / #333333.
- Icons are `Icon` instances with a #808080 fill (Filled Input 1: #333333).

## States (joined Default 40 read)
- Default: stroke #e6e6e6.
- Filled: as Default, text darkens (#333333 first input, #666666 second).
- Active: first input stroke #cccccc (joined) / #808080 (Horizontal/Vertical "Active 1/2", only the focused one is stroked); export shows a thick soft ring around the focused input.
- Error: stroke #dc2626 on first input, red ring, helper text red. Success: stroke #16a34a, green ring, helper text green.
- Disabled: fill #fafafa, stroke #e6e6e6, text and icons faded, Top/Bottom text faded.

## Assets
Icons reuse existing Input assets (`public/icons/`): material-help, select chevrons; no new assets seen. Mastercard, flag, avatar, color swatch are existing components.

## Gaps
- No variable names or REST dump: all colors are hex only. Active/ring widths, stroke weight, and ring color per state not readable from node data; the error/success ring is visible in the export (about 4px alpha ring like Input).
- Visibility of the left/right slots (Icon, Payment, Avatar, Country, Colors, Button, Select) not reported; export shows Left Icon hidden, only Text and Select chevron shown, "Add Text" top-right.
- Corner radius for the joined sets, and for Large/Small/Micro of Horizontal/Vertical, not read. Paddings of Input not readable (Left/Right widths imply about 12px at Default).
- Stacked joined variant: how the two inputs share a border (1px overlap) - corners likely square on the inner edge.
- Playground frames (11999:21495, 15971:*) not inspected.
