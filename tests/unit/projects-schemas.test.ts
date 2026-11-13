import { describe, expect, it } from "vitest"

import {
  addMemberInput,
  createProjectInput,
  createStageInput,
  createTaskInput,
  moveTaskInput,
  reorderStagesInput,
} from "@/lib/projects/schemas"

const projectId = "0b7f5a3e-1c2d-4e5f-8a9b-0c1d2e3f4a5b"
const stageId = "6f1e2d3c-4b5a-4987-a6b5-c4d3e2f1a0b9"

describe("createProjectInput", () => {
  it("trims text and turns empty form fields into defaults", () => {
    const parsed = createProjectInput.parse({
      name: "  Checkout Redesign  ",
      clientName: "",
      clientDescription: "",
      deadline: "",
      income: "",
      cost: "1200",
    })
    expect(parsed).toMatchObject({
      name: "Checkout Redesign",
      clientName: undefined,
      clientDescription: undefined,
      deadline: null,
      income: 0,
      cost: 1200,
      removeLogo: false,
    })
    expect(parsed.logo).toBeUndefined()
  })

  it("rejects a blank name, negative money and malformed dates", () => {
    expect(createProjectInput.safeParse({ name: "   ", income: "", cost: "" }).success).toBe(false)
    expect(createProjectInput.safeParse({ name: "A", income: "-5", cost: "" }).success).toBe(false)
    expect(createProjectInput.safeParse({ name: "A", income: "", cost: "", deadline: "31/12/2026" }).success).toBe(false)
  })

  it("reads checkbox flags from form values", () => {
    const parsed = createProjectInput.parse({ name: "A", income: "", cost: "", removeLogo: "on", removeClientLogo: "false" })
    expect(parsed.removeLogo).toBe(true)
    expect(parsed.removeClientLogo).toBe(false)
  })

  it("drops an empty file input and rejects non-image logos", () => {
    const empty = new File([], "")
    expect(createProjectInput.parse({ name: "A", income: "", cost: "", logo: empty }).logo).toBeUndefined()

    const pdf = new File(["%PDF"], "logo.pdf", { type: "application/pdf" })
    expect(createProjectInput.safeParse({ name: "A", income: "", cost: "", logo: pdf }).success).toBe(false)
  })
})

describe("addMemberInput", () => {
  it("normalizes the email", () => {
    const parsed = addMemberInput.parse({ projectId, email: "  Maya.Patel@Example.COM " })
    expect(parsed.email).toBe("maya.patel@example.com")
  })

  it("rejects invalid emails and project ids", () => {
    expect(addMemberInput.safeParse({ projectId, email: "not-an-email" }).success).toBe(false)
    expect(addMemberInput.safeParse({ projectId: "123", email: "a@b.co" }).success).toBe(false)
  })
})

describe("stage and task date ranges", () => {
  it("rejects a stage that ends before it starts", () => {
    const result = createStageInput.safeParse({ projectId, name: "Design", startDate: "2026-05-10", endDate: "2026-05-01" })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(["endDate"])
  })

  it("accepts open-ended ranges", () => {
    expect(createStageInput.safeParse({ projectId, name: "Design", startDate: "2026-05-10", endDate: "" }).success).toBe(true)
  })

  it("defaults a new task to status 'new' with no stage or assignees", () => {
    const parsed = createTaskInput.parse({ projectId, title: "Write release notes", stageId: "" })
    expect(parsed).toMatchObject({ status: "new", stageId: null, assigneeIds: [], startDate: null, dueDate: null })
  })

  it("rejects a task due before it starts", () => {
    const result = createTaskInput.safeParse({ projectId, title: "QA", startDate: "2026-06-02", dueDate: "2026-06-01" })
    expect(result.success).toBe(false)
  })
})

describe("drag and drop inputs", () => {
  it("accepts a whole, non-negative drop index and a known status", () => {
    expect(moveTaskInput.safeParse({ taskId: stageId, status: "done", index: 0 }).success).toBe(true)
    expect(moveTaskInput.safeParse({ taskId: stageId, status: "done", index: -1 }).success).toBe(false)
    expect(moveTaskInput.safeParse({ taskId: stageId, status: "archived", index: 0 }).success).toBe(false)
  })

  it("needs at least one stage id to reorder", () => {
    expect(reorderStagesInput.safeParse({ projectId, stageIds: [] }).success).toBe(false)
    expect(reorderStagesInput.safeParse({ projectId, stageIds: [stageId] }).success).toBe(true)
  })
})
