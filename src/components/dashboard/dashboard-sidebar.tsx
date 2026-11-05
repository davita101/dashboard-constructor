"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { useTranslations } from "next-intl"
import Link from "next/link"
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
}: {
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
