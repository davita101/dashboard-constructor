# Dropdown spec

Page 4290:12174, slug `dropdown`. Dump/REST fetch failed (script crash, once) so colors = hex only, mapped to gray ramp by guess. Sizes from TalkToFigma.
Every set has 2 shape families: Rounded + Pilled (Pilled = bigger radius, +4px height on item). Same structure, treat as `shape` variant (`rounded` | `pilled`).

## Sets (node ids)
| Set | Id | Variants | Size (rounded / pilled) |
|---|---|---|---|
| Item-Dropdown-Rounded | 2692:137241 | Type=Default x State=Default,Hover,Active,Disabled (4290:12947, 13346:68433, 13347:68667, 13347:68783) | 280x36 |
| Item-Dropdown-Pilled | 16281:15167 | same 4 (16281:15168/15205/15242/15279) | 280x40 |
| Item-2-Dropdown-Rounded | 12855:24785 | Type=Default x same 4 (12855:24786, 12880:2166, 13351:73979, 13351:74010) | 280x74 (title+description) |
| Item-2-Dropdown-Pilled | 16292:266882 | same 4 (16292:266883/266911/266939/266967) | 280x82 (disabled 74) |
| Menu-Dropdown-Rounded | 4292:13287 | Type=Default (7118:65257) | 280x184 |
| Menu-Dropdown-Pilled | 16281:15693 | Type=Default (16281:15694) | 280x212 |
| Head-Footer-Dropdown-Rounded | 7120:55116 | Type=Default 7120:55115 (280x40), Button 7120:59041 (280x48), Form 7120:59305 (280x48), User 12855:3058 (280x64) | |
| Head-Footer-Dropdown-Pilled | 16281:20393 | Default 16281:20394, Button 16281:20404, Form 16281:20406, User 16281:20408 (same sizes) | |
| Menu-2-Dropdown-Rounded | 12865:345558 | Type=Default (12859:345323) | 320x222 |
| Menu-2-Dropdown-Pilled | 16294:267333 | Type=Default (16294:267334) | 320x270 |
| Divider-Dropdown-Rounded | 14146:1331 | Type=Default (14146:1330) | 283x8 |
| Divider-Dropdown-Pilled | 16281:20389 | Type=Default (16281:20390) | 283x12 |

Also on page: Playground frames 11364:38798, 16295:268771; Base rects 16295:273083, 16295:268027 (bg).

## Parts
### Item (Item-Dropdown-Rounded default, 4290:12947)
| Part | Spec |
|---|---|
| Root | 280x36, outer pad 4 (content 264x28 at x+8/y+4 so root probably has 8/4 pad). Content frame r8 (pilled: larger, unknown) |
| Content | horizontal, space-between: Left + Right. inner pad 4 horizontal |
| Left | gap 4; optional lead slot (one of) + Text |
| Lead slots (all 20-24px tall, instances) | Icon 20 (fill #808080), Payment (Mastercard-Rounded 32x20 r6 stroke #e6e6e6), Avatar (Avatar-Image 24 r8 + status dot 6 #22c55e + badge 12), Flag (United-States 24), Checkbox 20 r6 fill #2563eb, Radio 20 (inner 10 white), Switcher 36x20 r16 (thumb 12) |
| Text | "Text Dropdown" Inter Bold 11/20, #4d4d4d |
| Right | optional trail slot (one of) + value text "140" Inter Bold 11/20 #666666 |
| Trail slots | Right Button (Outline-Button 45x20 r6, stroke #ededed->#e6e6e6 gradient, fill #fff->#fafafa, label Inter Bold 10/16 #333333, icons 16 #808080, counter badge 12), Icon 20 (chevron, default visible in export), Right Payment, Right Avatar, Right Flag, Right Checkbox, Right Radio, Right Switcher |
| Visible in export | lead Icon + Text + trailing chevron icon only; other slots are hidden variant-props (visibility not readable) |

### Item-2 (12855:24785)
Same as Item but 74 high: Title ("Text Dropdown" bold) + description "Upgrade your plan for more credits" (smaller, lighter gray, ~Inter Medium 10-11). No lead icon in export. Hover/Active/Disabled same fills as Item.

### Menu (4292:13287)
Card 280x184: Heading "Text Heading" (bold, Head-Footer Default) / Divider / Item x2 (lead Icon + chevron) / Divider / Footer "Text Footer". White fill, soft shadow (shadow-base likely), outer radius larger than item (unknown, ~12-16), pad ~8.

### Menu-2 (12865:345558)
Card 320x222, same chrome, composed of Item-2 rows and dividers (not exported; structure unread).

### Head-Footer (7120:55116)
| Type | Content |
|---|---|
| Default 280x40 | "Text Heading" bold + right: "140" value + Button (Outline-Button small) + chevron |
| Button 280x48 | full-width outline button "Button" |
| Form 280x48 | input "Text" with stroke, r8-ish |
| User 280x64 | name "John Smith" bold + chevron-down, email "jhonsmith@gmail.com" gray, Avatar 40ish right (story ring, circular crop) |

### Divider
1px line, 283x8 rounded / 283x12 pilled (vertical margin 3.5 / 5.5), color ~ #e6e6e6.

## States (Item, Item-2)
| State | Look |
|---|---|
| Default | transparent bg, text #4d4d4d, icon #808080 |
| Hover | bg light gray (~#f5f5f5, guess base-50/background-*), text same, icon darker |
| Active | bg gray (~#e6e6e6, guess base-100), full rounded content |
| Disabled | text and icon faded (opacity ~0.5, guess), no bg |
Focus: not present in Figma.

## Token guess (hex -> neutral gray ramp, Light)
#4d4d4d ~ base-700/800, #666666 ~ base-600, #808080 ~ base-500, #e6e6e6 ~ base-100/200, #fafafa ~ base-50, #2563eb = primary-600 (blue), #22c55e success-500, #ef4444 danger-500. Verify in color-mode.css.

## Icons
No assets fetched (`design/figma-dump/4290-12174` missing). Slot icons are generic Icon instances (gear/circle placeholder 20px, chevron right 16/20). Flag = United-States asset needed; Mastercard 32x20 asset needed. Reuse existing icon/avatar/checkbox/radio/switch/badge/button components from other done pages.

## Gaps
- REST fetch crashed: no tree.txt, no token names, no paddings/gap exact, no effects (card shadow, radii of pilled).
- Hidden slot visibility per variant not readable; Item slots (lead/trail) props unknown.
- Pilled radii, Menu/Menu-2 internal layout, Item-2 text sizes/colors, Hover/Active/Disabled exact fills, disabled opacity not read.
- Playground frames (11364:38798, 16295:268771) not inspected.
