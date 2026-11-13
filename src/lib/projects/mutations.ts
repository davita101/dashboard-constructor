import "server-only"

import { and, asc, count, eq, inArray, max, ne, sql } from "drizzle-orm"
import type { z } from "zod"

import { db } from "@/db"
import { clients, files, projectEvents, projectMembers, projects, projectStages, taskAssignees, tasks, users } from "@/db/schema"
import { LOGOS_BUCKET, PROJECT_FILES_BUCKET, projectIdOfPath } from "@/lib/files/paths"
import { logoKeyOf, removeObjects, uploadLogo } from "@/lib/files/storage"
import type {
  addMemberInput,
  createProjectInput,
  createStageInput,
  createTaskInput,
  deleteFileInput,
  deleteProjectInput,
  deleteStageInput,
  deleteTaskInput,
  moveTaskInput,
  projectFields,
  registerFileInput,
  removeMemberInput,
  reorderStagesInput,
  setTaskAssigneesInput,
  setTaskStatusInput,
  updateMemberRoleInput,
  updateProjectInput,
  updateStageInput,
  updateTaskInput,
} from "@/lib/projects/schemas"

// Projects writes. Every function takes the signed-in Clerk user id (from auth(), never from the client) and
// already-validated input (./schemas.ts), runs in one transaction and checks that the user is a member of the
// project it touches: Drizzle bypasses RLS, so this check is the access control.
// Permissions: every member may edit everything (project_members.role is a job title, not a permission).
// Creates append a project_events row (the feed kinds are all "Added …"; edits/deletes have no kind yet).
// Each function returns who must see the change, so the action can expire their cached reads.

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

export type WriteResult = {
  projectId: string
  /** Members before and after the write: their `user-projects:` cache must be expired. */
  memberIds: string[]
  slug?: string
  /** The slug list changed (create/delete): expire `project-slugs`. */
  slugsChanged?: boolean
  /** registerFile: the new `files` row. */
  fileId?: string
}

export class MutationError extends Error {
  constructor(
    readonly code: "not_found" | "invalid" | "conflict",
    message: string,
    readonly field?: string,
  ) {
    super(message)
    this.name = "MutationError"
  }
}

// --- helpers ---

/** Throws not_found unless `userId` is a member (a non-member must not learn the project exists). */
async function requireMember(tx: Tx, userId: string, projectId: string) {
  const [row] = await tx
    .select({ slug: projects.slug })
    .from(projects)
    .innerJoin(projectMembers, and(eq(projectMembers.projectId, projects.id), eq(projectMembers.userId, userId)))
    .where(eq(projects.id, projectId))
    .limit(1)
  if (!row) throw new MutationError("not_found", "Project not found")
  return row
}

async function projectMemberIds(tx: Tx, projectId: string) {
  const rows = await tx.select({ id: projectMembers.userId }).from(projectMembers).where(eq(projectMembers.projectId, projectId))
  return rows.map((r) => r.id)
}

async function userName(tx: Tx, userId: string) {
  const [u] = await tx.select({ name: users.name }).from(users).where(eq(users.id, userId)).limit(1)
  return u?.name ?? userId
}

function logEvent(tx: Tx, e: { projectId: string; actorId: string; kind: "member" | "stage" | "task" | "file"; title: string }) {
  return tx.insert(projectEvents).values(e)
}

/** Bump updated_at so the project rises in "Last Projects". */
function touch(tx: Tx, projectId: string) {
  return tx.update(projects).set({ updatedAt: new Date() }).where(eq(projects.id, projectId))
}

async function result(tx: Tx, projectId: string, extra: Partial<WriteResult> = {}, before: string[] = []): Promise<WriteResult> {
  const now = await projectMemberIds(tx, projectId)
  return { projectId, memberIds: [...new Set([...before, ...now])], ...extra }
}

/** "My Big Project!" → "my-big-project"; never "new" (that's the editor route). */
function slugify(name: string) {
  const base =
    name
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "project"
  return base === "new" ? "new-project" : base
}

async function uniqueSlug(tx: Tx, name: string, exceptProjectId?: string) {
  const base = slugify(name)
  const rows = await tx
    .select({ slug: projects.slug })
    .from(projects)
    .where(
      and(
        sql`(${projects.slug} = ${base} or ${projects.slug} like ${base + "-%"})`,
        exceptProjectId ? ne(projects.id, exceptProjectId) : undefined,
      ),
    )
  const taken = new Set(rows.map((r) => r.slug))
  if (!taken.has(base)) return base
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`
}

/** Client for a project: reuse it when only this project uses it, else make a new one. null clears. */
async function upsertClient(
  tx: Tx,
  currentClientId: string | null,
  projectId: string | null,
  name: string | undefined,
  description: string | undefined,
) {
  if (!name) return null
  if (currentClientId && projectId) {
    const [{ n }] = await tx
      .select({ n: count() })
      .from(projects)
      .where(and(eq(projects.clientId, currentClientId), ne(projects.id, projectId)))
    if (n === 0) {
      await tx.update(clients).set({ name, description: description ?? null }).where(eq(clients.id, currentClientId))
      return currentClientId
    }
  }
  // A shared client is copied, keeping its logo (logo upload arrives with Storage, Phase 4).
  const [current] = currentClientId
    ? await tx.select({ logo: clients.logo }).from(clients).where(eq(clients.id, currentClientId)).limit(1)
    : []
  const [c] = await tx
    .insert(clients)
    .values({ name, description: description ?? null, logo: current?.logo ?? null })
    .returning({ id: clients.id })
  return c.id
}

/** Drop a client no project points at any more (and its logo, if nothing else uses it). */
async function pruneClient(tx: Tx, clientId: string | null) {
  if (!clientId) return
  const [gone] = await tx
    .delete(clients)
    .where(and(eq(clients.id, clientId), sql`not exists (select 1 from ${projects} where ${projects.clientId} = ${clientId})`))
    .returning({ logo: clients.logo })
  if (gone) await removeLogoIfUnused(tx, gone.logo)
}

/**
 * Delete a logo object once no project or client row points at it (a copied client shares its URL).
 * Runs inside the write transaction, before commit: the storage policy still sees the user as a member.
 */
async function removeLogoIfUnused(tx: Tx, url: string | null) {
  const key = logoKeyOf(url)
  if (!key || !url) return
  const [{ n }] = await tx
    .select({ n: count() })
    .from(projects)
    .where(sql`${projects.logo} = ${url} or exists (select 1 from ${clients} where ${clients.logo} = ${url})`)
  if (n === 0) await removeObjects(LOGOS_BUCKET, [key], true)
}

async function taskProject(tx: Tx, userId: string, taskId: string) {
  const [t] = await tx.select({ projectId: tasks.projectId, status: tasks.status }).from(tasks).where(eq(tasks.id, taskId)).limit(1)
  if (!t) throw new MutationError("not_found", "Task not found")
  await requireMember(tx, userId, t.projectId)
  return t
}

async function stageProject(tx: Tx, userId: string, stageId: string) {
  const [s] = await tx.select({ projectId: projectStages.projectId }).from(projectStages).where(eq(projectStages.id, stageId)).limit(1)
  if (!s) throw new MutationError("not_found", "Stage not found")
  await requireMember(tx, userId, s.projectId)
  return s
}

/** A stage id must belong to the same project as the task. */
async function assertStageIn(tx: Tx, projectId: string, stageId: string | null) {
  if (!stageId) return
  const [s] = await tx
    .select({ id: projectStages.id })
    .from(projectStages)
    .where(and(eq(projectStages.id, stageId), eq(projectStages.projectId, projectId)))
    .limit(1)
  if (!s) throw new MutationError("invalid", "Stage is not in this project", "stageId")
}

/** Only project members can be assigned. */
async function assertMembers(tx: Tx, projectId: string, userIds: string[]) {
  if (!userIds.length) return
  const ids = new Set(await projectMemberIds(tx, projectId))
  if (userIds.some((u) => !ids.has(u))) throw new MutationError("invalid", "Assignee is not a project member", "assigneeIds")
}

/** Renumber stages 1..n in their current order (after a delete). */
async function compactStages(tx: Tx, projectId: string) {
  const rows = await tx
    .select({ id: projectStages.id })
    .from(projectStages)
    .where(eq(projectStages.projectId, projectId))
    .orderBy(asc(projectStages.position), asc(projectStages.createdAt))
  await setStagePositions(tx, rows.map((r) => r.id))
}

/** `case id when <id> then <n> … end`: one UPDATE writes every position (base = first number). */
function positionsCase(column: typeof tasks.id | typeof projectStages.id, ids: string[], base: number) {
  return sql`case ${column} ${sql.join(
    ids.map((id, i) => sql`when ${id}::uuid then ${i + base}::int`),
    sql` `,
  )} end`
}

/** Stage positions 1..n in the given id order. */
async function setStagePositions(tx: Tx, ids: string[]) {
  if (!ids.length) return
  await tx
    .update(projectStages)
    .set({ position: positionsCase(projectStages.id, ids, 1) })
    .where(inArray(projectStages.id, ids))
}

/** Rewrite positions 0..n of one board column, in the given id order. */
async function writeColumn(tx: Tx, ids: string[]) {
  if (!ids.length) return
  await tx.update(tasks).set({ position: positionsCase(tasks.id, ids, 0) }).where(inArray(tasks.id, ids))
}

async function columnIds(tx: Tx, projectId: string, status: (typeof tasks.status.enumValues)[number], exceptTaskId?: string) {
  const rows = await tx
    .select({ id: tasks.id })
    .from(tasks)
    .where(and(eq(tasks.projectId, projectId), eq(tasks.status, status), exceptTaskId ? ne(tasks.id, exceptTaskId) : undefined))
    .orderBy(asc(tasks.position), asc(tasks.createdAt))
  return rows.map((r) => r.id)
}

// --- projects ---

export function createProject(userId: string, input: z.output<typeof createProjectInput>) {
  return db.transaction(async (tx) => {
    const clientId = await upsertClient(tx, null, null, input.clientName, input.clientDescription)
    const slug = await uniqueSlug(tx, input.name)
    const [p] = await tx
      .insert(projects)
      .values({
        slug,
        name: input.name,
        clientId,
        ownerId: userId,
        income: input.income,
        cost: input.cost,
        deadline: input.deadline,
      })
      .returning({ id: projects.id })
    await tx.insert(projectMembers).values({ projectId: p.id, userId })
    await logEvent(tx, { projectId: p.id, actorId: userId, kind: "member", title: await userName(tx, userId) })
    return result(tx, p.id, { slug, slugsChanged: true })
  })
}

export function updateProject(userId: string, input: z.output<typeof updateProjectInput>) {
  return db.transaction(async (tx) => {
    await requireMember(tx, userId, input.projectId)
    const [current] = await tx
      .select({ name: projects.name, slug: projects.slug, clientId: projects.clientId })
      .from(projects)
      .where(eq(projects.id, input.projectId))
    const clientId = await upsertClient(tx, current.clientId, input.projectId, input.clientName, input.clientDescription)
    // The slug follows a rename so links read well; old links 404 (no redirect table yet).
    const slug = input.name === current.name ? current.slug : await uniqueSlug(tx, input.name, input.projectId)
    await tx
      .update(projects)
      .set({ name: input.name, slug, clientId, income: input.income, cost: input.cost, deadline: input.deadline })
      .where(eq(projects.id, input.projectId))
    if (current.clientId !== clientId) await pruneClient(tx, current.clientId)
    return result(tx, input.projectId, { slug, slugsChanged: slug !== current.slug })
  })
}

export function deleteProject(userId: string, input: z.output<typeof deleteProjectInput>) {
  return db.transaction(async (tx) => {
    await requireMember(tx, userId, input.projectId)
    const before = await projectMemberIds(tx, input.projectId)
    const fileKeys = await tx.select({ key: files.storagePath }).from(files).where(eq(files.projectId, input.projectId))
    const [p] = await tx
      .delete(projects)
      .where(eq(projects.id, input.projectId))
      .returning({ clientId: projects.clientId, logo: projects.logo })
    await pruneClient(tx, p.clientId)
    // Stages, tasks, members, events, files rows cascade; storage objects go before commit (policy = member).
    await removeLogoIfUnused(tx, p.logo)
    await removeObjects(PROJECT_FILES_BUCKET, fileKeys.map((f) => f.key), true)
    return { projectId: input.projectId, memberIds: before, slugsChanged: true } satisfies WriteResult
  })
}

// --- members ---

export function addMember(userId: string, input: z.output<typeof addMemberInput>) {
  return db.transaction(async (tx) => {
    await requireMember(tx, userId, input.projectId)
    // Only people who already signed up (the Clerk webhook / first visit creates their `users` row).
    const [u] = await tx
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(sql`lower(${users.email}) = ${input.email}`)
      .limit(1)
    if (!u) throw new MutationError("not_found", "No user with this email has signed up yet", "email")
    const inserted = await tx
      .insert(projectMembers)
      .values({ projectId: input.projectId, userId: u.id, role: input.role ?? null })
      .onConflictDoNothing()
      .returning({ userId: projectMembers.userId })
    if (!inserted.length) throw new MutationError("conflict", "Already a member", "email")
    await logEvent(tx, { projectId: input.projectId, actorId: userId, kind: "member", title: u.name })
    await touch(tx, input.projectId)
    return result(tx, input.projectId)
  })
}

export function updateMemberRole(userId: string, input: z.output<typeof updateMemberRoleInput>) {
  return db.transaction(async (tx) => {
    await requireMember(tx, userId, input.projectId)
    const updated = await tx
      .update(projectMembers)
      .set({ role: input.role ?? null })
      .where(and(eq(projectMembers.projectId, input.projectId), eq(projectMembers.userId, input.userId)))
      .returning({ userId: projectMembers.userId })
    if (!updated.length) throw new MutationError("not_found", "Member not found")
    return result(tx, input.projectId)
  })
}

export function removeMember(userId: string, input: z.output<typeof removeMemberInput>) {
  return db.transaction(async (tx) => {
    await requireMember(tx, userId, input.projectId)
    const before = await projectMemberIds(tx, input.projectId)
    if (!before.includes(input.userId)) throw new MutationError("not_found", "Member not found")
    if (before.length === 1) throw new MutationError("invalid", "A project needs at least one member: delete the project instead")
    await tx
      .delete(projectMembers)
      .where(and(eq(projectMembers.projectId, input.projectId), eq(projectMembers.userId, input.userId)))
    // Their task assignments in this project go too.
    await tx
      .delete(taskAssignees)
      .where(
        and(
          eq(taskAssignees.userId, input.userId),
          inArray(taskAssignees.taskId, tx.select({ id: tasks.id }).from(tasks).where(eq(tasks.projectId, input.projectId))),
        ),
      )
    await touch(tx, input.projectId)
    return result(tx, input.projectId, {}, before)
  })
}

// --- stages ---

export function createStage(userId: string, input: z.output<typeof createStageInput>) {
  return db.transaction(async (tx) => {
    await requireMember(tx, userId, input.projectId)
    const [{ last }] = await tx
      .select({ last: max(projectStages.position) })
      .from(projectStages)
      .where(eq(projectStages.projectId, input.projectId))
    await tx.insert(projectStages).values({
      projectId: input.projectId,
      position: (last ?? 0) + 1,
      name: input.name,
      startDate: input.startDate,
      endDate: input.endDate,
    })
    await logEvent(tx, { projectId: input.projectId, actorId: userId, kind: "stage", title: input.name })
    await touch(tx, input.projectId)
    return result(tx, input.projectId)
  })
}

export function updateStage(userId: string, input: z.output<typeof updateStageInput>) {
  return db.transaction(async (tx) => {
    const { projectId } = await stageProject(tx, userId, input.stageId)
    await tx
      .update(projectStages)
      .set({ name: input.name, startDate: input.startDate, endDate: input.endDate })
      .where(eq(projectStages.id, input.stageId))
    await touch(tx, projectId)
    return result(tx, projectId)
  })
}

export function deleteStage(userId: string, input: z.output<typeof deleteStageInput>) {
  return db.transaction(async (tx) => {
    const { projectId } = await stageProject(tx, userId, input.stageId)
    // Its tasks and files stay in the project (stage_id → null).
    await tx.delete(projectStages).where(eq(projectStages.id, input.stageId))
    await compactStages(tx, projectId)
    await touch(tx, projectId)
    return result(tx, projectId)
  })
}

export function reorderStages(userId: string, input: z.output<typeof reorderStagesInput>) {
  return db.transaction(async (tx) => {
    await requireMember(tx, userId, input.projectId)
    const rows = await tx.select({ id: projectStages.id }).from(projectStages).where(eq(projectStages.projectId, input.projectId))
    const ids = new Set(rows.map((r) => r.id))
    const given = new Set(input.stageIds)
    if (given.size !== input.stageIds.length || given.size !== ids.size || input.stageIds.some((id) => !ids.has(id)))
      throw new MutationError("invalid", "Send every stage of the project exactly once")
    await setStagePositions(tx, input.stageIds)
    await touch(tx, input.projectId)
    return result(tx, input.projectId)
  })
}

// --- tasks ---

export function createTask(userId: string, input: z.output<typeof createTaskInput>) {
  return db.transaction(async (tx) => {
    await requireMember(tx, userId, input.projectId)
    await assertStageIn(tx, input.projectId, input.stageId)
    const assignees = [...new Set(input.assigneeIds)]
    await assertMembers(tx, input.projectId, assignees)
    // New tasks go to the bottom of their column.
    const [{ last }] = await tx
      .select({ last: max(tasks.position) })
      .from(tasks)
      .where(and(eq(tasks.projectId, input.projectId), eq(tasks.status, input.status)))
    const [t] = await tx
      .insert(tasks)
      .values({
        projectId: input.projectId,
        stageId: input.stageId,
        title: input.title,
        description: input.description ?? null,
        status: input.status,
        position: last === null ? 0 : last + 1,
        startDate: input.startDate,
        dueDate: input.dueDate,
        createdBy: userId,
      })
      .returning({ id: tasks.id })
    if (assignees.length) await tx.insert(taskAssignees).values(assignees.map((u) => ({ taskId: t.id, userId: u })))
    await logEvent(tx, { projectId: input.projectId, actorId: userId, kind: "task", title: input.title })
    await touch(tx, input.projectId)
    return result(tx, input.projectId)
  })
}

export function updateTask(userId: string, input: z.output<typeof updateTaskInput>) {
  return db.transaction(async (tx) => {
    const { projectId } = await taskProject(tx, userId, input.taskId)
    await assertStageIn(tx, projectId, input.stageId)
    await tx
      .update(tasks)
      .set({
        title: input.title,
        description: input.description ?? null,
        stageId: input.stageId,
        startDate: input.startDate,
        dueDate: input.dueDate,
      })
      .where(eq(tasks.id, input.taskId))
    await touch(tx, projectId)
    return result(tx, projectId)
  })
}

/** dnd-kit drop: put the task at `index` of the `status` column and renumber both columns. */
export function moveTask(userId: string, input: z.output<typeof moveTaskInput>) {
  return db.transaction(async (tx) => {
    const { projectId, status: from } = await taskProject(tx, userId, input.taskId)
    const target = await columnIds(tx, projectId, input.status, input.taskId)
    target.splice(Math.min(input.index, target.length), 0, input.taskId)
    await tx.update(tasks).set({ status: input.status }).where(eq(tasks.id, input.taskId))
    await writeColumn(tx, target)
    if (from !== input.status) await writeColumn(tx, await columnIds(tx, projectId, from))
    await touch(tx, projectId)
    return result(tx, projectId)
  })
}

/** Status change outside the board (e.g. a "Done" button): the task goes to the bottom of its new column. */
export function setTaskStatus(userId: string, input: z.output<typeof setTaskStatusInput>) {
  return db.transaction(async (tx) => {
    const { projectId, status: from } = await taskProject(tx, userId, input.taskId)
    if (from === input.status) return result(tx, projectId)
    const target = await columnIds(tx, projectId, input.status, input.taskId)
    await tx.update(tasks).set({ status: input.status }).where(eq(tasks.id, input.taskId))
    await writeColumn(tx, [...target, input.taskId])
    await writeColumn(tx, await columnIds(tx, projectId, from))
    await touch(tx, projectId)
    return result(tx, projectId)
  })
}

export function setTaskAssignees(userId: string, input: z.output<typeof setTaskAssigneesInput>) {
  return db.transaction(async (tx) => {
    const { projectId } = await taskProject(tx, userId, input.taskId)
    const ids = [...new Set(input.userIds)]
    await assertMembers(tx, projectId, ids)
    await tx.delete(taskAssignees).where(eq(taskAssignees.taskId, input.taskId))
    if (ids.length) await tx.insert(taskAssignees).values(ids.map((u) => ({ taskId: input.taskId, userId: u })))
    await touch(tx, projectId)
    return result(tx, projectId)
  })
}

export function deleteTask(userId: string, input: z.output<typeof deleteTaskInput>) {
  return db.transaction(async (tx) => {
    const { projectId, status } = await taskProject(tx, userId, input.taskId)
    await tx.delete(tasks).where(eq(tasks.id, input.taskId))
    await writeColumn(tx, await columnIds(tx, projectId, status))
    await touch(tx, projectId)
    return result(tx, projectId)
  })
}

// --- logos ---

/**
 * Upload the project / client logo picked in the project form. Runs after create/update committed, so the storage
 * policy sees the user as a member and the project's current client. Replaced logos are deleted when unused.
 */
export async function setLogos(userId: string, projectId: string, input: Partial<Pick<z.output<typeof projectFields>, "logo" | "clientLogo" | "removeLogo" | "removeClientLogo">>) {
  // A new upload for a slot wins over its remove flag.
  const dropLogo = !!input.removeLogo && !input.logo
  const dropClientLogo = !!input.removeClientLogo && !input.clientLogo
  if (!input.logo && !input.clientLogo && !dropLogo && !dropClientLogo) return
  const [current] = await db
    .select({ logo: projects.logo, clientId: projects.clientId, clientLogo: clients.logo })
    .from(projects)
    .innerJoin(projectMembers, and(eq(projectMembers.projectId, projects.id), eq(projectMembers.userId, userId)))
    .leftJoin(clients, eq(clients.id, projects.clientId))
    .where(eq(projects.id, projectId))
    .limit(1)
  if (!current) throw new MutationError("not_found", "Project not found")
  if (input.clientLogo && !current.clientId) throw new MutationError("invalid", "Add a client name first", "clientLogo")

  const logo = input.logo ? await uploadLogo("projects", projectId, input.logo) : undefined
  const clientLogo = input.clientLogo && current.clientId ? await uploadLogo("clients", current.clientId, input.clientLogo) : undefined
  await db.transaction(async (tx) => {
    if (logo) await tx.update(projects).set({ logo }).where(eq(projects.id, projectId))
    if (clientLogo && current.clientId) await tx.update(clients).set({ logo: clientLogo }).where(eq(clients.id, current.clientId))
    if (dropLogo && current.logo) await tx.update(projects).set({ logo: null }).where(eq(projects.id, projectId))
    // No client → nothing to clear, ignored silently.
    if (dropClientLogo && current.clientId && current.clientLogo) await tx.update(clients).set({ logo: null }).where(eq(clients.id, current.clientId))
    if (logo || dropLogo) await removeLogoIfUnused(tx, current.logo)
    if (clientLogo || (dropClientLogo && current.clientId)) await removeLogoIfUnused(tx, current.clientLogo)
  })
}

// --- files ---

/** Record a file the browser just uploaded (storage RLS already checked membership; checked again here). */
export function registerFile(userId: string, input: z.output<typeof registerFileInput>) {
  return db.transaction(async (tx) => {
    if (projectIdOfPath(input.path) !== input.projectId) throw new MutationError("invalid", "Invalid upload path")
    await requireMember(tx, userId, input.projectId)
    await assertStageIn(tx, input.projectId, input.stageId)
    // Size and type come from Storage, not from the client.
    const {
      rows: [object],
    } = await tx.execute<{ size: string | null; mime: string | null }>(
      sql`select metadata->>'size' as size, metadata->>'mimetype' as mime from storage.objects where bucket_id = ${PROJECT_FILES_BUCKET} and name = ${input.path} limit 1`,
    )
    if (!object) throw new MutationError("not_found", "Upload not found, try again")
    const [f] = await tx
      .insert(files)
      .values({
        projectId: input.projectId,
        stageId: input.stageId,
        uploaderId: userId,
        name: input.name,
        storagePath: input.path,
        size: Number(object.size ?? 0),
        mime: object.mime,
      })
      .onConflictDoNothing()
      .returning({ id: files.id })
    if (!f) throw new MutationError("conflict", "File already added")
    await logEvent(tx, { projectId: input.projectId, actorId: userId, kind: "file", title: input.name })
    await touch(tx, input.projectId)
    return result(tx, input.projectId, { fileId: f.id })
  })
}

export function deleteFile(userId: string, input: z.output<typeof deleteFileInput>) {
  return db.transaction(async (tx) => {
    const [row] = await tx.select({ projectId: files.projectId }).from(files).where(eq(files.id, input.fileId)).limit(1)
    if (!row) throw new MutationError("not_found", "File not found")
    await requireMember(tx, userId, row.projectId)
    const [f] = await tx.delete(files).where(eq(files.id, input.fileId)).returning({ key: files.storagePath })
    // Not best-effort: if Storage refuses, the row comes back (rollback) instead of pointing at nothing.
    await removeObjects(PROJECT_FILES_BUCKET, [f.key])
    await touch(tx, row.projectId)
    return result(tx, row.projectId)
  })
}
