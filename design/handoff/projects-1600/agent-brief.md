# Projects (1600) — builder brief (shared by every step)

You build ONE step of `design/handoff/projects-1600/audit.md` ("Build Order"). Nobody answers questions: decide, note it in your final report.

## Context
- Page: `/dashboard/projects` → `src/app/dashboard/projects/page.tsx` (server). **Do not edit page.tsx**: the orchestrator wires your component in. Exception: if your step says so.
- Figma frame: Projects (1600) `14061:68482` on the only page of the open Figma file. Layer tree with sizes: `design/handoff/projects-1600/tree.txt` (read only the lines of your part). Overall image: `design/handoff/projects-1600/img/projects-1600.png`.
- Data: `src/lib/projects/data.ts` + `types.ts` (async getters, mock). Pass data as props from the server page; components stay presentational.
- i18n: strings under the `projects` namespace in `messages/en.json` (next-intl, `useTranslations("projects")` / `getTranslations`). Only add keys you use.
- Domain components go in `src/components/projects/<PascalCase>.tsx`, named export, compositions of `src/components/ui/*`.

## Rules (from CLAUDE.md, mandatory)
1. Read Figma ONLY via TalkToFigma (`mcp__TalkToFigma__get_node_info` / `get_nodes_info` on your node ids; colors via `pnpm -s token:hex "#hex"`). Never the official Figma MCP or REST API. Never guess a token.
2. Invoke the `shadcn` skill (Skill tool) before writing component code. Map each Figma part to an existing `ui/` component first (`pnpm -s ui:index src/components/ui/<file>.tsx` to see variants; don't read whole files). A missing look = new `cva` variant/size in the `ui/` file, never a consumer `className` override. `className` = layout only.
3. Tokens only: no hex, no `space-x/y-`, no `w-N h-N` (use `size-N`), no `dark:`. Dividers = `Separator`. Figma strokes inside the box → `outline -outline-offset-1 outline-<token>`.
4. Icons: reuse `public/icons/*`. Never write SVG files. Missing icon → use `/icons/material-default-icon.svg` and list it in your report + append a line `- <Component>: …` to `design/known-gaps.md`.
5. Server Components by default; `"use client"` only for state/handlers.
6. If you change a `ui/` file, update its preview `src/app/design-system/<component>/page.tsx` with the new variant/size.
7. Audit before reporting: `pnpm exec tsc --noEmit`, `pnpm exec eslint <your files>`, grep your files for `space-[xy]-|dark:|#[0-9a-fA-F]{6}`. Fix everything.
8. Do not commit. Do not touch files outside your step.

## Report (final message, ≤15 lines)
Files created/changed · Figma→ui mapping · assumptions · missing icons/assets · audit result.
