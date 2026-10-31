# review chart attempt 1: REJECTED

Audit/scope/complete OK. Visual mismatches:

1. Bar-Chart 9794:1692 (all 3 Lines): Y category labels (Germany/USA/...) render left AND right at wrong spot, right copy overlaps value label ("2294" collides with "Germany"). Figma: category label left col, mirrored label right col, value text sits just right of each bar end (Inter 700 10/16 base-700), no collision. Fix: value label offset so it never overlaps right-col label; bar max length leave room.
2. Bar-Chart: row order reversed. Figma top = Sh Korea 711, bottom = Germany 2294. Ours Germany top. Reverse data order.
3. Bar-Chart: bars flat color. Figma Germany bar gradient (dark blue to light blue), each bar own hue gradient. Add `linearGradient` per bar via tokens.
4. Bar-Double-Chart 9795:987: same issues 1-3. Figma pair: 2 bars per row, 2nd bar lighter tint, values stacked left of each bar end (902/788 ...). Ours values overlap category labels ("2294 Germany", "1905 1878"). Fix overlap + order + gradient + lighter 2nd bar.
5. Progress-Chart 9815:3249 (both Types): Figma rings thick (~6px stroke), 7 rings, each with light track tint ring, arcs round caps, start top, ring gap tight, gradient-ish bright colors. Ours rings thin (~2px), gaps large, tracks barely visible. Thicken stroke, tighten radii so outermost ring ~ full image width, track color per-ring light token (primary-50/success-50/etc).
6. Progress-Half-Chart 9817:2793 No Text: ours renders tiny stub arc (~30px). Figma image img/progress-half-chart.png is 5K = small too, but recheck size vs node size in figma.md and match node W/H, same as Text variant.
7. Tooltip (ChartTooltipContent) all sets: text looks doubled/blurry in screenshot (bold halo). Figma Tooltip 9771 inst: text Inter 700 11/20 `background-0`, bg dark, no shadow on text. Check no `text-shadow`/duplicate render (recharts animation + defaultIndex). Fix so text crisp.
8. Line-Chart etc Left Y Data: last x label clipped ("Se"). Figma shows full "Sep". Add right padding/margin so Sep not cut.
9. Line-Chart 2 Y Data / Right Y: x axis first label cut ("m" for Jan) on Right Y/No Y. Add left margin.
