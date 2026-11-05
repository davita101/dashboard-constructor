// Shared by server and client code: keep free of next/headers and other server-only imports.
export const locales = ["en", "ka", "de", "fr", "es"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "en"
export const LOCALE_COOKIE = "locale"

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.some((l) => l === value)
}
