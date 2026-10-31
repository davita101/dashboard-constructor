# Tabs Switch spec

Page 12210:14389, slug `tabs-switch`. Fetch REST failed (script crash) → no tree.txt. Colors = hex, token unknown (guess in Gaps).
Reuse: see graph-context.md (`ui/tabs.tsx` cva variant).

## Component sets (page has 31)
| Set | id | Variants |
|---|---|---|
| Tab-Switch-Rounded-Component | 12210:14456 | State × Size × Style |
| Tab-Switch-Pilled-Component | 12213:1444 | same (assumed; not read) |
| Tab-Switch-Icon-Rounded-Component | 12210:14766 | Size × State × Style; icon-only square |
| Tab-Switch-Icon-Pilled-Component | 12213:1805 | same (assumed) |
| Switcher-Horizontal-{Rounded,Pilled}-Group (+Black, +White) | 12210:14530 (Rounded), 14351:288136 (R Black), 14421:7780 (R White), 12213:1481 (Pilled), 14316:126529 (P Black), 14351:287823 (P White) | Size × Type |
| Switcher-Icon-Horizontal-{Rounded,Pilled}-Group (+Black/White) | 14352:6739, 14429:46035, 14431:47072 (R); 12213:1896, 14428:6668, 14428:7713 (P) | assumed same |
| Switcher-Vertical-{Rounded,Pilled}-Group (+Black/White) | 14353:9175, 14435:61845, 14435:62206 (R); 12213:2618, 14435:61298, 14435:61662 (P) | assumed |
| Switcher-Icon-Vertical-{Rounded,Pilled}-Group (+Black/White) | 12214:2722, 14435:62389, 14435:62964 (R); 12214:2970, 14435:63259, 14435:63778 (P) | assumed |
Black/White group sets = group container colour theme variants (Style on items = Default/White). Playground frame 12214:4712.

## Variant props
- Tab item (Rounded, 12210:14456): State = Default, Hover, Active. Size = Extra Large (60), Large (48), Default (40), Small (32), Extra Small (28), Micro (24), Extra Micro (20), Super Extra Micro (16). Style = Default, White.
- Icon tab (12210:14766): same props; square WxH = size (60..16).
- Group: Size = Super Extra Large (76), Extra Large (60), Large (48), Default (40), Small (32), Extra Small (28), Micro (24). Type = Hug, Fill (Fill width 742).

## Item sizes (Rounded, Style=Default; w for text "Switch")
| Size | h | w |
|---|---|---|
| Extra Large | 60 | 89 |
| Large | 48 | 74 |
| Default | 40 | 66 |
| Small | 32 | 58 |
| Extra Small | 28 | 58 |
| Micro | 24 | 58 |
| Extra Micro | 20 | 39 |
| Super Extra Micro | 16 | 39 |

## Parts (read at Large 48 and group Large; others scale by size, values NOT read)
| Part | Spec |
|---|---|
| Group (Content SLOT 14111:23656) | h 48 (Large) = item 40 + padding 4 each side; fill #fafafa, stroke #e6e6e6 (1px inside), radius 12; gap 2 between items; items in SLOT (swappable) |
| Item | Large 48 standalone: w 74 h 48, padding x 20 (text at x+20? icon at x+20 too; w = 34 text + 40). In group Default 40: w 66 = 34 + 16*2; radius 8 |
| Label | Inter Bold 700, 10px, lh 16, letterSpacing 0, text "Switch" |
| Icon | `material-default-icon` instance 20x20 (placeholder circle glyph, 10x10 fill #808080); overlaps label at same x → likely hidden/toggle; icon-only set shows it alone |

## States (Style=Default)
| State | fill | stroke | label color |
|---|---|---|---|
| Default | none | none | #808080 |
| Hover | #fafafa | none | #808080 |
| Active | #ffffff | #e6e6e6 | #4d4d4d |
Icon fill #808080 in all states read. Radius 8 all states (Large). Style=White: not read (likely inverse for dark/black groups).

## Icons
Placeholder `material-default-icon` only; no assets dir (no dump).

## Gaps
- No tree.txt (figma:fetch crashed, not 429). Token names unresolved. Guess by hex, Light mode: #fafafa ~ base-50, #e6e6e6 ~ base-100, #808080 ~ base-500, #4d4d4d ~ base-700, #fff ~ white/background. Builder verify vs `src/styles/color-mode.css`/`primitives.css` (oklch).
- Radius per size, text size per size (only 10px/Bold read at Large; Large label 10px seems small, likely font-size token 10), padding per size, gap icon/label unread.
- Pilled sets: radius (likely full) and Style=White / Black group colors unread. Vertical groups layout unread.
- Icon visibility toggle, focus state, disabled state: none seen.
- Item padding at Large standalone ambiguous (74 wide = 34 + 40).
- Export image of Rounded Horizontal group (12210:14530) viewed only: 7 sizes Hug + 7 Fill, first item active, 8 items.
