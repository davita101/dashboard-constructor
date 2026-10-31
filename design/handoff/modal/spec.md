# Modal spec
Figma page `6980:969` (`❖ Modal`). slug `modal`. Route `/design-system/modal`. Read via TalkToFigma only. All 14 sets read + exported (12 modal sets + Head + Footer). Light mode tokens (`pnpm token:hex`).
Coords = relative to variant top-left. Font Inter. Fmt `weight/size/lineHeight`.

## Sets (14)
| Set | Node | Variant props | Variant ids | Size | read/exported |
|---|---|---|---|---|---|
| Modal-Default | 6980:1181 | Type=Primary,Base,Danger | 6980:1173, 12142:234721, 12142:234667 | 228x256 | Primary full read; Base/Danger = footer style swap (export) / exported |
| Modal-Payment | 12138:10308 | Type=Default | 12138:10309 | 360x527 | read/exported |
| Modal-Form | 12139:4837 | Type=Default | 12139:4838 | 360x424 | read/exported |
| Modal-Radio-List | 12139:225680 | Type=Default | 12139:225681 | 360x632 | read/exported |
| Modal-Switcher-List | 12139:229957 | Type=Default | 12139:229958 | 360x592 | read/exported |
| Modal-Switcher-Payment | 12141:231248 | Type=Default | 12141:231249 | 360x628 | read/exported |
| Modal-Switcher-Users | 12141:231787 | Type=Default | 12141:231788 | 360x544 | read/exported |
| Modal-Files | 12142:234847 | Type=Default | 12142:234848 | 360x736 | read/exported |
| Modal-Two-Factor-Authentication | 12144:240412 | Type=Default | 12144:240413 | 360x564 | read/exported |
| Modal-Pin | 12145:241269 | Type=Default | 12145:241270 | 360x340 | read/exported |
| Modal-Date-Range | 12143:235221 | Type=Default | 12143:235222 | 600x576 | read/exported |
| Modal-Welcome (name has trailing space) | 12142:232397 | Type=Default | 12142:232398 | 360x388 | read/exported |
| Head-Modal-Component | 12135:3001 | Type=Default,Center | 12135:3000, 12135:3451 | 216x156 | read/exported |
| Footer-Modal-Component | 12135:3246 | Type=Left,Block,Center x Style=Primary,Danger,Base (9) | Left-Primary 12135:3229, Block-Primary 12139:2771, Center-Primary 12135:3482, Left-Danger 12138:10007, Block-Danger 12139:4732, Center-Danger 12138:10012, Left-Base 12138:10174, Block-Base 12139:4797, Center-Base 12138:10179 | 320x100 | Primary Left+Block, Danger Left read; rest from export / exported |

Page also has `Base` rect 16204:93512, `Head-Design-System` instance 13777:18272 (ignore).

## Shell (all Modal-* variants)
| Part | Value |
|---|---|
| Card | fill `#ffffff` = `base-0`/`background`; stroke `#e6e6e6` = `base-100` 1px inside; radius 20; shadow large soft visible in export (not in API) |
| Width | 360 (Date-Range 600; Modal-Default 228) |
| Stack | Head, Content (SLOT, optional), Footer. No gap between. Height hugs |
| Padding | x 20 everywhere. Content slot: first child y = slot top + 8 (Files/Payment/Radio/Switcher/Form); 2FA and Pin content starts at slot top (0) |
| Modal-Default | no content slot: Head(156) + Footer(100, checkbox row visible) = 256, width 228 |

## Head-Modal-Component (Type=Default, 360 wide e.g. 12139:225682)
| Part | Spec |
|---|---|
| Height | 20 pad + 40 icon + 20 gap + heading 24 + 12 gap + about (20/line*lines) + 20 pad. 156 = 1 line about. 176 = 2 lines. 196 = 3 lines. Date-Range 124 (no about) |
| Close | frame 24x24 at x=312,y=24 (right pad 24, top 24); `material-close` 24, color `#808080` `base-500`. ids `12135:1488`, `12135:1489`, icon `11956:33161` |
| Icon badge | `Badge-Icon-Pilled` 40x40 at (20,20); fill `#ffffff` `base-0`, stroke `#e6e6e6` `base-100`, radius 32 (full); inner icon 20x20 centered, `#808080` `base-500`. Icon per modal (see Icon assets) |
| Heading | y=80. `600/14/24` `#010101` `base-900`, left, width 284 |
| About | y = heading bottom + 12 (heading frame 24, about starts +36). `600/11/20` `#808080` `base-500`, left, text box 284 wide, wraps |
| Type=Center (12135:3451) | same parts, icon + heading + about centered (text-align center), close top right unchanged |
| Welcome head | uses Center layout, 96h: icon badge frame present but not shown (only heading+about), top pad 20: heading `600/14/24` center, about `600/11/20` center, gap 12 |

## Footer-Modal-Component
Frame 64h in content modals (button row only; checkbox row hidden, see Gaps); 100h in set demo and Modal-Default (checkbox row at y=12 h=20, gap 16, buttons y=48, bottom pad 20). Button row padding: top 12, x 20, bottom 20 (64 = 12+32+20). Buttons 32h, radius 32, gap 8, text `700/11/20`, icon slots 16 (hidden), padding x 12.
| Layout | Behaviour |
|---|---|
| Left | buttons hug left: primary action (Save Changes 113x32) then secondary (Close 67x32) |
| Block | 2 buttons fill row, each 156 (in 320), gap 8; secondary first (left), primary right. Single-button modals: `Pay Now` Dark-Button full 320x32 |
| Center | buttons hug, centered, gap 8, secondary first then primary |
| Checkbox row | `Checkbox-Text` 121x20: `Checkbox` 20x20 r6 fill `#ffffff` stroke `#e6e6e6` `base-100`; gap 12; "Don't ask again" `600/12/20` `#333333` `base-800`; "Additional Text" `600/12/20` `#808080` (hidden) |
| Style=Primary | Save = Dark-Button, Close = Outline-Button |
| Style=Danger | Save = Danger-Button solid, Close = Danger-Button soft |
| Style=Base | Save = Outline-Button, Close = Ghost-Button (from export, not hex-read) |
Button styles
| Button | Fill | Stroke | Text/icon | Counter badge |
|---|---|---|---|---|
| Dark | gradient top->bottom `#333333` `base-800` -> `#010101` `base-900` | gradient `#3b3b3b` (var 12969:47598, no token) -> `#010101` | `#ffffff` `base-0` | gradient `#357af3` `primary-525` -> `#235ee6` `primary-625`, text `#f7faff` `8/700/12` |
| Outline | gradient `#ffffff` `base-0` -> `#fafafa` `base-20` | gradient `#ededed` (var 3876:14031, no token) -> `#e6e6e6` `base-100` | text `#333333` `base-800`, icon `#808080` `base-500` | fill `#ffffff`, stroke `#e6e6e6`, text `#4d4d4d` `base-700` |
| Ghost | none | none | text `#4d4d4d` `base-700`, icon `#808080` `base-500` | fill `#ffffff`, stroke `#e6e6e6`, text `#4d4d4d` |
| Danger solid | gradient `#ef4444` `danger-500` -> `#e53535` `danger-550` | gradient `#f87171` `danger-400` -> `#dc2626` `danger-600` | `#fef8f8` `danger-25` | fill `#ffffff`@20, text `#ffffff` |
| Danger soft | gradient `#ef4444`@5 -> `#ef4444`@10 | gradient `#ef4444`@10 -> `#ef4444`@20 | text/icon `#dc2626` `danger-600` | gradient `#ef4444`->`#dc2626`, text `#fef8f8` |

## Modal-Default (6980:1181) Type=Primary | Base | Danger
228x256: Head (156, 188 text width, placeholder ring icon, "Heading Modal", "About Text") + Footer (100, checkbox "Don't ask again" + `Save Changes` + `Close`, Left layout).
| Type | Footer style |
|---|---|
| Primary | Left-Primary |
| Base | Left-Base |
| Danger | Left-Danger |

## Modal-Payment (12138:10309) 360x527
Head 156: "Payment Card Method", about "Fill in the fields for payment", icon credit card (see Gaps). Slot 307 (y156..463). Footer 64: `Pay Now` Dark full width.
| Child | Spec |
|---|---|
| `Input-Payment-Pilled` 12138:24482 320x87, y=8 | label row 16: "Payment Card" `700/10/16` `#4d4d4d` `base-700` + `material-help` 12; gap 8; row1 Input 320x32 fill `#ffffff` stroke `#e6e6e6`; text "Card Number" `600/10/16` `base-700`, left pad 12; right `Mastercard-Pilled` 29x16 (fill `#ffffff` stroke `#e6e6e6` r72; logo 16x10 `#ed0006`/`#f9a000`/`#ff5e00`); row2 3 inputs 107.33x32 each (shared borders): "00 / 00", "CSV", "Zip Code" `600/10/16` `base-700`; total 16+8+32+32-1 |
| gap 12 | |
| `Input-Pilled` "Street Address" 12139:1328 320x56 | label `700/10/16` `base-700` + help 12; gap 8; input 320x32 fill `#ffffff` stroke `#e6e6e6` r32 (pill) pad x12; text `600/10/16` `base-700` |
| gap 12 | |
| `Group` 12139:2325 320x56 | 2 `Input-Pilled` 152 wide, gap 16: "Number" 12139:2326, "ZIP" 12139:2117; same input spec |
| gap 12 | |
| `Input-Pilled` "State" 12139:2534 320x56 | same; placeholder "State / Province"; right chevron up/down icon 16 `#808080` |
Input-Pilled hidden slots: left Tags/Button/Checkbox/Radio/Switcher/Icon/Payment/Avatar/Country/Colors; right Text/Button/Icon/Command keys. Bottom helper `600/10/16` `#999999` `base-400` hidden.

## Modal-Form (12139:4838) 360x424
Head 156: "Invite Users to Service", about "You can add people to project", icon add_circle. Slot 204. Footer 64 `Pay Now`.
| Child | Spec |
|---|---|
| Input-Pilled #1 12139:4842 320x56, y=8 | label "Email Address" `700/10/16` `base-700` + help 12; input state Active: outer ring 320x32 stroke `#808080`@20 r32, inner fill `#ffffff` stroke `#cccccc` `base-200` r32; left mail icon 16 `#808080`; text `mail@gmail.com` `#010101`; right `Send` pill (Outline-Button small 48x20, `700/10/16` `base-800`) |
| gap 12 | |
| #2 12139:5755 320x32 | label hidden; fill `#ffffff` stroke `#e6e6e6` r32; mail icon; `johnmail@gmail.com` `600/10/16` `base-700`; `Send` pill |
| gap 12 | |
| #3 12139:5960 320x32 | `smithmail@gmail.com`; same |
| gap 12 | |
| `Ghost-Button` "Add more" 12139:225608 105x32 | icon add_circle 16 `#808080`, text `700/11/20` `#4d4d4d` `base-700` |

## Modal-Radio-List (12139:225681) 360x632
Head 196: "Select Plans", icon monetization_on, about 3 lines "Our free Starter Site plan is great for trying. Purchase a paid Site plan to publish, host, and unlock additional features." Slot 372 (196..568). Footer 64 `Pay Now`.
4 `Radio-Card` 320x80, gap 12, first y=8: 12139:226592 (selected), 12139:227092, 12139:227273, 12139:227333.
| Part | Spec |
|---|---|
| Card | fill `#ffffff`; radius 16; pad 16; stroke selected `#808080`@50 `base-alpha-50`, unselected `#e6e6e6` `base-100`; selected has soft shadow |
| Left slot | hidden here (default icon 24, Badge-Icon 32, Visa 38x24, Avatar 32, BTC 28, UK 28); content starts x=16 |
| Content 250x48 | Main `600/12/20` `#010101` `base-900`: "Starter Plan","Basic Site Plan","CMS Site Plan","Business Site Plan"; Additional `600/12/20` `#999999` `base-400`: "Best for learning how to Use","$14 / mo billed yearly","$24 / mo billed yearly","$38 / mo billed yearly"; gap 8; Links row hidden (`Link 1`/`Link 2` `600/11/20` `base-900`) |
| Radio | 20x20 at x=285,y=16: selected fill `#010101` `base-900`, stroke `#333333` `base-800`, inner dot 10x10 `#ffffff`; unselected fill `#ffffff` stroke `#e6e6e6` r32 |

## Modal-Switcher-List (12139:229958) 360x592
Head 156: "You Post was Publish", about "You can add people to your project send", head badge = green soft badge with done-all icon (fill gradient `#22c55e`@5->@15, stroke `#22c55e`@10->@20; see Gaps). Slot 372. Footer 64 `Pay Now`.
4 `Switcher-Card` 320x80 gap 12: 12139:229961 (selected, ON, stroke `#808080`@50), 12141:230896, 12141:231018, 12141:231088 (OFF, stroke `#e6e6e6`). Fill `#ffffff`, r16, pad 16.
| Part | Spec |
|---|---|
| Left brand icon | 24x24 at x=16,y=16: X-Twitter (`#010101` glyph), Facebook, Pinterest, Telegram (export SVG) |
| Content | x=60, 188x48: Main `600/12/20` `#010101`: "Share on X","Share on Facebook","Share on Pinterest","Share on Telegram"; Additional `600/12/20` `#808080` `base-500`: "Send Post Now","Send Post","Send Post","Send Post"; gap 8 |
| Links row | hidden here; visible in Switcher-Payment |
| Switcher | 36x20 at x=268,y=16, r16. ON: fill `#010101` `base-900`, stroke `#333333` `base-800`, thumb 12x12 `#ffffff` right. OFF: fill `#e6e6e6` `base-100`, stroke `#e6e6e6`, thumb `#ffffff` left |

## Modal-Switcher-Payment (12141:231249) 360x628
Head 156: "Payments Method", icon monetization_on, about "You can add people to your project send". Slot 408. Footer 64.
3 `Switcher-Card` 320x108 gap 12: 12141:231252 (Visa, ON, stroke `#808080`@50), 12141:231575 (Mastercard, OFF), 12141:231701 (Maestro, OFF).
| Part | Spec |
|---|---|
| Left logo | 38x24 at x=16,y=16: `Visa-Rounded` / `Mastercard-Rounded` / Maestro; base fill `#ffffff` stroke `#e6e6e6` r6; visa mark `#1a1f71` |
| Content x=58, 174x76 | Main `600/12/20` `#010101`: "Visa Ending in 3456","Mastercard Ending in 4321","Maestro Ending in 3456"; Additional "Expiry 05/56" `600/12/20` `#808080`; Links row 20h: 2x `Link` text "Link" `700/11/20` `#666666` `base-600`, gap 16; vertical gap 8 |
| Switcher | same as Switcher-List |
After cards: `Ghost-Button` "Add New Payment" 151x32 12141:231770 (add_circle 16, `700/11/20` `#4d4d4d`), gap 12.

## Modal-Switcher-Users (12141:231788) 360x544
Head 156: "Select Users for Work", icon add_circle, about "You can add people to your project send". Slot 324. Footer 64.
3 `Switcher-Card` 320x80 gap 12: 12141:231791 (Liam Brown, ON), 12141:231792 (Jordan Smith, OFF), 12141:231793 (Emma Johnson, OFF). Left `Avatar-Image` 32x32 at x=16 (full radius, photo). Content x=68: Main `600/12/20` `#010101` (name), Additional `600/12/20` `#808080`: "User Interface Designer","Project Manager","Software Developer"; gap 8. Switcher as above. Then `Ghost-Button` "Add User" 102x32 12141:231794, gap 12.

## Modal-Files (12142:234848) 360x736
Head 156: "Upload Files", icon file_download, about "Add the files below". Slot 516 (236..752). Footer 64 Block: `Ghost-Button` "Close" 156x32 + `Outline-Button` "Save Changes" 156x32, gap 8 (no dark button).
Slot children y from 8, gap 12 unless noted:
| Child | Spec |
|---|---|
| `Form-Upload-Files` 12142:235089 320x200 | drop zone fill `#ffffff`, stroke `#cccccc` `base-200` dashed r12; badge 40x40 centered at y=46 (fill `#ffffff`, stroke `#e6e6e6`, r32, upload-file icon 20 `#808080`); text block 176x44 at y=110: "Drag & Drop Files or " `700/11/20` `#333333` `base-800` + "browse files" `700/11/20` `#2563eb` `primary-600`; "Max File Size 256MB" `700/10/16` `#b3b3b3` `base-300`, gap 8. Label row hidden ("Add the file below" `600/12/20` `#333333` + help 16) |
| `Divider-Horizontal` 12142:235101 320x16 | lines 1px `#d9d9d9` `base-150`, 134 wide, center text "Or" `700/10/16` `#4d4d4d` `base-700`, gap 16; use `Separator` + label |
| "Uploading Files" 12142:235106 | `700/12/20` `#424242` `base-750`, 320x20, gap 12 from divider |
| `File-Item-Component` x4 320x48, gap 12 | fill `#ffffff`, stroke `#e6e6e6` `base-100`, r28 pill, pad 8, row 304x32 |
File items
| # | id | State | Badge 32x32 | Text | Right |
|---|---|---|---|---|---|
| 1 | 12142:235108 | uploading circular | fill gradient `#3b82f6`@5->@15, stroke `#3b82f6`@10->@20, r16, upload icon 16 | "Image.png" `700/10/16` `#333333`; "5.6mb of 24mb" `600/10/16` `#808080`; text x=40 | `Progress-Circular` 24x24 (track `#3b82f6`@10, arc `#2563eb` `primary-600`; 9 variants 5,10,25,35,50,60,75,90,100%) + Outline-Button 32x32 close icon 16 |
| 2 | 12142:235109 | uploading linear | same blue | "File Name" `700/10/16` `#333333`; `Progress-Line` 194x2 + "64%" `700/10/16` `#2563eb` right (22x16) | Outline-Button 32 close |
| 3 | 12142:235110 | error | gradient `#ef4444`@5->@15, stroke `#ef4444`@10->@20, icon red | "File Name" `700/10/16` `#dc2626` `danger-600`; "File Too Large. Try another one." `700/9/16` `#dc2626`; text x=44 | retry icon 20x20 + Outline-Button 32 close |
| 4 | 12142:235111 | success | gradient `#22c55e`@5->@15, stroke `#22c55e`@10->@20 | "File Name" `700/10/16` `#16a34a` `success-600`; "5.6mb of 24mb" `600/10/16` `#808080` | `material-done` 20x20 `#22c55e` `success-500` + Outline-Button 32 close |

## Modal-Two-Factor-Authentication (12144:240413) 360x564
Head 176: "Two-factor Authentication", icon lock, about 2 lines "Scan the QR code and enter the generated code below". Slot 324 (256..580). Footer 64 `Pay Now`.
| Child | Spec |
|---|---|
| QR panel 12144:241004 320x184 at slot top, x=20 | fill `#f5f5f5` `base-40`/`muted`, r16; `QR-Code` 12144:240556 120x120 centered (100,32): fill `#ffffff` stroke `#e6e6e6` r8, code art 94.7 inset 12.6 |
| gap 20 | |
| `Input-OTP` 12145:241053 256x104 (left-aligned, not full width) | Top 20h: "Verification Code" `700/12/20` `#4d4d4d` `base-700` + `material-help` 16 (x=111); gap 12; 6 slots each 36x40, gap 8: fill `#ffffff`, stroke `#e6e6e6` `base-100`, r8, text `600/12/20` centered; slot1 "1" `#010101`; slot2 active: outer ring stroke `#808080`@20 r8, inner stroke `#cccccc` `base-200`, caret `\|`; slots 3-6 empty (placeholder text `#666666`); gap 12; Bottom 20h "Didn't get a code? Click to resend" `600/11/20` `#808080` |

## Modal-Pin (12145:241270) 360x340
Head 156: "You Must Enter PIN to continue.", icon lock, about "We’ve sent a code to email@gmail.com". Slot 120 (236..356), content starts at slot top x=20. Footer 64 `Pay Now`.
`Input-OTP` 12145:241275 256x104 same as 2FA; bottom helper "If you didn't receive the code, click send again". Slot height 120 = 104 + 16 bottom.

## Modal-Date-Range (12143:235222) 600x576
Head 124: calendar icon, "Select Date Range", no about. Slot 388 (124..512). Footer 64 `Pay Now` full width 560.
Child `Double-Date-Picker-Mobile-Calendar` 12144:239312 560x372 at (20,8): fill `#ffffff`, stroke `#e6e6e6` `base-100`, r20.
| Part | Spec |
|---|---|
| Head 560x64 12143:237427 | border-bottom 1px `#e6e6e6`; pad 16; `Input-Pilled` 528x32 12143:238090: pill r32 fill `#ffffff` stroke `#e6e6e6`, text "Today" `600/10/16` `#4d4d4d` `base-700`, right chevron up/down 16 `#808080` (presets select) |
| Body 560x308 | pad 16; row 560x264 of two `Item`s 258x232, gap 12 (ids 12143:237437 Feb, 12143:237494 Mar); Footer 560x44 12143:237551 border-top `#e6e6e6` |
| Item | stroke `#e6e6e6`, r20, fill none; Head 258x48 pad 8: `material-chevron_left` 24 (x=8), center 132x24: `Month` select 58x24 ("Feb"/"Mar") + `Year` select 66x24 ("2078"), gap 8, pills fill gradient `#ffffff`->`#fafafa`, stroke gradient `#ededed`->`#e6e6e6`, r32, text `700/10/16` `#333333` `base-800`, chevron-down 16; `material-chevron_right` 24 (x=226). Content 258x184, pad x12 |
| Weekday row | 234x28, 7 cols 33.43 wide: "MO TU WE TH FR SA SU" `700/10/16` `#b3b3b3` `base-300` centered |
| Date grid | 234x140 (5 rows x 28), frame stroke `#e6e6e6` r8; `Date-Component` 33.43x28 stroke `#e6e6e6` 1px; default fill `#ffffff` text `700/10/16` `#4d4d4d` `base-700`; outside month fill `#fafafa` `base-20` text `#cccccc` `base-200`; selected: inner `Date` frame 28.43x23 inset 2 fill `#010101` `base-900` text `#ffffff`, radius 6 (range start/end caps rounded half-pill on one side: Feb 7 left-rounded, Mar 15 right-rounded); today: small blue dot `#2563eb` under 18 (Mar) |
| Selection | left Feb 2078: 7..29 selected; right Mar 2078: 1..15 selected |
| Footer text | 504x20, `600/12/20` `#999999` `base-400`; "Selected from " + bold date "13 March" + " to " + bold "15 February 2078" (bold runs darker, color unread) |

## Modal-Welcome (12142:232398) 360x388
Top `Content` frame 360x228 (y0): `Player-Video` 12142:232709 320x200 at (20,20), r16, IMAGE fill (cover; export still). Overlay:
| Part | Spec |
|---|---|
| Center | `Black-Soft-Button` 60x60 at (130,70) (center of video): fill `#000000`@20 `black-alpha-20`, stroke `#000000`@5 `black-alpha-5`, r32; play icon 28x28 `#ffffff` |
| Head row (hidden) | y=12 inset 12: "Video Heading" `700/12/20` `#ffffff` + `material-more_horiz` 20 right |
| Footer row (hidden) | y=156 inset 12: `Progress-Line` 256x4 (value text "100%" `700/10/16` `#dc2626`), time "8:58 / 20:45" `700/10/16` `#ffffff`, icons 20: play_arrow, skip_next, volume_up / subtitles, settings, fullscreen |
Then Head-Modal-Component Center at y=228 (96h): "First Step Welcome!" center, about "You can add people to your project send" center. Footer 64 Block: Outline "Close" 156x32 + Dark "Pay Now" 156x32, gap 8 (shown). Total 228+96+64 = 388.

## Parts to shadcn map (suggested)
| Part | Map |
|---|---|
| Card shell | `Dialog` popup, size sm 228 / md 360 / lg 600 |
| Head | `DialogHeader` with icon badge slot, `DialogTitle`, `DialogDescription`, `DialogClose`; center variant |
| Footer | `DialogFooter` layout variants left/block/center; `Button` variants dark/outline/ghost/danger/danger-soft |
| Checkbox-Text | `Checkbox` + label |
| Inputs | `Input`/input-group pill |
| Radio-Card | `RadioGroup` card item |
| Switcher-Card | `Switch` in card row |
| Divider "Or" | `Separator` + label |
| File-Item | `Progress` + icon `Button` |
| OTP | `InputOTP` 6 slots |
| Calendar | `Calendar` range, 2 months |
| Video | media card + play `Button` |

## Icon assets (export SVG)
Head badge icons (20x20 in Badge-Icon-Pilled, `…;11567:21490`): placeholder ring-dot, credit_card (Payment), add_circle (Form, Switcher-Users, Welcome), monetization_on (Radio-List, Switcher-Payment), file_download (Files), lock (2FA, Pin: 12144:240414;12135:1491;11567:21490 / 12145:241271;12135:1491;11567:21490), calendar (Date-Range, in 12143:235223), done_all green (Switcher-List 12139:229959). Close `material-close` 11956:33161. `material-help` 12/16 (12431:127223, 12434:269897). `material-done` (12142:235111;9413:4074). Video: `material-more_horiz`, `material-play_arrow`, `material-skip_next`, `material-volume_up`, `material-subtitles`, `material-settings`, `material-fullscreen`, play 28 in 4302:56590. Calendar: chevron_left 12143:237439, chevron_right 12143:237443. Card: material-default-icon 9426:30226. Upload badges: 10446:594117 (blue), 10446:594133 (red), 10446:594121 (green). Brand: X-Twitter 9427:4090, Facebook 9427:4072, Pinterest, Telegram (siblings in 12141:230896..231088). Payments: visa-logo 4996:88574, Mastercard 4996:88593, Maestro (7115:100165). QR 12144:240556.

## Token map (Light)
`#ffffff` base-0/background; `#fafafa` base-20; `#f5f5f5` base-40/muted; `#e6e6e6` base-100; `#d9d9d9` base-150; `#cccccc` base-200; `#b3b3b3` base-300; `#999999` base-400; `#808080` base-500; `#666666` base-600; `#4d4d4d` base-700; `#424242` base-750; `#333333` base-800; `#010101` base-900; `#808080`@50 base-alpha-50; `#2563eb` primary-600; `#3b82f6`@20 primary-alpha-20; `#357af3` primary-525; `#235ee6` primary-625; `#ef4444` danger-500; `#e53535` danger-550; `#f87171` danger-400; `#dc2626` danger-600; `#fef8f8` danger-25; `#22c55e` success-500; `#16a34a` success-600; `#000000`@20 black-alpha-20; `#000000`@5 black-alpha-5.
No exact token: `#808080`@20 (nearest base-alpha-20 off 3); `#3b82f6`@10 (primary-alpha-10 off 2); `#ef4444`@10/@20 (danger-alpha-10/20 off 3-4); `#22c55e`@10/@20 (success-alpha-10 off 6); `#1a1f71` visa (primary-925 off 17); `#ed0006` mastercard red (none). Button stroke gradient stops are bound variables (12969:47598, 12920:6391, 3876:14031) with no printed token.

## Gaps
- Card shadow, selected-card shadow, active input ring: effects not in node JSON; export shows soft large shadow.
- Visibility flags unreadable: footer checkbox row (visible in Modal-Default, apparently hidden in content modals since footer = 64), hidden Links rows, hidden left slots, hidden Welcome head icon/close.
- Auto-layout padding/gap not returned; values inferred from bbox deltas.
- Stroke weights unread (assumed 1px inside; drop zone dash pattern unknown).
- Date-Component variants (start/middle/end/today/disabled) not read individually.
- Modal-Default Base/Danger and Footer Base/Danger-Block/Center not hex-read (inferred from Left variants + export); Switcher-List head green badge, brand icon colors, upload icon colors from export only.
- Circular progress: only 100% hex read; partial arcs by variant name.
- Video still: IMAGE fill, export separately.
- Payment head icon name (credit card) and calendar icon name inferred from export, not read.
