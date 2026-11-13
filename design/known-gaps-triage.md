# Known gaps triage

Source: `design/known-gaps.md` (L = line number there). Classes: **code** = code-only, **figma** = needs Figma re-read (TalkToFigma value/page unreadable), **asset** = needs user asset (icon/logo/image the user writes or exports; never create SVGs), **none** = informational, no action (decision / open note / already fine).

## Summary

105 bullets in known-gaps.md, all covered (every `L<n>` appears); split into 222 gap rows.

| Class | Rows |
|---|---|
| code-only | 57 |
| needs Figma | 70 |
| needs user asset | 44 |
| none (info/decision) | 51 |

## Gap table

| Component | Gap | Class | Batch | Note |
|---|---|---|---|---|
| shadcn vars (L5) | `--background`, `--primary`, `--border`, `--radius`… not mapped to tokens | code | B1 | `globals.css` |
| Fonts (L6) | Geist still loaded, Inter/Playfair/Roboto/Merriweather/Ms Madi not wired to `--font-family-*` | code | B1 | `layout.tsx`, `next/font` |
| Icons (L7) | Figma icon SVGs hardcode `#808080`, ignore dark mode | code | B2 | render via CSS mask (`AlertIcon` pattern); do not edit/create SVGs |
| Avatars (L8) | Progress ring + Badge-Square-Pilled counter overlay not built | code | B5 | `Badge square-12` exists; arc data unreadable, use 2px assumption |
| Avatars (L8) | Story ring stroke assumed 2px | figma | - | stroke weight unreadable |
| Badge (L9) | Token names recovered by hex; shade may be neighbour | figma | - | needs variable names |
| Badge (L9) | Icons/dot use text color (Figma one shade off); shadows `/1` on solid only | code | B3 | token tweak |
| Badge (L9) | Square-Rounded 60 text 14/24 (Figma 11/20); Icon-Rounded 16 r6 (Figma r4) | code | B3 | `badge.tsx` |
| VerifyIcon (L10) | Material `verified` path, not Figma vector; 500 shade assumed | asset | - | user exports vector |
| Layer visibility (L11) | TalkToFigma gives no visibility / stroke weights | none | - | tool limitation |
| Code Connect (L12) | not set up | none | - | needs official MCP, out of scope |
| Blur/shadow (L13) | 15px backdrop blur and `0 1px 2px` shadow are literals in `button.tsx`/`alert.tsx` | code | B3 | extract to tokens/consts; Figma values unverified |
| Breadcrumb (L14) | Last item rendered Selected vs Figma all Default | none | - | deliberate current-page a11y |
| Breadcrumb (L14) | Arrow `Active` unused in Figma | none | - | |
| Breadcrumb (L14) | Icon glyphs base-500 on Base badges (Figma #808080) | none | - | same hex-match, fine |
| Button (L15) | Shadows `/1` on all states (Figma `/3` on few Hover) | figma | - | confirm which variants |
| Button (L15) | `icon-16` r4 vs Figma Icon-type 16 r6 | code | B3 | `button.tsx` |
| Button (L15) | `ButtonCounter` badge size/style explicit | none | - | documented map |
| Button (L15) | Figma names two soft sets wrongly | none | - | Figma-side typo |
| Button Group (L16) | size/shape must match children (no context) | code | B5 | add context |
| Button Group (L16) | Rounded Default 60 uses 1px gap in Figma (10px narrower) | code | B3 | |
| Button Group (L16) | Not added via `shadcn add`; `ButtonGroupText` left out | none | - | not in Figma |
| Calendar (L17) | Event scheduler custom, not shadcn Calendar | none | - | decision |
| Calendar (L17) | Time pills primary-600 vs Figma -650 | code | B3 | nearest token / no -650 token; verify |
| Calendar (L17) | Year view not built | code | B5 | shadcn `Calendar` mini months; mini months on other Figma page |
| Calendar (L17) | Mobile week 40px time column (Figma narrows) | figma | - | exact width unread |
| Tabs (L18) | `pill` only Switcher Small (32) Fill; full Switcher needs own page | figma | - | |
| Tabs (L18) | Pill 28 left/right icon + badge slots not built | code | B5 | slots in `tabs.tsx` |
| Input (L19) | Colors hex-matched to Light tokens, no variable names | figma | - | |
| Input (L19) | Ring 4px inset, stroke weight unread; disabled fade opacity-50; paddings guessed | figma | - | |
| Input (L19) | Filled uses `:placeholder-shown`, inputs need placeholder | code | B3 | document/guard |
| Input (L19) | `material-help` Material path not Figma vector | asset | - | |
| Input (L19) | Field/InputGroup size/shape must match (no context) | code | B5 | context |
| Input (L19) | Select, Country flag, Payment card slots not built | code | B5 | Select primitive exists via NativeSelect; flags need asset (see TableCell) |
| Checkbox (L20) | Hex-matched, disabled glyph/colors guessed, text colors inconsistent in Figma | figma | - | |
| Checkbox (L20) | Check glyph Material, minus hand-drawn | asset | - | |
| Checkbox (L20) | Disabled card/links `opacity-50` unreadable; ring on checked focus not in Figma | figma | - | |
| Checkbox (L20) | Text Dislabled Horizontal shows default box (code uses disabled box) | none | - | deliberate |
| Radio (L21) | Hex-matched; dot 10/8px; `Disabled checked`, focus ring not in Figma; text-card padding differs | figma | - | |
| Switcher (L22) | Hex-matched; On Disabled colors from export; stroke weight, knob shadow, opacities unreadable | figma | - | |
| Switcher (L22) | Dislabled Horizontal shows plain Off | none | - | deliberate |
| Text Area (L23) | Reuses Input colors/states; paddings, min-heights from exports; ring/stroke unreadable | figma | - | |
| Text Area (L23) | Resize grip native, in corner (Figma ~16px in) | code | B3 | custom grip optional; low value |
| Text Area (L23) | Default Top/Bottom text 11/20 (Figma 12/20) | code | B3 | `textareaFieldSize` |
| Divider (L24) | Hex-matched to Neutral gray; thickness/gap from bboxes | figma | - | |
| Divider (L24) | Material add icons, not Figma vectors | asset | - | |
| Divider (L24) | Button Icon "+" base-800 vs Figma #808080 | code | B3 | |
| Divider (L24) | Button Group type lines squeeze to 0 in 180px frame | none | - | Figma stray rectangles |
| Tooltip (L25) | Hex-matched; notch size and `0 16px 32px` shadow guessed | figma | - | |
| Tooltip (L25) | 2 Lines fixed 20px gap | figma | - | |
| Tooltip (L25) | `TooltipDot` only 600 shade (Figma 50–500, White, Black) | code | B3 | add shades via cva |
| Progress (L26) | Hex-matched, arc stroke 2px, gradient from export, circular text 700 only Primary verified | figma | - | |
| Progress (L26) | Line value label after bar vs over its end | none | - | deliberate |
| Progress (L26) | Dot Hover/Active static `state` prop | none | - | |
| Slider (L27) | Hex-matched, thumb stroke 1px, track layers missing, bubble offset estimated | figma | - | |
| Slider (L27) | Range Small Primary solid dots vs Runner; disabled opacity, focus ring not in Figma | none | - | |
| Steps (L28) | Hex-matched, gradients, paddings, line weights from exports | figma | - | |
| Steps (L28) | Check Material, dot plain circle | asset | - | |
| Steps (L28) | Group-02 Fill (two rows?) one stretched row | figma | - | |
| Loader (L29) | Hex-matched; ring width/arc measured; spin speed, inline 16, `current` not in Figma | none | - | |
| Loader (L29) | Container drop shadow omitted | none | - | near invisible |
| Command Key (L30) | White variant not theme-aware | code | B3 | token via `white-*`; fixed by design |
| Command Key (L30) | Modifier glyphs fallback font until Inter loads | code | B1 | solved by font wiring |
| Command Key (L30) | Ignored Figma inconsistencies | none | - | |
| Input OTP (L31) | Hex-matched; disabled-with-value text assumed; separator not in Figma | figma | - | |
| Input OTP (L31) | Caret is bar, not "|" glyph; typing/focus not browser-tested | open | B6 | step-guarded: only reachable after Clerk sends a real code (signed out); not checked |
| Counter (L32) | Hex-matched; hover shadow estimated; Error stroke danger-500 vs -600; ring outside; Micro Pilled icon 12 vs 16 | code | B3 | `counter.tsx` — read exports to decide; Micro icon 16 is code-fixable |
| Counter (L32) | `material-remove.svg` Material, not Figma vector | asset | - | |
| Status (L33) | Hex-matched; stroke weights inferred; half-pixel offsets at 125% zoom | figma | - | |
| Status (L33) | Drop shadow guessed; Color Border 0 falls back to 1px ring | none | - | |
| Links (L34) | Hex-matched; Active 2 pill colors guessed; paddings estimated; disabled opacity/focus not in Figma | figma | - | |
| Links (L34) | Icons/Dropdown slots Material/placeholder | asset | - | |
| Links (L34) | `BreadcrumbLink`, `CheckboxCardLink` don't reuse Link | code | B3 | refactor to Link |
| Color Input (L35) | Hex-matched, stroke weights, Rose #dd0042, r1 token missing | figma | - | |
| Color Input (L35) | `InputGroupSwatch` shape must match input shape (no context) | code | B5 | context |
| Color Input (L35) | No text field/selected/hover/focus states in Figma | none | - | |
| Double Input (L36) | Reuses Input colors so Active stroke base-200 (Figma #808080), Filled text base-900 | code | B3 | per-input tokens |
| Double Input (L36) | Joined radius/gaps read from exports; Pilled identical to Rounded; Large/Small/Micro gaps unverified | figma | - | |
| Double Input (L36) | Select chevron Material `unfold_more` | asset | - | |
| ActivityIcon (L37) | Deadline check hand-drawn from PNG | asset | - | swap for Figma vector |
| Input Group (L38) | Hex-matched; paddings from widths; Pilled Large/Small widths unread; Playground not read | figma | - | |
| Input Group (L38) | Payment (Mastercard), Country flag slots not built; Select chevron Material | asset | - | |
| Input Group (L38) | Browser check vs spec only, re-check vs exports | figma | - | needs Figma channel |
| Input Custom (L39) | Stroke/ring widths unreadable; disabled dimming; help icon color; Large inset 20 vs 16 | figma | - | |
| Input Custom (L39) | Slot layers keep light colors inside glass inputs | code | B3 | color inheritance |
| File Input (L40) | Hex-matched; ring/opacity unread; Playground frames not read | figma | - | |
| File Input (L40) | `material-help` Material | asset | - | |
| File Input (L40) | Console errors not inspected live | moot | — | `ui/file-input.tsx` removed in a9183ee; live `FileUpload` (ProjectFormDialog) checked in Chrome 2026-11-13, no console errors |
| File Upload (L41) | Icons redrawn from Material paths, not Figma | asset | - | |
| File Upload (L41) | Dash pattern, stroke, disabled opacity, hover/focus rings, shadows, Playground unread | figma | - | |
| File Upload (L41) | Retry icon 14 vs Figma 20; close icon 16 | code | B3 | |
| Payment Card Input (L42) | No Figma dump; stroke/radius/ring unread; Playground frames not inspected | figma | - | |
| Payment Card Input (L42) | Mastercard artwork hand-drawn; help icon Material | asset | - | |
| Payment Card Input (L42) | `PaymentCardBrand` shape `pilled` vs `pill` elsewhere | code | B3 | align names |
| Payment Card Input (L42) | Other brands (Visa…) not in Figma | asset | - | |
| Payment Card Input (L42) | Default-cell text color differs between sets | none | - | |
| Add Avatar (L43) | No dump; hex matched; gaps inferred from bboxes; layers assumed hidden | figma | - | |
| Add Avatar (L43) | material-account_circle not exported | asset | - | |
| Add Avatar (L43) | "Chnage Image" typo shipped as "Change Image" | none | - | fixed in code |
| Mail Input (L44) | Browser check not done; focus ring shadow, wrapper stroke unread; sender avatar overlays not drawn; card shadow not applied | figma | - | |
| Mail Input (L44) | Attach/mood icons reuse Material | asset | - | |
| Mail Input (L44) | Replay chevron assumed | figma | - | |
| Mail Input (L45) | Paperclip vertical in Figma vs horizontal; zoom_out_map not visible | figma | - | |
| AI Input (L46) | No tree; White set values assumed; Menu-Dropdown-Rounded in Create not built | figma | - | |
| AI Input (L46) | arrow-upward/tune/language icons hand-written; placeholder image icon | asset | - | |
| AI Input (L46) | Attachment hover close fade, Active ring width unverified | figma | - | |
| Text Area Editor (L47) | No dump; radii, footer heights, opacity, icon colors, ring unread; no visual comparison | figma | - | |
| Text Area Editor (L47) | Footer Outline-Button icon material-add not read | asset | - | |
| Tabs Switch (L48) | No tree; Pilled/Icon/Vertical sets assumed equal; vertical XS (28) item size missing | figma | - | |
| Tabs Switch (L48) | Icon lucide CircleIcon placeholder for material-default-icon | code | B3 | use existing default icon mask |
| Misc (L49) | Icon colors read from pixels, Upload Active 2/3 inferred, shadow inferred | figma | - | |
| Misc (L49) | Map and Dark-Mode screenshot raster exports | none | - | |
| Dropdown (L50) | Colors/radii/paddings/opacity guessed; Head-Footer shells only | figma | - | |
| Dropdown (L50) | Lead/trail slots not built (payment, avatar, flag, checkbox, radio, switch) | code | B5 | compose existing primitives |
| Dropdown (L50) | No flag/mastercard assets | asset | - | |
| Dropdown (L50) | Preview body text renders serif (no `font-sans` on page main) | code | B1 | |
| Popover (L51) | No effects/stroke/arrow data; dark mode not read | figma | - | |
| Popover (L51) | Figma inconsistencies (close 20 vs 16, Back/Next 4px) | none | - | |
| Dialog (L52) | Tree missing; Black type, button size 24 unread; shadow/overlay assumed | figma | - | |
| Dialog (L52) | Black Cancel uses black-soft (darker than Figma) | code | B3 | pick variant |
| Modal (L53) | Form, Switcher-List/Payment/Users, Files, 2FA, Pin copy and field lists guessed | figma | - | |
| Modal (L54) | Date-Range has no Calendar range; Payment State no Select primitive | moot | — | Modal removed in a9183ee (9f-6) |
| Modal (L54) | Welcome omits Player-Video | figma | - | no primitive |
| Modal (L54) | Head icon placeholder material-default-icon | asset | - | |
| Modal (L54) | Backdrop opacity, card shadow unread | figma | - | |
| Toast (L55) | Black variant colors not read from node; close icon color/shadow, hover/focus unread | figma | - | |
| Toast (L55) | Ring dot icon approximated with CSS (no asset) | asset | - | |
| Notification (L56) | Stroke widths/effects unreadable | figma | - | |
| Notification (L56) | Banner/avatar images placeholders | asset | - | |
| Command (L57) | Search/flag/logo/menu, Undo, Select All, Find, Instagram, ↵/Esc icons absent; banner gradient image absent | asset | - | |
| Command (L57) | Tab/preview-panel sizing approximated | figma | - | |
| Color Picker (L58) | Gradient stops/eyedropper visual only, no token for hexes | code | B5 | wire eyedropper (EyeDropper API) optional |
| Color Picker (L58) | Rounded variant bits read from PNG only | figma | - | |
| Date Picker (L59) | Icon assets/counters hidden in Figma; Active First/Last square per spec | figma | - | |
| Action Panel (L60) | Hidden Top/Bottom rows, tag/button slots, leading media not shown | figma | - | |
| ContentCard (L61) | Material icons added from standard paths | asset | - | |
| ContentCard (L61) | Shopify/Adobe Aero logos and gradient photos missing | asset | - | |
| ContentCard (L61) | Avatar Progress ring, Badge-Square-Pilled counter not shown | code | B5 | after Avatars ring built |
| Card Content (L62) | Shopify logo missing, logo-adobe placeholder | asset | - | |
| Profile (L63) | Miro logo, banners, Facebook glyph not exported | asset | - | |
| Profile (L63) | Counter/trailing icons in Dark/Ghost buttons omitted (hidden in Figma) | none | - | |
| Profile (L63) | Avatar verify color assumed primary | figma | - | |
| Message (L64) | Emoji image fills have no asset (platform emoji stand-in) | asset | - | |
| Message (L64) | Source Code Pro not loaded, uses font-mono | code | B1 | `next/font` |
| Message (L64) | Tag avatar/dot/icon slots hidden in Figma | none | - | |
| Task (L65) | Cover image fill no export (banner-1.png) | asset | - | |
| Task (L65) | Label tint gradients nearest alpha; glyphs use nearest masks | asset | - | missing icons list |
| QR Code (L66) | No Figma Code image; slot + placeholder | none | - | slot is the design |
| Carousel (L67) | Primary dot stroke base-alpha-20 (no exact token) | none | - | |
| Carousel (L67) | Primary-tone arrows (black-soft) not in Figma | none | - | |
| TableCell (L68) | Sort Up/Down artwork unreadable (chevrons) | figma | - | |
| TableCell (L68) | Country/Crypto/Logotype/Brand artwork missing | asset | - | |
| TableCell (L68) | Sizes per cell approximated; Head & Select Primary as Border style | figma | - | |
| Navbar (L69) | Hidden Menu link icons/counters, Search slots not built; Navigate-02 Back button not shown | none | - | hidden in Figma |
| NavbarMenu (L70) | Item icons unnamed instances, closest icons used | asset | - | |
| NavbarMenu (L70) | Panel shadow unreadable, reuses dropdown shadow; image placeholders gray | figma | - | |
| Navigate Head (L71) | phone, edit, send, sort, grid, branch, tag, arrows, group icons missing | asset | - | |
| Navigate Head (L71) | Head-07 cover banner-1.png (gradient image) | asset | - | |
| Navigate Head (L71) | Stroke/shadow weights from images | figma | - | |
| Navigate Footer (L72) | Facebook/Pinterest glyphs missing | asset | - | |
| Navigate Footer (L72) | Hidden language icon, Counter, flag-dot | none | - | hidden in Figma |
| Pagination (L73) | No active state in Figma; `isActive` uses Button primary stand-in | none | - | decision |
| Pagination (L73) | Hidden Counter/icon layers not rendered | none | - | |
| Sidebar (L74) | Facebook/X glyphs PNG brands (blank-looking buttons) | asset | - | |
| Sidebar (L74) | Left-slot swaps not exposed (compose any child) | none | - | |
| Sidebar (L74) | Sidebar-08 menu shadow `shadow-lg`; Sidebar-07 active base-alpha-5 | code | B3 done | use `--shadow-base` |
| Chart (L75) | Series data, geometry, strokes, tooltip placement approximated | figma | - | |
| Chart Component (L76) | Plugin gives no vector geometry; shapes generated | figma | - | |
| Chart Component (L76) | Chart-Dot Border=2, Pie/Donut ring width from images | figma | - | |
| Chart Metric (L77) | check_circle and bar_chart icons missing, slots empty | asset | - | |
| Chart Metric (L77) | Geometry and Image-type fill approximated | figma | - | |
| Chart White (L78) | white-alpha-10 (no exact token) | none | - | |
| Chart White (L78) | Data/geometry approximated | figma | - | |
| Chart Card (L79) | `material-bar_chart.svg` missing (user writes it) | asset | - | |
| Chart Card (L79) | Stroke widths, effects, dark gradient end read from images; tooltip pinned | figma | - | |
| Auth Templates (L80) | `brands/google.svg` and `apple.svg` missing, social buttons 404 | asset | - | |
| Auth Templates (L80) | QR image placeholder; shadow/stroke weights from image | figma | - | |
| Navigate Sidebars Footers (L81) | Many icons referenced by path only (list) | asset | - | |
| Navigate Sidebars Footers (L81) | Tree indents/guide line approximated; Head switcher 32 vs 36; hidden badges | figma | - | |
| Code Snippet (L82) | Source Code Pro not loaded, uses font-mono | code | B1 | `next/font` |
| Code Snippet (L82) | Hidden counter/icon in copy button | none | - | |
| Mockups (L83) | Bezel art bitmap not exportable; checkerboard screen not reproduced | asset | - | |
| Sign In (L84) | Slides 2–6 generated crops of hero.jpg | asset | - | |
| Sign In (L84) | Forgot password link to `/forgot-password` (page not built) | code | B4 done (stale, verified wired) | |
| Sign In (L84) | 2FA/verification steps not wired | code | B4 | Clerk flow; overlaps queue #5 |
| Sign In (L84) | Apple/Facebook/Google need enabling in Clerk Dashboard | none | - | user dashboard action |
| Sign Up (L85) | `/verify` page missing (queue #5) | code | B4 done (stale, verified wired) | belongs to queue #5; keep out of 9x if already planned |
| Check Your Email (L86) | Reset code cannot be entered (/verify not built) | code | B4 done (stale, verified wired) | same as above |
| Check Your Email (L86) | Shared split layout instead of Figma header/footer | none | - | user choice |
| Dashboard (L87) | Night Mode switch not wired to theme | code | B4 done (stale, verified wired) | `next-themes` or `.dark` toggle |
| Table (L88) | Product photos not in public/images (banner placeholder) | asset | - | |
| Table (L88) | Header sort built beyond Figma | none | - | |
| WidgetBoard (L89) | 5-tile rows not reproduced; odd chart leaves gap; chart 540 vs 528 (shared row-span); 768 rail narrows board | code | B5 | `WidgetBoard` layout |
| ProjectStats (L90) | No design-system preview page; `stat` variant not previewed | moot | — | design-system previews dropped in a9183ee |
| ProjectStats (L90) | KPI 2 columns below xl | none | - | decision |
| ProjectEventsCard (L91) | Task kind color (purple assumed) not read | figma | - | |
| QuickAddCard (L92) | No click handlers except Project | code | B4 done (stale, verified wired) | dead controls |
| FinanceMetricCard (L92) | Amounts rounded, locale currency vs Figma grouping | none | - | decision |
| ProjectSummaryCard (L93) | none open | none | - | |
| ProjectMembersCard (L94) | Row gap 6px not measured; avatar overlays omitted | figma | - | |
| ProjectMembersCard (L94) | `ui/member-row.tsx` no preview page | moot | — | design-system previews dropped in a9183ee |
| ProjectPage (L95) | No 360 frame (stacks below lg) | figma | - | |
| ProjectPage (L95) | Non-Dashboard tabs have no panels | code | B4 | placeholder/empty state or real panels |
| ProjectPage (L95) | Dates dd.MM(.yyyy) not locale formatted | code | B3 done | `Intl`/date-fns via next-intl |
| DashboardSidebar (L96) | One Sidebar-01 truncates long names; Figma 04 lists unused | none | - | user decision |
| DashboardSidebar (L96) | Android/Banner/Website have no brand logo (default.svg) | asset | - | |
| ProjectPage (L97) | Non-Dashboard tabs empty state (no frames) | figma | - | same as L95 |
| ProjectPage (L97) | Logos not uploadable (Phase 4) | none | - | backend phase |
| Projects page (L99) | Column layout between lg and xl, 36px sides | none | - | decision |
| ScrollArea (L100) | Thumb fixed 4x96; Base UI limits | none | - | |
| ScrollArea (L100) | Footer back-to-top button has no action | code | B4 done (stale, verified wired) | scroll to top of ScrollArea viewport |
| ComingSoon (L101) | Toast motion/position unspecified in Figma | none | - | decision |
| ProjectForms (L102) | No Figma frames; stage reorder up/down, no second overlay on nested confirm | none | - | decision |
| NativeSelect/Textarea (L103) | No Figma select component read | figma | - | |
| QuickAddCard (L104) | No chat screen; no DM recipient picker | code | B4 | feature, large; defer |
| UploadFilesDialog (L105) | No Figma frame; no upload progress (supabase-js) ; no URL import | none | - | platform limit |
| UploadFilesDialog (L105) | Uploaded file link plain hover underline | code | B3 done | use `Link` |
| ProjectFormDialog logos (L106) | Two 200px drop areas make dialog scroll; no current-logo preview; no remove logo | code | B4 | |
| Dashboard metric tiles (L107) | Sparkline placeholder art; Head "…" decorative | none | - | |
| RadialChart (L108) | progress-half browser check not run (auth) | done | B6 | Chrome 2026-11-13: Task completion widget renders 60%, no console errors |
| Widgets (L109) | Candle/map demo data hidden from picker | none | - | |
| Projects table widget (L110) | No Figma frame for projects columns | figma | - | |

## Batches

Code-only, ordered by value/risk. Each ≤ ~6 files. Fixed lines get removed from known-gaps.md in the batch that fixes them.

### B1 Theme wiring: shadcn vars + fonts
Map shadcn vars to tokens; load Inter/Playfair/Roboto/Merriweather/Ms Madi/Source Code Pro with `next/font` onto `--font-family-*` (replace Geist); `font-sans` on design-system page main (Dropdown serif). Gaps: L5, L6, L30 (font part), L50 (serif), L64/L82 (Source Code Pro).
Files: `src/app/layout.tsx`, `src/app/globals.css`, `src/styles/tailwind-theme.css` (or `scripts/build-tokens.mjs` if generated), `src/app/design-system/layout`/dropdown page. Risk: medium (global look); check build.

### B2 Icon dark mode
Hardcoded `#808080` in `public/icons` ignored by dark mode: add a shared `Icon` mask component (token colored, `AlertIcon` pattern) and switch `<img>` consumers over, without editing the SVGs. Gap: L7.
Files: `src/components/ui/icon.tsx` (new), the 3–5 heaviest `<img src="/icons/...">` consumers (grep first). Risk: low-medium.

### B3 Token/variant fixes
Small values fixable from tokens: Badge r4/text size (L9), Button `icon-16` radius (L15), Button Group 60 gap (L16), Textarea default text size (L23), Divider "+" color (L24), TooltipDot shades (L25), Counter Micro icon (L32), BreadcrumbLink/CheckboxCardLink reuse Link (L34), Double Input tokens (L36), Input Custom slot colors (L39), File Upload retry icon (L41), `PaymentCardBrand` shape name (L42), Tabs Switch default icon (L48), Dialog Black Cancel (L52), Sidebar shadows (L74), blur/shadow constants (L13), ProjectPage date formatting (L95), UploadFilesDialog link (L105), Calendar pill text (L17).
Files: `badge.tsx`, `button.tsx`, `tooltip.tsx`, `counter.tsx`, `double-input.tsx`, `link.tsx` + consumers. Split into two tasks if it exceeds 6 files. Risk: low.

### B4 Dead controls and flows
Night Mode switch to theme (L87), footer back-to-top (L100), QuickAddCard handlers (L92), non-Dashboard project tab panels / empty state (L95/L97), ProjectFormDialog logo area (L106), Forgot password page + verify steps (L84–L86, only if queue #5 has not covered them). Chat screen (L104) deferred (feature, not a gap fix).
Files: dashboard sidebar, footer component, `QuickAddCard`, `ProjectPage`, `ProjectFormDialog`, auth pages. Risk: medium; verify with browser.

### B5 Missing variants and slots
Avatar Progress ring + Badge-Square-Pilled overlay (L8, L61), size/shape context for Field/InputGroup/ButtonGroup/InputGroupSwatch (L16, L19, L35), Tabs pill icon/badge slots (L18), Calendar year view (L17), Date-Range calendar + Select in Modal (L19, L54), Dropdown lead/trail slots (L50), WidgetBoard layout (L89), Color Picker eyedropper (L58).
Files per sub-task ≤ 6; split by component when run. Risk: medium.

### B6 Previews and browser checks
Add `/design-system/project-stats`, `member-row` preview (L90, L94); browser check Input OTP typing/focus (L31), File Input console (L40), RadialChart progress-half (L108). Files: `src/app/design-system/*/page.tsx`. Risk: low.

## Not code-fixable now
`figma` rows need a TalkToFigma re-read (or the official MCP) before any change; `asset` rows need the user to provide the icon/logo/image (listed in the table, never create SVGs).
