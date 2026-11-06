import { ProjectCardHead } from "@/components/projects/ProjectCardHead"
import { Card, CardStatValue } from "@/components/ui/card"

type Tone = "default" | "blue" | "yellow" | "green" | "red"

/** Figma stat tile (160 high, r16): head + big 30px value. `wide` (340) carries the more menu; the small ones (175) an icon. */
function ProjectStatTile({
  title,
  value,
  icon,
  tone = "default",
  wide = false,
}: {
  title: string
  value: string | number
  icon?: string
  tone?: Tone
  wide?: boolean
}) {
  return (
    <Card variant="tile" className="h-40">
      <ProjectCardHead title={title} icon={icon} menu={wide} />
      <div className="flex px-5">
        <CardStatValue size="30" tone={tone}>
          {value}
        </CardStatValue>
      </div>
    </Card>
  )
}

export { ProjectStatTile }
