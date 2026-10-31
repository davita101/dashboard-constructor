import { Checkbox } from "@/components/ui/checkbox"
import { Task, TaskDates, TaskIcon, TaskRow, TaskTitle } from "@/components/ui/task"

import { TaskAssignees, TaskCounts, TaskLabelList } from "./task-card"

/** Figma Task-List (12284:15290): one row. drag_indicator uses material-more-vert. */
function TaskList({ title = "Header Page Update" }: { title?: string }) {
  return (
    <Task variant="list">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <TaskIcon src="/icons/material-more-vert.svg" className="size-4" />
          <Checkbox size="16" aria-label={title} />
          <TaskTitle>{title}</TaskTitle>
        </div>
        <TaskDates />
      </div>
      <div className="flex flex-col gap-3">
        <TaskLabelList className="gap-1.5" />
        <TaskRow>
          <TaskAssignees size="20" />
          <TaskCounts />
        </TaskRow>
      </div>
    </Task>
  )
}

export { TaskList }
