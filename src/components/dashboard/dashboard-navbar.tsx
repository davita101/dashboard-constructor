"use client"

import { useUser } from "@clerk/nextjs"
import Link from "next/link"

import type { DashboardSize } from "@/components/dashboard/use-dashboard-size"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, ButtonIcon } from "@/components/ui/button"
import {
  Navbar,
  NavbarActions,
  NavbarHeading,
  NavbarIconButton,
  NavbarLogo,
  NavbarMenu,
  NavbarMenuLink,
  NavbarSearch,
  NavbarTitle,
} from "@/components/ui/navbar"

/**
 * Figma Navigate-01. Desktop (1600): logo, search field, menu, actions with the Upgrade button.
 * Tablet (768): sidebar toggle, search collapses to an icon, Upgrade is icon only.
 * Mobile (360): logo, title, Upgrade and the avatar; the toggle is our addition (Figma draws no way to open the sidebar).
 */
function DashboardNavbar({ size, sidebarToggle }: { size: DashboardSize; sidebarToggle: React.ReactNode }) {
  const { user } = useUser()
  const desktop = size === "desktop"
  const mobile = size === "mobile"

  return (
    <Navbar>
      <NavbarHeading>
        {!desktop && sidebarToggle}
        <NavbarLogo />
        <NavbarTitle>New Project</NavbarTitle>
      </NavbarHeading>
      {desktop && <NavbarSearch />}
      {!desktop && !mobile && <NavbarIconButton icon="/icons/material-search.svg" label="Search" />}
      {!mobile && (
        <NavbarMenu>
          <NavbarMenuLink render={<Link href="/dashboard" />}>Dashboard</NavbarMenuLink>
          <NavbarMenuLink href="#">News</NavbarMenuLink>
          <NavbarMenuLink href="#">Support</NavbarMenuLink>
          <NavbarMenuLink href="#">More</NavbarMenuLink>
        </NavbarMenu>
      )}
      <NavbarActions>
        {!mobile && (
          <>
            <NavbarIconButton icon="/icons/material-notifications.svg" label="Notifications" variant="ghost" />
            <NavbarIconButton icon="/icons/material-help.svg" label="Help" variant="ghost" />
            <NavbarIconButton icon="/icons/material-settings.svg" label="Settings" variant="ghost" />
          </>
        )}
        {desktop ? (
          <Button variant="dark" size="32" shape="pill">
            <ButtonIcon src="/icons/material-star.svg" className="size-4" />
            Upgrade
          </Button>
        ) : (
          <NavbarIconButton icon="/icons/material-star.svg" label="Upgrade" variant="dark" />
        )}
        <Avatar size="32">
          <AvatarImage src={user?.imageUrl ?? "/images/avatars/avatar-1.png"} alt="" />
          <AvatarFallback>{user?.firstName?.slice(0, 1) ?? "M"}</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        {!mobile && <NavbarIconButton icon="/icons/material-close.svg" label="Close" />}
      </NavbarActions>
    </Navbar>
  )
}

export { DashboardNavbar }
