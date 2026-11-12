import { sql } from "drizzle-orm"
import { date, index, integer, pgEnum, pgPolicy, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { authenticatedRole } from "drizzle-orm/supabase"

import { projects, projectStages } from "./projects"
import { isProjectMember } from "./rls"
import { users } from "./users"

export const taskStatus = pgEnum("task_status", ["new", "in_work", "done", "failed"])

export const tasks = pgTable(
  "tasks",
  {
    id: uuid().primaryKey().defaultRandom(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    stageId: uuid().references(() => projectStages.id, { onDelete: "set null" }),
    title: text().notNull(),
    description: text(),
    status: taskStatus().notNull().default("new"),
    /** Order inside its board column (dnd-kit). */
    position: integer().notNull().default(0),
    startDate: date(),
    dueDate: date(),
    cover: text(),
    createdBy: text().references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index().on(t.projectId, t.status, t.position),
    index().on(t.stageId),
    pgPolicy("tasks_select_member", { for: "select", to: authenticatedRole, using: isProjectMember(t.projectId) }),
  ],
).enableRLS()

export const taskAssignees = pgTable(
  "task_assignees",
  {
    taskId: uuid()
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.taskId, t.userId] }),
    index().on(t.userId),
    // `tasks` is itself RLS-filtered to the user's projects.
    pgPolicy("task_assignees_select_member", {
      for: "select",
      to: authenticatedRole,
      using: sql`${t.taskId} in (select id from tasks)`,
    }),
  ],
).enableRLS()

/** Labels are defined per project and attached to tasks through task_labels. */
export const labels = pgTable(
  "labels",
  {
    id: uuid().primaryKey().defaultRandom(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text().notNull(),
    /** Badge `color` variant (blue, green, orange, purple, …). */
    color: text().notNull(),
  },
  (t) => [
    index().on(t.projectId),
    pgPolicy("labels_select_member", { for: "select", to: authenticatedRole, using: isProjectMember(t.projectId) }),
  ],
).enableRLS()

export const taskLabels = pgTable(
  "task_labels",
  {
    taskId: uuid()
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    labelId: uuid()
      .notNull()
      .references(() => labels.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.taskId, t.labelId] }),
    index().on(t.labelId),
    pgPolicy("task_labels_select_member", {
      for: "select",
      to: authenticatedRole,
      using: sql`${t.taskId} in (select id from tasks)`,
    }),
  ],
).enableRLS()
