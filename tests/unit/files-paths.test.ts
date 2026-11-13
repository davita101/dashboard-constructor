import { describe, expect, it } from "vitest"

import { formatBytes, projectFilePath, projectIdOfPath, safeFileName } from "@/lib/files/paths"

const projectId = "0b7f5a3e-1c2d-4e5f-8a9b-0c1d2e3f4a5b"

describe("safeFileName", () => {
  it("keeps safe names as they are", () => {
    expect(safeFileName("Q4-Report_final.xlsx")).toBe("Q4-Report_final.xlsx")
  })

  it("replaces spaces and symbols with single dashes", () => {
    expect(safeFileName("My  Brand (v2)!.pdf")).toBe("My-Brand-v2.pdf")
  })

  it("strips accents and falls back to 'file' for empty bases", () => {
    expect(safeFileName("Café.png")).toBe("Cafe.png")
    expect(safeFileName("???.zip")).toBe("file.zip")
  })

  it("caps the base at 80 and the extension at 10 characters", () => {
    const name = safeFileName(`${"a".repeat(200)}.${"b".repeat(20)}`)
    expect(name).toBe(`${"a".repeat(80)}.${"b".repeat(10)}`)
  })
})

describe("project file paths", () => {
  it("round-trips the project id through a generated key", () => {
    const path = projectFilePath(projectId, "Brand Guidelines.pdf")
    expect(path).toMatch(new RegExp(`^${projectId}/[0-9a-f-]{36}/Brand-Guidelines\\.pdf$`))
    expect(projectIdOfPath(path)).toBe(projectId)
  })

  it("rejects keys outside the <projectId>/<uuid>/<name> layout", () => {
    expect(projectIdOfPath(`${projectId}/file.pdf`)).toBeNull()
    expect(projectIdOfPath(`../${projectId}/x/y.pdf`)).toBeNull()
    expect(projectIdOfPath(`${projectId}/${projectId}/nested/y.pdf`)).toBeNull()
  })
})

describe("formatBytes", () => {
  it("picks B, KB or MB", () => {
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(2048)).toBe("2.0 KB")
    expect(formatBytes(5.6 * 1024 * 1024)).toBe("5.6 MB")
  })
})
