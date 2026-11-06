import type { Member, Project, ProjectEvent, ProjectFinance, ProjectTotals } from "@/lib/projects/types"

// Mock data for the Projects section, copied from Figma "Projects (1600)" (14061:68482).
// Async getters so pages read it like an API; replace the bodies with fetch calls later, keep the signatures.

const LOGO = "/icons/logotypes"
// Apple, Kickstarter and WeChat logos are not in public/icons yet (design/known-gaps.md): default logo until supplied.
const DEFAULT_LOGO = `${LOGO}/default-logo-color.svg`

const members: Member[] = [
  { id: "m1", name: "John Smith", avatar: "/images/avatars/avatar-1.png" },
  { id: "m2", name: "Cameron Williamson", avatar: "/images/avatars/avatar-2.png" },
  { id: "m3", name: "Jane Cooper", avatar: "/images/avatars/avatar-3.png" },
  { id: "m4", name: "Robert Fox", avatar: "/images/avatars/avatar-4.png" },
  { id: "m5", name: "Esther Howard", avatar: "/images/avatars/avatar-5.png" },
  { id: "m6", name: "Jacob Jones", avatar: "/images/avatars/avatar-6.png" },
]

const team = (...ids: string[]) => ids.map((id) => members.find((m) => m.id === id)!)

const project = (
  id: string,
  name: string,
  logo: string,
  extra: Partial<Omit<Project, "id" | "slug" | "name" | "logo">> = {},
): Project => ({
  id,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name,
  logo,
  members: team("m1", "m2", "m3", "m4"),
  progress: 89,
  stages: 5,
  tasks: 21,
  income: 5000,
  deadline: "2078-09-25",
  updatedAt: "2078-09-01T12:00:00Z",
  ...extra,
})

// Sidebar order (Figma Sidebar-Dashboards-04), then the two extra cards of the Last Projects list.
const projects: Project[] = [
  project("p1", "Develop Chat Application", `${LOGO}/adobe-color.svg`, { updatedAt: "2078-09-10T12:00:00Z" }),
  project("p2", "City Advertising Campaign", DEFAULT_LOGO, { updatedAt: "2078-09-09T12:00:00Z", progress: 64, deadline: "2078-10-02" }),
  project("p3", "File transfer application", `${LOGO}/whatsapp-color.svg`, { progress: 42, income: 3200, deadline: "2078-11-14" }),
  project("p4", "Banner Development", `${LOGO}/zoom-color.svg`, { progress: 75, income: 1800, deadline: "2078-09-30" }),
  project("p5", "Development of Dashboards", `${LOGO}/airbnb-color.svg`, { progress: 30, income: 7400, deadline: "2078-12-01" }),
  project("p6", "Android Application for Bank", DEFAULT_LOGO, { progress: 55, income: 9100, deadline: "2078-10-20" }),
  project("p7", "Website Development", `${LOGO}/twitch-color.svg`, { progress: 18, income: 2600, deadline: "2078-11-05" }),
  project("p8", "Android Application for Bank", DEFAULT_LOGO, { progress: 92, income: 4300, deadline: "2078-09-28" }),
  project("p9", "Banner Development", DEFAULT_LOGO, { progress: 10, income: 900, deadline: "2079-01-15" }),
  project("p10", "File transfer application", DEFAULT_LOGO, { progress: 67, income: 2100, deadline: "2078-10-11" }),
  project("p11", "Website", DEFAULT_LOGO, { progress: 50, income: 1500, deadline: "2078-12-24" }),
  project("p12", "Web Application Development", DEFAULT_LOGO, { updatedAt: "2078-09-08T12:00:00Z" }),
  project("p13", "Facebook Application", `${LOGO}/zoom-color.svg`, { updatedAt: "2078-09-07T12:00:00Z" }),
].map((p, i, all) => {
  // Same names repeat in the Figma sidebar: keep slugs unique.
  const dup = all.slice(0, i).some((q) => q.slug === p.slug)
  return dup ? { ...p, slug: `${p.slug}-${p.id}` } : p
})

// Figma Latest events: two project groups.
const events: ProjectEvent[] = [
  { id: "e1", projectId: "p1", kind: "member", title: "John Smith", at: "2078-09-10T12:00:00Z" },
  { id: "e2", projectId: "p1", kind: "comment", title: "Super useful! I made a thing in Figma", at: "2078-09-10T12:00:00Z" },
  { id: "e3", projectId: "p1", kind: "stage", title: "Effective Advertising Pointers", at: "2078-09-10T12:00:00Z" },
  { id: "e4", projectId: "p1", kind: "file", title: "Image-template.pdf", at: "2078-09-10T12:00:00Z" },
  { id: "e5", projectId: "p1", kind: "file", title: "Video-info.mp4", at: "2078-09-10T12:00:00Z" },
  { id: "e6", projectId: "p1", kind: "member", title: "John Smith", at: "2078-09-10T12:00:00Z" },
  { id: "e7", projectId: "p3", kind: "task", title: "Add Templates UI Kits", at: "2078-09-09T12:00:00Z" },
  { id: "e8", projectId: "p3", kind: "task", title: "Add HTML Files and JS", at: "2078-09-09T12:00:00Z" },
  { id: "e9", projectId: "p3", kind: "member", title: "Cameron Williamson", at: "2078-09-09T12:00:00Z" },
  { id: "e10", projectId: "p3", kind: "stage", title: "Effective Advertising Pointers", at: "2078-09-09T12:00:00Z" },
]

// Figma KPI row and finance cards. Served as totals (not derived from the mock list, which is shorter than the real one).
const totals: ProjectTotals = { projects: 21, tasks: 145, members: 12, files: 432 }
const finance: ProjectFinance = { income: 14000, incomeTrend: 23, profit: 4560, profitTrend: -11, cost: 9440 }

export async function getProjects(): Promise<Project[]> {
  return projects
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return projects.find((p) => p.slug === slug)
}

export async function getProjectEvents(): Promise<ProjectEvent[]> {
  return events
}

export async function getProjectTotals(): Promise<ProjectTotals> {
  return totals
}

export async function getProjectFinance(): Promise<ProjectFinance> {
  return finance
}
