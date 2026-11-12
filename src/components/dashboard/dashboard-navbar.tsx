"use client"

import { useUser } from "@clerk/nextjs"
import { useTranslations } from "next-intl"
import Link from "next/link"

import { useWidgetPicker } from "@/components/dashboard/widgets/widget-picker"
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
function DashboardNavbar({
  size,
  sidebarToggle,
}: {
  size: DashboardSize
  sidebarToggle: React.ReactNode
}) {
  const { user } = useUser()
  const t = useTranslations("navbar")
  const tSide = useTranslations("sidebar")
  const { open } = useWidgetPicker()
  const desktop = size === "desktop"
  const mobile = size === "mobile"

  return (
    <Navbar className="sticky top-0 z-30">
      {mobile && (
        <NavbarHeading>
          {sidebarToggle}
          <NavbarLogo />
          <NavbarTitle>{tSide("project")}</NavbarTitle>
        </NavbarHeading>
      )}
      {desktop && (
        // Opens the widget picker; readOnly so the field acts as a trigger and refocus on close does not reopen it.
        <NavbarSearch readOnly className="cursor-pointer" onClick={open} onKeyDown={(e) => e.key === "Enter" && open()} />
      )}
      {!desktop && !mobile && <NavbarIconButton icon="/icons/material-search.svg" label={t("search")} onClick={open} />}
      {!mobile && (
        <NavbarMenu>
          <NavbarMenuLink render={<Link href="/dashboard" />}>{t("dashboard")}</NavbarMenuLink>
          <NavbarMenuLink href="#">{t("news")}</NavbarMenuLink>
          <NavbarMenuLink href="#">{t("support")}</NavbarMenuLink>
          <NavbarMenuLink href="#">{t("more")}</NavbarMenuLink>
        </NavbarMenu>
      )}
      <NavbarActions>
        {!mobile && (
          <>
            <NavbarIconButton icon="/icons/material-notifications.svg" label={t("notifications")} variant="ghost" data-soon />
            <NavbarIconButton icon="/icons/material-help.svg" label={t("help")} variant="ghost" data-soon />
            <NavbarIconButton icon="/icons/material-settings.svg" label={t("settings")} variant="ghost" data-soon />
          </>
        )}
        {desktop ? (
          <Button variant="dark" size="32" shape="pill" data-soon>
            <ButtonIcon src="/icons/material-star.svg" className="size-4" />
            {t("upgrade")}
          </Button>
        ) : (
          <NavbarIconButton icon="/icons/material-star.svg" label={t("upgrade")} variant="dark" data-soon />
        )}
        <Avatar size="32">
          <AvatarImage src={user?.imageUrl ?? "/images/avatars/avatar-1.png"} alt="" />
          <AvatarFallback>{user?.firstName?.slice(0, 1) ?? "M"}</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        {!mobile && <NavbarIconButton icon="/icons/material-close.svg" label={t("close")} data-soon />}
      </NavbarActions>
    </Navbar>
  )
}

export { DashboardNavbar }
