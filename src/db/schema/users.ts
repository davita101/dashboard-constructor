import { sql } from "drizzle-orm"
import { pgPolicy, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { authenticatedRole } from "drizzle-orm/supabase"

import { clerkUserId } from "./rls"

/** Mirror of Clerk users, kept in sync by /api/webhooks/clerk. */
export const users = pgTable(
  "users",
  {
    /** Clerk user id (`user_…`). Seed users use `seed_…`. */
    id: text().primaryKey(),
    name: text().notNull(),
    email: text(),
    avatar: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    pgPolicy("users_select_self", {
      for: "select",
      to: authenticatedRole,
      using: sql`${t.id} = ${clerkUserId}`,
    }),
  ],
).enableRLS()
