"use client"

import { useTranslations } from "next-intl"
import * as React from "react"

import { DashboardFooter } from "@/components/dashboard/dashboard-footer"
import { LanguageProvider } from "@/components/dashboard/language"
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { DashboardSidebar, type SidebarProject } from "@/components/dashboard/dashboard-sidebar"
import { WidgetPickerProvider } from "@/components/dashboard/widgets/widget-picker"
import { useDashboardSize } from "@/components/dashboard/use-dashboard-size"
import { NavbarIconButton } from "@/components/ui/navbar"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

/**
 * Figma "New Page": Navigate-01 on top, Sidebar-01 (248) + content, Footer at the bottom.
 * Every dashboard route renders inside this shell (src/app/dashboard/layout.tsx).
 * Tablet docks the same collapsible sidebar (starts as the rail); on mobile it opens from the navbar toggle in a Sheet.
 */
const COLLAPSED_KEY = "dashboard-sidebar-collapsed"

function DashboardShell({ children, projects = [] }: { children: React.ReactNode; projects?: SidebarProject[] }) {
  return (
    <LanguageProvider>
      <WidgetPickerProvider>
        <DashboardShellInner projects={projects}>{children}</DashboardShellInner>
      </WidgetPickerProvider>
    </LanguageProvider>
  )
}

function DashboardShellInner({ children, projects }: { children: React.ReactNode; projects: SidebarProject[] }) {
  const t = useTranslations("sidebar")
  const size = useDashboardSize()
  const [open, setOpen] = React.useState(false)
  // Rail state, remembered per browser (null = never chosen: desktop opens full, tablet starts as the rail).
  // Read lazily: the server never renders past the `!size` branch, so no hydration mismatch.
  const [stored, setStored] = React.useState<boolean | null>(() => {
    if (typeof window === "undefined") return null
    const v = window.localStorage.getItem(COLLAPSED_KEY)
    return v === null ? null : v === "1"
  })

  // Size is unknown on the server and on the first client paint: keep the page in the tree but hidden, so no wrong-size layout flashes.
  if (!size)
    return (
      <>
        <DashboardSkeleton />
        <div hidden>{children}</div>
      </>
    )

  const mobile = size === "mobile"
  const collapsed = stored ?? size === "tablet"

  const toggleCollapsed = () => {
    window.localStorage.setItem(COLLAPSED_KEY, collapsed ? "0" : "1")
    setStored(!collapsed)
  }

  const navbar = (
    <DashboardNavbar
        size={size}
        sidebarToggle={
          <Sheet open={open && mobile} onOpenChange={setOpen}>
            <SheetTrigger render={<NavbarIconButton icon="/icons/material-sidebar.svg" label={t("open")} />} />
            <SheetContent side="left">
              <SheetTitle>{t("navigation")}</SheetTitle>
              <DashboardSidebar className="h-full" projects={projects} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        }
    />
  )

  // Desktop + tablet: the sidebar is docked (tablet starts as the rail) and owns the full height with logo head; navbar, content and footer sit to its right.
  if (!mobile) {
    return (
      <div className="flex min-h-svh bg-background-20 font-default">
        <div className="sticky top-0 z-40 h-svh shrink-0 self-start">
          <DashboardSidebar className="h-full" projects={projects} withHead collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {navbar}
          <main className="min-w-0 flex-1">{children}</main>
          <DashboardFooter size={size} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background-20 font-default">
      {navbar}
      <main className="min-w-0 flex-1">{children}</main>
      <DashboardFooter size={size} />
    </div>
  )
}

export { DashboardShell }
