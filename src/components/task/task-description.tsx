import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge, BadgeDot } from "@/components/ui/badge"
import { Button, ButtonIcon } from "@/components/ui/button"
import { CloseAction } from "@/components/ui/icon-action"
import { InputGroup, InputGroupAddon, InputGroupIcon, InputGroupInput } from "@/components/ui/input-group"
import { Task, TaskDot, TaskSection, TaskSectionTitle } from "@/components/ui/task"

/** Figma Task-Description (15607:461117). */
function TaskDescription() {
  return (
    <Task variant="description">
      <TaskSection>
        <TaskSectionTitle>
          <TaskDot />
          Status
        </TaskSectionTitle>
        <InputGroup size="32" shape="pill">
          <InputGroupAddon>
            <span aria-hidden className="size-2 rounded-full bg-purple-500" />
          </InputGroupAddon>
          <InputGroupInput readOnly aria-label="Status" defaultValue="Select Status: Todo" className="font-semibold" />
          <InputGroupAddon align="inline-end">
            <InputGroupIcon src="/icons/material-unfold-more.svg" />
          </InputGroupAddon>
        </InputGroup>
      </TaskSection>
      <TaskSection>
        <TaskSectionTitle icon="/icons/material-today.svg">Dates</TaskSectionTitle>
        <div className="flex gap-2">
          {["Start Day", "End Day"].map((day) => (
            <InputGroup key={day} size="32" shape="pill" className="w-34">
              <InputGroupInput readOnly aria-label={day} defaultValue={day} className="font-semibold" />
              <InputGroupAddon align="inline-end">
                <InputGroupIcon src="/icons/material-unfold-more.svg" />
              </InputGroupAddon>
            </InputGroup>
          ))}
        </div>
      </TaskSection>
      <TaskSection>
        <TaskSectionTitle icon="/icons/material-list.svg">Labels</TaskSectionTitle>
        <div className="flex items-center gap-2">
          <Badge variant="soft-border" color="purple" size="32" shape="pill">
            <BadgeDot />
            Business
            <CloseAction aria-label="Remove Business" />
          </Badge>
          <Badge variant="soft-border" color="sky" size="32" shape="pill">
            <BadgeDot />
            Project
            <CloseAction aria-label="Remove Project" />
          </Badge>
          <Button variant="outline" size="icon-32" aria-label="Add label">
            <ButtonIcon src="/icons/material-add.svg" />
          </Button>
        </div>
      </TaskSection>
      <TaskSection>
        <TaskSectionTitle icon="/icons/material-account-circle.svg">Assignees</TaskSectionTitle>
        <div className="flex items-center gap-2">
          <Badge variant="base" size="32" shape="pill">
            <Avatar size="20">
              <AvatarImage src="/images/avatars/avatar-1.png" alt="" />
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            John Smith
            <CloseAction aria-label="Remove John Smith" />
          </Badge>
          <Button variant="outline" size="icon-32" aria-label="Add assignee">
            <ButtonIcon src="/icons/material-add.svg" />
          </Button>
        </div>
      </TaskSection>
    </Task>
  )
}

export { TaskDescription }
