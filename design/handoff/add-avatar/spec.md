# Add Avatar spec

| Field | Value |
|---|---|
| Page | 11553:28400 |
| Set | Form-Avatar-Add 11553:39491 (1400x378) |
| Slug | add-avatar |
| Export | seen via export_node_as_image, 2 rows x 5 cols |

## Variants

- Size: Extra Large (60), Large (48), Default (40), Small (32), Micro (24)
- State: Default, With Image
- Default exists for all 5 sizes. With Image exists for all 5 sizes. Total 10 components.

| Size | Component ids (Default / With Image) |
|---|---|
| XL 60 | 11553:39451 / 11553:39641 |
| L 48 | 11553:39459 / 11553:39700 |
| M 40 | 11553:39467 / 11553:39756 |
| S 32 | 11553:39475 / 11553:39795 |
| Micro 24 | 11553:39483 / 11553:39820 |

## Layout

Root: vertical, gap 16 (XL), 12 (L), 8 (rest). Children `Head` then `Content`.
Content: horizontal, gap 16 (XL), 16 (L), 16 (M, S, Micro: 8). Avatar left, buttons right, vertically centered.

| Size | Avatar | Placeholder icon | Head h | Label font | Help icon | Button h | Btn text | Btn icon | Btn pad-x |
|---|---|---|---|---|---|---|---|---|---|
| XL | 60 | 24 | 20 | 12 bold, lh 20 | 16 | 40 | 12/20 | 20 | 16 |
| L | 48 | 24 | 20 | 12 bold, lh 20 | 16 | 32 | 11/20 | 16 | 12 |
| M | 40 | 24 | 20 | 12 bold, lh 20 | 16 | 24 | 10/16 | 16 | 8 |
| S | 32 | 20 | 16 | 10 bold, lh 16 | 12 | 24 | 10/16 | 16 | 8 |
| Micro | 24 | 16 | 16 | 9 bold, lh 16 | 12 | 24 | 10/16 | 16 | 8 |

Button gap to avatar: 16 (XL, L, M), 8 (S, Micro) inferred from bboxes (XL 156-140, L 466-450, M 736-724 = 12, S 976-968 = 8, Micro 1204-1196 = 8). M is 12.
Button inner gap ~6 (icon 172 to text frame 172, text x 178). Inferred.

## Parts

| Part | Details |
|---|---|
| Head/Label | Text "Label", Inter Bold, fill #666666 (token unknown, likely base-600 or base-500) |
| Head/material-help | Icon instance, help circle, sizes in table |
| Avatar (Default) | Frame circle (radius 60), fill #ffffff (background-0), stroke #e6e6e6 (likely base-100/200), inner material-account_circle icon |
| Avatar-Image (With Image) | Instance of existing Avatar component: Image (fill IMAGE, circle), Story ring (ellipse stroke #2563eb, +3px outset), Progress ring (stroke #3b82f6 a20 + #2563eb), Status dot (#22c55e, 8px; 6px Micro), Badge-Square-Pilled (red gradient #ef4444 to #dc2626, 16px; 12px S/Micro). Story, Progress, Status, Badge visibility not readable: likely hidden in this use |
| Outline-Button "Select Image" | Default state. Instance of Outline-Button, radius 32 (pill), fill gradient #ffffff to #fafafa (top to bottom), stroke gradient #ededed to #e6e6e6 (vars 3876:14031 / 3876:14028), text #333333 (likely base-800) Inter Bold. Leading Icon, Text, Counter, two trailing icons (counter/trailing hidden, visibility unknown) |
| Outline-Button "Chnage Image" (typo in Figma, use "Change Image") | With Image state only, XL; other sizes show text "Select Image" in Figma (likely not edited). Use "Change Image" everywhere |
| Outline-Button icon-only (remove) | With Image state. Square: 40 XL, 32 L, 24 M/S/Micro, radius 32, same fill/stroke, inner Icon 20/16/12/12/12 (close/x look) |

## States

- Default: placeholder avatar + 1 button.
- With Image: avatar image + button (change) + icon-only remove button.
- No hover/focus/disabled variants in Figma.

## Assets

- No figma-dump (pnpm figma:fetch crashed: Node assert in scripts/figma-fetch.mjs:192, UV_HANDLE_CLOSING, likely not 429). Icon SVGs not fetched.
- Icons needed: material-account_circle (placeholder), material-help, close/x (remove), upload/image icon in button leading slot (shape unknown from export).
- Sample image: photo of woman, unknown source.

## Gaps

- Token names unresolved: matched by hex only. Light neutral gray hex values not checked against src/styles/primitives.css.
- Layer gaps/padding derived from bboxes, not auto-layout props.
- Visibility of hidden layers (Counter, trailing icons, Story, Progress, Status, Badge) unknown.
- Stroke weights, effects (shadows on button) unknown.
- Button leading icon shape unknown.
- Reuse: Outline-Button and Avatar-Image likely already exist in design-system (button, avatar slugs).
