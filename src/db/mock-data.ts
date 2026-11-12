import type { Member, Project, ProjectEvent, ProjectStage, TeamMember } from "@/lib/projects/types"

// Mock data for the Projects section, copied from Figma "Projects (1600)" (14061:68482).
// Only the seed reads it now (src/db/seed.ts); pages read the database through src/lib/projects/data.ts.

// Figma uses square brand marks (round 20-28 logos), not wordmarks: public/icons/brands.
const BRAND = "/icons/brands"
const LOGO = "/icons/logotypes"
const brand = (name: string) => `${BRAND}/${name}.svg`
// Marks the Figma draws but brands/ doesn't hold (Android Application for Bank, Banner Development, Website): default mark.
const DEFAULT_LOGO = brand("default")

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
  cost: 0,
  deadline: "2078-09-25",
  updatedAt: "2078-09-01T12:00:00Z",
  ...extra,
})

// Sidebar order (Figma Sidebar-Dashboards-04), then the two extra cards of the Last Projects list.
export const mockProjects: Project[] = [
  project("p1", "Develop Chat Application", brand("adobe"), { updatedAt: "2078-09-10T12:00:00Z" }),
  project("p2", "City Advertising Campaign", brand("apple"), { updatedAt: "2078-09-09T12:00:00Z", progress: 64, deadline: "2078-10-02" }),
  project("p3", "File transfer application", brand("whatsapp"), { progress: 42, income: 3200, deadline: "2078-11-14" }),
  project("p4", "Banner Development", brand("zoom"), { progress: 75, income: 1800, deadline: "2078-09-30" }),
  project("p5", "Development of Dashboards", brand("airbnb"), { progress: 30, income: 7400, deadline: "2078-12-01" }),
  project("p6", "Android Application for Bank", brand("tech-crunch"), { progress: 55, income: 9100, deadline: "2078-10-20" }),
  project("p7", "Website Development", brand("twitch"), { progress: 18, income: 2600, deadline: "2078-11-05" }),
  project("p8", "Android Application for Bank", DEFAULT_LOGO, { progress: 92, income: 4300, deadline: "2078-09-28" }),
  project("p9", "Banner Development", DEFAULT_LOGO, { progress: 10, income: 900, deadline: "2079-01-15" }),
  project("p10", "File transfer application", brand("kakao-talk"), { progress: 67, income: 2100, deadline: "2078-10-11" }),
  project("p11", "Website", DEFAULT_LOGO, { progress: 50, income: 1500, deadline: "2078-12-24" }),
  project("p12", "Web Application Development", brand("kickstarter"), { updatedAt: "2078-09-08T12:00:00Z" }),
  project("p13", "Facebook Application", brand("zoom"), { updatedAt: "2078-09-07T12:00:00Z" }),
].map((p, i, all) => {
  // Same names repeat in the Figma sidebar: keep slugs unique.
  const dup = all.slice(0, i).some((q) => q.slug === p.slug)
  // Figma has no cost per project: ~67% of income (finance card ratio 9440 / 14000).
  const cost = p.cost || Math.round(p.income * 0.674)
  return dup ? { ...p, cost, slug: `${p.slug}-${p.id}` } : { ...p, cost }
})

// Figma Latest events: two project groups.
export const mockEvents: ProjectEvent[] = [
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

// Figma project page (14061:76419): same company, stages and team for every project.
export const mockCompany = {
  name: "Facebook Company ltd",
  logo: `${LOGO}/adobe-color.svg`,
  description:
    "Facebook, Inc. is an American technology conglomerate based in Menlo Park, California. It was founded by Mark Zuckerberg, along with his fellow roommates and students at Harvard College, who were Eduardo Saverin, Andrew McCollum, Dustin Moskovitz and Chris Hughes, originally as TheFacebook.com—today's Facebook, a popular global social networking service. Facebook is one of the most valuable companies. It is considered one of the Big Five companies in the information",
}

const stage = (index: number, name: string, start: string, end: string): ProjectStage => ({
  id: `s${index}`,
  index,
  name,
  tasks: 10,
  members: 4,
  files: 5,
  start,
  end,
})

export const mockStages: ProjectStage[] = [
  stage(1, "Analytics and Task Settings", "2078-11-21", "2078-11-29"),
  stage(2, "Engineering and Design", "2078-11-29", "2078-12-05"),
  stage(3, "Development and Testing", "2078-11-29", "2078-12-05"),
  stage(4, "Customer Approval", "2078-11-29", "2078-12-05"),
  stage(5, "Launch of the project", "2078-11-29", "2078-12-05"),
]

export const mockTeam: TeamMember[] = [
  { id: "t1", name: "John Smith", role: "Designer", avatar: "/images/avatars/avatar-1.png" },
  { id: "t2", name: "Leslie Alexander", role: "Developer", avatar: "/images/avatars/avatar-2.png" },
  { id: "t3", name: "Arlene McCoy", role: "Developer", avatar: "/images/avatars/avatar-3.png" },
  { id: "t4", name: "Guy Hawkins", role: "Developer", avatar: "/images/avatars/avatar-4.png" },
  { id: "t5", name: "Brooklyn Simmons", role: "Developer", avatar: "/images/avatars/avatar-5.png" },
  { id: "t6", name: "Ronald Richards", role: "Developer", avatar: "/images/avatars/avatar-6.png" },
  { id: "t7", name: "Annette Black", role: "Developer", avatar: "/images/avatars/avatar-1.png" },
  { id: "t8", name: "Theresa Webb", role: "Developer", avatar: "/images/avatars/avatar-2.png" },
]
