// Loads the Figma mock data (./mock-data.ts) into the database: `pnpm db:seed`.
// Idempotent and scoped: it only deletes what it created before (seed_ users, seed project slugs, the seed client),
// so real users synced by the Clerk webhook and their projects survive a re-run.
// Counts and progress are not copied: they come out of the generated tasks/stages/files (project_stats view).
// Every real Clerk user (CLERK_SECRET_KEY) is upserted and added to the seed projects, so signed-in pages show data
// without waiting for the webhook.

import { and, eq, inArray, like, notExists } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { mockCompany, mockEvents, mockProjects, mockStages, mockTeam } from "./mock-data"
import * as schema from "./schema"

try {
  process.loadEnvFile(".env.local")
} catch {
  // env comes from the environment
}
const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is not set (see .env.example)")
if (process.env.NODE_ENV === "production") throw new Error("Refusing to seed with NODE_ENV=production")

const client = postgres(url, { prepare: false, max: 1 })
const db = drizzle(client, { schema, casing: "snake_case" })
const { users, clients, projects, projectMembers, projectStages, tasks, taskAssignees, labels, taskLabels, projectEvents, files } =
  schema

// Mock dates are Figma's (2078). Shift them so the newest mock event lands one day ago: seed rows then sort
// below anything created through the app, and deadlines/stages keep their spacing relative to it.
const MOCK_NOW = Math.max(...mockEvents.map((e) => Date.parse(e.at)), ...mockProjects.map((p) => Date.parse(p.updatedAt)))
const SHIFT = Date.now() - 86_400_000 - MOCK_NOW
const shift = (iso: string) => new Date(Date.parse(iso) + SHIFT)
const shiftDay = (day: string) => shift(`${day}T12:00:00Z`).toISOString().slice(0, 10)

const SEED_CLIENT = "Facebook Company ltd"
const seedUserId = (name: string) => `seed_${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

const TASK_TITLES = [
  "Header Page Update",
  "Add Templates UI Kits",
  "Add HTML Files and JS",
  "Prepare Wireframes",
  "Design Review",
  "Set Up CI Pipeline",
  "Write API Docs",
  "Fix Login Flow",
  "Optimize Images",
  "QA Regression Pass",
]
const LABELS = [
  { name: "Label 1", color: "blue" },
  { name: "Label 2", color: "green" },
  { name: "Label 3", color: "orange" },
  { name: "Label 4", color: "purple" },
]
const FILE_TYPES = [
  { ext: "pdf", mime: "application/pdf", size: 1_240_000 },
  { ext: "png", mime: "image/png", size: 384_000 },
  { ext: "mp4", mime: "video/mp4", size: 18_600_000 },
]

/** Spread `total` tasks so that `done` matches the mock progress; the rest is new / in work / failed. */
function statusPlan(total: number, progress: number): (typeof schema.taskStatus.enumValues)[number][] {
  const done = Math.round((total * progress) / 100)
  const rest = total - done
  const failed = Math.min(2, rest)
  const inWork = Math.min(3, rest - failed)
  const fresh = rest - failed - inWork
  return [
    ...Array<"done">(done).fill("done"),
    ...Array<"in_work">(inWork).fill("in_work"),
    ...Array<"failed">(failed).fill("failed"),
    ...Array<"new">(fresh).fill("new"),
  ]
}

/** Real Clerk users (Backend API), shaped like the webhook writes them. Empty without CLERK_SECRET_KEY. */
async function fetchClerkUsers() {
  const key = process.env.CLERK_SECRET_KEY
  if (!key) {
    console.warn("CLERK_SECRET_KEY not set: no real users added to the seed projects")
    return []
  }
  const res = await fetch("https://api.clerk.com/v1/users?limit=100", { headers: { Authorization: `Bearer ${key}` } })
  if (!res.ok) throw new Error(`Clerk users: ${res.status} ${await res.text()}`)
  const list = (await res.json()) as {
    id: string
    first_name: string | null
    last_name: string | null
    username: string | null
    image_url: string | null
    primary_email_address_id: string | null
    email_addresses: { id: string; email_address: string }[]
  }[]
  return list.map((u) => {
    const email = u.email_addresses.find((e) => e.id === u.primary_email_address_id)?.email_address ?? null
    const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || email || u.id
    return { id: u.id, name, email, avatar: u.image_url || null }
  })
}

async function main() {
  const sample = { company: mockCompany, stages: mockStages, team: mockTeam }
  const clerkUsers = await fetchClerkUsers()

  // People: card members first (they lead the avatar group), then the rest of the project team.
  const people = new Map<string, { name: string; avatar: string; role: string }>()
  for (const m of mockProjects[0].members) people.set(m.name, { name: m.name, avatar: m.avatar, role: "Developer" })
  for (const t of sample.team) people.set(t.name, { name: t.name, avatar: t.avatar, role: t.role })
  const ownerId = seedUserId(mockProjects[0].members[0].name)

  await db.transaction(async (tx) => {
    // --- clean up the previous seed ---
    await tx.delete(projects).where(inArray(projects.slug, mockProjects.map((p) => p.slug)))
    await tx.delete(users).where(like(users.id, "seed\\_%"))
    await tx
      .delete(clients)
      .where(
        and(
          eq(clients.name, SEED_CLIENT),
          notExists(tx.select().from(projects).where(eq(projects.clientId, clients.id))),
        ),
      )

    // --- users + client ---
    await tx.insert(users).values(
      [...people.values()].map((p) => ({ id: seedUserId(p.name), name: p.name, avatar: p.avatar })),
    )
    for (const u of clerkUsers) {
      await tx
        .insert(users)
        .values(u)
        .onConflictDoUpdate({ target: users.id, set: { name: u.name, email: u.email, avatar: u.avatar } })
    }
    const [company] = await tx
      .insert(clients)
      .values({ name: sample.company.name, logo: sample.company.logo, description: sample.company.description })
      .returning({ id: clients.id })

    const projectIdByMock = new Map<string, string>()
    let fileSeq = 0

    for (const [index, mp] of mockProjects.entries()) {
      const [row] = await tx
        .insert(projects)
        .values({
          slug: mp.slug,
          name: mp.name,
          logo: mp.logo,
          clientId: company.id,
          ownerId,
          income: mp.income,
          cost: mp.cost,
          deadline: shiftDay(mp.deadline),
          // Spread over the last ~2 months, oldest first: ordering by created_at keeps the Figma sidebar order,
          // and the finance trend (last 30 days vs the 30 before) has data on both sides.
          createdAt: new Date(Date.now() - (mockProjects.length - index) * 4 * 86_400_000),
          updatedAt: shift(mp.updatedAt),
        })
        .returning({ id: projects.id })
      projectIdByMock.set(mp.id, row.id)

      // Members, joined one second apart so ordering by joined_at keeps the mock order.
      const memberIds = [...people.values()].map((p) => seedUserId(p.name))
      await tx.insert(projectMembers).values(
        [...people.values()].map((p, i) => ({
          projectId: row.id,
          userId: seedUserId(p.name),
          role: p.role,
          joinedAt: new Date(MOCK_NOW + SHIFT - 60 * 86_400_000 + i * 1000),
        })),
      )
      if (clerkUsers.length)
        await tx.insert(projectMembers).values(
          clerkUsers.map((u) => ({ projectId: row.id, userId: u.id, role: "Project Manager", joinedAt: new Date(MOCK_NOW + SHIFT - 59 * 86_400_000) })),
        )

      const stageRows = await tx
        .insert(projectStages)
        .values(
          sample.stages.map((s) => ({
            projectId: row.id,
            position: s.index,
            name: s.name,
            startDate: shiftDay(s.start),
            endDate: shiftDay(s.end),
          })),
        )
        .returning({ id: projectStages.id, position: projectStages.position, startDate: projectStages.startDate, endDate: projectStages.endDate })

      const labelRows = await tx
        .insert(labels)
        .values(LABELS.map((l) => ({ ...l, projectId: row.id })))
        .returning({ id: labels.id })

      const plan = statusPlan(mp.tasks, mp.progress)
      const positions = new Map<string, number>()
      const taskRows = await tx
        .insert(tasks)
        .values(
          plan.map((status, i) => {
            const stage = stageRows[i % stageRows.length]
            const position = positions.get(status) ?? 0
            positions.set(status, position + 1)
            return {
              projectId: row.id,
              stageId: stage.id,
              title: TASK_TITLES[i % TASK_TITLES.length],
              status,
              position,
              startDate: stage.startDate,
              dueDate: stage.endDate,
              cover: i % 4 === 0 ? "/images/banners/banner-1.png" : null,
              createdBy: ownerId,
            }
          }),
        )
        .returning({ id: tasks.id, stageId: tasks.stageId })

      await tx.insert(taskAssignees).values(
        taskRows.flatMap((t, i) => [
          { taskId: t.id, userId: memberIds[i % memberIds.length] },
          { taskId: t.id, userId: memberIds[(i + 1) % memberIds.length] },
        ]),
      )
      await tx.insert(taskLabels).values(
        taskRows.flatMap((t, i) => [
          { taskId: t.id, labelId: labelRows[i % labelRows.length].id },
          ...(i % 2 === 0 ? [{ taskId: t.id, labelId: labelRows[(i + 1) % labelRows.length].id }] : []),
        ]),
      )

      // Two files per stage, the first one attached to a task of that stage.
      await tx.insert(files).values(
        stageRows.flatMap((s, si) =>
          [0, 1].map((k) => {
            const type = FILE_TYPES[(si + k) % FILE_TYPES.length]
            const name = `stage-${s.position}-file-${k + 1}.${type.ext}`
            return {
              projectId: row.id,
              stageId: s.id,
              taskId: k === 0 ? (taskRows.find((t) => t.stageId === s.id)?.id ?? null) : null,
              uploaderId: memberIds[(si + k) % memberIds.length],
              name,
              storagePath: `seed/${mp.slug}/${++fileSeq}-${name}`,
              size: type.size,
              mime: type.mime,
            }
          }),
        ),
      )
    }

    await tx.insert(projectEvents).values(
      mockEvents.map((e) => ({
        projectId: projectIdByMock.get(e.projectId)!,
        actorId: e.kind === "member" && people.has(e.title) ? seedUserId(e.title) : ownerId,
        kind: e.kind,
        title: e.title,
        at: shift(e.at),
      })),
    )
  })

  const stats = await db.select().from(schema.projectStats)
  const [{ count }] = await client`select count(*)::int as count from projects`
  console.log(`seeded ${people.size} users (+${clerkUsers.length} Clerk), ${count} projects, ${mockEvents.length} events`)
  console.table(stats.slice(0, 5))
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => client.end())
