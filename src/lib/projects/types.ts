// Projects section data shapes (Figma "Dashboard: Projects"). Served by ./data.ts today; an API can replace it 1:1.

export type Member = {
  id: string
  name: string
  avatar: string
}

export type Project = {
  id: string
  slug: string
  name: string
  /** Brand logo shown in Brand-Cell and the sidebar tree. */
  logo: string
  members: Member[]
  /** 0–100 */
  progress: number
  stages: number
  tasks: number
  /** Whole currency units (USD). */
  income: number
  /** Whole currency units (USD); "Costs" tab order. */
  cost: number
  /** ISO date. */
  deadline: string
  /** ISO date-time, drives the "Last Projects" order. */
  updatedAt: string
}

export type ProjectEventKind = "member" | "comment" | "stage" | "file" | "task"

export type ProjectEvent = {
  id: string
  projectId: string
  kind: ProjectEventKind
  /** First line: who or what (e.g. "John Smith", "Image-template.pdf"). */
  title: string
  /** ISO date-time; the row shows its time. */
  at: string
}

export type ProjectTotals = {
  projects: number
  tasks: number
  /** Tasks with status done (dashboard "Tasks done" metric). */
  tasksDone: number
  members: number
  files: number
}

// --- Project page (Figma Projects (1600) 14061:76419: per-project dashboard) ---

export type ProjectStage = {
  id: string
  /** 1-based position, shown in the number badge. */
  index: number
  name: string
  tasks: number
  members: number
  files: number
  /** ISO dates. */
  start: string
  end: string
}

export type TeamMember = Member & { role: string }

export type ProjectDetail = {
  project: Project
  company: { name: string; logo: string; description: string }
  /** 0–100, "Project implementation" tile. */
  implementation: number
  counts: { messages: number; stages: number; members: number; files: number }
  tasks: { new: number; inWork: number; done: number; failed: number }
  stages: ProjectStage[]
  team: TeamMember[]
}

export type ProjectFinance = {
  income: number
  /** Percent change, signed. */
  incomeTrend: number
  profit: number
  profitTrend: number
  cost: number
}

/** Pickers for the create dialogs (Quick Add): the user's projects with their stages and members. */
export type ProjectOption = {
  id: string
  name: string
  stages: { id: string; name: string }[]
  members: Member[]
}
