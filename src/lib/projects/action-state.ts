// Result of a Projects form action (./actions.ts), for useActionState. Kept out of the "use server" file,
// which may only export async functions.

export type ActionState = {
  status: "idle" | "ok" | "error"
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

export const initialActionState: ActionState = { status: "idle" }
