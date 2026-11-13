import { getFormatter, getTranslations } from "next-intl/server"

import { Badge, BadgeIcon, type BadgeColor } from "@/components/ui/badge"
import { Card, CardStatLabel, CardStatValue } from "@/components/ui/card"
import type { ProjectTotals } from "@/lib/projects/types"

// Figma Grid 14061:68492: four stat pills.
const items: { key: Exclude<keyof ProjectTotals, "tasksDone">; color: BadgeColor; icon: string }[] = [
  { key: "projects", color: "blue", icon: "/icons/material/material-assignment.svg" },
  { key: "tasks", color: "green", icon: "/icons/material/material-restore-page.svg" },
  { key: "members", color: "purple", icon: "/icons/material-account-circle.svg" },
  { key: "files", color: "cyan", icon: "/icons/material-file-download.svg" },
]

/** Projects KPI row: value, label and a colored icon badge per pill. */
async function ProjectStats({ totals }: { totals: ProjectTotals }) {
  const t = await getTranslations("projects.stats")
  const format = await getFormatter()

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map(({ key, color, icon }) => (
        <Card key={key} variant="stat">
          <CardStatValue>{format.number(totals[key])}</CardStatValue>
          <CardStatLabel>{t(key)}</CardStatLabel>
          <Badge variant="soft-border" color={color} size="square-32" shape="pill">
            <BadgeIcon src={icon} />
          </Badge>
        </Card>
      ))}
    </div>
  )
}

export { ProjectStats }
