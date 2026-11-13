import { z } from "zod"

import { locales } from "@/i18n/config"

// User settings (Phase 6). Client-safe: the sync component and the stores reuse the types.

export const themes = ["light", "dark"] as const
export type Theme = (typeof themes)[number]

export const widgetLayoutSchema = z
  .array(z.object({ id: z.string().min(1).max(40), type: z.string().min(1).max(60) }))
  .max(100)

/** Partial update: only the keys present are written. */
export const updateSettingsInput = z.object({
  theme: z.enum(themes).optional(),
  locale: z.enum(locales).optional(),
  widgetLayout: widgetLayoutSchema.optional(),
})

export type UserSettings = {
  theme: Theme | null
  locale: (typeof locales)[number] | null
  widgetLayout: z.output<typeof widgetLayoutSchema> | null
}

export const emptySettings: UserSettings = { theme: null, locale: null, widgetLayout: null }
