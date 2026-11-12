import "server-only"

import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"
import { cacheLife, cacheTag } from "next/cache"

import { db } from "@/db"
import { clients, projectEvents, projectMembers, projects, projectStages, projectStats, stageStats, users } from "@/db/schema"
import type { Member, Project, ProjectDetail, ProjectEvent, ProjectFinance, ProjectTotals } from "@/lib/projects/types"
import { projectTag, userProjectsTag } from "@/lib/projects/tags"

// Cached Drizzle reads. Every function takes the Clerk user id as an argument (it is part of the cache key) and
// only returns projects that user is a member of. Drizzle bypasses RLS, so this scoping is the access check.
// Callers get the id from auth() (./data.ts); never pass an id that came from the client.

/** Project ids the user belongs to. */
const memberProjectIds = (userId: string) =>
  db.select({ id: projectMembers.projectId }).from(projectMembers).where(eq(projectMembers.userId, userId))

async function membersByProject(projectIds: string[]) {
  const rows = projectIds.length
    ? await db
        .select({ projectId: projectMembers.projectId, id: users.id, name: users.name, avatar: users.avatar, role: projectMembers.role })
        .from(projectMembers)
        .innerJoin(users, eq(users.id, projectMembers.userId))
        .where(inArray(projectMembers.projectId, projectIds))
        .orderBy(asc(projectMembers.joinedAt), asc(users.name))
    : []
  const map = new Map<string, (Member & { role: string })[]>()
  for (const r of rows) {
    const list = map.get(r.projectId) ?? []
    list.push({ id: r.id, name: r.name, avatar: r.avatar ?? "", role: r.role ?? "" })
    map.set(r.projectId, list)
  }
  return map
}

const projectColumns = {
  id: projects.id,
  slug: projects.slug,
  name: projects.name,
  logo: projects.logo,
  income: projects.income,
  deadline: projects.deadline,
  updatedAt: projects.updatedAt,
  progress: projectStats.progress,
  stages: projectStats.stages,
  tasks: projectStats.tasks,
}

type ProjectRow = { [K in keyof typeof projectColumns]: (typeof projectColumns)[K]["_"]["data"] | null }

function toProject(row: ProjectRow, members: Member[]): Project {
  return {
    id: row.id!,
    slug: row.slug!,
    name: row.name!,
    logo: row.logo ?? "",
    members: members.map(({ id, name, avatar }) => ({ id, name, avatar })),
    progress: row.progress ?? 0,
    stages: row.stages ?? 0,
    tasks: row.tasks ?? 0,
    income: row.income ?? 0,
    deadline: row.deadline ?? "",
    updatedAt: row.updatedAt!.toISOString(),
  }
}

export async function queryProjects(userId: string): Promise<Project[]> {
  "use cache"
  cacheLife("hours")
  cacheTag(userProjectsTag(userId))

  const rows = await db
    .select(projectColumns)
    .from(projects)
    .leftJoin(projectStats, eq(projectStats.projectId, projects.id))
    .where(inArray(projects.id, memberProjectIds(userId)))
    .orderBy(asc(projects.createdAt), asc(projects.id))
  for (const r of rows) cacheTag(projectTag(r.id))

  const members = await membersByProject(rows.map((r) => r.id))
  return rows.map((r) => toProject(r, members.get(r.id) ?? []))
}

/** Every project slug, unscoped: only for generateStaticParams (route shells, no data). */
export async function queryAllProjectSlugs(): Promise<string[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("project-slugs")
  const rows = await db.select({ slug: projects.slug }).from(projects).orderBy(asc(projects.createdAt))
  return rows.map((r) => r.slug)
}

export async function queryProjectEvents(userId: string, limit = 50): Promise<ProjectEvent[]> {
  "use cache"
  cacheLife("minutes")
  cacheTag(userProjectsTag(userId))

  const rows = await db
    .select({ id: projectEvents.id, projectId: projectEvents.projectId, kind: projectEvents.kind, title: projectEvents.title, at: projectEvents.at })
    .from(projectEvents)
    .where(inArray(projectEvents.projectId, memberProjectIds(userId)))
    .orderBy(desc(projectEvents.at), asc(projectEvents.id))
    .limit(limit)
  return rows.map((r) => ({ ...r, at: r.at.toISOString() }))
}

export async function queryProjectTotals(userId: string): Promise<ProjectTotals> {
  "use cache"
  cacheLife("hours")
  cacheTag(userProjectsTag(userId))

  const mine = memberProjectIds(userId)
  const [row] = await db
    .select({
      projects: sql<number>`count(*)::int`,
      tasks: sql<number>`coalesce(sum(${projectStats.tasks}), 0)::int`,
      files: sql<number>`coalesce(sum(${projectStats.files}), 0)::int`,
      // Distinct people across the user's projects (a member of two projects counts once).
      members: sql<number>`(select count(distinct ${projectMembers.userId}) from ${projectMembers} where ${inArray(projectMembers.projectId, mine)})::int`,
    })
    .from(projectStats)
    .where(inArray(projectStats.projectId, mine))
  return row
}

/** Trends need history (a finance ledger, later phase): 0 until then. */
export async function queryProjectFinance(userId: string): Promise<ProjectFinance> {
  "use cache"
  cacheLife("hours")
  cacheTag(userProjectsTag(userId))

  const [row] = await db
    .select({
      income: sql<number>`coalesce(sum(${projects.income}), 0)::float8`,
      cost: sql<number>`coalesce(sum(${projects.cost}), 0)::float8`,
    })
    .from(projects)
    .where(inArray(projects.id, memberProjectIds(userId)))
  return { income: row.income, cost: row.cost, profit: row.income - row.cost, incomeTrend: 0, profitTrend: 0 }
}

export async function queryProjectDetail(userId: string, slug: string): Promise<ProjectDetail | undefined> {
  "use cache"
  cacheLife("hours")
  cacheTag(userProjectsTag(userId))

  const [row] = await db
    .select({
      ...projectColumns,
      membersCount: projectStats.members,
      files: projectStats.files,
      tasksNew: projectStats.tasksNew,
      tasksInWork: projectStats.tasksInWork,
      tasksDone: projectStats.tasksDone,
      tasksFailed: projectStats.tasksFailed,
      company: { name: clients.name, logo: clients.logo, description: clients.description },
    })
    .from(projects)
    .leftJoin(projectStats, eq(projectStats.projectId, projects.id))
    .leftJoin(clients, eq(clients.id, projects.clientId))
    .where(and(eq(projects.slug, slug), inArray(projects.id, memberProjectIds(userId))))
    .limit(1)
  if (!row) return undefined
  cacheTag(projectTag(row.id))

  const [members, stages] = await Promise.all([
    membersByProject([row.id]),
    db
      .select({
        id: projectStages.id,
        index: projectStages.position,
        name: projectStages.name,
        start: projectStages.startDate,
        end: projectStages.endDate,
        tasks: stageStats.tasks,
        members: stageStats.members,
        files: stageStats.files,
      })
      .from(projectStages)
      .leftJoin(stageStats, eq(stageStats.stageId, projectStages.id))
      .where(eq(projectStages.projectId, row.id))
      .orderBy(asc(projectStages.position)),
  ])
  const team = members.get(row.id) ?? []
  const project = toProject(row, team)

  return {
    project,
    company: {
      name: row.company?.name ?? "",
      logo: row.company?.logo ?? "",
      description: row.company?.description ?? "",
    },
    implementation: project.progress,
    // Messages arrive with chat (Phase 5).
    counts: { messages: 0, stages: project.stages, members: row.membersCount ?? 0, files: row.files ?? 0 },
    tasks: { new: row.tasksNew ?? 0, inWork: row.tasksInWork ?? 0, done: row.tasksDone ?? 0, failed: row.tasksFailed ?? 0 },
    stages: stages.map((s) => ({
      ...s,
      start: s.start ?? "",
      end: s.end ?? "",
      tasks: s.tasks ?? 0,
      members: s.members ?? 0,
      files: s.files ?? 0,
    })),
    team,
  }
}
