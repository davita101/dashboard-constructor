import { z } from "zod"

import { LOGO_TYPES, MAX_LOGO_BYTES } from "@/lib/files/paths"

// Input schemas for the Projects write actions (./actions.ts). Client-safe: forms may reuse them for hints.
// FormData values arrive as strings, so optional fields accept "" and turn it into undefined/null.

const id = z.uuid()
const text = (max: number) => z.string().trim().min(1).max(max)
/** "" → undefined, otherwise trimmed text. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined))
/** yyyy-mm-dd from <input type="date">; "" → null (clears the date). */
const isoDate = z
  .union([z.iso.date(), z.literal("")])
  .optional()
  .transform((v) => (v ? v : null))
/** Whole USD, ≥ 0; "" → 0. */
const money = z.union([z.literal("").transform(() => 0), z.coerce.number().min(0).max(9_999_999_999)])

export const taskStatuses = ["new", "in_work", "done", "failed"] as const
export type TaskStatus = (typeof taskStatuses)[number]

/** Optional image from <input type="file">: an empty input posts a 0-byte File → undefined. */
const logoFile = z
  .custom<File>((v) => v instanceof File)
  .optional()
  .transform((f) => (f && f.size > 0 ? f : undefined))
  .refine((f) => !f || f.size <= MAX_LOGO_BYTES, "Max 2 MB")
  .refine((f) => !f || f.type in LOGO_TYPES, "PNG, JPG, WEBP or GIF")

/** Checkbox / flag from a form: "on" | "true" | "1" → true, anything else or absent → false. */
const flag = z
  .union([z.string(), z.boolean()])
  .optional()
  .transform((v) => v === true || v === "on" || v === "true" || v === "1")

// --- Projects ---

export const projectFields = z.object({
  name: text(120),
  clientName: optionalText(120),
  clientDescription: optionalText(500),
  deadline: isoDate,
  income: money,
  cost: money,
  logo: logoFile,
  clientLogo: logoFile,
  removeLogo: flag,
  removeClientLogo: flag,
})
export const createProjectInput = projectFields
export const updateProjectInput = projectFields.extend({ projectId: id })
export const deleteProjectInput = z.object({ projectId: id })

// --- Members ---

export const addMemberInput = z.object({
  projectId: id,
  email: z.string().trim().toLowerCase().pipe(z.email()),
  role: optionalText(80),
})
export const updateMemberRoleInput = z.object({ projectId: id, userId: text(64), role: optionalText(80) })
export const removeMemberInput = z.object({ projectId: id, userId: text(64) })

// --- Stages ---

const stageFields = z
  .object({ name: text(120), startDate: isoDate, endDate: isoDate })
  .refine((s) => !s.startDate || !s.endDate || s.startDate <= s.endDate, { path: ["endDate"], message: "End is before start" })
export const createStageInput = stageFields.and(z.object({ projectId: id }))
export const updateStageInput = stageFields.and(z.object({ stageId: id }))
export const deleteStageInput = z.object({ stageId: id })
/** Every stage id of the project in the new order. */
export const reorderStagesInput = z.object({ projectId: id, stageIds: z.array(id).min(1).max(500) })

// --- Tasks ---

const optionalId = z
  .union([id, z.literal("")])
  .optional()
  .transform((v) => (v ? v : null))

export const createTaskInput = z
  .object({
    projectId: id,
    stageId: optionalId,
    title: text(200),
    description: optionalText(2000),
    status: z.enum(taskStatuses).default("new"),
    startDate: isoDate,
    dueDate: isoDate,
    assigneeIds: z.array(text(64)).max(50).default([]),
  })
  .refine((t) => !t.startDate || !t.dueDate || t.startDate <= t.dueDate, { path: ["dueDate"], message: "Due is before start" })
/** Full edit form: omitted optional fields are cleared. */
export const updateTaskInput = z
  .object({
    taskId: id,
    title: text(200),
    description: optionalText(2000),
    stageId: optionalId,
    startDate: isoDate,
    dueDate: isoDate,
  })
  .refine((t) => !t.startDate || !t.dueDate || t.startDate <= t.dueDate, { path: ["dueDate"], message: "Due is before start" })
/** dnd-kit drop: the task lands in `status` column at `index` (0-based). */
export const moveTaskInput = z.object({ taskId: id, status: z.enum(taskStatuses), index: z.number().int().min(0) })
export const setTaskAssigneesInput = z.object({ taskId: id, userIds: z.array(text(64)).max(50) })
export const setTaskStatusInput = z.object({ taskId: id, status: z.enum(taskStatuses) })
export const deleteTaskInput = z.object({ taskId: id })

// --- Files ---

/** After the browser uploaded to project-files/<projectId>/<uuid>/<name>: record it. */
export const registerFileInput = z.object({
  projectId: id,
  path: z.string().max(400),
  name: text(255),
  stageId: optionalId,
})
export const deleteFileInput = z.object({ fileId: id })
