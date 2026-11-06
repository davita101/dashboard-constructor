import { useFormatter, useTranslations } from "next-intl"
import Link from "next/link"

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

const icon = (name: string) => `/icons/material/material-${name}.svg`

/** Figma project list Item (424x152 r12): brand + team head, progress row, 2x2 facts grid. */
function ProjectSummaryCard({ project }: { project: Project }) {
  const t = useTranslations("projects.list")
  const format = useFormatter()

  const deadline = format
    .dateTime(new Date(project.deadline), { timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit" })
    .replaceAll("/", ".")
  const income = format.number(project.income, { style: "currency", currency: "USD", maximumFractionDigits: 0 })

  const facts = [
    { icon: icon("clear-all"), text: t("stages", { count: project.stages }) },
    { icon: icon("alarm"), text: t("deadline", { date: deadline }) },
    { icon: "/icons/material-account-balance-wallet.svg", text: t("income", { amount: income }) },
    { icon: icon("restore"), text: t("tasks", { count: project.tasks }) },
  ]

  return (
    // The title link stretches over the card; the add-member button sits above it.
    <Card variant="item" className="relative">
      <div className="flex items-center justify-between">
        <TableCell size="40" className="static min-w-0 flex-1">
          <TableCellLogo src={project.logo} />
          <TableCellContent className="min-w-0">
            <TableCellTitle className="truncate">
              <Link
                href={`/dashboard/projects/${project.slug}`}
                className="rounded-r12 outline-none after:absolute after:inset-0 after:z-1 after:rounded-r12 focus-visible:after:ring-2 focus-visible:after:ring-primary-500 focus-visible:after:ring-inset"
              >
                {project.name}
              </Link>
            </TableCellTitle>
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
          <Button variant="outline" size="icon-24" shape="rounded" className="relative z-10" aria-label={t("addMember", { name: project.name })}>
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
