import { getFormatter, getTranslations } from "next-intl/server"

import { CompanyCard } from "@/components/projects/CompanyCard"
import { ProjectEventsCard } from "@/components/projects/ProjectEventsCard"
import { ProjectMembersCard } from "@/components/projects/ProjectMembersCard"
import { ProjectStagesCard } from "@/components/projects/ProjectStagesCard"
import { ProjectStatTile } from "@/components/projects/ProjectStatTile"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ProjectDetail, ProjectEvent } from "@/lib/projects/types"

const tabKeys = ["dashboard", "stages", "tasks", "messages", "chat", "members", "customer", "files", "activity"] as const

const icon = (name: string) => `/icons/material-${name}.svg`

/** Figma main card (1128x1176, r20): pill tabs head, divider, stat tiles and the lower group. */
async function ProjectDashboardCard({ detail, events }: { detail: ProjectDetail; events: ProjectEvent[] }) {
  const [t, tTabs, tEvents, format] = await Promise.all([
    getTranslations("projectPage.stats"),
    getTranslations("projectPage.tabs"),
    getTranslations("projectPage.events"),
    getFormatter(),
  ])
  const { project, counts, tasks } = detail
  const [y, m, d] = project.deadline.slice(0, 10).split("-")

  return (
    <Card variant="panel" className="gap-0">
      <Tabs defaultValue="dashboard" className="h-16 shrink-0 justify-center px-5">
        <TabsList variant="pill" size="32" aria-label={tTabs("label")} className="max-w-full overflow-x-auto">
          {tabKeys.map((key) => (
            <TabsTrigger key={key} value={key}>
              {tTabs(key)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Separator />
      <div className="flex flex-col gap-3 p-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[--spacing(85)_1fr]">
          <div className="flex flex-col gap-3">
            <ProjectStatTile wide title={t("implementation")} value={format.number(detail.implementation / 100, { style: "percent" })} />
            <ProjectStatTile wide title={t("deadline")} value={`${d}.${m}.${y}`} />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <ProjectStatTile title={t("messages")} icon={icon("message")} value={format.number(counts.messages)} />
            <ProjectStatTile title={t("stages")} icon={icon("clear-all")} value={format.number(counts.stages)} />
            <ProjectStatTile title={t("members")} icon={icon("person")} value={format.number(counts.members)} />
            <ProjectStatTile title={t("files")} icon={icon("cloud")} value={format.number(counts.files)} />
            <ProjectStatTile title={t("newTasks")} icon={icon("flag")} tone="blue" value={format.number(tasks.new)} />
            <ProjectStatTile title={t("inWork")} icon={icon("watch-later")} tone="yellow" value={format.number(tasks.inWork)} />
            <ProjectStatTile title={t("doneTasks")} icon={icon("task")} tone="green" value={format.number(tasks.done)} />
            <ProjectStatTile title={t("failedTasks")} icon={icon("close")} tone="red" value={format.number(tasks.failed)} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[--spacing(179)_1fr]">
          <div className="flex flex-col gap-3">
            <CompanyCard company={detail.company} />
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <ProjectStagesCard stages={detail.stages} />
              <ProjectMembersCard team={detail.team} />
            </div>
          </div>
          <ProjectEventsCard title={tEvents("title")} events={events} projects={[project]} className="lg:h-182" />
        </div>
      </div>
    </Card>
  )
}

export { ProjectDashboardCard }
