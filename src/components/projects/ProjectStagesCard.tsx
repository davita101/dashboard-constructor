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
      <TableCellIcon src={icon} tone="soft" className="size-4" />
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
        <ul className="flex flex-col gap-3 pr-5 pl-4">
          {stages.map((stage) => (
            <li key={stage.id}>
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
                    <Stat icon="/icons/material/material-alarm.svg" label={t("start")}>{short(stage.start)}</Stat>
                    <Stat icon="/icons/material/material-alarm.svg" label={t("end")}>{short(stage.end)}</Stat>
                  </div>
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
