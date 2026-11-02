Channel: eyg843by

| #   | Component             | Figma node   | Status      | Notes                                                                                                                              |
| --- | --------------------- | ------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Accordion             | 9402:27557   | done        | already in code                                                                                                                    |
| 2   | Activity              | 10445:211848 | done        | already in code                                                                                                                    |
| 3   | Alert                 | 6978:36557   | done        | already in code                                                                                                                    |
| 4   | Avatar                | 4313:42252   | done        | already in code                                                                                                                    |
| 5   | Badge                 | 4313:16170   | done        | already in code                                                                                                                    |
| 6   | Banner                | 12852:18328  | done        | already in code                                                                                                                    |
| 7   | Breadcrumb            | 5522:25332   | done        | already in code                                                                                                                    |
| 8   | Button                | 321:0        | done        | already in code                                                                                                                    |
| 9   | Button Group          | 412:0        | done        | already in code                                                                                                                    |
| 10  | Calendar              | 12256:118505 | done        | already in code                                                                                                                    |
| 11  | Tabs                  | 4313:16169   | done        | already in code                                                                                                                    |
| 12  | Input                 | 8928:37150   | done        | Checkbox/Radio/Switcher/Select/Country/Payment/Colors slots pending                                                                |
| 13  | Checkbox              | 8985:336791  | done        | 1 retry (dark: cva key renamed)                                                                                                    |
| 14  | Radio                 | 8985:338003  | done        | resumed from dead session; Input radio slot not wired                                                                              |
| 15  | Switcher              | 8985:342542  | done        | Input switcher slot not wired                                                                                                      |
| 16  | Text Area             | 8985:334025  | done        | Textarea on inputVariants + size/shape cva; REST dump 429                                                                          |
| 17  | Divider               | 7060:312915  | done        | 1 retry (hex in comments); Separator cva + SeparatorGroup/Label/Icon slots                                                         |
| 18  | Tooltip               | 4313:31796   | done        | shadcn tooltip (Base UI) + cva variant/layout, Heading/Row/Label/Value/Dot slots; REST dump 429                                    |
| 19  | Progress              | 4313:34129   | done        | 1 retry (dark: cva key renamed); Line/Circle/Half/Percent/Dot on Base UI progress; REST dump 429                                   |
| 20  | Slider                | 4313:51976   | done        | shadcn slider (Base UI) + cva track/range/thumb, Tooltip value pills; first-pass approve; hex→token                                |
| 21  | Steps                 | 4313:48088   | done        | 2 retries (dark: cva key renamed; browser check redo fixed Component-02 line color); no shadcn stepper, cva + Separator            |
| 22  | Loader                | 9402:26498   | done        | shadcn spinner (two-tone ring like ProgressCircle) + Loader container cva, 4 sizes; first-pass approve; drop shadow omitted        |
| 23  | Command Key           | 9402:26499   | done        | shadcn kbd extended (variant/shape/glyph, KbdSeparator, KbdGroup props via cloneElement); first-pass approve                       |
| 24  | Input OTP             | 9402:26500   | done        | shadcn input-otp restyled to 6 separate slots (cva size 60/48/40 × state) + InputOTPField on Field; first-pass approve             |
| 25  | Counter               | 9402:27553   | done        | Base UI NumberField + cva (no shadcn base), Counter appearance button/input + slots, Input on InputGroup/Field; first-pass approve |
| 26  | Status                | 9463:285753  | done        |                                                                                                                                    |
| 27  | Links                 | 12123:27015  | done        |                                                                                                                                    |
| 28  | Color Input           | 12053:26144  | done        | Forms: Color                                                                                                                       |
| 29  | Double Input          | 11956:50138  | done        | Forms: Double Inputs                                                                                                               |
| 30  | Input Group           | 12015:28362  | done        | Forms: Input Groups                                                                                                                |
| 31  | Input Custom          | 12509:89789  | done        | InputGroup tone white/black + Field tone glass cva; first-pass approve; FIGMA_TOKEN expired, no tree.txt                           |
| 32  | File Input            | 12015:2400   | done        | Forms: File Input; ring 4px + disabled opacity-50 guessed, see known-gaps                                                          |
| 33  | File Upload           | 9402:22988   | done        | FileUpload dropzone + Item + Card cva slots, AddFilesCard; icons redrawn (REST token expired); first-pass approve                  |
| 34  | Payment Card Input    | 12008:2462   | done        | PaymentCardBrand slot (rounded/pilled × 5 sizes) + DoubleInput joined + InputGroup; first-pass approve; Mastercard svg hand-drawn  |
| 35  | Add Avatar            | 11553:28400  | done        | Forms: Add Avatar; no figma-dump, hex-matched                                                                                      |
| 36  | Mail Input            | 12273:34772  | done        | Forms: Mail; browser check via headless chrome; Button muted + glyph-20 added                                                      |
| 37  | AI Input              | 12814:6371   | done        | 1 retry (dark: cva key renamed to inverse); no tree.txt, tokens from hex; Menu-Dropdown-Rounded not built                          |
| 38  | Text Area Editor      | 15267:48550  | done        | Forms: Text Area Editors; 1 retry (browser check redo); Pilled non-XL radii inferred, footer button plain label, see known-gaps    |
| 39  | Tabs Switch           | 12210:14389  | done        | tone cva (default/black/white) + size + iconOnly on tabs.tsx; 1 retry (dark: removed, White/Black missing); icon placeholder       |
| 40  | Misc                  | 460:6121     | done        | rebuilt: Close/Upload (Button icon-action)/Header x5/Dark-Mode guide/Map rasters; icon colors pixel-derived, see known-gaps        |
| 41  | Dropdown              | 4290:12174   | done        | partial rebuild (builder cut off at 10 min); accepted as is by user                                                                |
| 42  | Popover               | 9402:22995   | done        | partial rebuild (builder cut off at 10 min); accepted as is by user                                                                |
| 43  | Dialog                | 9402:26501   | done        | shadcn dialog (Base UI) + cva variant/layout, DialogPanel static; first-pass approve; no tree.txt, black/horizontal guessed        |
| 44  | Modal                 | 6980:969     | done        | partial rebuild (builder cut off at 10 min); accepted as is by user; reuses dialog.tsx                                             |
| 45  | Toast                 | 6978:41509   | done        | Figma toast = Alert (CLAUDE.md): extend alert.tsx with variants, not shadcn toast                                                  |
| 46  | Notification          | 12145:243335 | done        | Check alert.tsx and row 45 first; reuse/extend them, new file only for parts they lack                                             |
| 47  | Command Menu          | 9402:27554   | done        |                                                                                                                                    |
| 48  | Color Picker          | 9402:27555   | done        |                                                                                                                                    |
| 49  | Date Picker           | 9402:27552   | done        |                                                                                                                                    |
| 50  | Action Panel          | 11531:349716 | done        | 3 sets built, layout matches Figma sizes                                                                                           |
| 51  | Card Content          | 11590:81923  | done        | Cards: Content; ui/card.tsx exists                                                                                                 |
| 52  | Profile               | 11638:16498  | done        |                                                                                                                                    |
| 53  | List                  | 11654:127    | done        |                                                                                                                                    |
| 54  | Message               | 11409:1128   | done        | Messages                                                                                                                           |
| 55  | Task                  | 12276:31748  | done        | Tasks                                                                                                                              |
| 56  | Empty State           | 11951:3850   | done        |                                                                                                                                    |
| 57  | QR Code               | 9488:542     | done        |                                                                                                                                    |
| 58  | Carousel              | 9524:2620    | done        |                                                                                                                                    |
| 59  | Cell UI Table         | 5026:42162   | done        | Cells UI (Tables)                                                                                                                  |
| 60  | Navbar                | 6860:42234   | done        | Nabars                                                                                                                             |
| 61  | Navbar Menu           | 12466:577    | done        | Nabars Menu; Parts of Navbar (row 60): reuse navbar files, add variants                                                            |
| 62  | Navigate Head         | 8967:25852   | done        |                                                                                                                                    |
| 63  | Navigate Footer       | 12492:252181 | done        | fb/pinterest glyphs placeholder, see known-gaps                                                                                    |
| 64  | Pagination            | 9232:577001  | done        |                                                                                                                                    |
| 65  | Sidebar               | 15260:53844  | done        |                                                                                                                                    |
| 66  | Sidebar Component     | 5081:15251   | done        | Sidebar Component                                                                                                                  |
| 67  | Chart                 | 9859:3629    | done        | Charts                                                                                                                             |
| 68  | Chart Component       | 5035:13716   | done        | Charts Components; Parts of Chart (row 67): reuse chart files, add variants                                                        |
| 69  | Chart Metric          | 9880:5306    | done        | Charts Metrics; Extend chart from row 67 (variant), no new chart primitive                                                         |
| 70  | Chart Card            | 9903:12833   | done        | Charts Cards; recovered from blocked run, tooltip pinned to Figma, card preset on chart primitives |
| 71  | Chart White           | 12246:59190  | done        | Charts (White); White theme of chart from row 67: variant, not a copy                                                              |
| 72  | Icons Payment         | 4289:8404    | hold        | user writes SVGs; SVG icons |
| 73  | Icons Social          | 5030:10817   | hold        | user writes SVGs; SVG icons |
| 74  | Icons Flags Rectangle | 11956:33422  | hold        | user writes SVGs; SVG icons |
| 75  | Logotypes             | 5992:23482   | hold        | user writes SVGs; SVG logos |
| 76  | Auth Templates        | 7058:304041  | done        | Sing In, Sing Up, Password, Activation; composite                                                                                  |
| 78  | Navigate Sidebars Footers | 10417:603619 | todo        | Navigate, Sidebars, Footers; reuse sidebar/navigate-footer (rows 63, 65) as variants, no copies |
| 79  | Code Snippet          | 11407:87015  | todo        | Code Snippet |
| 80  | Player                | 9402:22996   | todo        | Player; video/audio player |
| 81  | Icons Material        | 314:956      | hold        | user writes SVGs; 2061 icons |
| 82  | Icons Lucide          | 15851:208399 | hold        | user writes SVGs; 1767 icons |
| 83  | Icons Outline Default | 15580:69404  | hold        | user writes SVGs; 90 icons |
| 84  | Icons Outline Lucide  | 15855:238638 | hold        | user writes SVGs; 1767 icons |
| 85  | Icons Brands          | 5028:7503    | hold        | user writes SVGs; 217 icons |
| 86  | Icons Emoji           | 5028:7132    | hold        | user writes SVGs; 611 icons |
| 87  | Icons Crypto          | 5027:42555   | hold        | user writes SVGs; 62 icons |
| 88  | Icons AI              | 13351:71669  | hold        | user writes SVGs; 32 icons |
| 89  | Icons Flags           | 4288:329     | hold        | user writes SVGs; 238 icons |
| 77  | Mockups               | 11662:1003   | todo        | composite, last                                                                                                                    |
