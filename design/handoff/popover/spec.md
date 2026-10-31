# Popover spec (REBUILD, read from Figma via TalkToFigma)

Page 9402:22995 ("❖ Popover"), slug `popover`. Page children: COMPONENT_SET 9494:47023, Playground frame 11387:62799 (not read), Head-Design-System 13776:10662, 2x Base rect.

## Sets
| Set | id | Props | Status |
|---|---|---|---|
| Popover | 9494:47023 | Type=Default\|Black; Direction=Top\|Right\|Bottom\|Left | read+exported |

Only 1 set, 8 variants, all 280x136 (+ notch outside). No state props (no hover/focus/disabled variants).

| Variant | id |
|---|---|
| Default/Top | 9494:51933 |
| Default/Right | 9494:52024 |
| Default/Left | 9494:52115 |
| Default/Bottom | 9494:47024 |
| Black/Top | 9494:52666 |
| Black/Right | 9494:52687 |
| Black/Left | 9494:52708 |
| Black/Bottom | 9494:52729 |

Direction semantics: Direction=Top = notch at BOTTOM edge pointing down (popover sits above trigger, per exports). Others by same logic: Bottom = notch top edge, Right = notch left edge?, Left = notch right edge? Visual export (0.5): Default/Right notch on right? CHECK against export; builder: verify direction-to-edge mapping visually against export of 9494:47023. Mapping read from scan: Top arrow at bottom (x~146,y~135); Bottom arrow at top (x134,y1); Right arrow at left (x1,y74); Left arrow at right (x279,y62).

## Structure (same all variants)
Root component: cornerRadius 12, 280x136, fill on `Content` child.
- `Content` frame (full 280x136, radius 12) holds fill/stroke.
  - `Head` 280x52: padding 16 (left/top), Group 20h at x16,y16: Icon 20x20 | Heading text | Badge-Default-Pilled 45x20 (radius 12); gap between Icon->Heading ~8 (Icon 96-116, Heading starts 124 black), Heading->Badge 8. Close `material-close` right edge, 16px right padding (Default 20x20 at x644; Black 16x16 at x328 relative node x80 => right pad 16).
  - `Content` 280x36: text "Content Here" at x16 (width 248), 20h; bottom pad 16.
  - `Footer` 280x48: text "1 from 10" at x16, y+6 (20h); `Buttons` frame right aligned, right pad 16 (Default 477-664 of 400-680; Black 157-344 of 80-360), gap Back->Next 4 (Default) / 8 (Black).
- Hidden/other-variant layers inside instances (Avatar-Text, Avatar-Image, United-States, Mastercard-Pilled, Counter, extra Icon) = hidden alt slots of Heading-adornment/button; ignore.
- `Arrow` VECTOR (notch) 12w x 6h, outside/overlapping card edge by ~1px.

## Colors (hex -> token, Light)
### Default
| Part | Hex | Token |
|---|---|---|
| Content fill | #ffffff | popover (= background / base-0) |
| Content stroke | #e6e6e6 | base-100 (stroke weight unread; assume 1, inside) |
| Heading icon | #808080 | base-500 |
| Heading text | #4d4d4d | base-700 |
| Content text | #666666 | base-600 |
| Footer counter text | #333333 | base-800 |
| Badge (Default-Pilled) | fill gradient #3b82f6@5% -> @15% (0d..26 hex alpha ~5%/15%); stroke gradient #3b82f6@10%->@20% | no exact token; nearest blue-alpha-10, primary-alpha-10 (stops vars 3876:14054 / 3876:14053); builder use existing Badge variant |
| Badge text/icon | #2563eb | primary-600 |
| Close icon | #808080 (material-close, size 20) | base-500 |
| Back = Ghost-Button | text #4d4d4d, icon #808080 | base-700 / base-500; use Button ghost variant (32h) |
| Next = Dark-Button | fill gradient #333333 -> #010101; stroke gradient #3b3b3b->#010101; text #ffffff; radius 32; 50x28 | base-800 -> base-900 (vars 12969:47598=#3b3b3b?, 3876:14012=base-900); use Button dark variant |

### Black
| Part | Hex | Token |
|---|---|---|
| Content fill | #000000 opacity 80% | black-alpha-80 |
| Content stroke | none | - |
| Heading icon / text | #ffffff | white (base-0) |
| Content text | #cccccc | base-200 |
| Footer text | #ffffff | base-0 |
| Badge fill | #ffffff@20% | white-alpha-20; text/icon #ffffff |
| Close icon | #ffffff, 16x16 | base-0 |
| Back = White-Soft-Button | fill #ffffff@20%, stroke #ffffff@15%, text/icon #ffffff, 51x28, radius 32 | white-alpha-20 / white-alpha-15 / white |
| Next = White-Button | fill #ffffff@90%, stroke #ffffff, text #000000@80%, icon #000000@70%, 50x28, radius 32 | white-alpha-90 / white / black-alpha-80 / black-alpha-70 |
| Counter badges (hidden) | white fill, #000000 text | - |

## Typography (Inter)
| Part | Size/lh | Weight |
|---|---|---|
| Heading | 12/20 | Bold 700 |
| Content Here | 11/20 | SemiBold 600 |
| 1 from 10 | 12/20 | SemiBold 600 |
| Button text | 11/20 | Bold 700 |
| Badge text | 8/12 | Bold 700 |

## Sizes
Card 280x136, radius 12 (r12). Head 52, body 36, footer 48. Buttons 28h (Default Back ghost 32h). Icons 20 (heading), 16 (button), close 20 default / 16 black. Notch 12x6 (arrow, fill = card fill: Default #ffffff; Black dark ~ black-alpha-80, blend on white renders ~#333).

## Icon assets
Heading icon instance 9494:51938 (default) / 9494:52671 (black): placeholder dot-ring icon (boolean op, 10x10 ring + 5x5) = generic icon slot; close icon `material-close` instance 9494:51945 (default) / 9494:52678 (black). Export SVG as needed.

## Gaps
- Shadow/effects: tool output does not return `effects`; Default exports show a faint soft drop shadow (not readable). Black has no visible shadow in export. Builder: use shadow token closest (check `shadow-*` tokens), verify visually.
- Stroke weight not returned (assume 1 inside).
- Notch fill/stroke/exact path not readable (get_node_info on Arrow nodes 9494:51934 / 9494:52686 timed out x4; SVG export returned tiny image only). Visually: solid triangle 12x6 same colour as card, centered on edge (bbox x146 in 280 card -> ~center 152? unreliable; export shows center ~142). Default notch appears to have thin e6e6e6 stroke on the two slanted sides.
- Auto-layout props (padding/gap values) tool did not return; positions inferred from bboxes.
- Playground 11387:62799 not read.
- Badge gradient has no exact token.
