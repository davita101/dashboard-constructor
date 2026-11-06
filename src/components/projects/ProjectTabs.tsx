"use client"

import { usePathname, useRouter } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { projectTabKeys, type ProjectTabKey } from "@/lib/projects/tabs"

/** Project page pill tabs. The active tab lives in `?tab=` so the sidebar sub-items and shared links can open one. */
function ProjectTabs({ value, labels, label }: { value: ProjectTabKey; labels: Record<ProjectTabKey, string>; label: string }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Tabs
      value={value}
      onValueChange={(next) => router.replace(next === "dashboard" ? pathname : `${pathname}?tab=${next}`, { scroll: false })}
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
