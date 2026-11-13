import "server-only"

import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"
import { cacheLife, cacheTag } from "next/cache"

import { db } from "@/db"
import { clients, projectEvents, projectMembers, projects, projectStages, projectStats, stageStats, users } from "@/db/schema"
import { DEFAULT_LOGO, type DashboardCharts, type Member, type Project, type ProjectOption, type ProjectDetail, type ProjectEvent, type ProjectFinance, type ProjectTotals } from "@/lib/projects/types"
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
  cost: projects.cost,
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
    logo: row.logo || DEFAULT_LOGO,
    members: members.map(({ id, name, avatar }) => ({ id, name, avatar })),
    progress: row.progress ?? 0,
    stages: row.stages ?? 0,
    tasks: row.tasks ?? 0,
    income: row.income ?? 0,
    cost: row.cost ?? 0,
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
      tasksDone: sql<number>`coalesce(sum(${projectStats.tasksDone}), 0)::int`,
      files: sql<number>`coalesce(sum(${projectStats.files}), 0)::int`,
      // Distinct people across the user's projects (a member of two projects counts once).
      members: sql<number>`(select count(distinct ${projectMembers.userId}) from ${projectMembers} where ${inArray(projectMembers.projectId, mine)})::int`,
    })
    .from(projectStats)
    .where(inArray(projectStats.projectId, mine))
  return row
}

/** Signed percent change from `prev` to `cur`, rounded. Nothing before → +100% if something now, else 0. */
const trend = (cur: number, prev: number) => (prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / Math.abs(prev)) * 100))

/**
 * Totals over all the user's projects. Trends compare the projects started (created_at) in the last 30 days
 * with the 30 days before: income and profit booked by new work, month over month.
 */
export async function queryProjectFinance(userId: string): Promise<ProjectFinance> {
  "use cache"
  cacheLife("hours")
  cacheTag(userProjectsTag(userId))

  const inWindow = (from: number, to: number) =>
    sql`${projects.createdAt} >= now() - make_interval(days => ${from}) and ${projects.createdAt} < now() - make_interval(days => ${to})`
  const [row] = await db
    .select({
      income: sql<number>`coalesce(sum(${projects.income}), 0)::float8`,
      cost: sql<number>`coalesce(sum(${projects.cost}), 0)::float8`,
      incomeCur: sql<number>`coalesce(sum(${projects.income}) filter (where ${inWindow(30, 0)}), 0)::float8`,
      incomePrev: sql<number>`coalesce(sum(${projects.income}) filter (where ${inWindow(60, 30)}), 0)::float8`,
      profitCur: sql<number>`coalesce(sum(${projects.income} - ${projects.cost}) filter (where ${inWindow(30, 0)}), 0)::float8`,
      profitPrev: sql<number>`coalesce(sum(${projects.income} - ${projects.cost}) filter (where ${inWindow(60, 30)}), 0)::float8`,
    })
    .from(projects)
    .where(inArray(projects.id, memberProjectIds(userId)))
  return {
    income: row.income,
    cost: row.cost,
    profit: row.income - row.cost,
    incomeTrend: trend(row.incomeCur, row.incomePrev),
    profitTrend: trend(row.profitCur, row.profitPrev),
  }
}

const CHART_MONTHS = 9
const TASKS_BY_PROJECT_LIMIT = 6
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** Uncached SQL behind queryDashboardCharts (exported so the smoke script can run it outside Next). */
export async function loadDashboardCharts(userId: string): Promise<DashboardCharts> {
  const mine = memberProjectIds(userId)
  const monthRows = await db.execute<{ month: string; income: number; cost: number }>(sql`
    select to_char(m.month, 'YYYY-MM') as month,
      coalesce(sum(p.income), 0)::float8 as income,
      coalesce(sum(p.cost), 0)::float8 as cost
    from generate_series(
      date_trunc('month', now()) - make_interval(months => ${CHART_MONTHS - 1}),
      date_trunc('month', now()),
      interval '1 month'
    ) as m(month)
    left join ${projects} p
      on date_trunc('month', p.created_at) = m.month and p.id in (${mine})
    group by m.month
    order by m.month
  `)
  const [[stats], byProject] = await Promise.all([
    db
      .select({
        new: sql<number>`coalesce(sum(${projectStats.tasksNew}), 0)::int`,
        inWork: sql<number>`coalesce(sum(${projectStats.tasksInWork}), 0)::int`,
        done: sql<number>`coalesce(sum(${projectStats.tasksDone}), 0)::int`,
        failed: sql<number>`coalesce(sum(${projectStats.tasksFailed}), 0)::int`,
      })
      .from(projectStats)
      .where(inArray(projectStats.projectId, mine)),
    db
      .select({
        name: projects.name,
        new: sql<number>`${projectStats.tasksNew}::int`,
        inWork: sql<number>`${projectStats.tasksInWork}::int`,
        done: sql<number>`${projectStats.tasksDone}::int`,
        failed: sql<number>`${projectStats.tasksFailed}::int`,
        total: sql<number>`${projectStats.tasks}::int`,
      })
      .from(projectStats)
      .innerJoin(projects, eq(projects.id, projectStats.projectId))
      .where(and(inArray(projectStats.projectId, mine), sql`${projectStats.tasks} > 0`))
      .orderBy(desc(projectStats.tasks), asc(projects.name))
      .limit(TASKS_BY_PROJECT_LIMIT),
  ])
  return {
    tasksByProject: byProject,
    months: Array.from(monthRows).map((r) => ({
      month: r.month,
      label: MONTH_LABELS[Number(r.month.slice(5, 7)) - 1],
      income: Number(r.income),
      cost: Number(r.cost),
    })),
    tasksByStatus: stats,
  }
}

/** Monthly income / cost (by project start month) and tasks by status over the user's projects. */
export async function queryDashboardCharts(userId: string): Promise<DashboardCharts> {
  "use cache"
  cacheLife("hours")
  cacheTag(userProjectsTag(userId))
  return loadDashboardCharts(userId)
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
      logo: row.company?.logo || DEFAULT_LOGO,
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

export async function queryProjectOptions(userId: string): Promise<ProjectOption[]> {
  "use cache"
  cacheLife("hours")
  cacheTag(userProjectsTag(userId))

  const rows = await db
    .select({ id: projects.id, name: projects.name })
    .from(projects)
    .where(inArray(projects.id, memberProjectIds(userId)))
    .orderBy(asc(projects.name))
  const ids = rows.map((r) => r.id)
  const [members, stages] = await Promise.all([
    membersByProject(ids),
    ids.length
      ? db
          .select({ projectId: projectStages.projectId, id: projectStages.id, name: projectStages.name })
          .from(projectStages)
          .where(inArray(projectStages.projectId, ids))
          .orderBy(asc(projectStages.position))
      : [],
  ])
  return rows.map((r) => ({
    ...r,
    stages: stages.filter((s) => s.projectId === r.id).map(({ id, name }) => ({ id, name })),
    members: (members.get(r.id) ?? []).map(({ id, name, avatar }) => ({ id, name, avatar })),
  }))
}
