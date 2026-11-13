"use client"

import { useFormatter, useTranslations } from "next-intl"
import Link from "next/link"
import * as React from "react"

import { SortHead } from "@/components/table/product-table"
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableCell, TableCellLogo, TableCellProgress, TableCellTitle } from "@/components/ui/table-cell"
import type { Project } from "@/lib/projects/types"

// Product-table frame (Figma 14055:68891) with the columns swapped for projects: select, Project (logo + name),
// Progress, Deadline, Income, Cost, Members.

type SortKey = "name" | "progress" | "deadline" | "income" | "cost" | "members"
type Sort = { key: SortKey; direction: "up" | "down" } | null

const compare = (key: SortKey, a: Project, b: Project) => {
  switch (key) {
    case "name":
      return a.name.localeCompare(b.name)
    case "deadline":
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    case "members":
      return a.members.length - b.members.length
    default:
      return a[key] - b[key]
  }
}

function ProjectsTable({ projects }: { projects: Project[] }) {
  const t = useTranslations("widgets.data")
  const format = useFormatter()
  const [selected, setSelected] = React.useState<string[]>([])
  const [sort, setSort] = React.useState<Sort>(null)
  const all = projects.length > 0 && selected.length === projects.length
  const some = selected.length > 0 && !all

  const onSort = (key: SortKey) =>
    setSort((prev) => (prev?.key !== key ? { key, direction: "up" } : prev.direction === "up" ? { key, direction: "down" } : null))

  const sorted = React.useMemo(() => {
    if (!sort) return projects
    const order = [...projects].sort((a, b) => compare(sort.key, a, b))
    return sort.direction === "up" ? order : order.reverse()
  }, [projects, sort])

  const toggle = (id: string, on: boolean) => setSelected((prev) => (on ? [...prev, id] : prev.filter((s) => s !== id)))
  const money = (n: number) => format.number(n, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
  const date = (iso: string) =>
    format.dateTime(new Date(iso), { timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit" }).replaceAll("/", ".")

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-12.5">
            <TableCell size="40" style="head" padding="loose" role="presentation" className="w-full">
              <Checkbox
                color="primary-dark"
                size="20"
                aria-label={t("selectAll")}
                checked={all}
                indeterminate={some}
                onCheckedChange={(on) => setSelected(on ? projects.map((p) => p.id) : [])}
              />
            </TableCell>
          </TableHead>
          <SortHead id="name" sort={sort} onSort={onSort}>
            {t("project")}
          </SortHead>
          <SortHead id="progress" className="w-50" sort={sort} onSort={onSort}>
            {t("progress")}
          </SortHead>
          <SortHead id="deadline" className="w-35" sort={sort} onSort={onSort}>
            {t("deadline")}
          </SortHead>
          <SortHead id="income" className="w-35" sort={sort} onSort={onSort}>
            {t("income")}
          </SortHead>
          <SortHead id="cost" className="w-35" sort={sort} onSort={onSort}>
            {t("cost")}
          </SortHead>
          <SortHead id="members" className="w-35" sort={sort} onSort={onSort}>
            {t("members")}
          </SortHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableData colSpan={7}>
              <TableCell size="40" style="border" role="presentation" className="w-full">
                <TableCellTitle tone="muted">{t("noProjects")}</TableCellTitle>
              </TableCell>
            </TableData>
          </TableRow>
        ) : (
          sorted.map((project) => (
            <TableRow key={project.id} data-state={selected.includes(project.id) ? "selected" : undefined}>
              <TableData>
                <TableCell size="40" style="border" padding="loose" role="presentation" className="w-full">
                  <Checkbox
                    color="primary-dark"
                    size="20"
                    aria-label={t("selectRow", { name: project.name })}
                    checked={selected.includes(project.id)}
                    onCheckedChange={(on) => toggle(project.id, on)}
                  />
                </TableCell>
              </TableData>
              <TableData>
                <TableCell size="40" style="border" role="presentation" className="w-full">
                  <TableCellLogo src={project.logo} />
                  <TableCellTitle>
                    <Link href={`/dashboard/projects/${project.slug}/dashboard`} className="outline-none hover:underline focus-visible:underline">
                      {project.name}
                    </Link>
                  </TableCellTitle>
                </TableCell>
              </TableData>
              <TableData>
                <TableCell size="40" style="border" role="presentation" className="w-full">
                  <TableCellProgress value={project.progress} color="green" className="w-full" />
                </TableCell>
              </TableData>
              <TableData>
                <TableCell size="40" style="border" role="presentation" className="w-full">
                  <TableCellTitle>{date(project.deadline)}</TableCellTitle>
                </TableCell>
              </TableData>
              <TableData>
                <TableCell size="40" style="border" role="presentation" className="w-full">
                  <TableCellTitle>{money(project.income)}</TableCellTitle>
                </TableCell>
              </TableData>
              <TableData>
                <TableCell size="40" style="border" role="presentation" className="w-full">
                  <TableCellTitle>{money(project.cost)}</TableCellTitle>
                </TableCell>
              </TableData>
              <TableData>
                <TableCell size="40" style="border" role="presentation" className="w-full">
                  <AvatarGroup size="24">
                    {project.members.slice(0, 4).map((member) => (
                      <Avatar key={member.id} size="24">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </TableCell>
              </TableData>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export { ProjectsTable }
