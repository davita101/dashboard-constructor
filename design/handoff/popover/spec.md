# Popover spec

| Key | Val |
|---|---|
| Page | 9402:22995 |
| Set | 9494:47023 `Popover` (COMPONENT_SET) |
| Slug | popover |
| Other page nodes | Playground 11387:62799, Head-Design-System instance (ignore) |
| Dump | none (figma:fetch crashed, no REST). Colors = hex matched by name to tooltip.tsx tokens; unverified |

## Variants (8)
| Prop | Values |
|---|---|
| Type | Default, Black |
| Direction | Top, Right, Bottom, Left |

All 280x136. Ids: Default Bottom 9494:47024, Top 9494:51933, Right 9494:52024, Left 9494:52115; Black Top 9494:52666, Right 9494:52687, Left 9494:52708, Bottom 9494:52729.
Direction = notch side of box, from export: Bottom = notch top edge (popover below trigger), Top = notch bottom edge, Right = notch left edge, Left = notch right edge. Same as tooltip `side` mapping (Direction=Bottom -> side=bottom).

## Parts (Default variant, read from 9494:47024)
Root: 280x136, radius 12 (r12), fill #ffffff (`bg-background-0`), 1px inside stroke #e6e6e6 (`base-100`), vertical stack: Head 52, Content 36, Footer 48. Shadow soft (see export, like tooltip `--shadow-base`), unread.

| Part | Size/pad | Detail |
|---|---|---|
| Head | 280x52, pad 16 (content starts x+16, y+16) | row: Group (232x20) + Close |
| Group | 232x20, gap 8 | Icon 20x20 (#808080 `base-500`?), Heading text, Badge |
| Icon | 20 | "circle-dot" placeholder icon, slot swappable. Head also contains hidden alt slots (Avatar-Text, Avatar-Image, United-States flag, Mastercard-Pilled); only Icon visible. Treat as optional leading slot |
| Heading | Inter Bold 12 / lh 20, #4d4d4d (`base-700`) | "Heading" |
| Badge | Badge-Default-Pilled 45x20, radius 12 | label "BADGE" Inter Bold 8/12 #2563eb (`primary-600`), fill gradient #3b82f6 5%->15%, stroke same 10-20% alpha; existing Badge pilled default/primary |
| Close | material-close 16x16 at right, x 328-344 (pad-right 16), y 98 | ghost close icon |
| Content | 280x36, pad-x 16 | text "Content Here" Inter SemiBold 11 / lh 20, #666666 (`base-600`), width 248 |
| Footer | 280x48, pad-x 16, items-center | left counter text, right Buttons |
| Footer text | "1 from 10" Inter SemiBold 12 / lh 20, #333333 (`base-800`) | |
| Buttons | 187x32 container, right-aligned, gap 8 | Ghost-Button + Dark-Button |
| Ghost-Button "Back" | 55x32, radius 8, text Inter Bold 11/20 #4d4d4d | maps Button ghost; hidden left/right icon + counter badge slots (16x16, off) |
| Dark-Button "Next" | 50x28 (box at y170), radius 32 (pill), fill gradient #333333->#010101, stroke gradient #3b3b3b->#010101, text Inter Bold 11/20 #ffffff | maps Button dark/pilled; hidden icon + counter badge (blue gradient #357af3->#235ee6) |

## Black type (not read, from export)
Fill dark (~`base-900` / ~80% like tooltip black), no stroke visible, text white/`base-0`. Heading white, content light gray, badge gray pill, Back button gray translucent fill pill, Next button light (#f5f5f5-ish) with dark text, close icon white. Exact tokens unknown.

## Notch (arrow)
Visible in export on box edge: ~8px wide, 4px out, centered on edge (tooltip pattern: `size-1.5 rotate-45` + offsets). Not found in layers (component bbox = box only) so likely a hidden effect/clipped; exact geometry unread. Reuse tooltip arrow approach.

## States
None as variants (no hover/focus/disabled). Buttons inherit Button states.

## Assets
Icon placeholders = generic circle-dot, no SVG needed. Close: material-close, use existing close icon (check alert/dialog close). No assets/ dump.

## Code mapping
Base UI `popover` (shadcn add popover): Popover, PopoverTrigger, PopoverContent (variant default/black via cva, side = Direction), slots PopoverHeader, PopoverTitle, PopoverClose, PopoverDescription/Content, PopoverFooter, PopoverArrow. Reuse Badge, Button, Separator not needed.

## Gaps
- Black variant colors/tokens, stroke, shadow unread.
- Notch geometry/fill unread.
- Shadow of Default unread (assume tooltip `--shadow-base`).
- Close icon color/stroke, gaps (Group 8, Buttons 8) inferred from bbox positions.
- All hex->token matches unverified (REST dump missing).
- Dark mode not read.
