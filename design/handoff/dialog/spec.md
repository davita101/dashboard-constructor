# Dialog spec

Page `9402:26501` (❖ Dialog). Slug `dialog`. Sibling: `src/components/ui/popover.tsx` (same Head/Content/Footer anatomy, reuse it).

## Sets
| Set | Node | Prop | Values | Size |
|---|---|---|---|---|
| Dialog-Popup | 9457:6527 | Type | Default (9457:6528), Black (9478:356) | 280x136 |
| Dialog-Horizontal-Popup | 9457:6717 | Style | Default (9457:6718), Black (9478:775) | 280x76 |

Default = light. Black = dark panel (dark bg, light text, inverted buttons: white Okay, gray Cancel). Black not read in detail -> Gaps.

## Dialog-Popup / Default (vertical)
Root: fill #ffffff (background-0), stroke #e6e6e6 1px inside (base-100), radius 20 (r20), shadow visible in export (effects unread). Col layout, 3 sections.
| Part | Size | Pad | Content |
|---|---|---|---|
| Head | 280x52 | 16 (x16, top 16) | Group 248x20 row: Icon 20 + Heading + Badge |
| Content | 280x36 | x16 | text 248x20 |
| Footer | 280x48 | x16, bottom 16 | Buttons row 248x32 |

Head group gap ~8 (icon 96-116, heading text box starts ~124; heading to badge 174-182 = 8).
| Layer | Detail |
|---|---|
| Icon | 20x20 slot, glyph 10x10 fill #808080 (base-500). Placeholder circle-dot glyph. Swappable icon slot |
| Heading | Inter Bold 12/20, #4d4d4d (base-700), text "Heading" |
| Badge | instance Badge-Default-Pilled 45x20, r12, blue gradient (primary alpha 5-15%), text "BADGE" Inter Bold 8/12, #2563eb (primary-600). Optional. Use existing `Badge` |
| Content text | Inter SemiBold 12/20, #666666 (base-600), "Text Dialog Here" |
| Footer gap | buttons gap 8 (64 wide + 8 + 74 wide) |
| Okay | Dark-Button instance 64x32, r32 pill, gradient #333333 to #010101, text #ffffff Inter Bold 11/20, "Okay". Use `Button` dark variant |
| Cancel | Ghost-Button instance 74x32, r32, text #4d4d4d Inter Bold 11/20, "Cancel". Use `Button` ghost variant |
Button optional parts (hidden in default): left icon 16, Counter badge, right icon 16.

## Dialog-Horizontal-Popup / Default
Same root/colors/radius, 280x76. Head (icon+heading+badge) on top, then Buttons row directly below (Okay + Cancel) without Content text. Read from export only: Okay and Cancel appear smaller (about 24 tall, tighter pad). Exact numbers unread -> Gaps. Same part tokens as above.

## Black variant (from export)
Panel dark (likely base-900/80 like popover Black), heading + text light, badge gray-ish ("BADGE" muted), Okay = white pill with dark text, Cancel = gray pill (#4d4d4d-ish) with light text.

## States
None in Figma (static; buttons carry their own states). Dialog open/close via Base UI Dialog.

## Icons
Placeholder glyph only (circle-dot, instance of icon component). No SVG assets fetched. Reuse the icon approach of popover (`--popover-icon` mask).

## Mapping
Dialog -> shadcn Dialog (Base UI): DialogContent (panel, cva variant `default|black`, layout `vertical|horizontal`), DialogHeader (icon slot, DialogTitle, optional Badge), DialogDescription (content), DialogFooter (Buttons). Reuse Popover variant tokens (`bg-background-0`, `bg-base-900/80`).

## Gaps
- `pnpm figma:fetch 9402-26501` crashed (script error/ no token or 429); no tree.txt. Colors matched by hex to tokens by name guess, unverified: #e6e6e6 base-100, #4d4d4d base-700, #666666 base-600, #808080 base-500, #2563eb primary-600.
- Black variants not read (colors, strokes).
- Horizontal variant: button sizes/pad/gaps unread.
- Shadow/effects, stroke weight (assumed 1), backdrop/overlay not in Figma.
- Auto-layout padding inferred from bboxes.
- Playground frame 11364:34819 not read.
