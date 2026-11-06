"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { usePathname } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarActions,
  SidebarBrand,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupHead,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarIcon,
  SidebarItem,
  SidebarItemEnd,
  SidebarItemIndent,
  SidebarItemLabel,
  SidebarItemRow,
  SidebarLogo,
  SidebarMenu,
  SidebarTitle,
  SidebarToggle,
  SidebarUser,
  SidebarUserEmail,
  SidebarUserName,
  SidebarUserText,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { LanguageFlag, LanguageMenu, useLanguage } from "@/components/dashboard/language"
import { useNightMode } from "@/components/dashboard/theme"
import { dashboardNav } from "@/components/dashboard/nav"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/projects/types"

export type SidebarProject = Pick<Project, "id" | "slug" | "name" | "logo">

const PROJECTS_OPEN_KEY = "dashboard-sidebar-projects-open"

// Figma Sidebar-Dashboards-04: sub-items of the active project. Per-project routes do not exist yet.
const projectSubItems = [
  { key: "dashboard", icon: "dashboard", href: "/dashboard/projects" },
  { key: "stages", icon: "list", href: "#" },
  { key: "tasks", icon: "check", href: "#" },
  { key: "messages", icon: "chat-bubble", href: "#" },
  { key: "chat", icon: "forum", href: "#" },
] as const

type NavKey = Parameters<ReturnType<typeof useTranslations<"nav">>>[0]

function GroupHead({ label }: { label: string }) {
  return (
    <SidebarGroupHead>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarIcon name="expand-less" />
    </SidebarGroupHead>
  )
}

/**
 * Figma Sidebar-01 (Default): Navigate / More / Links groups, settings rows and the user card.
 * `collapsed` animates it down to the 64 icon rail; the DOM is identical in both states (labels just fade),
 * so there is no re-layout jump. The toggle is an edge handle (`SidebarToggle`), not an icon in the head.
 */
function DashboardSidebar({
  className,
  onNavigate,
  withHead = false,
  collapsed = false,
  onToggleCollapsed,
  projects = [],
}: {
  projects?: SidebarProject[]
  className?: string
  onNavigate?: () => void
  /** Desktop: logo + project title live in the sidebar head (Figma Logo-Head-Sidebar), not in the navbar. */
  withHead?: boolean
  collapsed?: boolean
  onToggleCollapsed?: () => void
}) {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()
  const { language } = useLanguage()
  const t = useTranslations("sidebar")
  const [dark, setDark] = useNightMode()
  const tNav = useTranslations("nav")
  const name = user?.fullName ?? user?.username ?? t("account")
  const email = user?.primaryEmailAddress?.emailAddress ?? ""
  // Collapsed rows only show an icon, so the label moves to the accessible name / tooltip.
  const tProjects = useTranslations("sidebarProjects")
  // null = never toggled: open while on a Projects route. Read lazily; the sidebar only renders on the client.
  const [treeStored, setTreeStored] = React.useState<boolean | null>(() => {
    if (typeof window === "undefined") return null
    const v = window.localStorage.getItem(PROJECTS_OPEN_KEY)
    return v === null ? null : v === "1"
  })
  const hint = (label: string) => (collapsed ? { "aria-label": label, title: label } : {})

  return (
    <Sidebar bordered collapsed={collapsed} className={cn("justify-between", className)} aria-label={t("label")}>
      {withHead && (
        <>
          <SidebarHeader>
            <SidebarBrand>
              <SidebarLogo />
              <SidebarTitle>{t("project")}</SidebarTitle>
            </SidebarBrand>
            <SidebarActions>
              <SidebarIcon name="bolt" size="16" />
            </SidebarActions>
          </SidebarHeader>
          <SidebarToggle collapsed={collapsed} onClick={onToggleCollapsed} aria-label={collapsed ? t("expand") : t("collapse")} />
        </>
      )}
      <SidebarContent className="flex-none gap-4 overflow-y-auto">
        <SidebarGroup>
          <GroupHead label={t("navigate")} />
          <SidebarMenu>
            {dashboardNav.map((n) => {
              const active = n.href === "/dashboard" ? pathname === n.href : pathname.startsWith(n.href)
              if (n.slug === "projects" && projects.length > 0) {
                const open = treeStored ?? active
                const toggle = () => {
                  window.localStorage.setItem(PROJECTS_OPEN_KEY, open ? "0" : "1")
                  setTreeStored(!open)
                }
                return (
                  <React.Fragment key={n.slug}>
                    <div className="relative">
                      <SidebarItem active={active} {...hint(tNav("projects"))} render={<Link href={n.href} onClick={onNavigate} />}>
                        <SidebarIcon name={n.icon} className={active ? "text-base-800" : "text-base-500"} />
                        <SidebarItemLabel>{tNav("projects")}</SidebarItemLabel>
                        <SidebarItemEnd>
                          <SidebarIcon name="chevron-right" className="invisible" />
                        </SidebarItemEnd>
                      </SidebarItem>
                      {!collapsed && (
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-label={open ? tProjects("collapse") : tProjects("expand")}
                          onClick={toggle}
                          className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center rounded-r6 text-base-500 outline-none hover:text-base-800 focus-visible:ring-2 focus-visible:ring-primary-500"
                        >
                          <SidebarIcon name={open ? "expand-less" : "expand-more"} />
                        </button>
                      )}
                    </div>
                    {open && !collapsed &&
                      projects.map((project, i) => (
                        <React.Fragment key={project.id}>
                          <SidebarItem render={<Link href="/dashboard/projects" onClick={onNavigate} />}>
                            <SidebarItemIndent level="2" />
                            <Image src={project.logo} alt="" width={16} height={16} className="size-4 shrink-0 object-contain" />
                            <SidebarItemLabel>{project.name}</SidebarItemLabel>
                          </SidebarItem>
                          {i === 0 &&
                            projectSubItems.map((sub) => (
                              <SidebarItem key={sub.key} active={sub.key === "dashboard" && active} render={<Link href={sub.href} onClick={onNavigate} />}>
                                <SidebarItemIndent level="3" />
                                <SidebarIcon name={sub.icon} className={sub.key === "dashboard" && active ? "text-base-800" : "text-base-500"} />
                                <SidebarItemLabel>{tProjects(sub.key)}</SidebarItemLabel>
                              </SidebarItem>
                            ))}
                        </React.Fragment>
                      ))}
                  </React.Fragment>
                )
              }
              return (
                <SidebarItem key={n.slug} active={active} {...hint(tNav((n.slug || "dashboard") as NavKey))} render={<Link href={n.href} onClick={onNavigate} />}>
                  <SidebarIcon name={n.icon} className={active ? "text-base-800" : "text-base-500"} />
                  <SidebarItemLabel>{tNav((n.slug || "dashboard") as NavKey)}</SidebarItemLabel>
                  <SidebarItemEnd>
                    {n.badge && (
                      <Badge variant="black" size="square-16">
                        {n.badge}
                      </Badge>
                    )}
                    {n.chevron && <SidebarIcon name="chevron-right" />}
                  </SidebarItemEnd>
                </SidebarItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <GroupHead label={t("more")} />
        </SidebarGroup>
        <SidebarGroup>
          <GroupHead label={t("links")} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarItem {...hint(t("settings"))}>
            <SidebarIcon name="settings" className="text-base-500" />
            <SidebarItemLabel>{t("settings")}</SidebarItemLabel>
            <SidebarItemEnd>
              <SidebarIcon name="expand-more" />
            </SidebarItemEnd>
          </SidebarItem>
          <LanguageMenu
            side="right"
            align="end"
            trigger={
              <SidebarItem {...hint(t("language"))}>
                <LanguageFlag language={language} />
                <SidebarItemLabel>{t("language")}</SidebarItemLabel>
                <SidebarItemEnd>
                  <span className="text-10 font-bold text-base-500">{language.code.toUpperCase()}</span>
                  <SidebarIcon name="expand-more" />
                </SidebarItemEnd>
              </SidebarItem>
            }
          />
          <SidebarItemRow onClick={() => setDark(!dark)} className="cursor-pointer transition-[height,margin,opacity] duration-300 group-data-[collapsed]/sidebar:my-0 group-data-[collapsed]/sidebar:h-0 group-data-[collapsed]/sidebar:opacity-0">
            <Switch aria-label={t("nightMode")} checked={dark} onCheckedChange={setDark} onClick={(e) => e.stopPropagation()} tabIndex={collapsed ? -1 : undefined} />
            <SidebarItemLabel>{t("nightMode")}</SidebarItemLabel>
          </SidebarItemRow>
          <SidebarItem {...hint(t("learn"))}>
            <SidebarIcon name="school" className="text-base-500" />
            <SidebarItemLabel>{t("learn")}</SidebarItemLabel>
          </SidebarItem>
        </SidebarMenu>
        <SidebarUser aria-label={t("signOut")} onClick={() => signOut({ redirectUrl: "/sign-in" })}>
          <Avatar size="32">
            <AvatarImage src={user?.imageUrl ?? "/images/avatars/avatar-1.png"} alt="" />
            <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <SidebarUserText className="transition-opacity duration-200 group-data-[collapsed]/sidebar:opacity-0">
            <SidebarUserName>{name}</SidebarUserName>
            <SidebarUserEmail>{email}</SidebarUserEmail>
          </SidebarUserText>
          <SidebarIcon
            name="expand-less"
            size="16"
            className="text-base-500 transition-opacity duration-200 group-data-[collapsed]/sidebar:opacity-0"
          />
        </SidebarUser>
      </SidebarFooter>
    </Sidebar>
  )
}

export { DashboardSidebar }
