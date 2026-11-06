"use client"

import { usePathname, useRouter } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { projectTabKeys, type ProjectTabKey } from "@/lib/projects/tabs"

/** Project page pill tabs. The tab is the last path segment (/<slug>/<tab>); the blank "new" editor has no slug and keeps `?tab=`. */
function ProjectTabs({ value, labels, label }: { value: ProjectTabKey; labels: Record<ProjectTabKey, string>; label: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const isNew = pathname === "/dashboard/projects/new"

  return (
    <Tabs
      value={value}
      onValueChange={(next) => router.replace(isNew ? (next === "dashboard" ? pathname : `${pathname}?tab=${next}`) : `${pathname.split("/").slice(0, 4).join("/")}/${next}`, { scroll: false })}
      className="h-16 shrink-0 justify-center px-5"
    >
      <TabsList variant="pill" size="32" aria-label={label} className="max-w-full overflow-x-auto">
        {projectTabKeys.map((key) => (
          <TabsTrigger key={key} value={key}>
            {labels[key]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export { ProjectTabs }
