// Project page sections (Figma Tab-Group-Pilled). Shared by the server page and the client tabs, so no "use client" here.
export const projectTabKeys = ["dashboard", "stages", "tasks", "messages", "chat", "members", "customer", "files", "activity"] as const
export type ProjectTabKey = (typeof projectTabKeys)[number]

// Tabs with a built section. The rest show the "Coming soon" toast in the tab bar and sidebar.
export const builtProjectTabs: readonly ProjectTabKey[] = ["dashboard"]

export function isBuiltProjectTab(value: ProjectTabKey): boolean {
  return builtProjectTabs.includes(value)
}

export function isProjectTab(value: string | undefined): value is ProjectTabKey {
  return projectTabKeys.includes(value as ProjectTabKey)
}
