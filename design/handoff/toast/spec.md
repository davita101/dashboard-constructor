# Toast spec
Page 6978:41509 ("❖ Toasts"). Component Toast. Slug toast. Maps to Alert (ui/alert.tsx), not shadcn toast.
Page also has: Base rect 16093:100285, "🎮 Playground" frame 11717:573508 (unread), Head-Design-System instance (ignore).

## Sets
| set | id | props | status |
|---|---|---|---|
| Toast | 6978:41848 | Style = Default (6978:41840), Black (6979:47781) | read Default, exported set |

Only 1 set. Black variant unread: same structure, inverted colors (dark bg, light text; see export: dark bg, white "Okey" btn, grey "Cancel" btn). Black hex values = Gap.

## Variant Default (300x124, fill #ffffff, stroke #e6e6e6, radius 20)
Vertical: Head 300x40, Content 300x84.
| part | id | size/layout | style |
|---|---|---|---|
| Head | 6978:41710 | 300x40, padding x12 y12, space-between, stroke #e6e6e6 (bottom divider likely) | |
| Head.Left | 6978:41711 | 57x16, icon + label, gap 8 | |
| icon material-default-icon | 6978:41712 | 16x16, inner circle 8x8 | fill #808080 |
| title "Toasts" | 6978:41713 | | Inter 600 10px/16, #333333 |
| Head.Right | 6978:41714 | 50x16, time + close, gap 12 | |
| time "11 m" | 6978:41715 | | Inter 600 10/16, #808080 |
| close material-close | 6978:41716 | 16x16 icon | color unread |
| Content | 6978:41717 | 300x84, pad 12, gap 12 (text y92, buttons y124), fill #ffffff | |
| message | 6978:41718 | 276x20 | Inter 600 11/20, #4d4d4d |
| Buttons | 6978:41729 | 276x28, row gap 8, two buttons each 134x28 | |
| Dark-Button "Okey" | 6978:41724 | 134x28 radius 32, pad-left 8 icon 16, gradient fill #333333→#010101 top-down, stroke gradient same | text Inter 700 11/20 #ffffff; = Button variant dark |
| Outline-Button "Cancel" | 6978:41725 | 134x28 radius 32, gradient fill #ffffff→#fafafa, stroke gradient #ededed→#e6e6e6 | text Inter 700 11/20 #333333; icon #808080; = Button variant outline |
Button optional parts (hidden in export): left Icon, Counter Badge-Square-Pilled (16x16 radius 16; dark btn badge gradient #357af3→#235ee6 text #f7faff 8/12 bold; outline btn badge fill #ffffff stroke #e6e6e6 text #4d4d4d), right Icon. Reuse existing Button/Badge.

## Tokens
Token names unresolved (no tree.txt; figma:fetch crashed, Node assertion error, not 429). Map hex to Light tokens in src/styles/color-mode.css: #e6e6e6 border, #333333 title, #808080 muted, #4d4d4d body, #ffffff bg. Variable aliases seen: stroke stops VariableID:12969:47598, 3876:14012 (dark btn), 3876:14031, 3876:14028 (outline btn).

## States
None in variants. Only Style. Hover/focus unread.

## Icons
Placeholder circle icon (material-default-icon) and material-close in instances; no assets fetched (no dump). Reuse AlertIcon/AlertClose.

## Gaps
- Black variant values unread.
- Padding/gap inferred from bboxes (12 padding, 8 gap in buttons).
- Head stroke sides unknown (assume bottom).
- Close icon color, shadows/effects not read.
- Playground frame unread.
- Token names unresolved.
