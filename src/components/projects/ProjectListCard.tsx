"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { ProjectSummaryCard } from "@/components/projects/ProjectSummaryCard"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemLeft,
  DropdownMenuItemTitle,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TableCell } from "@/components/ui/table-cell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Project } from "@/lib/projects/types"

type ListTab = "last" | "deadline" | "costs"

const tabs: ListTab[] = ["last", "deadline", "costs"]

const sorters: Record<ListTab, (a: Project, b: Project) => number> = {
  last: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  deadline: (a, b) => a.deadline.localeCompare(b.deadline),
  costs: (a, b) => b.income - a.income,
}

/** Figma Column 14061:68564 (456x788 r20): pill tabs + more menu head, scrolling list of project cards. */
function ProjectListCard({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects.list")
  const tEmpty = useTranslations("projects.empty")
  const [tab, setTab] = React.useState<ListTab>("last")

  return (
    <Card variant="panel" className="gap-0 lg:h-197">
      <Tabs value={tab} onValueChange={(value) => setTab(value as ListTab)} className="min-h-0 flex-1 gap-0">
        <div className="flex items-center justify-between">
          <TableCell size="60" padding="loose">
            <TabsList variant="pill" size="28">
              {tabs.map((key) => (
                <TabsTrigger key={key} value={key}>
                  {t(`tabs.${key}`)}
                </TabsTrigger>
              ))}
            </TabsList>
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
                <DropdownMenuItem data-soon>
                  <DropdownMenuItemLeft>
                    <DropdownMenuItemTitle>{t("viewAll")}</DropdownMenuItemTitle>
                  </DropdownMenuItemLeft>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {tabs.map((key) => (
          <TabsContent key={key} value={key} className="min-h-0 flex-1">
            {projects.length === 0 ? (
              <div className="flex h-full items-center justify-center px-5">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <EmptyIcon src="/icons/material-default-icon.svg" />
                    </EmptyMedia>
                    <EmptyTitle>{tEmpty("projectsTitle")}</EmptyTitle>
                    <EmptyDescription>{tEmpty("projectsDescription")}</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            ) : (
            <ScrollArea className="h-full" scrollbar="track">
              <ul className="flex flex-col gap-3 pr-5 pl-3">
                {[...projects].sort(sorters[key]).map((project) => (
                  <li key={project.id}>
                    <ProjectSummaryCard project={project} />
                  </li>
                ))}
              </ul>
            </ScrollArea>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}

export { ProjectListCard }
