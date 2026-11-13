"use client"

import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"
import { isBuiltProjectTab, projectTabKeys, type ProjectTabKey } from "@/lib/projects/tabs"

/** Project page pill tabs. The tab is the last path segment (/<slug>/<tab>); the blank "new" editor has no slug and keeps `?tab=`. */
function ProjectTabs({ value, labels, label }: { value: ProjectTabKey; labels: Record<ProjectTabKey, string>; label: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const isNew = pathname === "/dashboard/projects/new"
  const tSoon = useTranslations("comingSoon")

  function onValueChange(next: ProjectTabKey) {
    // Unbuilt sections: same "Coming soon" toast as the rest of the app; the tab stays where it is.
    if (!isBuiltProjectTab(next)) {
      toast.add({ title: tSoon("title"), timeout: 3000 })
      return
    }
    router.replace(isNew ? (next === "dashboard" ? pathname : `${pathname}?tab=${next}`) : `${pathname.split("/").slice(0, 4).join("/")}/${next}`, { scroll: false })
  }

  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as ProjectTabKey)}
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
