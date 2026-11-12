import { sql } from "drizzle-orm"
import { date, index, integer, numeric, pgPolicy, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { authenticatedRole } from "drizzle-orm/supabase"

import { clients } from "./clients"
import { clerkUserId, isProjectMember } from "./rls"
import { users } from "./users"

// Counts and progress are not columns: see ./views.ts.

export const projects = pgTable(
  "projects",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull().unique(),
    name: text().notNull(),
    logo: text(),
    clientId: uuid().references(() => clients.id, { onDelete: "set null" }),
    ownerId: text().references(() => users.id, { onDelete: "set null" }),
    /** USD. */
    income: numeric({ precision: 12, scale: 2, mode: "number" }).notNull().default(0),
    /** USD. */
    cost: numeric({ precision: 12, scale: 2, mode: "number" }).notNull().default(0),
    deadline: date(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    /** Drives the "Last Projects" order. */
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index().on(t.clientId),
    index().on(t.ownerId),
    index().on(t.updatedAt),
    pgPolicy("projects_select_member", { for: "select", to: authenticatedRole, using: isProjectMember(t.id) }),
  ],
).enableRLS()

/** Project team (Member + TeamMember). `role` is the job title shown in the team list. */
export const projectMembers = pgTable(
  "project_members",
  {
    projectId: uuid()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text(),
    joinedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.projectId, t.userId] }),
    index().on(t.userId),
    // Own rows only: a policy that read project_members again would recurse.
    pgPolicy("project_members_select_self", {
      for: "select",
      to: authenticatedRole,
      using: sql`${t.userId} = ${clerkUserId}`,
    }),
  ],
).enableRLS()

export const projectStages = pgTable(
  "project_stages",
  {
    id: uuid().primaryKey().defaultRandom(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    /** 1-based order, shown in the number badge. Not unique so reorders can swap freely. */
    position: integer().notNull(),
    name: text().notNull(),
    startDate: date(),
    endDate: date(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index().on(t.projectId, t.position),
    pgPolicy("project_stages_select_member", {
      for: "select",
      to: authenticatedRole,
      using: isProjectMember(t.projectId),
    }),
  ],
).enableRLS()
