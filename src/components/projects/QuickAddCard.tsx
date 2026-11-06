import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { Button, ButtonIcon } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Figma Add 14061:68511. Icons (assignment, short_text, restore, person_add, message, cloud_done)
// are not in public/icons yet (known-gaps), the default icon stands in.
const actions = [
  { key: "project", icon: "/icons/material-default-icon.svg", href: "/dashboard/projects/new" },
  { key: "stages", icon: "/icons/material-default-icon.svg" },
  { key: "task", icon: "/icons/material-default-icon.svg" },
  { key: "member", icon: "/icons/material-default-icon.svg" },
  { key: "message", icon: "/icons/material-default-icon.svg" },
  { key: "file", icon: "/icons/material-default-icon.svg" },
] as const satisfies readonly { key: string; icon: string; href?: string }[]

/** Projects Quick Add: 2x3 grid of create actions. Only Project has a flow so far (open question Q4 for the rest). */
async function QuickAddCard() {
  const t = await getTranslations("projects.quickAdd")

  return (
    <Card variant="panel" className="p-5">
      <div className="grid grid-cols-2 gap-x-10 gap-y-3">
        {actions.map((action) => (
          <Button
            key={action.key}
            variant="plain"
            size="tile-20"
            shape="rounded"
            {...("href" in action ? { nativeButton: false, render: <Link href={action.href} /> } : {})}
          >
            <ButtonIcon src={action.icon} />
            {t(action.key)}
          </Button>
        ))}
      </div>
    </Card>
  )
}

export { QuickAddCard }
