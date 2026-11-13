import { sql } from "drizzle-orm"
import { jsonb, pgEnum, pgPolicy, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { authenticatedRole } from "drizzle-orm/supabase"

import { clerkUserId } from "./rls"
import { users } from "./users"

export const themeMode = pgEnum("theme_mode", ["light", "dark"])

/**
 * Per-user preferences that follow the user across devices (Phase 6). The browser keeps a copy (localStorage /
 * locale cookie) so pages paint in the right theme and language before this row is read; null = never chosen.
 */
export const userSettings = pgTable(
  "user_settings",
  {
    userId: text()
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    theme: themeMode(),
    /** next-intl locale code (src/i18n/config.ts). */
    locale: text(),
    /** Dashboard widget board: ordered `{ id, type }` items (src/components/dashboard/widgets/widget-layout.ts). */
    widgetLayout: jsonb().$type<{ id: string; type: string }[]>(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    pgPolicy("user_settings_select_self", {
      for: "select",
      to: authenticatedRole,
      using: sql`${t.userId} = ${clerkUserId}`,
    }),
  ],
).enableRLS()
