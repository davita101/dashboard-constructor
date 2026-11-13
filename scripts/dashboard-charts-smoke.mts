// Smoke test for loadDashboardCharts. Run: pnpm exec tsx --conditions=react-server scripts/dashboard-charts-smoke.mts
// Temp rows use a `smoke_<tag>` prefix, removed at the end.
import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"

process.loadEnvFile(".env.local")

const { db } = await import("../src/db")
const { users, projects, projectMembers, projectStats, tasks } = await import("../src/db/schema")
const { eq, inArray, sql } = await import("drizzle-orm")
const { loadDashboardCharts } = await import("../src/lib/projects/queries")

const tag = randomUUID().slice(0, 8)
const uA = `smoke_${tag}_a`
const uEmpty = `smoke_${tag}_empty`
let projectId: string | undefined
let extraIds: string[] = []
const pass = (name: string) => console.log(`PASS ${name}`)

try {
  await db.insert(users).values([
    { id: uA, name: "Smoke A" },
    { id: uEmpty, name: "Smoke Empty" },
  ])
  const [p] = await db
    .insert(projects)
    .values({ slug: `smoke-charts-${tag}`, name: "Smoke charts", income: 100, cost: 40 })
    .returning({ id: projects.id })
  projectId = p.id
  await db.insert(projectMembers).values({ projectId, userId: uA })

  const a = await loadDashboardCharts(uA)
  assert.equal(a.months.length, 9)
  const keys = a.months.map((m) => m.month)
  assert.deepEqual(keys, [...keys].sort())
  assert.equal(new Set(keys).size, 9)
  for (const m of a.months) {
    assert.ok(Number.isFinite(m.income) && Number.isFinite(m.cost))
    assert.match(m.month, /^\d{4}-\d{2}$/)
    assert.ok(m.label.length === 3)
  }
  pass("9 months ascending, finite numbers")

  const last = a.months[8]
  assert.equal(last.income, 100)
  assert.equal(last.cost, 40)
  assert.equal(a.months.slice(0, 8).reduce((s, m) => s + m.income + m.cost, 0), 0)
  pass("project lands in current month, others zero-filled")

  const [tot] = await db
    .select({ n: sql<number>`coalesce(sum(${projectStats.tasks}), 0)::int` })
    .from(projectStats)
    .where(eq(projectStats.projectId, projectId))
  const t = a.tasksByStatus
  assert.equal(t.new + t.inWork + t.done + t.failed, tot.n)
  pass("tasksByStatus sum equals project_stats total")

  const e = await loadDashboardCharts(uEmpty)
  assert.equal(e.months.length, 9)
  assert.ok(e.months.every((m) => m.income === 0 && m.cost === 0))
  assert.deepEqual(e.tasksByStatus, { new: 0, inWork: 0, done: 0, failed: 0 })
  pass("user without projects gets zeros")
  assert.deepEqual(e.tasksByProject, [])
  pass("tasksByProject empty for user without projects")

  assert.ok(!a.tasksByProject.some((r) => r.name === "Smoke charts"))
  pass("tasksByProject skips project with 0 tasks")

  await db.insert(tasks).values([
    { projectId, title: "smoke new", status: "new" },
    { projectId, title: "smoke done", status: "done" },
  ])
  const a2 = await loadDashboardCharts(uA)
  assert.deepEqual(a2.tasksByProject, [{ name: "Smoke charts", new: 1, inWork: 0, done: 1, failed: 0, total: 2 }])
  pass("tasksByProject counts per status")

  const e2 = await loadDashboardCharts(uEmpty)
  assert.deepEqual(e2.tasksByProject, [])
  pass("non-member never sees the project")

  // 7 more projects (1 task each) → capped at 6, ordered by total desc then name asc.
  const extra = await db
    .insert(projects)
    .values(Array.from({ length: 7 }, (_, i) => ({ slug: `smoke-charts-${tag}-x${i}`, name: `Smoke x${i}` })))
    .returning({ id: projects.id })
  extraIds = extra.map((r) => r.id)
  await db.insert(projectMembers).values(extraIds.map((id) => ({ projectId: id, userId: uA })))
  await db.insert(tasks).values(extraIds.map((id) => ({ projectId: id, title: "smoke x" })))
  const a3 = await loadDashboardCharts(uA)
  assert.equal(a3.tasksByProject.length, 6)
  assert.equal(a3.tasksByProject[0].name, "Smoke charts")
  const rest = a3.tasksByProject.slice(1).map((r) => r.name)
  assert.deepEqual(rest, [...rest].sort())
  pass("tasksByProject capped at 6, sorted total desc then name")
} finally {
  if (extraIds.length) await db.delete(projects).where(inArray(projects.id, extraIds))
  if (projectId) await db.delete(projects).where(eq(projects.id, projectId))
  await db.delete(users).where(inArray(users.id, [uA, uEmpty]))
  process.exit(process.exitCode ?? 0)
}
