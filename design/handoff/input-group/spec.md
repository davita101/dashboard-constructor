# Input Group — handoff spec

- Page: `12015:28362` (`❖ Forms: Input Groups`), slug `input-group`
- Existing code to extend: `src/components/ui/input-group.tsx` (see `graph-context.md`).
- No `design/figma-dump/12015-28362/` (REST not tried; hex matched to Light tokens, token names unknown).

## Component sets (6)

| Set | Node id | Group slots | Radius type |
|---|---|---|---|
| Input-Left-Group-Rounded | 12015:28366 | Group + Input | Rounded |
| Input-Left-Group-Pilled | 12037:18710 | Group + Input | Pilled |
| Input-Right-Group-Rounded | 12031:38793 | Input + Group | Rounded |
| Input-Right-Group-Pilled | 12041:36103 | Input + Group | Pilled |
| Input-Double-Group-Rounded | 12031:39929 | Group + Input + Group | Rounded |
| Input-Double-Group-Pilled | 12050:2481 | Group + Input + Group | Pilled |

Page also has 5 `❖ Playground` frames (12053:4018, 12058:290919, 16044:311435, 12060:21539, 16044:311860, 15076:17525), 6 `Base` rectangles, `Head-Design-System`. Not read.

## Variant properties

- `Size`: Extra Large (60), Large (48), Default (40), Small (32), Micro (24).
- `State`:
  - Left/Right: Default, Filled, Active 1, Active 2, Error, Success, Disabled. 35 variants each.
  - Double: same plus Active 3 (Success is spelled `Succes` in Double-Rounded). 40 variants each.
  - Active N = which segment is focused. Left: Active 1 = Group, Active 2 = Input. Right: Active 1 = Input, Active 2 = Group. Double: 1 = left Group, 2 = Input, 3 = right Group.
- Variant frame is 300 wide. Heights: 132 / 112 / 96 / 80 / 64 (60/48/40/32/24 box + 20 top + 20 bottom + no gap listed).

## Parts (per variant, vertical stack: Top, Content, Bottom)

- **Top** (300x20): left Label frame (text "Label" Inter Bold 12/20 `#4d4d4d`, plus `material-help` 16px icon), right "Add Text" (Semi Bold 12/20 `#999999`). Frame fills are hidden.
- **Content** (300 x box height): horizontal row of segments, which overlap by 1px (Left/Right: group + input = group width + input width - ... = 301 vs 300; Double: 302 vs 300 so 2 overlaps).
  - **Group** segment (addon). Width per size, Rounded: 66 / 56 / 46 / 42 / 33. Pilled: 78 / (Large not read) / 54 / (Small not read) / 39. Fill `#ffffff`, stroke `#e6e6e6`.
  - **Input** segment = remaining width. Rounded Left: 235 / 245 / 255 / 259 / 268. Pilled Left: 223 / (-) / 247 / (-) / 262. Double input: Rounded 170 / (-) / 210 / (-) / 236, Pilled 146 at XL. Fill `#ffffff`, stroke `#e6e6e6`.
    - Left side: text (value) Semi Bold. Default color `#4d4d4d`, Filled `#333333`, Active `#666666`/`#333333` (see States).
    - Right side: "Add Text" `#808080`, optional Button (Right Button), Right Icon 24, Command Keys (`Command-Keys-Group` 70x32), Select icon 24.
- **Group slot alternatives** (all children of the Group frame, visibility not readable; the export shows only "Text"):
  - Button (`Left Button` instance 65x32, r8, gradient `#ffffff` to `#fafafa`, gradient stroke), Checkbox (20), Radio (20), Switcher (36x20), Left Icon (24), Payment (Mastercard-Rounded 38x24), Avatar (Avatar-Image 32, r8), Colors (Color 24, r6, `#ffffff` fill `#e6e6e6` stroke), Country (United-States 24), Text (Semi Bold 12/20 `#666666`), Select (Icon 24).
  - Slot frames add 12px padding to the widget width (e.g. Checkbox 20 -> 36, Switcher 36 -> 52, Icon 24 -> 36, Payment 38 -> 50, Color 24 -> 30?, Avatar 32 -> 36).
- **Bottom** (300x20): "Add Text Bottom" Semi Bold 12/20 `#999999`.

## Typography (Semi Bold 600, Inter, line 20 at 60/48 else matches size)

| Size | Text size |
|---|---|
| Extra Large (60) | 12 |
| Large (48) | 12 (Button 11 bold) |
| Default (40) | 11 |
| Small (32) | 10 |
| Micro (24) | 9 |

## States / colors (hex, matched against Light tokens)

- Default: stroke `#e6e6e6` (base-100), fill `#ffffff`, group text `#666666`, input value `#4d4d4d`, placeholder/add text `#808080`.
- Filled: input value `#333333`. Right-Group Default (40) Filled input stroke `#d9d9d9` (base-150); other sets keep `#e6e6e6`.
- Active (focused segment): that segment has fill none, stroke `#808080`, text `#333333`; the wide 4px ring seen in the export is outside the node data (stroke weight and effects not read). Other segments keep default (text `#666666`). Double Active 2: both Groups have no fill, stroke `#e6e6e6`.
- Error: all segments stroke `#dc2626`, group and input text `#dc2626`, add-text `#808080`. Bottom text red in export.
- Success: all strokes `#16a34a`, text `#16a34a`, bottom text green.
- Disabled: Left/Right Rounded fill `#fafafa` (background-20), stroke `#e6e6e6`; text group `#666666`, input `#666666`, add-text `#808080`; export shows whole control faded. Double and Right sets keep `#ffffff` fill in node data (probably an inconsistency; export shows grey).
- Hover: none.

## Shape

- Rounded set vs Pilled set (Pilled has larger group widths, 12px more). Radii not returned by TalkToFigma; export shows the outer corners rounded (Rounded about r12-r16 at XL scaling down, Pilled full) and inner joining edges square.

## Icons

- `material-help` 16px (label hint), slot Icons 24px, `Command-Keys-Group` instance, Mastercard and United-States instances, Select chevron. No asset dump; reuse existing `public/icons/` (`material-help.svg`, select/chevron).

## Gaps

- Corner radii per size, padding/gap inside slots, stroke weight, ring/shadow effects, visibility of hidden slot alternatives: unreadable.
- Large (48) and Small (32) widths for Pilled and Double not read (only XL, Default, Micro sampled).
- Token names unresolved (REST dump not fetched); hex matched only.
- Disabled opacity unreadable; fills inconsistent between sets.
- Image export of Left-Group-Rounded only was viewed.
