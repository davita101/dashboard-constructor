import { getFormatter, getTranslations } from "next-intl/server"

import { Badge, BadgeIcon, type BadgeColor } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button, ButtonIcon } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  TableCell,
  TableCellContent,
  TableCellDescription,
  TableCellLogo,
  TableCellTitle,
} from "@/components/ui/table-cell"
import { cn } from "@/lib/utils"
import type { Project, ProjectEvent, ProjectEventKind } from "@/lib/projects/types"

// Figma Badge-Icon-Pilled color per event kind: add_circle green, message blue, clear_all orange, download cyan.
// "task" has no Figma sample color or icon (last row not read): purple + default icon, see known-gaps.
// message, clear_all and the task icon are not in public/icons yet: default icon stands in.
const kinds: Record<ProjectEventKind, { color: BadgeColor; icon: string }> = {
  member: { color: "green", icon: "/icons/material-add-circle.svg" },
  comment: { color: "blue", icon: "/icons/material-default-icon.svg" },
  stage: { color: "orange", icon: "/icons/material-default-icon.svg" },
  file: { color: "cyan", icon: "/icons/material-file-download.svg" },
  task: { color: "purple", icon: "/icons/material-default-icon.svg" },
}

type Group = { project: Project; events: ProjectEvent[] }

/** Group events by project, keeping first-seen order; events of unknown projects are dropped. */
function groupEvents(events: ProjectEvent[], projects: Project[]): Group[] {
  const byId = new Map(projects.map((p) => [p.id, p]))
  const groups = new Map<string, Group>()
  for (const event of events) {
    const project = byId.get(event.projectId)
    if (!project) continue
    const group = groups.get(project.id) ?? { project, events: [] }
    group.events.push(event)
    groups.set(project.id, group)
  }
  return [...groups.values()]
}

/** Figma Last Events (14061:68638): Latest events head with a more menu and a scrolling list of per-project event groups. */
async function ProjectEventsCard({
  events,
  projects,
  title,
  className,
  groupHead = "stacked",
}: {
  events: ProjectEvent[]
  projects: Project[]
  title?: string
  className?: string
  groupHead?: "stacked" | "inline"
}) {
  const t = await getTranslations("projects.events")
  const tEmpty = await getTranslations("projects.empty")
  const format = await getFormatter()
  const groups = groupEvents(events, projects)

  const time = (at: string) =>
    format.dateTime(new Date(at), { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" })

  return (
    <Card variant="panel" className={cn("lg:h-197", className)}>
      <div className="flex shrink-0 items-center justify-between">
        <TableCell size="60">
          <TableCellTitle>{title ?? t("title")}</TableCellTitle>
        </TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="muted" size="icon-60" shape="rounded" aria-label={t("more")}>
                <ButtonIcon src="/icons/material-more-horiz.svg" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>{t("viewAll")}</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {groups.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center px-5">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <EmptyIcon src="/icons/material-default-icon.svg" />
              </EmptyMedia>
              <EmptyTitle>{tEmpty("eventsTitle")}</EmptyTitle>
              <EmptyDescription>{tEmpty("eventsDescription")}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col p-1 pe-5">
          {groups.map(({ project, events: items }) => (
            <section key={project.id} aria-label={project.name} className="flex flex-col">
              <TableCell size="48" padding="none" className="w-full gap-0">
                <TableCell size="48" padding="none" align="center" className="w-12">
                  <TableCellLogo src={project.logo} alt="" />
                </TableCell>
                <TableCellContent className="py-0">
                  {groupHead === "inline" ? (
                    <div className="flex min-w-0 items-baseline gap-1">
                      <TableCellTitle className="truncate">{project.name}</TableCellTitle>
                      <TableCellDescription className="shrink-0 text-base-500">{t("count", { count: items.length })}</TableCellDescription>
                    </div>
                  ) : (
                    <>
                      <TableCellTitle className="truncate">{project.name}</TableCellTitle>
                      <TableCellDescription>{t("count", { count: items.length })}</TableCellDescription>
                    </>
                  )}
                </TableCellContent>
              </TableCell>
              {items.map((event) => {
                const { color, icon } = kinds[event.kind]
                return (
                  <div key={event.id} className="flex flex-col">
                    <div className="flex h-3 ps-6" aria-hidden>
                      <Separator orientation="vertical" />
                    </div>
                    <div className="flex h-12 items-center">
                      <TableCell size="48" padding="none" align="center" className="w-12">
                        <Badge variant="soft-border" color={color} size="square-32" shape="pill">
                          <BadgeIcon src={icon} />
                        </Badge>
                      </TableCell>
                      <TableCell size="48" padding="none" className="min-w-0 flex-1">
                        <TableCellContent className="py-0">
                          <TableCellTitle className="truncate">{event.title}</TableCellTitle>
                          <TableCellDescription>{t(`kind.${event.kind}`)}</TableCellDescription>
                        </TableCellContent>
                      </TableCell>
                      <TableCell size="48">
                        <Badge variant="base" size="24" shape="pill">
                          <time dateTime={event.at}>{time(event.at)}</time>
                        </Badge>
                      </TableCell>
                    </div>
                  </div>
                )
              })}
            </section>
          ))}
        </div>
      </ScrollArea>
      )}
    </Card>
  )
}

export { ProjectEventsCard }
