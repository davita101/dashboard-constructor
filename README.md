# Dashboard Constructor — demo

> **This is a demo.** It shows a dashboard built from the Commerce Constructor 7.7 Figma design system, with a real
> backend behind it. The data you see first is **sample data** copied from the Figma file and loaded into the
> database by a seed script. Projects, tasks, files and messages you create are saved for real, but the app is
> not meant for production use yet (see [Not done / limits](#not-done--limits)).

Live: https://dashboard-constructor.vercel.app

## Stack

- Next.js 16 (App Router, React 19, TypeScript)
- Tailwind CSS v4 with design tokens generated from the Figma variables (`pnpm tokens` → `src/styles/`)
- shadcn/ui (`base-nova` style on Base UI) for every component
- Clerk for sign-in, Supabase (Postgres + Storage + Realtime) for data, Drizzle ORM for queries
- next-intl for translations, deployed on Vercel

## What is done

### Design system
- Figma variables → CSS tokens: colors (Light/Dark), primary and gray themes, radius, fonts, spacing, line height
- UI components built on shadcn/ui and matched to the Figma file, with previews at `/design-system/<component>`
- Light/Dark mode, theme switching through `data-*` attributes, mobile and desktop layouts from the Figma frames

### Pages
- Auth: sign in, sign up, check email, forgot password, password reset, set new password (Clerk)
- Dashboard (`/dashboard`): customizable widget board (add, remove, reorder widgets; layout saved per user)
- Projects: list with KPIs, finance cards and activity feed; project detail; create / edit / delete project

### Backend
- Database schema: users, clients, projects, members, stages, tasks (with assignees and labels), activity events,
  files, conversations and messages, user settings; row-level security on every table
- Clerk → Supabase user sync through a webhook
- All reads scoped to the signed-in user and cached per user
- Mutations: projects, members (add by email, change role, remove), stages (add, edit, delete, reorder), tasks
  (create, edit, delete, drag between statuses)
- Files: upload to Supabase Storage, signed download links, project and client logos
- Chat: project and direct messages with live updates (Supabase Realtime); Quick Add "Message" dialog
- User settings: theme, language and widget layout saved to the account and restored on any device
- Dashboard widgets show the user's real project numbers (charts, metric tiles, KPI strip, projects table)

## Not done / limits

- **Sample data:** the starting projects, team and events come from the Figma mock-up (`src/db/mock-data.ts`,
  loaded by `pnpm db:seed`, dates moved to recent ones). They are not real customers or money.
- **Demo-only widgets:** the candle chart and the map widget have no data source; they are hidden from the widget picker.
- **No permission model:** every project member can edit everything. Owner/admin rules are needed before real teams use it.
- **Finance trends** compare the last 30 days with the 30 before; there is no real ledger or history.
- **Not built yet** (no Figma pages): Notes, Mail, Calendar, Knowledge Base, Clients, Users, and the project tabs
  (stages, tasks board, messages, members, files, activity). Those sidebar links show a 404.
- Clerk runs on a development instance.

Full task list: [`design/backend/TODO.md`](design/backend/TODO.md). Known design gaps: [`design/known-gaps.md`](design/known-gaps.md).

## Built with Claude Code ❤️

I built this project with [Claude Code](https://claude.com/claude-code), Anthropic's coding agent, using its skills,
MCP servers and custom subagents:

- **MCP servers**
  - **TalkToFigma**: reads the Figma file (components, variants, layers, tokens, PNG exports) straight from the Figma plugin
  - **shadcn MCP**: searches the shadcn/ui registry and adds components
  - **Claude in Chrome**: checks every component and page in a real browser (variants, interactions, console errors)
- **Skills**
  - `shadcn`: shadcn/ui rules for every component
  - `frontend-ui-engineering`, `ui-styling`, `vercel:react-best-practices`: UI code quality
  - `vercel:deploy`: deploys
  - `graphify`: knowledge graph of the codebase
  - `caveman`: shorter replies to save tokens
- **Custom agents and loops** (`.claude/agents/`, `scripts/`)
  - `component-builder` + `director`: build one Figma component, then review it against the Figma data
  - `page-builder`: builds one page from its desktop and mobile frames
  - `todo-director` + `todo-builder`: work through `design/backend/TODO.md` one item at a time (plan → build → review → commit)

## Run locally

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase + Clerk keys
pnpm db:migrate              # apply the schema
pnpm db:seed                 # load the demo data
pnpm dev                     # http://localhost:3000
```

Other commands: `pnpm build`, `pnpm lint`, `pnpm tokens` (rebuild tokens after a Figma export), `pnpm db:studio`.
