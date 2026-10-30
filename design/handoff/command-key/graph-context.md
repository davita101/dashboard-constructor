# Command Key — graph context

Query: `graphify query "Command Key: which ui primitives, cva variants, icons and design-system pages already exist that this should reuse" --budget 1500` (graph is stale: last `graphify update` after Loader was refused).

## PM notes (reuse plan)

- `src/components/ui/kbd.tsx` already exists (shadcn Kbd / KbdGroup). Extend it with cva variants from the spec; do not create a parallel primitive.
- Existing Kbd consumers: `src/components/ui/input-group.tsx` and `src/app/design-system/input/page.tsx`. Keep their current default rendering working (no breaking API change).
- Icons: lucide-react (e.g. Command, ArrowBigUp, Option, CornerDownLeft) for modifier glyphs, unless Figma uses custom SVGs.
- Preview page pattern: `src/app/design-system/button/page.tsx`.

## Raw graphify output

```
[graphify] note: this graph uses the pre-#1504 node-ID scheme; rebuild with `graphify extract --force` to get path-qualified IDs (fixes same-name-file collisions).
Graph: graphify-out/graph.json (1049 nodes) | Traversal: BFS depth=2 | Start: ['Design-system preview pages', 'Design-system Pages (checkbox, radio)', 'Design-system preview pages (src/app/design-system/<component>)', 'variants', 'primitives.css (palette, fonts, sizes, spacing, opacity, max-width)', 'Figma-first workflow order (Figma -> tokens -> components -> pages)', 'Switch cva Mapping (sizes, styles)', 'public/icons/material-check.svg', 'Slider graph context (reuse plan)', 'src/components/ui/separator.tsx (Separator)', 'Queue row #21 Steps (4313:48088)'] | 227 nodes found

[!] TRUNCATED: showing 51 of 227 nodes (~1500-token budget). The answer may be among the 176 cut nodes — raise the token budget to 6255 to get all 227 (CLI: --budget 6255, MCP: token_budget=6255) or narrow the query (e.g. context_filter=['call'], or get_node for a specific symbol).

NODE Design-system preview pages [src=CLAUDE.md loc=None community=6]
NODE Design-system Pages (checkbox, radio) [src=design/handoff/switcher/graph-context.md loc=None community=29]
NODE Design-system preview pages (src/app/design-system/<component>) [src=CLAUDE.md loc=None community=3]
NODE variants [src=src/app/design-system/button/page.tsx loc=L7 community=0]
NODE primitives.css (palette, fonts, sizes, spacing, opacity, max-width) [src=src/styles/primitives.css loc=None community=3]
NODE Figma-first workflow order (Figma -> tokens -> components -> pages) [src=CLAUDE.md loc=None community=3]
NODE Switch cva Mapping (sizes, styles) [src=design/handoff/switcher/spec.md loc=None community=21]
NODE public/icons/material-check.svg [src=public/icons/material-check.svg loc=None community=25]
NODE Slider graph context (reuse plan) [src=design/handoff/slider/graph-context.md loc=None community=5]
NODE src/components/ui/separator.tsx (Separator) [src=design/handoff/divider/graph-context.md loc=L7 community=10]
NODE Queue row #21 Steps (4313:48088) [src=design/agent-queue.md loc=None community=27]
NODE src/components/ui/progress.tsx [src=CLAUDE.md loc=None community=5]
NODE slider.tsx [src=src/components/ui/slider.tsx loc=L1 community=18]
NODE page.tsx [src=src/app/design-system/button/page.tsx loc=L1 community=0]
NODE src/components/ui/tooltip.tsx [src=CLAUDE.md loc=None community=17]
NODE Steps graph context (graphify query) [src=design/handoff/steps/graph-context.md loc=None community=22]
NODE Steps handoff spec (Figma page 4313:48088) [src=design/handoff/steps/spec.md loc=None community=25]
NODE Switcher Graph Context [src=design/handoff/switcher/graph-context.md loc=None community=29]
NODE src/components/ui/field.tsx [src=design/handoff/slider/graph-context.md loc=None community=4]
NODE src/components/ui/input.tsx [src=CLAUDE.md loc=None community=4]
NODE Design Token Pipeline [src=CLAUDE.md loc=None community=3]
NODE Agent component queue (77 Figma components) [src=design/agent-queue.md loc=None community=27]
NODE Per-component checklist [src=CLAUDE.md loc=None community=3]
NODE Figma Switcher Set (457:75) [src=design/handoff/switcher/spec.md loc=None community=21]
NODE src/components/ui/progress-percent.tsx [src=CLAUDE.md loc=None community=5]
NODE Commerce Constructor 7.7 E-commerce Website [src=CLAUDE.md loc=None community=3]
NODE Checkbox (Figma 8985:336791) [src=CLAUDE.md loc=None community=1]
NODE Steps [src=src/components/ui/steps.tsx loc=None community=22]
NODE progress-colors.ts [src=CLAUDE.md loc=None community=5]
NODE Per-component checklist [src=CLAUDE.md loc=None community=6]
NODE SeparatorGroup slot [src=design/agent-queue.md loc=L21 community=10]
NODE Figma Divider page 7060:312915 [src=design/handoff/divider/spec.md loc=L3 community=10]
NODE Divider done log entry [src=design/agent-report.md loc=L31 community=10]
NODE Button Group component [src=CLAUDE.md loc=Known gaps community=10]
NODE cn() from @/lib/utils [src=CLAUDE.md loc=Conventions community=10]
NODE SeparatorLabel slot [src=design/handoff/divider/graph-context.md loc=L10 community=10]
NODE src/components/ui/switch.tsx [src=design/handoff/switcher/graph-context.md loc=None community=21]
NODE StepIndicator [src=src/components/ui/steps.tsx loc=None community=25]
NODE Checkbox preview page [src=src/app/design-system/checkbox/page.tsx loc=None community=6]
NODE cn() from @/lib/utils [src=CLAUDE.md loc=None community=5]
NODE Known Gap: Design Fonts Not Loaded (Geist still used) [src=CLAUDE.md loc=L82 community=3]
NODE Dividers use Separator rule [src=CLAUDE.md loc=shadcn rules community=10]
NODE bg-border stock class (unmapped shadcn var) [src=design/handoff/divider/graph-context.md loc=L7 community=10]
NODE SeparatorIcon slot [src=design/agent-queue.md loc=L21 community=10]
NODE Input preview page [src=src/app/design-system/input/page.tsx loc=None community=6]
NODE Orientation = Separator orientation [src=design/handoff/divider/spec.md loc=L54 community=10]
NODE Alert component (AlertSeparator slot) [src=CLAUDE.md loc=shadcn rules community=10]
NODE @base-ui/react/separator [src=design/handoff/divider/graph-context.md loc=L7 community=10]
NODE /design-system/divider preview page [src=design/handoff/divider/graph-context.md loc=L12 community=10]
NODE src/app/design-system/slider/page.tsx [src=design/handoff/slider/graph-context.md loc=None community=5]
NODE cn() [src=src/lib/utils.ts loc=None community=0]
... (truncated — 176 more nodes cut by ~1500-token budget. Narrow with context_filter=['call'] or use get_node for a specific symbol)
```
