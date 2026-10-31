# Text Area Editor spec
- Page 15267:48550 "❖ Forms: Text Area Editors". Slug `text-area-editor`.
- Source: TalkToFigma only. `pnpm figma:fetch 15267-48550` crashed (Node assertion in scripts/figma-fetch.mjs:192, not 429); no dump. Colors = hex, token names guessed (see Token hints).
- Ref image: export of 12116:43093 (grid cols XL/Large/Default/Small, rows Default/Filled/Active/Error/Succes/Disabled).

## Sets (4 sets, 24 variants each)
| Set | id | Radius family | Toolbar | Footer | Variant w x h |
|---|---|---|---|---|---|
| Textarea-Editor-Rounded | 12116:43093 | Rounded | yes | no | 280x200 |
| Textarea-Editor-Pilled | 12122:46791 | Pilled | yes | no | 280x200 |
| Textarea-Footer-Rounded | 11150:46313 | Rounded | no | yes | 200x200 |
| Textarea-Footer-Pilled | 11153:47817 | Pilled | no | yes | 200x200 |

Variant props (all sets): Size = Extra Large | Large | Default | Small; State = Default | Filled | Active | Error | Succes (sic) | Disabled.
Sample ids: Editor-Rounded XL Default 12116:43094, Large 12116:43208, Default 12116:43322, Small 12116:43341, XL Filled 12120:46176, Active 12120:46293, Error 12120:46410, Succes 12120:46527, Disabled 12121:46644. Editor-Pilled XL Default 12122:46792. Footer-Rounded XL Default 11150:46314. Footer-Pilled XL Default 11153:47818.
Read: Editor-Rounded all 4 sizes Default + XL all states; Footer-Rounded XL Default; Editor-Pilled XL Default. Rest assumed same pattern (Gaps).

## Structure (vertical stack: Top, Text Area box, Bottom)
| Part | Content |
|---|---|
| Top | row, space-between. Left: "Label" (Bold, #4d4d4d) + `material-help` icon 16x16, gap 8. Right: "Add Text" (Semi Bold, #999999). Height 20 (Small 16). Left pad = side pad; right 0. |
| Text Area box | fill #ffffff, stroke #e6e6e6 1px inside, radius per size. Holds Head (editor sets) + Text (+ Footer in footer sets). |
| Head (toolbar, Editor sets) | 8 icon instances 20x20 (16 Small), gap 8, left pad = side pad. Order: material-format_bold, material-format_italicon_editor, material-format_underlined, material-format_size, material-list, material-format_list_numbered, material-format_align_left, material-format_align_right. Icon color not read. |
| Text | placeholder "Text Area", Semi Bold, #4d4d4d. Width = box - side pad*2. |
| Footer (Footer sets) | 48 high at box bottom, side pad 24 (XL). Left: 3 icons 20x20 gap 8 (material-attachment, material-mic_none, material-mood). Right: Outline-Button instance 49x24 radius 6, grad fill #ffffff to #fafafa, grad stroke #ededed to #e6e6e6; icon 16 + text "Button" Bold 10/16 #333333 + Counter (Badge-Square-Pilled 16x16 radius 16, fill #ffffff, stroke #e6e6e6, "1" Bold 8/12 #4d4d4d) + trailing icon 16. Reuse existing Button/Badge. |
| Bottom | "Add Text Bottom" Semi Bold #999999, left pad = side pad, full width. Height 20 (Small 16). |

## Size table (Editor-Rounded)
| Size | Side pad | Radius (Rounded) | Head h | Text row h | Box h | Font | Line h | Toolbar icon | Top/Bottom h | Gap Top-box, box-Bottom |
|---|---|---|---|---|---|---|---|---|---|---|
| Extra Large | 24 | 16 | 44 | 44 | 128 | 12 | 20 | 20 | 20 | 16 |
| Large | 16 | 12 | 36 | 36 | 136 | 12 | 20 | 20 | 20 | 12 |
| Default | 12 | 8 | 32 | 32 | 144 | 11 | 20 | 20 | 20 | 8 |
| Small | 12 | 6 | 28 | 28 | 152 | 10 | 16 | 16 | 16 | 8 |
- Variant is fixed 200 tall; box height = remaining space (use min-h, not fixed).
- Toolbar icon step = icon + 8 gap.
- Pilled: XL radius 24 (read). Other Pilled sizes not read.
- Footer sets: XL box 128 = Text row 44 + Footer 48 (+ pad); other sizes unread.

## States (read on Editor-Rounded XL)
| State | Box fill | Box stroke | Outer ring wrapper | Text color |
|---|---|---|---|---|
| Default | #ffffff | #e6e6e6 | none | #4d4d4d |
| Filled | same as Default | same | none | #4d4d4d |
| Active | #ffffff | #cccccc | `Active` frame, stroke #808080 alpha 0.2, same radius | #333333 |
| Error | #ffffff | #dc2626 | `Error`, stroke #ef4444 alpha 0.2 | #333333 |
| Succes | #ffffff | #16a34a | `Succes`, stroke #22c55e alpha 0.2 | #333333 |
| Disabled | #fafafa | #e6e6e6 | none | #666666 |
- Ring = ~3-4px focus-like ring outside box (weight not readable; export shows it). Disabled export shows faded labels/icons (opacity not read).
- No hover/focus variants in Figma.

## Typography
Inter. "Label" Bold; "Add Text", "Add Text Bottom", "Text Area" Semi Bold. Sizes per table. Letter spacing 0.

## Token hints (Light, unverified)
#e6e6e6 base-100/150; #cccccc base-200/300; #4d4d4d base-700/800; #333333 base-800/900; #666666 base-600; #999999 base-400; #808080 alpha 20 base-alpha-20; #fafafa base-20/background-20; #ef4444 alpha 20 danger-alpha-20; #dc2626 danger-600/500; #22c55e alpha 20 success-alpha-20; #16a34a success-600/500; #ffffff background-0. Verify in src/styles/color-mode.css. Button stroke grad VariableIDs 3876:14031 / 3876:14028 (names unknown).

## Icons
No dump assets. Instances `material-*`: help, format_bold, format_italicon_editor, format_underlined, format_size, list, format_list_numbered, format_align_left, format_align_right, attachment, mic_none, mood. Check public/icons/ for existing first. Single color: CSS mask per CLAUDE.md.

## Reuse
Textarea (src/components/ui/textarea.tsx), Toggle/ToggleGroup for toolbar, Separator, InputGroup addons, Button + Badge for footer button. See graph-context.md.

## Gaps
- No token names/auto-layout paddings (fetch crashed).
- Pilled Large/Default/Small radii; Footer sets Large/Default/Small and non-Default states; Pilled non-Default states: not read.
- Active ring weight, toolbar/icon colors, Disabled opacity.
- Playground frames 15267:49582/49584/49586/49588 not read.
