# Misc — spec

Page `460:6121`, slug `misc`. GRAB-BAG: 6 unrelated sets. Recommend NO single `/design-system/misc` component. Build only items marked NEW-small; skip doc-only.

## Parts map

| Set | Node | Variants | Maps to | Verdict |
|---|---|---|---|---|
| Map | `4120:45264` | Style=Light `1043:92601`, Style=Dark `13536:17017`; each 1600x1145 | none (static map image, light/dark) | Asset only: export PNG to `public/` if a page needs it. Not a component. Maybe `next/image` swap by theme |
| Scroll | `4293:18196` | Type=Vertical/Horizontal x Size=32,60,92,120,160,256,512 (vertical) / 92,120,160,256,512 (horizontal) x State=Default/Active (24 total) | none exact. Scrollbar thumb. Closest `src/components/ui/slider.tsx`/`separator.tsx`; shadcn `scroll-area` | NEW: `ScrollArea` (shadcn `scroll-area`, add base, thumb styled via cva) |
| Close | `11956:33166` | Type=Default/Hover/Active + Style=Base; Type=Active Style=Disabled (4) ; 20x20 | Icon button close. Alert/Banner already have close slots (`AlertClose`). Check `button.tsx` icon size | Reuse existing close slot / `Button` icon variant. Maybe add `CloseButton` slot only if no existing |
| Upload | `11956:33373` | Type=Default, Hover, Active, Active 2, Active 3; 20x20 | Refresh/reload icons (NOT upload arrow): circular arrow x5 | Icon assets only. Possibly loader/refresh icon; maps to `loader.tsx`/`spinner.tsx` states? no, static icons. Export SVGs |
| Head-Design-System | `13771:13296` | Size=84 `13771:10332` (918x432), 72 `13771:13297` (918x408), 64 `13771:13300` (918x360), 52 `13771:13305` (918x248), 40 `13771:13311` (918x172) | Figma doc page header ("Avatars" title + "One Design System" subtitle) | SKIP. Figma documentation chrome |
| Dark-Mode | `15607:648872` | Type=Default `12780:35733` 900x1345 | Instructions screenshot "Enable Dark Theme" | SKIP. Doc only. Dark mode already via `.dark` in `color-mode.css` |

Also on page: 3 `Base` rectangles (`16259:100961/100965/100966`) = page backdrop, skip; instance `13784:91387` Head-Design-System = doc header.

## Scroll (only real new component)

| Prop | Values |
|---|---|
| Type | Vertical (w4, h = Size), Horizontal (h4, w = Size) |
| Size | 32, 60, 92, 120, 160, 256, 512 (Horizontal has no 32/60) |
| State | Default, Active |

- Single rect, no children. Radius 8 (pill at 4px width).
- Default fill `#d9d9d9`; Active fill `#808080`. Token unknown; match gray tokens in `src/styles/color-mode.css` (likely base-alpha or base-200/base-400). Verify.
- Map to shadcn `scroll-area`: thumb 4px, rounded-full, Default color idle, Active color on hover/drag. Size = container length, not a prop in code.

## Close

- 20x20, single child instance `material-close` (icon). Types: Default, Hover, Active, Disabled (Active+Style=Disabled).
- Colors unreadable via TalkToFigma (instance fills not returned). Gap.
- Icon asset: `material-close`, not in dump.

## Upload (actually refresh icons)

- 20x20, child instance `Icon`. Default gray, Hover (blue per export), Active dark gray, Active 2 circular arrows (two-way), Active 3 reverse arrow. Export order seen: gray, blue, dark gray, double-arrow, counter-arrow.
- Colors: gray ~`#808080`, blue ~primary-500, dark ~base-700. Token unknown.

## Gaps

- `pnpm figma:fetch 460-6121` crashed (Node async assertion, not 429); no `design/figma-dump/460-6121/tree.txt`, no assets, no token names.
- Close/Upload icon fills, hover colors, SVG assets not read.
- Scroll token names unresolved (hex only).
- Map is raster; source file not downloaded.
- Did not read Head-Design-System/Dark-Mode layers (doc chrome).

## Recommendation for builder

1. Do `scroll` only: `ScrollArea` at `/design-system/scroll` (or `misc`).
2. Close: confirm existing close slots; add only if missing.
3. Upload icons: export SVGs if a consumer needs them.
4. Mark queue `misc` done after Scroll.
