import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"

import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/config"
import en from "../../messages/en.json"

type Messages = typeof en

// Missing keys fall back to English, so a half-translated locale never shows a raw key.
function merge<T extends Record<string, unknown>>(base: T, override: Record<string, unknown>): T {
  const out: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(override)) {
    const current = out[key]
    out[key] =
      value && typeof value === "object" && current && typeof current === "object"
        ? merge(current as Record<string, unknown>, value as Record<string, unknown>)
        : value
  }
  return out as T
}

// No locale in the URL: the choice lives in a cookie (set by the language switcher), so existing routes stay as they are.
export default getRequestConfig(async () => {
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value
  const locale = isLocale(stored) ? stored : defaultLocale
  const messages = locale === defaultLocale ? en : merge<Messages>(en, (await import(`../../messages/${locale}.json`)).default)
  return { locale, messages }
})
