# Mail Input spec
Figma page 12273:34772 ("Forms: Mail"). Set `Add-Mail-Input` 12273:40969 (440x1061 canvas, purple dashed frame = doc only). Slug `mail-input`.
Also on page: Playground 16072:337637 (not read), Head-Design-System, Base rect (ignore).
Export: 2 variants stacked.

## Variants
| prop | values | node |
|---|---|---|
| State | Default | 12273:40970 |
| State | Active | 12273:73317 |
Each comp 280x248.

## Layout (both states)
Root col 280w, gap 12 (Head y80-120, Content y132). Head 40h, Content 196h.

| part | size | detail |
|---|---|---|
| Head 12273:73137 | 280x40 | row, space-between, center |
| Avatar group | 116x40 | row gap 16: Avatar-Image 40x40 + name |
| Avatar-Image | 40 | existing Avatar instance: Image r300, Story ring 46 (#2563eb stroke), Progress ring, Status dot 8 (#22c55e) at bottom-right, Badge-Square-Pilled 16 r16 red gradient #ef4444-#dc2626 top-right. Reuse `add-avatar`/`avatar` |
| Name "John Smith" | 60x20 | Inter 600 11/20, fill #4d4d4d |
| Outline-Button "Replay" | 89x32 r32 | existing Button outline; pad 12 L/R, icon 16 L (hidden?), text Inter 700 11/20 #333333, trailing chevron icon 16 (at x324). Fill grad #fff to #fafafa, stroke grad #ededed to #e6e6e6 |
| Content card | 280x196 r16 | fill #ffffff, pad 16, col |
| Card Head | 248x20 | row space-between: Left = email text "noreply@gumroad.com" Inter 600 11/20 #4d4d4d; right icon material-zoom_out_map 20x20 (y offset +6, i.e. centered of 32 row? gap to body 16) |
| Card Body | 248x48 | placeholder text "Type yor Mail" (sic) Inter 600 11/20; top at head+36 (gap 16 after head) |
| Footer | 248x64 | col gap 12 |
| Footer Group | 248x20 | row space-between: Icon row 180w (6 icons 20x20, gap 12) + material-delete 20 right |
| Footer Send button | 248x32 r32 | Outline-Button full width, label "Send" centered Inter 700 11/20 #333333; icons hidden (Icon/Counter children present, likely invisible) |

Icon row order: material-format_color_text, material-attach_file, material-link, material-sentiment_satisfied, material-photo, material-more_vert. Right: material-delete. Card head: material-zoom_out_map.

## State diffs
| | Default | Active |
|---|---|---|
| Content stroke | #e6e6e6 solid, 1 | inner card stroke #cccccc; outer wrapper 13700:3580 (280x196 r16) stroke #808080 @20% opacity = focus ring (width appears ~4 from image; Gaps) |
| placeholder text | #4d4d4d | #333333 |
| structure | Content 12273:40972 directly | Content 13700:3580 wraps inner Content 12273:73323 |
Active = focus-within state of card. Hover/disabled: none in Figma.

## Tokens (hex match to Light, Neutral gray; token unknown unless matched, REST dump absent)
| hex | likely token |
|---|---|
| #4d4d4d | base-700 (verify) |
| #333333 | base-800 (verify) |
| #e6e6e6 | base-200 (verify) |
| #cccccc | base-300 (verify) |
| #808080 @20% | base-alpha-* / base-500 at 20% (verify) |
| #ffffff | background-0 |
| #2563eb story ring, #22c55e status, red badge | covered by Avatar component |
| button grads | Button outline variant (existing; variable ids 3876:14031 / 3876:14028) |
Font: Inter 11px/20 (text-11? check tailwind-theme; 11 may not exist, builder verify), weights 600 text / 700 buttons.

## Reuse (from graph-context)
ui/input-group, ui/text-area, ui/button (outline), ui/avatar / add-avatar, ui/separator not needed.
Card: textarea body + InputGroup addons for head/footer plausible; builder decide.

## Icons
Material icons (20x20): zoom_out_map, format_color_text, attach_file, link, sentiment_satisfied, photo, more_vert, delete; chevron 16 in Replay button. No assets dump (`design/figma-dump/12273-34772` missing, `pnpm figma:fetch` not tried). Check `public/icons/` for existing material-*.

## Gaps
- No tree.txt: token names, exact padding/gap inferred from bounding boxes; all hex-to-token mapping is guess.
- Focus ring stroke weight, effects/shadows (image shows soft shadow on card), visibility of hidden button icons/counter not readable.
- Replay chevron icon identity unreadable (instance names "Icon").
- Playground frame 16072:337637 not inspected.
- Typo "Type yor Mail" in Figma; keep or fix = builder call.
