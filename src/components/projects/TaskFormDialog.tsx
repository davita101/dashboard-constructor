"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { ActionDialog } from "@/components/projects/ActionDialog"
import { FormField } from "@/components/projects/FormField"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxField, CheckboxFieldContent, CheckboxFieldTitle } from "@/components/ui/checkbox-field"
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { createTaskAction } from "@/lib/projects/actions"
import { taskStatuses } from "@/lib/projects/schemas"
import type { ProjectOption } from "@/lib/projects/types"

/** Add a task: project (unless `projectId` is fixed) → its stages and members for the stage / assignee pickers. */
function TaskFormDialog({
  trigger,
  projects,
  projectId: fixedProjectId,
}: {
  trigger: React.ReactElement
  projects: ProjectOption[]
  projectId?: string
}) {
  const t = useTranslations("forms.task")
  const [projectId, setProjectId] = React.useState(fixedProjectId ?? "")
  const project = projects.find((p) => p.id === projectId)

  return (
    <ActionDialog
      trigger={trigger}
      icon="/icons/material/material-restore.svg"
      title={t("createTitle")}
      action={createTaskAction}
      submitLabel={t("create")}
      successMessage={t("created")}
      hidden={fixedProjectId ? { projectId: fixedProjectId } : undefined}
    >
      {(state) => (
        <FieldGroup>
          {!fixedProjectId ? (
            <FormField name="projectId" label={t("project")} state={state}>
              {(p) => (
                <NativeSelect {...p} required value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                  <NativeSelectOption value="" disabled>
                    {t("projectPlaceholder")}
                  </NativeSelectOption>
                  {projects.map((option) => (
                    <NativeSelectOption key={option.id} value={option.id}>
                      {option.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            </FormField>
          ) : null}
          <FormField name="title" label={t("title")} state={state}>
            {(p) => <Input {...p} required maxLength={200} placeholder={t("titlePlaceholder")} />}
          </FormField>
          <FormField name="description" label={t("description")} state={state}>
            {(p) => <Textarea {...p} maxLength={2000} placeholder={t("descriptionPlaceholder")} />}
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            {/* Re-mount per project so a stage of the previous project is never posted. */}
            <FormField key={projectId} name="stageId" label={t("stage")} state={state}>
              {(p) => (
                <NativeSelect {...p} defaultValue="" disabled={!project?.stages.length}>
                  <NativeSelectOption value="">{t("noStage")}</NativeSelectOption>
                  {project?.stages.map((stage) => (
                    <NativeSelectOption key={stage.id} value={stage.id}>
                      {stage.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            </FormField>
            <FormField name="status" label={t("status")} state={state}>
              {(p) => (
                <NativeSelect {...p} defaultValue="new">
                  {taskStatuses.map((status) => (
                    <NativeSelectOption key={status} value={status}>
                      {t(`statuses.${status}`)}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            </FormField>
            <FormField name="startDate" label={t("start")} state={state}>
              {(p) => <Input {...p} type="date" placeholder="yyyy-mm-dd" />}
            </FormField>
            <FormField name="dueDate" label={t("due")} state={state}>
              {(p) => <Input {...p} type="date" placeholder="yyyy-mm-dd" />}
            </FormField>
          </div>
          {project?.members.length ? (
            <FieldSet key={project.id}>
              <FieldLegend>{t("assignees")}</FieldLegend>
              <ScrollArea className="max-h-40">
                <div className="flex flex-col gap-2">
              {project.members.map((member) => (
                <CheckboxField key={member.id}>
                  <Checkbox name="assigneeIds" value={member.id} aria-label={member.name} />
                  <CheckboxFieldContent className="items-center gap-2">
                    <Avatar size="24">
                      <AvatarImage src={member.avatar} alt="" />
                      <AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <CheckboxFieldTitle>{member.name}</CheckboxFieldTitle>
                  </CheckboxFieldContent>
                </CheckboxField>
              ))}
                </div>
              </ScrollArea>
            </FieldSet>
          ) : null}
        </FieldGroup>
      )}
    </ActionDialog>
  )
}

export { TaskFormDialog }
