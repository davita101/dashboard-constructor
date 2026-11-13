"use server"

import { updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { getViewerId } from "@/lib/auth/viewer"
import type { ActionState } from "@/lib/projects/action-state"
import * as m from "@/lib/projects/mutations"
import * as s from "@/lib/projects/schemas"
import { projectTag, userProjectsTag } from "@/lib/projects/tags"

// Server Actions for the Projects section. Each one: signed-in user (auth.protect) → Zod parse → mutation
// (membership check + transaction, ./mutations.ts) → updateTag for every affected member so their next
// render reads fresh data. Form actions take (prevState, FormData) for useActionState; board actions
// (move/reorder/assign) take plain objects.

const ok: ActionState = { status: "ok" }

/** FormData → plain object; `arrays` keys keep every value (multi-selects, checkboxes). */
function fromForm(form: FormData, arrays: string[] = []) {
  const out: Record<string, unknown> = {}
  for (const key of new Set(form.keys())) {
    if (key.startsWith("$ACTION")) continue
    out[key] = arrays.includes(key) ? form.getAll(key) : form.get(key)
  }
  for (const key of arrays) out[key] ??= []
  return out
}

function expire(r: m.WriteResult) {
  for (const id of r.memberIds) updateTag(userProjectsTag(id))
  updateTag(projectTag(r.projectId))
  if (r.slugsChanged) updateTag("project-slugs")
}

/** Short, human messages for the form fields (Zod's defaults read like type errors). */
function fieldMessage(issue: z.core.$ZodIssue): string {
  if (issue.input === "" || issue.input === undefined) return "Required"
  switch (issue.code) {
    case "invalid_type":
      return "Required"
    case "too_small":
      return issue.origin === "string" && issue.minimum === 1 ? "Required" : issue.origin === "number" ? "Can't be negative" : "Too short"
    case "too_big":
      return issue.origin === "number" ? "Too large" : "Too long"
    case "invalid_format":
      return issue.format === "email" ? "Enter a valid email" : issue.format === "date" ? "Enter a valid date" : "Invalid value"
    case "invalid_union":
      return "Invalid value"
    default:
      return issue.message
  }
}

type Run = { ok: true; result: m.WriteResult } | { ok: false; state: ActionState }

/** Parse + write + expire. Never throws for expected failures: they come back as an error state. */
async function run<S extends z.ZodType>(
  schema: S,
  raw: unknown,
  write: (userId: string, input: z.output<S>) => Promise<m.WriteResult>,
): Promise<Run> {
  const userId = await getViewerId()
  const parsed = schema.safeParse(raw, { reportInput: true })
  if (!parsed.success) {
    return { ok: false, state: { status: "error", message: "Check the highlighted fields", fieldErrors: z.flattenError(parsed.error, fieldMessage).fieldErrors } }
  }
  try {
    const result = await write(userId, parsed.data)
    expire(result)
    return { ok: true, result }
  } catch (error) {
    if (error instanceof m.MutationError) {
      return {
        ok: false,
        state: { status: "error", message: error.message, fieldErrors: error.field ? { [error.field]: [error.message] } : undefined },
      }
    }
    console.error("[projects action]", error)
    return { ok: false, state: { status: "error", message: "Something went wrong, try again" } }
  }
}

const projectPath = (slug: string) => `/dashboard/projects/${slug}/dashboard`

// --- projects ---

/** A client logo needs a client to belong to. */
function requireClientForLogo(input: z.output<typeof s.projectFields>) {
  if (input.clientLogo && !input.clientName) throw new m.MutationError("invalid", "Add a client name first", "clientLogo")
}

export async function createProjectAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.createProjectInput, fromForm(form), async (userId, input) => {
    requireClientForLogo(input)
    const result = await m.createProject(userId, input)
    // The project exists now: a failed logo upload must not turn into an error that invites a duplicate create.
    await m.setLogos(userId, result.projectId, input).catch((error) => console.error("[projects action] logo upload", error))
    return result
  })
  if (!r.ok) return r.state
  redirect(projectPath(r.result.slug!))
}

export async function updateProjectAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.updateProjectInput, fromForm(form), async (userId, input) => {
    requireClientForLogo(input)
    const result = await m.updateProject(userId, input)
    await m.setLogos(userId, input.projectId, input)
    return result
  })
  if (!r.ok) return r.state
  // A rename changes the slug: move to the new URL.
  if (r.result.slugsChanged) redirect(projectPath(r.result.slug!))
  return ok
}

export async function deleteProjectAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.deleteProjectInput, fromForm(form), m.deleteProject)
  if (!r.ok) return r.state
  redirect("/dashboard/projects")
}

// --- members ---

export async function addMemberAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.addMemberInput, fromForm(form), m.addMember)
  return r.ok ? ok : r.state
}

export async function updateMemberRoleAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.updateMemberRoleInput, fromForm(form), m.updateMemberRole)
  return r.ok ? ok : r.state
}

export async function removeMemberAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.removeMemberInput, fromForm(form), m.removeMember)
  if (!r.ok) return r.state
  // Leaving a project: its page is no longer readable.
  if (form.get("userId") === (await getViewerId())) redirect("/dashboard/projects")
  return ok
}

// --- stages ---

export async function createStageAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.createStageInput, fromForm(form), m.createStage)
  return r.ok ? ok : r.state
}

export async function updateStageAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.updateStageInput, fromForm(form), m.updateStage)
  return r.ok ? ok : r.state
}

export async function deleteStageAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.deleteStageInput, fromForm(form), m.deleteStage)
  return r.ok ? ok : r.state
}

export async function reorderStagesAction(input: z.input<typeof s.reorderStagesInput>): Promise<ActionState> {
  const r = await run(s.reorderStagesInput, input, m.reorderStages)
  return r.ok ? ok : r.state
}

// --- tasks ---

export async function createTaskAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.createTaskInput, fromForm(form, ["assigneeIds"]), m.createTask)
  return r.ok ? ok : r.state
}

export async function updateTaskAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.updateTaskInput, fromForm(form), m.updateTask)
  return r.ok ? ok : r.state
}

export async function deleteTaskAction(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await run(s.deleteTaskInput, fromForm(form), m.deleteTask)
  return r.ok ? ok : r.state
}

export async function moveTaskAction(input: z.input<typeof s.moveTaskInput>): Promise<ActionState> {
  const r = await run(s.moveTaskInput, input, m.moveTask)
  return r.ok ? ok : r.state
}

export async function setTaskStatusAction(input: z.input<typeof s.setTaskStatusInput>): Promise<ActionState> {
  const r = await run(s.setTaskStatusInput, input, m.setTaskStatus)
  return r.ok ? ok : r.state
}

// --- files ---

/** Called by the upload dialog after the browser put the object in Storage. */
export async function registerFileAction(input: z.input<typeof s.registerFileInput>): Promise<ActionState & { fileId?: string }> {
  const r = await run(s.registerFileInput, input, m.registerFile)
  return r.ok ? { ...ok, fileId: r.result.fileId } : r.state
}

export async function deleteFileAction(input: z.input<typeof s.deleteFileInput>): Promise<ActionState> {
  const r = await run(s.deleteFileInput, input, m.deleteFile)
  return r.ok ? ok : r.state
}

export async function setTaskAssigneesAction(input: z.input<typeof s.setTaskAssigneesInput>): Promise<ActionState> {
  const r = await run(s.setTaskAssigneesInput, input, m.setTaskAssignees)
  return r.ok ? ok : r.state
}
