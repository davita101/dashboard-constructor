# File Upload spec
Page `9402:22988` ("Forms: File Upload"). Slug `file-upload`. Source: TalkToFigma only (no tree.txt, REST not tried). Colors hex; token = Light-mode guess, unverified (see Gaps).
Page has 4 sets (below) + Playground `11364:39103`. Reuse existing: `src/components/ui/file-input.tsx`, `progress*.tsx`, `button.tsx`, `separator.tsx`, `input-group.tsx`, `card.tsx`. Context `design/handoff/file-upload/graph-context.md`.

## Sets
| Set | id | Variants |
|---|---|---|
| Form-Upload-Files | `9411:3320` | State = Default `9411:3319`, Hover `11954:8518`, Drag `9411:3321`, Focused `11954:8529`, Error `9411:3334`, Disabled `9411:3360` |
| Form-Upload-Files-Images | `11954:8561` | same 6 States; Default `11954:8562`. Differs: badge icon = image, badge tinted blue (not white), hint text "PNG, JPG, GIF up to 10MB" |
| File-Item-Component | `9413:3004` | Type = Upload `9413:3000`, Progress `9413:3001`, Error `11956:18399`, Done `9413:4057` |
| Add-Files-Card | `11956:18823` | State = Default `11956:18479` (320x412), Uploading `11956:18651` (320x688) |

## Form-Upload-Files (dropzone) 280x232
Layout: Label row (280x20) + Content box (280x200). Gap 12 (label y80-100, box y112).
| Part | Size | Style |
|---|---|---|
| Label row | 280x20 | text "Label" Inter Bold 12/20 `#333333` (base-800?) + `material-help` 16x16 icon (`public/icons/material-help.svg`) gap ~8 |
| Content | 280x200 | radius 12 (r12), bg `#ffffff`, stroke `#cccccc` DASHED (export shows dashes; dash/weight not readable), children centered column |
| Badge-Icon-Pilled | 40x40 | radius 32 (full), bg `#ffffff`, stroke `#e6e6e6`; Icon 20x20 = `material-insert-drive-file` (file doc icon, grey) |
| Text block | 176x44 | Head 176x20: "Drag & Drop Files or " Inter Bold 11/20 `#333333` + "browse files" Inter Bold 11/20 `#2563eb` (primary-600?). Hint "Max File Size 256MB" Inter Bold 10/16 `#b3b3b3` (base-300?) |
Gap badge to text block approx 12-16 (not exposed).

States (Content box unless noted; label/text same as Default unless noted):
| State | bg | stroke | Other |
|---|---|---|---|
| Default | `#ffffff` | `#cccccc` dashed | - |
| Hover | `#f7f7f7` | `#b3b3b3` dashed? (export: grey bg, light dashed) | - |
| Drag | `#fafafa` | `#2563eb` dashed | blue dashed border |
| Focused | `#fafafa` | `#2563eb` SOLID (export) | solid blue border |
| Error | `#ffffff` | `#dc2626` dashed | badge = red tint bg, icon `Icon` red file (instance `11567:21282`, no fill on badge: tinted danger), hint text `#dc2626` (danger-600?) |
| Disabled | `#ffffff` | `#e6e6e6` | whole comp faded (~50%, node opacity not exposed); text colours same hex |

### Images variant (`11954:8561`)
Same layout/states. Badge fill none (tinted: Default light blue bg, Error light red bg, Disabled faded blue), icon = image (material-image-like, blue; red in Error). Hint "PNG, JPG, GIF up to 10MB" (same type as Max File Size). Error hint red. Needs image icon asset (not in `public/icons`).

## File-Item-Component 280x48
Pill: radius 28, bg `#ffffff`, stroke `#e6e6e6`. Content 264x32 (padding 8 all sides; gap between Left and Right = auto/space-between). Left: Badge-Icon-Pilled 32x32 (r16 full, tinted) + text col (File Name Inter Bold 10/16 `#333333`; sub-line). Right: actions.
| Type | Badge / icon | Text | Right |
|---|---|---|---|
| Upload | blue tint, icon upload-arrow 16x16 (`10446:594117`) | name `#333333`; sub "5.6mb of 24mb" Inter SemiBold 10/16 `#808080` (base-500?) | Progress-Circular 24x24 (ring track `#3b82f6` @10%, arc `#2563eb`, 9 steps 5/10/25/35/50/60/75/90/100%) + Outline-Button 32x32 close (16x16 icon `4284:68095`, `material-close`) gap 12 (68 wide) |
| Progress | same as Upload | name; below it Progress row 192x16: Progress-Line 154x2 (track light, fill `#2563eb`) + "64%" Inter Bold 10/16 `#2563eb` (Line has own 100% label 8/12 hidden) | Outline-Button close only |
| Error | red tint, icon `10446:594133` (upload/error, red) | name `#dc2626`; sub "File Too Large. Try another one." Inter Bold 9/16 `#dc2626` | retry icon 20x20 (`11956:33389`, refresh/replay arrow, in 28x32 frame) + Outline-Button close |
| Done | green tint, icon `10446:594121` (upload arrow green) | name `#16a34a` (success-600?); sub "5.6mb of 24mb" `#808080` | `material-done` 20x20 check (green) + Outline-Button close (64 wide) |
Outline-Button 32x32 radius 32: existing `ButtonIcon` outline variant 32.

## Add-Files-Card (modal card)
320 wide. Bg `#ffffff`, stroke `#e6e6e6`, radius 20, padding 20, gap ~16 (stack: Head 24, dropzone 232, divider 16, input 40; +20 label + 216 list for Uploading).
| Part | Spec |
|---|---|
| Head 280x24 | "Upload Files" Inter Bold 14/24 `#333333`; Close 20x20 (`material-close`) right |
| Dropzone | instance of Form-Upload-Files, label overridden "Add the file below" Inter SemiBold 12/20 |
| Divider-Horizontal 280x16 | line `#d9d9d9` 1px + "Or" Inter Bold 10/16 `#4d4d4d` center. Use `Separator` w/ text |
| Input-Pilled 280x40 | pill r32, bg `#ffffff`, stroke `#e6e6e6`; left link icon 20 (`material-link`), text "Add form URL" Inter SemiBold 11/20 `#4d4d4d`; right Button "Add File" 64x24 Inter Bold 10/16 `#333333` (outline/pilled). Reuse `input-group.tsx` |
| Uploading only | "Uploading Files" Inter Bold 12/20 `#424242`; Files SLOT 280x216 = 4 File-Item (Upload "Image.png", Progress, Error, Done), gap 8 (4x48+3x8=216) |
Card Default 412 tall; Uploading 688 tall.

## Icon assets
Existing `public/icons/`: `material-close.svg`, `material-help.svg`, `material-insert-drive-file.svg`. Missing (not downloaded; no assets dir): upload arrow, image, refresh/retry, done/check, link. Check `material-check`, `material-attachment`, `material-add` if present per graph-context; else fetch via `pnpm figma:fetch 9402-22988` (or export SVG per node `export_node_as_image` format SVG).

## Gaps
- Token names unresolved; hex to token guesses only (#333333 base-800, #4d4d4d base-700, #808080 base-500, #b3b3b3 base-300, #cccccc base-200, #e6e6e6 base-100, #f7f7f7 base-50, #fafafa base-25, #2563eb primary-600, #dc2626 danger-600, #16a34a success-600, #3b82f6 primary-500). Verify vs `src/styles/color-mode.css`.
- Stroke weight, dash pattern, padding, gaps not exposed by TalkToFigma (no auto-layout fields). Padding/gap values above estimated from sizes.
- Tinted badge fills (blue/red/green) for Images/Error/Done not exposed (fills None on instance); infer from export: primary-50/danger-50/success-50.
- Disabled opacity unknown. Hover/focus ring/shadow effects unreadable.
- Progress-Line fill width/track color unreadable; Progress-Circular arc step per percent.
- Playground `11364:39103` not inspected.
