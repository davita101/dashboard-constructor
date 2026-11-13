import { describe, expect, it } from "vitest"

import { formatIsoDate } from "@/lib/projects/dates"
import { builtProjectTabs, isBuiltProjectTab, isProjectTab, projectTabKeys } from "@/lib/projects/tabs"
import { projectTag, userProjectsTag } from "@/lib/projects/tags"

describe("formatIsoDate", () => {
  it("renders English dates day-first with dots, like the Figma frames", () => {
    expect(formatIsoDate("2026-03-07", "en")).toBe("07.03")
    expect(formatIsoDate("2026-03-07T23:59:00Z", "en", true)).toBe("07.03.2026")
  })

  it("uses the calendar day of the ISO string, whatever the offset", () => {
    expect(formatIsoDate("2026-01-01T00:00:00+14:00", "en", true)).toBe("01.01.2026")
  })
})

describe("project tabs", () => {
  it("accepts known tabs only", () => {
    expect(isProjectTab("dashboard")).toBe(true)
    expect(isProjectTab("files")).toBe(true)
    expect(isProjectTab("settings")).toBe(false)
    expect(isProjectTab(undefined)).toBe(false)
  })

  it("marks only built tabs as navigable", () => {
    expect(builtProjectTabs.every((tab) => projectTabKeys.includes(tab))).toBe(true)
    expect(isBuiltProjectTab("dashboard")).toBe(true)
    expect(isBuiltProjectTab("stages")).toBe(false)
  })
})

describe("cache tags", () => {
  it("scopes project reads per user and per project", () => {
    expect(userProjectsTag("user_123")).toBe("user-projects:user_123")
    expect(projectTag("p1")).toBe("project:p1")
    expect(userProjectsTag("a")).not.toBe(userProjectsTag("b"))
  })
})
