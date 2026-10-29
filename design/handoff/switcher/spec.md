# Switcher — handoff spec

Page: 8985:342542 (Forms: Switcher). Slug: `switcher`. Four component sets. Read via TalkToFigma (get_node_info); the REST dump was rate limited (429), so no token names. Hex values below are Figma; token guesses are matched to Neutral Light tokens (same method as Checkbox/Radio).

Images in this folder: `switcher.png` (457:75), `switcher-text.png` (9433:3537), `switcher-text-card.png` (9435:3720), `switcher-card.png` (9427:4066).

## 1. Switcher (457:75) — the toggle itself
Variants: Style = Primary | Primary Dark; Status = On | Off | On Disabled | Off Disabled; Size = Default (20) | Small (16). 16 components.

Geometry (all radius 16 = pill; stroke inside, weight unreadable, assume 1):
- Default (20): track 36x20, knob "Base" 12x12 (cornerRadius 11, circle), inset 4px (Off: knob at left, x+4; On: knob right, x+20).
- Small (16): track 32x16, knob 12x12, inset 2px (Off left x+2; On right x+18). Knob is the same 12px in both sizes.

Colors (fill / stroke / knob):
| Style | Status | Track fill | Track stroke | Knob | Token guess |
|---|---|---|---|---|---|
| Primary | On | #2563eb | #2563eb | #ffffff | primary-600 |
| Primary | Off | #e6e6e6 | #e6e6e6 | #ffffff | base-100 |
| Primary | On Disabled | #3b82f6 @30% | #3b82f6 @30% | #ffffff | primary-500 / alpha 30 |
| Primary | Off Disabled | #f7f7f7 | #f0f0f0 | #e6e6e6 | base-30 / base-60 (as Checkbox disabled), knob base-100 |
| Primary Dark | On | #010101 | #333333 | #ffffff | base-900 / base-800 |
| Primary Dark | Off | #e6e6e6 | #e6e6e6 | #ffffff | same as Primary Off |
| Primary Dark | On Disabled | #010101 | #010101 | #ffffff | base-900 (looks greyed in export, so likely an opacity not readable; see Gaps) |
| Primary Dark | Off Disabled | #f7f7f7 | #f0f0f0 | #e6e6e6 | same as Primary Off Disabled |

(The export shows Primary Dark On Disabled as light grey: the fill/opacity is probably set on the instance; read as ~opacity 30-40%.)

States: only On/Off/disabled; no hover/focus variants in Figma. No icon inside the knob.

## 2. Switcher-Text (9433:3537)
Variants: Type = Horizontal | Vertical; State = Active | Default | Dislabled (sic). 6 components. Uses Switcher Default (20) Primary Dark: Active = On, Default/Dislabled = Off (Vertical Dislabled uses Off Disabled colors; Horizontal Dislabled still shows plain Off, as in Checkbox).
Parts:
- Switcher 36x20 at left.
- Content frame at x+48 (gap 12 from switcher).
- Main Text: Inter SemiBold 12/20. Additional Text: Inter SemiBold 12/20, #808080 (base-500).
- Horizontal: 201x20, Main and Additional side by side, gap 8 (Main width 57, Additional starts +65). Content 153 wide.
- Vertical: 136x44, Additional below Main, gap 4 (content height 44).
Text colors: Main Active #010101 (base-900); Default #333333 (base-800); Dislabled Horizontal #999999 (base-400), Vertical #808080 (base-500). Additional #808080 in all.

## 3. Switcher-Text-Card (9435:3720)
Variants: Type = Horizontal | Vertical; State = Default | Active | Dislabled. 6 components. Same inner parts as Switcher-Text (Main text always #010101 except disabled #999999).
- Horizontal: 233x36, radius 28 (pill), padding 8, gap 12, switcher 36x20, content 153x20, gap 8 between texts. Right padding is ~20 (content narrower than box), code can use p-2 + right slack.
- Vertical: 233x68, radius 16, padding 12, gap 12, content 149x44 (text gap 4).
- Fill: Default #ffffff (background / base-0); Active #ffffff; Dislabled #fafafa (background-20).
- Stroke: Default #e6e6e6 (base-100); Active #808080 @50% (base-alpha-50); Dislabled #e6e6e6.
- Switcher: Default Off (#e6e6e6), Active On Dark (#010101/#333333), Dislabled Off Disabled (#f7f7f7/#f0f0f0, knob #e6e6e6).

## 4. Switcher-Card (9427:4066)
Variants: Type = Vertical only; State = Default | Active | Dislabled. 3 components, 320x108, radius 16, padding 16 (content 76 tall: 16+76+16), gap 16 between media and content.
Parts (left to right):
- Media slot: `material-default-icon` 24x24 (visible by default, glyph #808080, 12x12 ring-dot). Hidden alternatives stacked at the same position (visibility unreadable): Badge-Icon-Pilled 32x32 (white, stroke #e6e6e6, 16px icon #808080), Visa-Rounded 38x24 (r6, white, stroke #e6e6e6, logo #1a1f71), Avatar-Image 32x32 (story ring #2563eb, progress, status dot #22c55e 8x8, Badge-Square-Pilled 12x12 red gradient #ef4444 to #dc2626, text #fef8f8 Inter Bold 8/12), Avatar-Text 32x32 (gradient #3b82f6 5%-15%, stroke #3b82f6 @20%, letter "M" #2563eb Inter Bold 10/16), BTC-Bitcoin 28x28, United-Kingdom flag 28x28.
- Content frame x+44, width 188: Main Text (12/20 SemiBold #010101), gap 8, Additional Text (12/20 SemiBold #808080), gap 8, Links row.
- Links row 188x20: Link instances (cornerRadius 20, 23 wide), gap 16 between them; each Link = optional Left Icon 20, text "Link" Inter Bold 11/20 #666666, optional counter Badge-Square-Pilled 16x16 (white, stroke #e6e6e6, text #4d4d4d Inter Bold 8/12), optional Right Icon 20, Dropdown 16. Only the text is visible by default.
- Switcher 36x20 at the right edge, top aligned with padding 16 (x = 348 in a 400-right box, i.e. right padding 16).
State styling: Default fill #ffffff / stroke #e6e6e6 / switcher Off. Active fill #ffffff / stroke #808080 @50% / switcher On Primary Dark. Dislabled fill #ffffff / stroke #e6e6e6 / switcher Off Disabled, Main Text #808080 and links faded (export shows whole content ~50% opacity; actual opacity unreadable).

## Icon assets
No Switcher-specific icons (knob is a plain circle). Card media icon is a generic placeholder; reuse existing Badge/Avatar/Visa/crypto/flag components. `design/figma-dump/8985-342542/` does not exist (REST 429).

## Mapping notes
- shadcn `switch` (Base UI) is not installed: add it, then extend with `cva` sizes (`default` 36x20 / `sm` 32x16, thumb 12px, translate = track width - 12 - 2*inset) and styles (primary / primary-dark) plus disabled+checked variants.
- Text/Text-Card/Card mirror `checkbox-field.tsx` / `checkbox-card.tsx` (same gap 12, 12/20 SemiBold here vs 14/20 on Checkbox).

## Gaps
- Variable/token names (dump rate limited); tokens above are hex matches.
- Stroke weights, shadows (the export shows a faint shadow on the knob/track), effects, layer visibility, opacity values for disabled (On Disabled Primary is encoded as alpha 30% fill; Primary Dark On Disabled export looks greyed but data says solid #010101).
- Auto-layout paddings are inferred from bounding boxes.
- Horizontal Text card right padding (~20) vs left 8 inferred.
- Which Switcher-Card media alternative is visible by default (assumed the 24px default icon).
