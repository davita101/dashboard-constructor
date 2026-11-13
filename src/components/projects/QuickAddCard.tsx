import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { AddMemberDialog } from "@/components/projects/AddMemberDialog"
import { SendMessageDialog } from "@/components/projects/SendMessageDialog"
import { StageFormDialog } from "@/components/projects/StageFormDialog"
import { TaskFormDialog } from "@/components/projects/TaskFormDialog"
import { UploadFilesDialog } from "@/components/projects/UploadFilesDialog"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { ProjectOption } from "@/lib/projects/types"

// Figma Add 14061:68511.
const icons = {
  project: "/icons/material/material-assignment.svg",
  stages: "/icons/material/material-short-text.svg",
  task: "/icons/material/material-restore.svg",
  member: "/icons/material/material-person-add.svg",
  message: "/icons/material/material-message.svg",
  file: "/icons/material/material-cloud-done.svg",
} as const

type Key = keyof typeof icons

/**
 * Projects Quick Add: 2x3 grid of create actions. Project opens the editor page; Stages, Task and Member open
 * their dialogs (with a project picker), File opens the upload dialog, Message posts to the project chat.
 */
async function QuickAddCard({ projects }: { projects: ProjectOption[] }) {
  const t = await getTranslations("projects.quickAdd")

  const tile = (key: Key, extra?: Record<string, unknown>) => (
    <Button variant="plain" size="tile-20" shape="rounded" {...extra}>
      <ButtonIcon src={icons[key]} />
      {t(key)}
    </Button>
  )
  // Without a project there is nothing to add a stage, task or member to: those tiles lead to the editor.
  const needsProject = (key: Key, dialog: React.ReactNode) =>
    projects.length ? dialog : tile(key, { nativeButton: false, render: <Link href="/dashboard/projects/new" /> })

  return (
    <Card variant="panel">
      <div className="grid grid-cols-2 gap-x-10 gap-y-2 p-5">
        {tile("project", { nativeButton: false, render: <Link href="/dashboard/projects/new" /> })}
        {needsProject("stages", <StageFormDialog trigger={tile("stages")} projects={projects} />)}
        {needsProject("task", <TaskFormDialog trigger={tile("task")} projects={projects} />)}
        {needsProject("member", <AddMemberDialog trigger={tile("member")} projects={projects} />)}
        {needsProject("message", <SendMessageDialog trigger={tile("message")} projects={projects} />)}
        {needsProject("file", <UploadFilesDialog trigger={tile("file")} projects={projects} />)}
      </div>
    </Card>
  )
}

export { QuickAddCard }
