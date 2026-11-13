// Sidebar-01 "Navigate" group. Every section lives under /dashboard/<slug>; Dashboard itself is /dashboard.
export type DashboardNavItem = {
  slug: string
  label: string
  icon: string
  href: string
  badge?: string
  /** Figma draws a trailing chevron on items that open a sub-list. */
  chevron?: boolean
  /** No page yet: the row shows the "Coming soon" toast instead of linking to a 404. */
  soon?: boolean
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
  item("notes", "Notes", "note", { chevron: true, soon: true }),
  item("files", "Files", "cloud", { chevron: true, soon: true }),
  item("chats", "Chats", "chat-bubble", { chevron: true, soon: true }),
  item("mail", "Mail", "mail-outline", { badge: "2", chevron: true, soon: true }),
  item("users", "Users", "supervisor-account", { soon: true }),
  item("calendar", "Calendar", "today", { chevron: true, soon: true }),
  item("knowledge-base", "Knowledge Base", "info2", { soon: true }),
  item("clients", "Clients", "account-box", { soon: true }),
  item("messenger", "Messenger", "forum", { soon: true }),
]

export function dashboardTitle(pathname: string): string {
  const found = dashboardNav.find((n) => n.href === pathname)
  if (found) return found.label
  const slug = pathname.split("/")[2] ?? ""
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard"
}
