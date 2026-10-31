import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { Badge, BadgeDot, type BadgeColor } from "@/components/ui/badge"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Task, TaskCover, TaskDates, TaskLabels, TaskRow, TaskStat, TaskStats, TaskTitle } from "@/components/ui/task"

const labels = [
  { color: "blue", text: "Label 1" },
  { color: "green", text: "Label 2" },
  { color: "orange", text: "Label 3" },
  { color: "purple", text: "Label 4" },
] as const satisfies { color: BadgeColor; text: string }[]

const photos = [1, 2, 3, 4, 5, 6].map((n) => `/images/avatars/avatar-${n}.png`)

/** Task-Labels: the four tinted Badge chips. */
function TaskLabelList({ className }: { className?: string }) {
  return (
    <TaskLabels className={className}>
      {labels.map((label) => (
        <Badge key={label.text} variant="soft-border" color={label.color} size="20" shape="pill">
          <BadgeDot />
          {label.text}
        </Badge>
      ))}
    </TaskLabels>
  )
}

function TaskAssignees({ size }: { size: "24" | "20" }) {
  return (
    <AvatarGroup size={size}>
      {photos.map((src) => (
        <Avatar key={src} size={size}>
          <AvatarImage src={src} alt="" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+2</AvatarGroupCount>
    </AvatarGroup>
  )
}

/** Subtasks (task_alt), Files (attachment), Description glyphs; task_alt/description use nearest check/insert-drive-file. */
function TaskCounts() {
  return (
    <TaskStats>
      <TaskStat icon="/icons/material-check.svg" count={1} />
      <TaskStat icon="/icons/material-attachment.svg" count={1} />
      <TaskStat icon="/icons/material-insert-drive-file.svg" />
    </TaskStats>
  )
}

/** Figma Task-Card (12276:42850). */
function TaskCard({ title = "Header Page Update" }: { title?: string }) {
  return (
    <Task variant="card">
      <TaskCover src="/images/banners/banner-1.png" />
      <TaskTitle className="flex-none">{title}</TaskTitle>
      <TaskDates />
      <TaskLabelList />
      <TaskAssignees size="24" />
      <TaskRow>
        <TaskCounts />
        <div className="flex gap-1">
          <Button variant="outline" size="icon-24" aria-label="Bookmark"><ButtonIcon src="/icons/material-star.svg" /></Button>
          <Button variant="outline" size="icon-24" aria-label="Edit"><ButtonIcon src="/icons/material-settings.svg" /></Button>
        </div>
      </TaskRow>
    </Task>
  )
}

export { TaskAssignees, TaskCard, TaskCounts, TaskLabelList }
