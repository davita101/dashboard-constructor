# Radio — handoff spec

- Page: `8985:338003` (❖ Forms: Radio), slug `radio` -> `/design-system/radio`
- Source: TalkToFigma `get_nodes_info` (hex only; REST `pnpm figma:fetch 8985-338003` failed, rate limited, so no token names, paddings, fonts or stroke weights).
- Reference images (this folder): `radio.png` (457:56), `radio-text.png` (9414:3234), `radio-text-card.png` (9414:3260), `radio-card.png` (9415:3455).
- shadcn base: `radio-group` (Base UI). Mirror Checkbox: `checkbox.tsx`, `checkbox-field.tsx`, `checkbox-card.tsx`.

Hex -> likely Light tokens (match, unverified): #010101 base-900, #333333 base-800, #808080 base-500, #999999 base-400, #b3b3b3 base-300, #e6e6e6 base-100, #f0f0f0 base-60/50?, #f7f7f7 base-30, #fafafa background-20, #ffffff white/background, #2563eb primary-600. Use Checkbox's choices for consistency.

## 1. Radio (set 457:56, 600x236) — 16 variants
Props: Style = Primary | Primary Dark; Status = Checked | Normal | Focus | Dislabled (sic); Size = Default (20) | Small (16).
Shape: circle (r=32 / full). Stroke inside the box. Inner dot part `Base` (FRAME, white #ffffff, circle): 10x10 at 20, 8x8 at 16 (centered).

| Style | Status | Fill | Stroke | Dot |
|---|---|---|---|---|
| Primary | Checked | #2563eb | #2563eb | #ffffff |
| Primary | Normal | #ffffff | #e6e6e6 | none |
| Primary | Focus | #ffffff | #2563eb | none |
| Primary | Dislabled | #f7f7f7 | #f0f0f0 | none |
| Primary Dark | Checked | #010101 | #333333 | #ffffff |
| Primary Dark | Normal | #ffffff | #e6e6e6 | none |
| Primary Dark | Focus | #ffffff | #010101 | none |
| Primary Dark | Dislabled | #f7f7f7 | #f0f0f0 | none |

Node ids: Primary Checked 20 `457:57`, 16 `9444:106929`; Normal 20 `457:65`, 16 `9444:106931`; Focus 20 `2745:140546`, 16 `9444:106932`; Disabled 20 `4294:23418`, 16 `9444:106933`. Primary Dark Checked 20 `8985:471790`, 16 `9444:106934`; Normal 20 `8985:471792`, 16 `9444:106936`; Focus 20 `8985:471793`, 16 `9444:106937`; Disabled 20 `8985:471794`, 16 `9444:106938`.
Notes: Primary Dark Checked looks like a thick black ring with white dot in the export (stroke weight ~ 4-5px, unreadable). Primary Checked shows blue fill, white dot. Focus = colored stroke only (no ring seen). Hover not present.

## 2. Radio-Text (set 9414:3234, 349x552) — 6 variants
Props: Type = Horizontal | Vertical; State = Active | Default | Dislabled.
Parts: `Radio` instance (20x20, Primary Dark style: Active = checked, Default = Normal, Dislabled = Dislabled), `Content` frame containing `Main Text` and `Additional Text`.
- Horizontal: root 189x20; Content 157x20, text row, gap 12 between Main (57x20) and Additional (88x20); gap Radio->Content 12.
- Vertical: root 120x44; Content 88x44 stacked (20 + 4 gap + 20); gap Radio->Content 12; Radio aligned top.
Text colors (Main / Additional): Active #010101 / #999999; Default #333333 / #999999; Dislabled Horizontal #999999 / #b3b3b3, Dislabled Vertical #808080 / #b3b3b3 (inconsistent, same as Checkbox). Type: 14/20 medium for Main (matches Checkbox; Additional appears same size, regular/medium, unreadable).
Ids: H Active `9414:3224`, H Default `9414:3298`, H Disabled `9414:3334`, V Active `9414:3235`, V Default `9414:3317`, V Disabled `9414:3357`.

## 3. Radio-Text-Card (set 9414:3260, 377x672) — 6 variants
Props: Type = Horizontal | Vertical; State = Default | Active | Dislabled.
- Horizontal: 217x36, radius 32 (pill); Vertical: 217x68, radius 16. Contents as Radio-Text (same Radio instance + Content). Vertical Content 153x44 (text fills width).
- Derived padding: Vertical card p=12 all sides, gap Radio->Content 20 (217-153-20=44 = 2*12+20). Horizontal card: height 36 -> py 8; px+gap = 40 total (px 14 / gap 12 or similar; unverified).
- Fill/stroke: Default #ffffff / #e6e6e6; Active #ffffff / #808080 (card stroke), radio checked (#010101, #333333, dot #fff); Dislabled #fafafa / #e6e6e6, radio disabled (#f7f7f7 / #f0f0f0).
- Text colors: Default Main #010101 / Add #999999; Active #010101 / #999999; Dislabled #999999 / #b3b3b3.
Ids: H Default `9414:3261`, H Active `9414:3382`, H Disabled `9414:3393`, V Default `9414:3266`, V Active `9414:3408`, V Disabled `9414:3445`.

## 4. Radio-Card (set 9415:3455, 480x564) — 3 variants
Props: Type = Vertical (only); State = Default | Active | Dislabled.
Root 320x108, radius 16, fill #ffffff, stroke Default #e6e6e6 / Active #808080 / Disabled #e6e6e6 (inferred disabled fill ~#fafafa per export; node reports #ffffff).
Layout (from export): media slot top-left (x≈20, centered ~ y 24), Content to the right, Radio (20x20) top-right. Content 206x76 (204 in disabled): Main Text 57x20, Additional Text 88x20, Links row 206x20 (Link 1 31x20, Link 2 32x20, #010101, ~12/20 semibold, gap ~16, as Checkbox-Card). Card padding ~16 vertical (108-76=32); horizontal ~16-20 (guess).
Radio: Default Normal; Active checked Primary Dark; Disabled disabled style.
Media alternatives (only first shown by default; others hidden, visibility unreadable): `material-default-icon` 24x24 (glyph 12x12 #808080, ring icon), `Badge-Icon-Pilled` 32x32 (fill #fff, stroke #e6e6e6, r16, icon 16x16 #808080), `Visa-Rounded` 38x24 (base r6 #fff/#e6e6e6, logo #1a1f71), `Avatar-Image` 32x32 (Story ring 38x38 #2563eb, Progress #3b82f6/#2563eb, Status 8x8 #22c55e, Badge-Square-Pilled 12x12), `Avatar-Text` 32x32 (stroke #3b82f6, "M" #2563eb, Status), `BTC-Bitcoin` 28x28, `United-Kingdom` 28x28 flag. Export shows the small material-default-icon (ring, #808080; disabled lighter) in all three states; Disabled variant's media is Avatar-Text per tree (not visible in export).
Text: Main #010101 (Disabled #808080), Additional #999999 (Disabled #b3b3b3), Links #010101 (Disabled faded in export, likely opacity ~50%).
Ids: Default `9415:3471`, Active `9426:30221`, Disabled `9427:3403`.

## Icon assets
None needed for the radio itself (CSS circle + dot). Radio-Card media reuses existing Badge/Avatar/icon components; the ring icon is `material-default-icon` (not in dump; REST fetch failed).

## Gaps
- No token names, no stroke weight (checked Primary Dark ring looks ~4-5px), no font family/size/weight (assume Inter 14/20 as Checkbox), no auto-layout paddings/gaps (derived values above), no effects, no layer visibility.
- Status values spelled `Dislabled` in Figma.
- Hover/pressed not in Figma; Focus is stroke-only.
- Radio-Card only has Vertical; Radio-Text-Card has both types.
- REST dump 8985-338003 not fetched (rate limit); rerun `pnpm figma:fetch 8985-338003` later to confirm tokens.
