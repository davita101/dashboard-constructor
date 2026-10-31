import { Button } from "@/components/ui/button"
import { CloseAction } from "@/components/ui/icon-action"
import { Task, TaskIcon, TaskName, TaskRow } from "@/components/ui/task"

/** Figma New-Task (12277:25738). Glyphs use nearest public/icons. */
function NewTask({ name = "Task Name" }: { name?: string }) {
  return (
    <Task variant="card">
      <TaskRow className="py-2 pr-1">
        <TaskName>{name}</TaskName>
        <CloseAction />
      </TaskRow>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <TaskIcon src="/icons/material-event.svg" />
          <TaskIcon src="/icons/material-list.svg" />
          <TaskIcon src="/icons/material-account-circle.svg" />
          <TaskIcon src="/icons/material-check.svg" />
          <TaskIcon src="/icons/material-attachment.svg" />
        </div>
        <Button variant="dark" size="32" className="w-full">
          Add Task
        </Button>
      </div>
    </Task>
  )
}

export { NewTask }
