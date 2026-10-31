# AI Input spec

page 12814:6371 ("Forms: AI"), slug `ai-input`. 7 sets, 1 page = 1 `/design-system/ai-input`.
REST dump absent (`pnpm figma:fetch 12814-6371` crashed, likely 429). Colors = hex matched to Light tokens, marked "likely". Padding/gap derived from bbox.

## Sets

| Set | Node | Variants | Size |
|---|---|---|---|
| AI-Form-Chat | 12843:212077 | State=Default/Hover/Active x Image=No; With Image (Image=Yes)/Hover/Active x Image=Yes. 6 comps | 280x166 |
| AI-Form-Chat-White | 14637:2856 | same 6 variants (ids 14637:2857..2916). dark/blue-bg theme | 280x166 |
| AI-Mini-Form | 12843:215046 | State=Default 12843:215047 / Hover 13704:9100 / Active 13704:9114 | 280x56 |
| AI-Mini-Form-White | 14650:6015 | same 3, dark theme | 280x56 |
| AI-Create-Form | 14780:3643 | State=Default/Hover/Active/Error x Image=No (14780:3644, 14790:8942, 14780:3664, 14812:2047) | 280x166 (Error 280x202) |
| AI-Create-Form-White | 14816:3676 | same 4, dark theme | same |
| Attachment | 14794:5059 | State=Default/Hover x Style=Default/Black (14794:5058, 14798:574, 14816:3855, 14816:3860) | 121x28 |

White = Chat/Mini/Create on dark gradient bg (export: blue gradient page bg). Black attachment style = for White forms. White-set internals not read (only exports); gap.

## Shared shell (Content frame)

| Prop | Chat / Create | Mini |
|---|---|---|
| radius | 20 (r20 if exists else arbitrary) | 40 (pill) |
| fill | #ffffff = background-0 | same |
| stroke 1 inside | Default #e6e6e6 (base-100 likely); Hover #d9d9d9 (base-150 likely?) ; Active #cccccc (base-200 likely) | same |
| padding | 20 all (content 240 wide) | 12 all, h56, content 256 |
| gap | text to footer ~12; attachments row to text 12 | row gap ~8 between left group and right group (space-between) |

Active: extra outer ring frame "Active", stroke #808080 alpha 0.2, same radius as shell (r20 / r32), ring ~3-4px outside (looks thick in export). Token likely base-alpha-20-ish; unknown.
Hover: only stroke change + text color change.

## Parts

### Chat (12843:212077)
| Part | Spec |
|---|---|
| Text (placeholder) "Assign a task or ask anything" | Inter 600 12/20; Default #4d4d4d (base-700 likely), Hover #4d4d4d?, Active/placeholder color gap. 240x82 area (textarea, grows) |
| Footer | h32, 240 wide, space-between, 2 groups |
| Left group | 2 Outline-Button icon 32 (gap 8, w72): plus, tune/settings-like icon |
| Right group | Outline-Button icon 32 (mic) + Dark-Button icon 32 (arrow-up, send), gap 8, w72 |
| Attachments row (Image=Yes) | row of 2 image-only attachments (thumb ~ 32? shows 2 photo thumbs 32x32 r8-ish) above text; sizes not read; gap |

### Mini (12843:215046)
| Part | Spec |
|---|---|
| Left group | Outline-Button icon 32 (plus) + text "Ask anything" Inter 600 12/20, Default #666666 (base-600 likely), Hover/Active #4d4d4d; gap 8 (116w) |
| Right group | Outline-Button icon 32 (mic) + Dark-Button icon 32 (arrow-up), gap 8 |

### Create (14780:3643)
| Part | Spec |
|---|---|
| Attachment row | frame 198x28, 2 Attachment instances 95x28, gap 8, top padding 20 |
| Text "To Build Site" | Inter 600 12/20, Default #808080 (base-500 likely = placeholder), Hover/Active/Error #666666; box 240x42-54 |
| Footer | h32. Left: Outline-Button icon 32 (plus) + Outline-Button 91x32 "GPT" (leading icon 16 globe-like, label Inter 700 11/20 #333333 = base-800 likely, trailing chevron icon 16, "Counter" frame 20x16 hidden?) gap 8 (131w). Right: Dark-Button icon 32 arrow-up |
| Menu-Dropdown-Rounded x2 (instances 240x116, 240x152, r16, stroke #e6e6e6) | overflow/hidden menus under form (model picker). Not visible in exports; likely hidden. Reuse existing dropdown if any; gap: visibility |
| Error | form fill #fef2f2 (danger-50 likely), stroke #ef4444 alpha .2 (danger-alpha-20 likely), r20, total h202. Extra Footer 280x32 below content: material-info icon 16 + label "File Type now Allowed" Inter 600 10/16 #ca2121 (danger-600/700 likely), right "Dismiss" same style #ca2121. padding x12, y8 |

### Attachment (14794:5059)
| Part | Spec |
|---|---|
| Root | h28, w121 hug, radius 8, stroke 1 #e6e6e6, fill #fff (Default). Padding 4, gap 6 |
| Icon | material-upload_file 20x20 (gray, file with up-arrow) |
| Image | 20x20 r4 thumbnail (image fill) |
| Label | "Design.md" Inter 600 11/20 #333333 (base-800 likely) |
| Hover | adds Close slot: 66x26 frame at right, left to right gradient white alpha 0.2 -> 0 fade, containing Danger-Button icon 20x20 r32 (red gradient #ef4444->#e53535, X icon 16), overlays label end |
| Style=Black | fill #fff alpha 0.2, stroke #fff alpha 0.1, label #ffffff; Hover same + close |
| Image-only compact variant | export shows thumb-only and thumb+close; nodes not in set (Hover/Black?). Gap |

## Reuse
Buttons: existing `button.tsx` variants `outline`, `dark`, `danger` sizes `icon-32` / `32` (confirm `danger` icon-20 size exists: `icon-20`?). Textarea: `textarea.tsx`. Attachment likely new ui part (`file-upload-item.tsx` exists, check). Alert-ish error footer: custom slot.

## Icons (no assets dump)
plus, tune/settings, mic, arrow-up (send), globe (GPT), chevron-down, material-upload_file, close X (16), material-info. Fetch via `pnpm figma:fetch` when 429 clears; else existing icon set. Image fills (2 thumbs) = placeholder photos, need assets.

## States
Default/Hover/Active as above. Error (Create only). Attachment hover shows close. Disabled absent. Focus = Active ring.

## Gaps
- No tree.txt: token names inferred from hex; hex->token "likely" only.
- White-set inner values not read (assume same layout, dark colors per exports: bg gradient blue page, form fill ~white alpha .1-.2, white text, send button white fill with dark arrow; Active+Image send button black).
- Chat Image=Yes thumb size/gap not read; Chat Active text color not read.
- Shadows/effects, exact ring width, padding (derived from bbox) unverified.
- Menu-Dropdown-Rounded visibility and contents unread.
- Counter frame in GPT button: hidden/empty?
- Dismiss clickable? presumed link-button.
