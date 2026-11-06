// Project page sections (Figma Tab-Group-Pilled). Shared by the server page and the client tabs, so no "use client" here.
export const projectTabKeys = ["dashboard", "stages", "tasks", "messages", "chat", "members", "customer", "files", "activity"] as const
export type ProjectTabKey = (typeof projectTabKeys)[number]

export function isProjectTab(value: string | undefined): value is ProjectTabKey {
  return projectTabKeys.includes(value as ProjectTabKey)
}
