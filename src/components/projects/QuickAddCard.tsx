import { getTranslations } from "next-intl/server"

import { Button, ButtonIcon } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Figma Add 14061:68511. Icons (assignment, short_text, restore, person_add, message, cloud_done)
// are not in public/icons yet (known-gaps), the default icon stands in.
const actions = [
  { key: "project", icon: "/icons/material-default-icon.svg" },
  { key: "stages", icon: "/icons/material-default-icon.svg" },
  { key: "task", icon: "/icons/material-default-icon.svg" },
  { key: "member", icon: "/icons/material-default-icon.svg" },
  { key: "message", icon: "/icons/material-default-icon.svg" },
  { key: "file", icon: "/icons/material-default-icon.svg" },
] as const

/** Projects Quick Add: 2x3 grid of create actions (handlers wired in a later step). */
async function QuickAddCard() {
  const t = await getTranslations("projects.quickAdd")

  return (
    <Card variant="panel" className="p-5">
      <div className="grid grid-cols-2 gap-x-10 gap-y-3">
        {actions.map(({ key, icon }) => (
          <Button key={key} variant="plain" size="tile-20" shape="rounded">
            <ButtonIcon src={icon} />
            {t(key)}
          </Button>
        ))}
      </div>
    </Card>
  )
}

export { QuickAddCard }
