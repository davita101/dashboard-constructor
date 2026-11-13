// `en` renders day-first (dd.MM) like the Figma frames; other locales use their own order.
const intlLocale = (locale: string) => (locale === "en" ? "en-GB" : locale || "en-GB")

/** ISO date (yyyy-MM-dd...) -> locale date; UTC so the day never shifts. */
export function formatIsoDate(iso: string, locale: string, withYear = false) {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "2-digit",
    month: "2-digit",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  })
    .format(new Date(`${iso.slice(0, 10)}T00:00:00Z`))
    .replaceAll("/", ".")
}
