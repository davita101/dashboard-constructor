import { getTranslations } from "next-intl/server"

import { ProjectCardHead } from "@/components/projects/ProjectCardHead"
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
      <TableCellIcon src={icon} tone="soft" />
      <span className="sr-only">{label}</span>
      {children}
    </span>
  )
}

/** Figma Project Stages card (352x504, r16): head + scrolling list of 80px stage items. */
async function ProjectStagesCard({ stages }: { stages: ProjectStage[] }) {
  const t = await getTranslations("projectPage.stages")

  return (
    <Card variant="tile" className="lg:h-126">
      <ProjectCardHead title={t("title")} />
      <ScrollArea className="h-111">
        <ul className="flex flex-col gap-2 pr-5 pb-3 pl-4">
          {stages.map((stage) => (
            <li key={stage.id}>
              <Card variant="item" className="h-20 justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="soft" color={tones[(stage.index - 1) % tones.length]} size="square-24" shape="pill">
                    {stage.index}
                  </Badge>
                  <span className="min-w-0 truncate font-default text-11 leading-20 font-bold text-base-900">{stage.name}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Stat icon="/icons/material-flag.svg" label={t("tasks")}>{stage.tasks}</Stat>
                  <Stat icon="/icons/material-group.svg" label={t("members")}>{stage.members}</Stat>
                  <Stat icon="/icons/material-cloud.svg" label={t("files")}>{stage.files}</Stat>
                  <Stat icon="/icons/material-alarm.svg" label={t("start")}>{short(stage.start)}</Stat>
                  <Stat icon="/icons/material-alarm.svg" label={t("end")}>{short(stage.end)}</Stat>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </Card>
  )
}

export { ProjectStagesCard }
