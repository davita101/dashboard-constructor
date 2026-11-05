// Sidebar-01 "Navigate" group. Every section lives under /dashboard/<slug>; Dashboard itself is /dashboard.
export type DashboardNavItem = {
  slug: string
  label: string
  icon: string
  href: string
  badge?: string
  /** Figma draws a trailing chevron on items that open a sub-list. */
  chevron?: boolean
}

const item = (slug: string, label: string, icon: string, extra: Partial<DashboardNavItem> = {}): DashboardNavItem => ({
  slug,
  label,
  icon,
  href: slug ? `/dashboard/${slug}` : "/dashboard",
  ...extra,
})

export const dashboardNav: DashboardNavItem[] = [
  item("", "Dashboard", "dashboard", { chevron: true }),
  item("projects", "Projects", "apps", { chevron: true }),
  item("notes", "Notes", "note", { chevron: true }),
  item("files", "Files", "cloud", { chevron: true }),
  item("chats", "Chats", "chat-bubble", { chevron: true }),
  item("mail", "Mail", "mail-outline", { badge: "2", chevron: true }),
  item("users", "Users", "supervisor-account"),
  item("calendar", "Calendar", "today", { chevron: true }),
  item("knowledge-base", "Knowledge Base", "info2"),
  item("clients", "Clients", "account-box"),
  item("messenger", "Messenger", "forum"),
]

export function dashboardTitle(pathname: string): string {
  const found = dashboardNav.find((n) => n.href === pathname)
  if (found) return found.label
  const slug = pathname.split("/")[2] ?? ""
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard"
}
