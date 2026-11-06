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
  members: number
  files: number
}

export type ProjectFinance = {
  income: number
  /** Percent change, signed. */
  incomeTrend: number
  profit: number
  profitTrend: number
  cost: number
}
