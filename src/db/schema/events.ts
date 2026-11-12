import { index, pgEnum, pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { authenticatedRole } from "drizzle-orm/supabase"

import { projects } from "./projects"
import { isProjectMember } from "./rls"
import { users } from "./users"

export const projectEventKind = pgEnum("project_event_kind", ["member", "comment", "stage", "file", "task"])

/** Activity feed ("Latest events"). Every write appends one (Phase 3). */
export const projectEvents = pgTable(
  "project_events",
  {
    id: uuid().primaryKey().defaultRandom(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    actorId: text().references(() => users.id, { onDelete: "set null" }),
    kind: projectEventKind().notNull(),
    /** First line: who or what (e.g. "John Smith", "Image-template.pdf"). */
    title: text().notNull(),
    at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index().on(t.projectId, t.at),
    index().on(t.at),
    pgPolicy("project_events_select_member", {
      for: "select",
      to: authenticatedRole,
      using: isProjectMember(t.projectId),
    }),
  ],
).enableRLS()
