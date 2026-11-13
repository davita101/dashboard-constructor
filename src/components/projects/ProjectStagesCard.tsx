import { getTranslations } from "next-intl/server"

import { ProjectCardHead } from "@/components/projects/ProjectCardHead"
import { ProjectStagesMenu } from "@/components/projects/ProjectStagesMenu"
import { StageFormDialog } from "@/components/projects/StageFormDialog"
import { Badge, type BadgeColor } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TableCellIcon } from "@/components/ui/table-cell"
import type { ProjectStage } from "@/lib/projects/types"

const tones: BadgeColor[] = ["blue", "green", "purple", "sky", "orange"]

/** ISO date -> dd.MM */
const short = (iso: string) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`

function Stat({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1 font-default text-11 leading-20 font-bold text-base-700" title={label}>
      <TableCellIcon src={icon} tone="soft" className="size-4" />
      <span className="sr-only">{label}</span>
      {children}
    </span>
  )
}

/** One 80px stage item: number badge + name | task/member/file counts and start/end dates. */
async function StageItem({ stage }: { stage: ProjectStage }) {
  const t = await getTranslations("projectPage.stages")

  return (
    <Card variant="item" className="h-20 p-0">
      <div className="flex h-10 items-center">
        <div className="flex w-10 shrink-0 justify-center">
          <Badge variant="soft" color={tones[(stage.index - 1) % tones.length]} size="square-24" shape="pill">
            {stage.index}
          </Badge>
        </div>
        <Separator orientation="vertical" />
        <span className="min-w-0 flex-1 truncate px-3 font-default text-11 leading-20 font-bold text-base-900">{stage.name}</span>
      </div>
      <Separator />
      <div className="flex h-10 items-center">
        <div className="flex flex-1 items-center justify-around px-2">
          <Stat icon="/icons/material/material-flag.svg" label={t("tasks")}>{stage.tasks}</Stat>
          <Stat icon="/icons/material/material-group.svg" label={t("members")}>{stage.members}</Stat>
          <Stat icon="/icons/material-cloud.svg" label={t("files")}>{stage.files}</Stat>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-1 items-center justify-around px-2">
          <Stat icon="/icons/material/material-alarm.svg" label={t("start")}>{stage.start ? short(stage.start) : "–"}</Stat>
          <Stat icon="/icons/material/material-alarm.svg" label={t("end")}>{stage.end ? short(stage.end) : "–"}</Stat>
        </div>
      </div>
    </Card>
  )
}

/**
 * Figma Project Stages card (352x504, r16): head + scrolling list of 80px stage items.
 * With a `projectId` (not on the blank editor) the menu adds stages and a click on a stage edits it.
 */
async function ProjectStagesCard({ stages, projectId }: { stages: ProjectStage[]; projectId?: string }) {
  const t = await getTranslations("projectPage.stages")
  const order = stages.map((s) => s.id)

  return (
    <Card variant="tile" className="lg:h-126">
      <ProjectCardHead title={t("title")} menu={projectId ? <ProjectStagesMenu projectId={projectId} /> : true} />
      <ScrollArea className="h-111">
        <ul className="flex flex-col gap-3 pr-5 pl-4">
          {stages.map((stage) => (
            <li key={stage.id}>
              {projectId ? (
                <StageFormDialog
                  projectId={projectId}
                  order={order}
                  stage={{ id: stage.id, name: stage.name, start: stage.start, end: stage.end }}
                  trigger={
                    <button
                      type="button"
                      aria-label={t("edit", { name: stage.name })}
                      className="block w-full rounded-r12 text-left outline-none focus-visible:ring-4 focus-visible:ring-base-alpha-20"
                    >
                      <StageItem stage={stage} />
                    </button>
                  }
                />
              ) : (
                <StageItem stage={stage} />
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </Card>
  )
}

export { ProjectStagesCard }
