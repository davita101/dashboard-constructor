# Input Custom spec

Page 12509:89789 ("❖ Forms: Inputs Custom"). Slug `input-custom`. Context: `graph-context.md` same dir.
Dark-surface inputs (glass over image/dark bg), 4 component sets. No tree.txt dump, no REST fetch tried (colors hex+alpha from TalkToFigma; token unknown unless noted).

## Sets

| Set | id | Radius shape | Input fill | Variants |
|---|---|---|---|---|
| Input-Rounded-White | 12509:89791 | rounded (per size) | #ffffff @25% | 30 |
| Input-Rounded-Black | 12513:173072 | rounded | #000000 @25% (expected, same as Pilled-Black; verify) | 30 |
| Input-Pilled-White | 12509:91203 | pill r32 | #ffffff @25% (expected) | 30 |
| Input-Pilled-Black | 12518:181280 | pill r32 | #000000 @25% | 30 |

Also on page: Playground 12518:188779 (FRAME), 5 "Base" rectangles (backdrops), Head-Design-System instance. Set frame: fill #000000 @60%, stroke #d8b4fe, r40 (showcase only, not component).
Rounded-White vs Rounded-Black visual: White = lighter gray glass, Black = darker glass. Pilled same.

## Variant props
- Size: Extra Large (60), Large (48), Default (40), Small (32), Micro (24) = Input frame height.
- State: Default, Disabled, Error, Succes (sic, success), Filled, Active.
- 5 sizes x 6 states = 30 per set.

## Layout (variant root, vertical, width 300)
Root h = input h + 72 (Top 20 + Bottom 20 + 2 gaps 16). Heights: 132/112/96/80/64. Gap 16 between Top/Input/Bottom (derived from y offsets 80/116/192).

| Part | Size | Notes |
|---|---|---|
| Top | 300x20 | row, space-between. Left: Label + `material-help` icon 16x16. Right: "Add Text" |
| Top Label | Inter Bold 12/20, #ffffff 100% | |
| Top Add Text | Inter SemiBold 12/20, #ffffff 50% | |
| Input | 300 x size h | stroke inside, radius table below |
| Bottom | 300x20 | helper text "Add Text Bottom" Inter SemiBold 12/20, #ffffff 50% |

Top/Bottom Label frames have hidden white fills (ignore).

### Input radius
| Size | Rounded | Pilled |
|---|---|---|
| Extra Large 60 | 16 | 32 (assumed, verify) |
| Large 48 | 12 | 32 |
| Default 40 | 8 | 32 |
| Small 32 | 8 | 32 |
| Micro 24 | 6 | 32 |

### Input inner structure (Input frame, row, space-between)
Left (slots, all optional/toggled; Figma shows all as hidden/visible layers in one frame):
- Tags: 3x `Badge-Default-Rounded` 78x32 (r8)
- Button: `Left Button` instance 65x32 (r8)
- Checkbox 20x20 (r6), Radio 20x20 (r32), Switcher 36x20 (r16) — fill/stroke #2563eb
- Left Icon: `Icon` 24x24 (wrapper 36x24)
- Payment: `Mastercard-Rounded` 38x24
- Avatar: `Avatar-Image` 32x32 r8
- Country: `United-States` 24x24
- Colors: `Color` swatch 24x24 r6, stroke #e6e6e6
- Center: Text, Inter SemiBold 12/20, #ffffff 90% (fills width)
Right:
- Add Text: Text Inter SemiBold 12/20, #ffffff 70%
- Button: `Right Button` 65x32 r8
- Right Icon: `Icon` 24x24
- Command Keys: `Command-Keys-Group` 70x32
- Select: `Icon` 24x24 (chevron)
Wrapper widths include 12px? side pad (wrapper 36 for 24 icon, 20 inner text 42 for 26 text => 8 side pad? exact padding unreadable, see Gaps).
Slots map: Badge, Button, Checkbox, Radio, Switch, Avatar, ColorSwatch, Kbd, InputGroupAddon. Reuse `input-group.tsx` addons.

## States (Input frame stroke; fill same all states)
| State | Stroke (Input) | Bottom text | Other |
|---|---|---|---|
| Default | White-set: #ffffff 5%; Black-set: #000000 5% | #ffffff 50% | |
| Filled | #ffffff 10% (all sets) | #ffffff 50% | |
| Active (focus) | White-set: #ffffff 80%; Pilled-Black: #ffffff 20% | #ffffff 50% | thick ring visible in export (~2-3px outer look) |
| Error | #dc2626 (= danger-600 Light) | #dc2626 | |
| Succes | #16a34a (= success-600 Light) | #16a34a | |
| Disabled | no stroke | #ffffff 50% | whole row looks dimmed in export (Label/Add Text/Text lower opacity); exact opacity unread |

Error/Succes/Active stroke weight looks 2-3px in export vs 1px default (stroke weight not returned).

## Icons
- `material-help` (16, Top label) and `material-*` select chevron, left/right icons: `public/icons/material-*.svg` already exist; no assets dump for this page.

## Gaps
- Stroke weight, padding, gap inside Input/Left/Right not returned; assume match `input.tsx`/`input-group.tsx` per size.
- Token names for white/black alpha not resolved (use `base-alpha-*` or `white-alpha`/`black-alpha` equivalents; check color-mode.css). #2563eb = primary-600 Blue (guess).
- Disabled opacity, Active ring width/offset, text color per state not read for Black sets; Rounded-Black and Pilled-White fills/Active strokes assumed from siblings.
- Which slot layers visible per variant unreadable (visible flag only on fills); export shows only Label/Text/Add Text with Help icon.
- Text colors #ffffff hardcoded: dark-surface only; no Light/Dark mode switching in Figma.
- Pilled Extra Large radius not verified (assumed 32 like others).
- No dev dump (tree.txt) used; REST fetch not attempted.
