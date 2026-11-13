import type { z } from "zod"

/** Summary shown above a form when field validation fails. */
export const FORM_ERROR_MESSAGE = "Check the highlighted fields"

/** Short, human messages for the form fields (Zod's defaults read like type errors). Needs `reportInput: true`. */
export function fieldMessage(issue: z.core.$ZodIssue): string {
  if (issue.input === "" || issue.input === undefined) return "Required"
  switch (issue.code) {
    case "invalid_type":
      return "Required"
    case "too_small":
      return issue.origin === "string" && issue.minimum === 1 ? "Required" : issue.origin === "number" ? "Can't be negative" : "Too short"
    case "too_big":
      return issue.origin === "number" ? "Too large" : "Too long"
    case "invalid_format":
      return issue.format === "email" ? "Enter a valid email" : issue.format === "date" ? "Enter a valid date" : "Invalid value"
    case "invalid_union":
      return "Invalid value"
    default:
      return issue.message
  }
}
