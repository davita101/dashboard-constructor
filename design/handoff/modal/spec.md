# Modal spec
Page 6980:969, name `❖ Modal`, slug `modal`. Reuse `dialog.tsx` (row 43), add variant/size. REST dump absent (no tree.txt), colors by hex match.

## Sets (all 15 must be built)
| Set | Node | Variants | Read |
|---|---|---|---|
| Modal-Default | 6980:1181 | Type=Primary(6980:1173) / Base(12142:234721) / Danger(12142:234667); 228x256 | read + exported |
| Modal-Payment | 12138:10308 | Type=Default 12138:10309; 360x527 | unread |
| Modal-Form | 12139:4837 | Type=Default 12139:4838; 360x424 | unread |
| Modal-Radio-List | 12139:225680 | Type=Default 12139:225681; 360x632 | unread |
| Modal-Switcher-List | 12139:229957 | Type=Default 12139:229958; 360x592 | unread |
| Modal-Switcher-Payment | 12141:231248 | Type=Default 12141:231249; 360x628 | unread |
| Modal-Switcher-Users | 12141:231787 | Type=Default 12141:231788; 360x544 | unread |
| Modal-Files | 12142:234847 | Type=Default 12142:234848; 360x736 | unread |
| Modal-Two-Factor-Authentication | 12144:240412 | Type=Default 12144:240413; 360x564 | unread |
| Modal-Pin | 12145:241269 | Type=Default 12145:241270; 360x340 | unread |
| Modal-Date-Range | 12143:235221 | Type=Default 12143:235222; 600x576 | unread |
| Modal-Welcome (name has trailing space) | 12142:232397 | Type=Default 12142:232398; 360x388 | unread |
| Head-Modal-Component | 12135:3001 | Type=Default 12135:3000 / Center 12135:3451; 216x156 | read (inside Default) |
| Footer-Modal-Component | 12135:3246 | Type=Left/Block/Center x Style=Primary/Danger/Base (9); 320x100 ids: Left-Primary 12135:3229, Block-Primary 12139:2771, Center-Primary 12135:3482, Left-Danger 12138:10007, Block-Danger 12139:4732, Center-Danger 12138:10012, Left-Base 12138:10174, Block-Base 12139:4797, Center-Base 12138:10179 | read (Left-Primary only) |
Also on page: Base 16204:93512 (rect backdrop), Head-Design-System 13777:18272 (ignore).
Export: Modal-Default only (C:\Users\grdze\.claude\projects\E--Girhub-ecormce-webstie\5c8d190a-03ee-4428-821b-ebd54bb1ac3b\tool-results\mcp-TalkToFigma-blob-1793434918101-vmsq26.png). Other sets unexported: builder export itself via TalkToFigma if needed.

## Modal-Default (Type=Primary read)
Card: fill #ffffff = `background-0`, stroke #e6e6e6 = `base-100`(verify, 1px inside), radius 20 (`rounded-r20`), width 228 in set (content 188, padding 20 horizontal). Stack: Head instance (156h) + Footer instance (100h). Type only changes footer Style (Primary/Base/Danger) and button colors.

### Head-Modal-Component (Type=Default left-aligned, Center = centered)
| Part | Spec |
|---|---|
| Close | frame 24x24 top-right at x+180,y+24; instance `Close` w/ `material-close` icon 24px |
| Icon | frame 188x40 row; `Badge-Icon-Pilled` 40x40, fill #fff, stroke #e6e6e6, radius 32, inner icon 20px, color #808080 (`base-500`? verify) |
| Heading | frame 188x56, gap 12 between icon and heading (icon y100-140, heading y160); padding top 20 |
| Heading Modal text | Inter 600 14/24, #010101 = `base-900` |
| About Text | Inter 600 11/20, #808080; sits 12 under heading (y196) |

### Footer-Modal-Component (Left-Primary read)
| Part | Spec |
|---|---|
| Checkbox-Text | 20h row: Checkbox 20x20 radius 6 fill #fff stroke #e6e6e6; gap 12; Main Text "Don't ask again" Inter 600 12/20 #333333 (`base-800`); Additional Text Inter 600 12/20 #808080 |
| Buttons row | frame 188x32, y284, gap 8, 12 above-footer gap 16 between checkbox and buttons; padding 12 top/20 sides |
| Primary btn (Dark-Button) | 113x32, radius 32, gradient #333333 to #010101, text "Save Changes" Inter 700 11/20 white, left icon 16px white, counter badge optional (Badge-Square-Pilled 16, grad #357af3 to #235ee6, radius 16, text 8/12 700 #f7faff), trailing icon 16 |
| Secondary (Outline-Button) | 67x32, radius 32, gradient #ffffff to #fafafa, stroke gradient #ededed to #e6e6e6, text "Close" Inter 700 11/20 #333333, counter badge fill #fff stroke #e6e6e6 text #4d4d4d |
Style=Danger: primary red solid, secondary light red (see export). Style=Base: both outline (white). Type=Block: buttons stacked/full-width. Type=Center: centered buttons. Exact values unread: builder reuse existing `Button` variants (dark/outline/danger).

## States
None as variant props. Hover/focus: use Button states.

## Icons
Close = `material-close`; badge icon placeholder. No assets dumped (`design/figma-dump/6980-969/` missing).

## Gaps
- 12 content sets (Payment ... Welcome) unread: only size known. Builder: `get_nodes_info` first variant per set (cap 4/run) or next fetch.
- Stroke token, shadow (export shows soft shadow), exact padding/gap of card, Danger/Base fill hex unread.
- REST dump absent; tokens unresolved except gray matches.
- Backdrop overlay (Base rect 16204:93512) opacity unread.
