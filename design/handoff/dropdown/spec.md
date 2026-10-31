# Dropdown spec (REBUILD, TalkToFigma, fresh read)

Page `4290:12174` "Dropdown" | slug `dropdown` | 12 sets (6 Rounded + 6 Pilled), all read + exported. Also on page: 2 playgrounds (`11364:38798`, `16295:268771`: Light + Dark menus), `Head-Design-System` instance, 2 `Base` rects. Playground export seen.

Variants: shape = Rounded | Pilled = two parallel set families, same structure, different radii/padding. No size prop. No Dark-specific set: dark = token mode.

## Sets

| Set | Node | Variant props | Values | Status |
|---|---|---|---|---|
| Item-Dropdown-Rounded | 2692:137241 | Type, State | Type=Default; State=Default `4290:12947`, Hover `13346:68433`, Active `13347:68667`, Disabled `13347:68783` | read+exported |
| Item-Dropdown-Pilled | 16281:15167 | same | Default `16281:15168`, Hover `16281:15205`, Active `16281:15242`, Disabled `16281:15279` | read+exported |
| Item-2-Dropdown-Rounded | 12855:24785 | Type, State | Default `12855:24786`, Hover `12880:2166`, Active `13351:73979`, Disabled `13351:74010` | read+exported |
| Item-2-Dropdown-Pilled | 16292:266882 | same | Default `16292:266883`, Hover `16292:266911`, Active `16292:266939`, Disabled `16292:266967` | read+exported |
| Menu-Dropdown-Rounded | 4292:13287 | Type | Default `7118:65257` | read+exported |
| Menu-Dropdown-Pilled | 16281:15693 | Type | Default `16281:15694` | read+exported |
| Menu-2-Dropdown-Rounded | 12865:345558 | Type | Default `12859:345323` | read+exported |
| Menu-2-Dropdown-Pilled | 16294:267333 | Type | Default `16294:267334` | read+exported |
| Head-Footer-Dropdown-Rounded | 7120:55116 | Type | Default `7120:55115`, Button `7120:59041`, Form `7120:59305`, User `12855:3058` | read+exported |
| Head-Footer-Dropdown-Pilled | 16281:20393 | Type | Default `16281:20394`, Button `16281:20404`, Form `16281:20406`, User `16281:20408` | read+exported |
| Divider-Dropdown-Rounded | 14146:1331 | Type | Default `14146:1330` | read+exported |
| Divider-Dropdown-Pilled | 16281:20389 | Type | Default `16281:20390` | read+exported |

Item / Item-2 / Head-Footer / Divider = parts. Menu = container; Menu-2 = container of Item-2 rows. Item-2 = two-line item (title + description). Head-Footer = menu heading/footer row (also used as footer, e.g. "Text Footer").

## Tokens (all hexes mapped via token:hex, Light)

| Hex | Token |
|---|---|
| #ffffff | background-0 (also card/popover) |
| #e6e6e6 | base-100 |
| #f5f5f5 | base-40 (accent/muted) |
| #4d4d4d | base-700 |
| #333333 | base-800 |
| #666666 | base-600 |
| #808080 | base-500 |
| #999999 | base-400 |
| #fafafa | base-20 |
| #2563eb | primary-600 |
| #22c55e | success-500 |
| #fef8f8 | danger-25 |

## Item (Rounded `2692:137241` / Pilled `16281:15167`)

Frame 280x36 (Rounded) / 280x40 (Pilled), no fill. Child `Content` (auto layout, derived from bboxes):

| Prop | Rounded | Pilled |
|---|---|---|
| Content size | 264x28, offset x8 y4 | 264x36, offset x8 y2 |
| Content padding | 4 (all) | 8 (all) |
| Content radius | 8 | 40 (pill) |
| Row | Left + Right, space-between, h20 | same |
| Left gap icon-to-text | icon frame 28w (icon 20 + 8), text frame 86w; text starts 4 after | same, icon frame 28w, text frame 86w |

State fills on Content only:

| State | Content fill | Icon (default dot) | Title #? | Count text "140" |
|---|---|---|---|---|
| Default | none | base-500 | base-700 | base-600 |
| Hover | base-40 | base-800 | base-800 | base-600 |
| Active | base-100 | base-800 | base-800 | base-800 |
| Disabled | none | base-800 | base-800 | base-400 |

Disabled: colors identical to hover text, no fill; faded look in export (export shows ~50% grey) => layer opacity not readable = Gap. Builder: `opacity-50` (check against export).

Typography: Inter Bold 700, 11px, line-height 20 (title, count). Strokes none.

Parts (Left slots, all in component, one shown at a time; hidden ones overlap at same x; visibility not readable):

| Slot (Left) | Frame | Child | Size |
|---|---|---|---|
| Payment | 40x20 | Mastercard-Rounded instance | 32x20, base rect #ffffff (background-0) stroke #e6e6e6 (base-100) radius 6 |
| Avatar | 32x24 | Avatar-Image instance | 24x24, radius 8 (Rounded Item), 32 in Item-2; Image radius 300; includes Story ring (stroke primary-600), Status dot (6x6, success-500, radius 8), Badge (12x12, radius 16, gradient #ef4444/#dc2626, text #fef8f8 danger-25 8px bold) |
| Flag | 32x24 | United-States instance | 24x24 |
| Checkbox | 20x20 | Checkbox instance | 20x20, radius 6, fill+stroke primary-600 |
| Radio | 28x20 | Radio instance | 20x20, radius 32 (full), fill+stroke primary-600, inner dot 10x10 #ffffff radius 10 |
| Switcher | 44x20 | Switcher instance | 36x20, radius 16, fill+stroke primary-600, knob 12x12 #ffffff radius 11 |
| Icon | 28x20 | Icon instance | 20x20, glyph 10x10 dot placeholder |
| Text | 86x20 | text "Text Dropdown" | |

Right slots (right-aligned, 24w frame):

| Slot (Right) | Frame | Content |
|---|---|---|
| Text | 29x20 | count "140" |
| Right Button | 45x20 (Rounded) / 49x20 (Pilled) | Outline-Button instance 45x20 radius 6 (Pilled 32), fill gradient #ffffff -> #fafafa (background-0 -> base-20), stroke gradient #ededed -> #e6e6e6 (base-70 -> base-100, vars 3876:14031/3876:14028), icon 16 base-500, label "Button" Inter Bold 10/16 base-800, optional Counter badge 16x16 radius 16 fill #ffffff stroke #e6e6e6 text #4d4d4d (base-700) 8px bold |
| Icon | 20x20 (frame 26x20 in Pilled/Item-2) | chevron (instance `4291:13045`, children unreadable = Gap; playground: chevron-right; also X close in flag list, color base-500 per export) |
| Right Payment | 32x20 | same as Payment |
| Right Avatar | 32x24 | avatar 24x24 radius 8 |
| Right Flag | 32x24 | flag |
| Right Checkbox | 28x20 | checkbox |
| Right Radio | 28x20 | radio |
| Right Switcher | 44x20 | switcher |

Playground usage (export): lead icon + title + count + chevron (Menu Open, Paste Here); lead payment logo + "Select" outline button (Search Payment list); lead avatar + name + "Select"; lead flag + country + X icon right; plain icon lists with shortcut text right (Ctrl+\, Shift+C, Ctrl+K as Right Text).

## Item-2 (Rounded `12855:24785` / Pilled `16292:266882`)

Frame 280x74 (Rounded) / 280x82 (Pilled; Disabled Pilled 280x74 = inconsistency, Gap). Content 264x58 / 264x66, radius 8 (Rounded) / 16 (Pilled). Padding: Rounded 8 all (inner 248 wide, ~6 bottom); Pilled 12 all (inner 240). Content = Group(Icon slot 36x28 [icon 28x28] + checkbox/radio/switcher/flag/avatar/payment slots + text Group) + Text(count) + Button + Icon (right). Text Group: 2 lines.

| Line | Style | Color |
|---|---|---|
| Title "Text Dropdown" | Inter Bold 700 12px lh20 | base-800 (all states) |
| Description "Upgrade your plan for more credits" | Inter Semi Bold 600 11px lh20 | base-500 |
| Count "140" | Inter Bold 700 11 lh20 | base-400 (all states) |

State fills same as Item: Hover base-40, Active base-100, Default/Disabled none. Right: count text frame 29x20, Button 73x32 (outline 57x24), Icon frame 26x20 (icon 20x20). Disabled faded (opacity unreadable).

## Menu (Rounded `4292:13287` / Pilled `16281:15693`)

| Prop | Rounded `7118:65257` | Pilled `16281:15694` |
|---|---|---|
| Size | 280x184 | 280x212 |
| Radius | 16 | 24 |
| Fill | background-0 | background-0 |
| Stroke | 1px base-100 (inside) | same |
| Shadow | present in export (soft, drop); effect values unreadable = Gap | same |
| Content | `SLOT` frame (full size, fill #ffffff), vertical stack, no padding | same |
| Children | Head-Footer(280x40) / Divider(280x8) / Item 1 (280x36) / Divider / Item 2 / Divider / Head-Footer footer(280x40) | Divider(280x8) / Item 1 (280x40) / Divider / Item 2 / Divider |

Pilled example has no head/footer in its default variant but Head-Footer-Pilled exists. Item-1/Item-2 are Item instances (Default state; hover/active shown in playground).

## Menu-2 (Rounded `12865:345558` / Pilled `16294:267333`)

Variant 320x222 (Rounded, radius 16) / 320x270 (Pilled, radius 24); fill #ffffff background-0, stroke 1px base-100. Content SLOT: List Item 1/2/3 (Item-2 instances, 320x66 Rounded / 320x82 Pilled) separated by Divider (320x8 Rounded / 320x12 Pilled). No head/footer.

## Head-Footer (Rounded `7120:55116` / Pilled `16281:20393`)

| Type | Rounded | Pilled | Parts |
|---|---|---|---|
| Default | 280x40 | 280x40 | Left: "Text Heading" Inter Bold 11/20 base-800 (72x20); Right: Text "140" (base-600?), Right Button (53x24 / 49), Icon 24x20 (chevron). All optional |
| Button | 280x48 | 280x48 | Outline-Button full width 256x28 (Rounded, radius 6) / 248x28 (Pilled, radius 32), centered label "Button", icons 16 |
| Form | 280x48 | 280x48 | Input-Rounded 256x32 / Input-Pilled 248x32: fill background-0, stroke base-100, radius 8 (Rounded) / 32 (Pilled) |
| User | 280x64 | 280x64 | Left name "John Smith" + chevron-down, email "jhonsmith@gmail.com"; right Avatar-Image 40x40 (radius 32, Story ring 46x46 stroke primary-600, Status 8x8 success-500, Badge 16x16). Content 212x40 / 208x40. |

Heading text color base-800. User name Inter Bold ~12 base-800, email ~11 base-500 (from export, not measured = Gap).

## Divider (Rounded `14146:1331` / Pilled `16281:20389`)

Variant 283x8 (Rounded) / 283x12 (Pilled), inner `Divider-Horizontal` instance 259x1 / 251x1 (inset 12 / 16 per side), Line fill base-100. Use `Separator`.

## States
Hover/Active/Disabled only on Item + Item-2 (table above). No focus state in Figma = Gap; builder adds keyboard-focus using hover fill. Menus have no states.

## Icon assets
Lead/trail icons are a single `Icon` instance placeholder (dot, 10x10 glyph in 20x20 / 28x28). Real icons come from playground (Change List, Table Sample, About List, Text Dropdown, Credits, Knowledge, Account, Settings, Homepage, Get Help, Sing Out, Themes, Notification, Hotkeys, Referrals, Trash, Log Out, search, close X, chevron-right, chevron-down, users). Item rows used in the playground: `7118:55736` (Left Icon frame), `4291:13045` (Right Icon). Builder: export per-icon SVG from playground nodes `11364:38798` / `16295:268771` or use existing `public/icons`.

## Gaps
- Visibility per slot (Payment/Avatar/Flag/Checkbox/Radio/Switcher shown or hidden) and exact padding/gap/auto-layout props not exposed by TalkToFigma; padding derived from bboxes (Item Rounded 4, Pilled 8; Item-2 8 / 12).
- Menu shadow (effects) unreadable; use closest `--shadow-*` token by eye vs export.
- Disabled opacity unreadable; text hex equals hover.
- Right chevron/close icon colors not read (assumed base-500).
- Pilled Item-2 Disabled 74 tall vs 82 others.
- Heading "140" color in Head-Footer assumed base-600 (same as Item).
- Dark mode colors not read separately; dark playground (`16295:268771`) = same sets in Dark mode.
- Existing `src/components/ui/dropdown-menu.tsx` guesses: lead/trail slots Payment/Avatar/Flag/Checkbox/Radio/Switcher are REAL Figma slots (Left and Right); Item-2/Menu-2/Head-Footer real. Check state fills/radii vs tables above (Hover base-40, Active base-100, radii 8/16 Rounded, 40/16/24 Pilled).
