# Status (Figma handoff)

- Page: `9463:285753` ("❖ Status")
- Component set: `459:14` "Status" (COMPONENT_SET, 532x336 frame, r40, stroke #d8b4fe dashed presentation frame)
- Other page children: `16237:638676` Base (rectangle), `13775:6391` Head-Design-System (instance, ignore)
- Slug: `status`
- Export: PNG of 459:14 at scale 1 (local copy: C:\Users\grdze\.claude\projects\E--girhub-ecormce-webstie\fc4bfe87-5897-49e1-9d4c-29f039fdc765\tool-results\mcp-TalkToFigma-blob-1793374069945-v3a4u1.png). Shows a grid of dots: columns Center Border 0 / Border 1 / 2 / 3 (filled dot with 0..3px white inner ring) then Border-type rings 1/2/3 (white fill, colored ring).

## Is it the same as Avatar status / BadgeDot?

Same family but not identical. Status is a bare 8x8 circle, no children. Code in `src/components/ui/avatar.tsx` `AvatarBadge` ("Figma Status online dot") is one instance of it: an 8-ish dot at bottom-right, `bg-success-500` (Online = #22c55e), but it has no white ring and no border variants. `BadgeDot` in `badge.tsx` is a different Figma part (6px "Dot" inside Badge, `bg-current`). Recommendation: add a standalone `Status` ui component (`status.tsx`, cva `type` x `border` x `color`, 8x8 rounded-full) and let `AvatarBadge` compose it (Online/Offline/Work/Busy + white ring border 1-3 to separate from avatar photo). Leave BadgeDot alone.

## Variant properties (60+ components, all 8x8, cornerRadius 8)

- `Type`: `Color Center`, `Color Border`
- `Border`: `0` (Center only), `1`, `2`, `3` (Border type has 1,2,3 only)
- `Style` (colors, hex):
  - Semantic: Primary #2563eb, Online #22c55e, Offline #999999, Work #facc15, Busy #ef4444
  - Palette: Orange #ea580c, Purple #9333ea, Yellow #ca8a04, Green #16a34a, Sky #0284c7, Pink #db2777, Red #dc2626, Gray #cccccc

Count: 13 styles x (Center 0,1,2,3 + Border 1,2,3) = 91 minus none; Primary/Online/Offline/Work/Busy Center Border=0 exist too (all 13 styles have Center Border=0).

## Parts / styling

- Size is always 8x8 (bounding box); Border value changes only the stroke weight (1/2/3px) which TalkToFigma does not report, so the weights are inferred from the export.
- Type=Color Center: fill = style color, stroke = #ffffff (white ring, inside, weight = Border; Border=0 has no stroke). Visually the colored dot shrinks as the white ring grows.
- Type=Color Border: fill = #ffffff, stroke = style color (colored ring, weight = Border 1/2/3).
- Radius 8 (full circle). No text, no icons, no effects readable.
- Token guess (Light tokens, matched by hex; names unverified): #2563eb primary-600 (Blue theme), #22c55e success-500, #999999 base-400/500 neighbour, #facc15 warning/yellow-400, #ef4444 danger-500, #ea580c orange-600, #9333ea purple-600, #ca8a04 yellow-600, #16a34a green-600, #0284c7 sky-600, #db2777 pink-600, #dc2626 red-600, #cccccc base-200 neighbour, #ffffff background-0.

## States

None (static). No hover/focus/disabled variants.

## Icon assets

None.

## Gaps

- Stroke weight, stroke alignment (inside/outside), and variable names unreadable (TalkToFigma; no REST dump for this page, `design/figma-dump/9463-285753` absent).
- Primary #2563eb is Blue theme; if the theme switches it should be `primary-600` (check against `color-mode.css`).
- Border=0 for Center exists for all 13 styles; Border type has no 0.
- Offline/Gray hexes (#999999/#cccccc) are not exact palette matches; verify against tokens.
