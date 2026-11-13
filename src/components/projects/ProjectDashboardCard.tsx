import { getFormatter, getLocale, getTranslations } from "next-intl/server"

import { CompanyCard } from "@/components/projects/CompanyCard"
import { ProjectEventsCard } from "@/components/projects/ProjectEventsCard"
import { ProjectMembersCard } from "@/components/projects/ProjectMembersCard"
import { ProjectStagesCard } from "@/components/projects/ProjectStagesCard"
import { ProjectStatTile } from "@/components/projects/ProjectStatTile"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProjectTabs } from "@/components/projects/ProjectTabs"
import { formatIsoDate } from "@/lib/projects/dates"
import { projectTabKeys, type ProjectTabKey } from "@/lib/projects/tabs"
import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import type { Project, ProjectDetail, ProjectEvent } from "@/lib/projects/types"

const icon = (name: string) => `/icons/material/material-${name}.svg`

/** Figma main card (1128x1176, r20): pill tabs head, divider, stat tiles and the lower group. */
async function ProjectDashboardCard({
  detail,
  events,
  projects,
  tab = "dashboard",
}: {
  detail: ProjectDetail
  events: ProjectEvent[]
  projects: Project[]
  tab?: ProjectTabKey
}) {
  const [t, tTabs, tEvents, format, locale] = await Promise.all([
    getTranslations("projectPage.stats"),
    getTranslations("projectPage.tabs"),
    getTranslations("projectPage.events"),
    getFormatter(),
    getLocale(),
  ])
  const { project, counts, tasks } = detail
  // The blank editor (/dashboard/projects/new) has no project to add stages or members to yet.
  const projectId = project.id === "new" ? undefined : project.id

  return (
    <Card variant="panel" className="gap-0">
      <ProjectTabs
        value={tab}
        label={tTabs("label")}
        labels={Object.fromEntries(projectTabKeys.map((key) => [key, tTabs(key)])) as Record<ProjectTabKey, string>}
      />
      <Separator />
      {tab !== "dashboard" ? (
        // Only the Dashboard section is drawn in Figma; the other tabs get an empty state until their frames are built.
        <Empty className="min-h-120 justify-center p-5">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <EmptyIcon src="/icons/material-default-icon.svg" />
            </EmptyMedia>
            <EmptyTitle>{tTabs(tab)}</EmptyTitle>
            <EmptyDescription>{tTabs("empty")}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
      <div className="flex flex-col gap-3 p-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[--spacing(85)_1fr]">
          <div className="flex flex-col gap-3">
            <ProjectStatTile wide title={t("implementation")} value={format.number(detail.implementation / 100, { style: "percent" })} />
            <ProjectStatTile wide title={t("deadline")} value={project.deadline ? formatIsoDate(project.deadline, locale, true) : "–"} />
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
              <ProjectStagesCard stages={detail.stages} projectId={projectId} />
              <ProjectMembersCard team={detail.team} projectId={projectId} />
            </div>
          </div>
          <ProjectEventsCard title={tEvents("title")} events={events} projects={projects} groupHead="inline" className="lg:h-182" />
        </div>
      </div>
      )}
    </Card>
  )
}

export { ProjectDashboardCard }
