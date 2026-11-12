import { bigint, index, pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { authenticatedRole } from "drizzle-orm/supabase"

import { projects, projectStages } from "./projects"
import { isProjectMember } from "./rls"
import { tasks } from "./tasks"
import { users } from "./users"

/** Metadata for objects in Supabase Storage (bucket comes in Phase 4). */
export const files = pgTable(
  "files",
  {
    id: uuid().primaryKey().defaultRandom(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    stageId: uuid().references(() => projectStages.id, { onDelete: "set null" }),
    /** Task attachment (task card paperclip count). */
    taskId: uuid().references(() => tasks.id, { onDelete: "set null" }),
    uploaderId: text().references(() => users.id, { onDelete: "set null" }),
    name: text().notNull(),
    /** Object key inside the storage bucket. */
    storagePath: text().notNull().unique(),
    size: bigint({ mode: "number" }).notNull(),
    mime: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index().on(t.projectId),
    index().on(t.stageId),
    index().on(t.taskId),
    pgPolicy("files_select_member", { for: "select", to: authenticatedRole, using: isProjectMember(t.projectId) }),
  ],
).enableRLS()
