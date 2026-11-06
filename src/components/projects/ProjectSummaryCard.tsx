import { useFormatter, useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  TableCell,
  TableCellContent,
  TableCellIcon,
  TableCellLogo,
  TableCellProgress,
  TableCellTitle,
} from "@/components/ui/table-cell"
import type { Project } from "@/lib/projects/types"

// Stages, Deadline and Tasks icons (clear_all, alarm, restore) are not in public/icons yet (known-gaps).
const DEFAULT_ICON = "/icons/material-default-icon.svg"

/** Figma project list Item (424x152 r12): brand + team head, progress row, 2x2 facts grid. */
function ProjectSummaryCard({ project }: { project: Project }) {
  const t = useTranslations("projects.list")
  const format = useFormatter()

  const deadline = format
    .dateTime(new Date(project.deadline), { timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit" })
    .replaceAll("/", ".")
  const income = format.number(project.income, { style: "currency", currency: "USD", maximumFractionDigits: 0 })

  const facts = [
    { icon: DEFAULT_ICON, text: t("stages", { count: project.stages }) },
    { icon: DEFAULT_ICON, text: t("deadline", { date: deadline }) },
    { icon: "/icons/material-account-balance-wallet.svg", text: t("income", { amount: income }) },
    { icon: DEFAULT_ICON, text: t("tasks", { count: project.tasks }) },
  ]

  return (
    <Card variant="item">
      <div className="flex items-center justify-between">
        <TableCell size="40" className="min-w-0 flex-1">
          <TableCellLogo src={project.logo} />
          <TableCellContent className="min-w-0">
            <TableCellTitle className="truncate">{project.name}</TableCellTitle>
          </TableCellContent>
        </TableCell>
        <TableCell size="40" className="shrink-0">
          <AvatarGroup size="24">
            {project.members.slice(0, 4).map((member) => (
              <Avatar key={member.id} size="24">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <Button variant="outline" size="icon-24" shape="rounded" aria-label={t("addMember", { name: project.name })}>
            <ButtonIcon src="/icons/material-add.svg" />
          </Button>
        </TableCell>
      </div>
      <TableCell size="32" className="w-full">
        <TableCellProgress value={project.progress} color="green" className="w-full" />
      </TableCell>
      <div className="grid grid-cols-2">
        {facts.map(({ icon, text }) => (
          <TableCell key={text} size="32">
            <TableCellIcon src={icon} />
            <TableCellContent>
              <TableCellTitle tone="muted">{text}</TableCellTitle>
            </TableCellContent>
          </TableCell>
        ))}
      </div>
    </Card>
  )
}

export { ProjectSummaryCard }
