"use client"

import * as React from "react"

import { DashboardFooter } from "@/components/dashboard/dashboard-footer"
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { useDashboardSize } from "@/components/dashboard/use-dashboard-size"
import { NavbarIconButton } from "@/components/ui/navbar"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

/**
 * Figma "New Page": Navigate-01 on top, Sidebar-01 (248) + content, Footer at the bottom.
 * Every dashboard route renders inside this shell (src/app/dashboard/layout.tsx).
 * Below 1024 the sidebar is not drawn in Figma, so it opens from the navbar toggle in a Sheet.
 */
function DashboardShell({ children }: { children: React.ReactNode }) {
  const size = useDashboardSize()
  const [open, setOpen] = React.useState(false)

  // Size is unknown on the server and on the first client paint: keep the page in the tree but hidden, so no wrong-size layout flashes.
  if (!size) return <div className="min-h-svh bg-background-20"><div hidden>{children}</div></div>

  const desktop = size === "desktop"

  return (
    <div className="flex min-h-svh flex-col bg-background-20 font-default">
      <DashboardNavbar
        size={size}
        sidebarToggle={
          <Sheet open={open && !desktop} onOpenChange={setOpen}>
            <SheetTrigger render={<NavbarIconButton icon="/icons/material-sidebar.svg" label="Open sidebar" />} />
            <SheetContent side="left">
              <SheetTitle>Navigation</SheetTitle>
              <DashboardSidebar className="h-full" onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        }
      />
      <div className="flex flex-1">
        {desktop && (
          <div className="sticky top-16 h-[calc(100svh-4rem)] shrink-0 self-start">
            <DashboardSidebar className="h-full" />
          </div>
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <DashboardFooter size={size} />
    </div>
  )
}

export { DashboardShell }
