import { sql } from "drizzle-orm"
import { pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { authenticatedRole } from "drizzle-orm/supabase"

/** Customer company of a project (ProjectDetail.company). */
export const clients = pgTable(
  "clients",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    logo: text(),
    description: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // `projects` is itself RLS-filtered to the user's projects.
    pgPolicy("clients_select_member", {
      for: "select",
      to: authenticatedRole,
      using: sql`${t.id} in (select client_id from projects)`,
    }),
  ],
).enableRLS()
