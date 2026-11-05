"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupHead,
  SidebarGroupLabel,
  SidebarIcon,
  SidebarItem,
  SidebarItemEnd,
  SidebarItemLabel,
  SidebarItemRow,
  SidebarMenu,
  SidebarUser,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { dashboardNav } from "@/components/dashboard/nav"
import { cn } from "@/lib/utils"

function GroupHead({ label }: { label: string }) {
  return (
    <SidebarGroupHead>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarIcon name="expand-less" />
    </SidebarGroupHead>
  )
}

/** Figma Sidebar-01 (Default): Navigate / More / Links groups, settings rows and the user card. */
function DashboardSidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()
  const name = user?.fullName ?? user?.username ?? "Account"
  const email = user?.primaryEmailAddress?.emailAddress ?? ""

  return (
    <Sidebar bordered className={cn("justify-between", className)} aria-label="Dashboard">
      <SidebarContent className="flex-none gap-4 overflow-y-auto">
        <SidebarGroup>
          <GroupHead label="Navigate" />
          <SidebarMenu>
            {dashboardNav.map((n) => {
              const active = n.href === "/dashboard" ? pathname === n.href : pathname.startsWith(n.href)
              return (
                <SidebarItem key={n.slug} active={active} render={<Link href={n.href} onClick={onNavigate} />}>
                  <SidebarIcon name={n.icon} className={active ? "text-base-800" : "text-base-500"} />
                  <SidebarItemLabel>{n.label}</SidebarItemLabel>
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
          <GroupHead label="More" />
        </SidebarGroup>
        <SidebarGroup>
          <GroupHead label="Links" />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {[
            ["settings", "Settings"],
            ["language", "Language"],
          ].map(([icon, label]) => (
            <SidebarItem key={label}>
              <SidebarIcon name={icon} className="text-base-500" />
              <SidebarItemLabel>{label}</SidebarItemLabel>
              <SidebarItemEnd>
                <SidebarIcon name="expand-more" />
              </SidebarItemEnd>
            </SidebarItem>
          ))}
          <SidebarItemRow>
            <Switch aria-label="Night Mode" />
            <SidebarItemLabel>Night Mode</SidebarItemLabel>
          </SidebarItemRow>
          <SidebarItem>
            <SidebarIcon name="school" className="text-base-500" />
            <SidebarItemLabel>Learn</SidebarItemLabel>
          </SidebarItem>
        </SidebarMenu>
        <SidebarUser aria-label="Sign out" onClick={() => signOut({ redirectUrl: "/sign-in" })}>
          <Avatar size="32">
            <AvatarImage src={user?.imageUrl ?? "/images/avatars/avatar-1.png"} alt="" />
            <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-1 flex-col text-left">
            <span className="truncate text-10 leading-16 font-bold text-base-800">{name}</span>
            <span className="truncate text-10 leading-16 font-semibold text-base-500">{email}</span>
          </span>
          <SidebarIcon name="expand-less" size="16" className="text-base-500" />
        </SidebarUser>
      </SidebarFooter>
    </Sidebar>
  )
}

export { DashboardSidebar }
