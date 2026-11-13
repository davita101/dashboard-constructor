"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { ActionDialog } from "@/components/projects/ActionDialog"
import { FormField } from "@/components/projects/FormField"
import { Button, ButtonIcon } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { toast } from "@/components/ui/toast"
import { createStageAction, deleteStageAction, reorderStagesAction, updateStageAction } from "@/lib/projects/actions"

type StageValues = { id: string; name: string; start: string; end: string }

/**
 * Add a stage (to `projectId`, or to the project picked from `projects`) or edit one (`stage`): edit also
 * moves it up/down (`order` = every stage id of the project in order) and deletes it.
 */
function StageFormDialog({
  trigger,
  open,
  onOpenChange,
  projectId,
  projects,
  stage,
  order,
}: {
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  projectId?: string
  projects?: { id: string; name: string }[]
  stage?: StageValues
  order?: string[]
}) {
  const t = useTranslations("forms.stage")
  const day = (iso: string) => iso.slice(0, 10)
  // Controlled here too, so deleting the stage (nested confirm) also closes this dialog.
  const [innerOpen, setInnerOpen] = React.useState(false)
  const isOpen = open ?? innerOpen
  const setOpen = (next: boolean) => {
    setInnerOpen(next)
    onOpenChange?.(next)
  }

  return (
    <ActionDialog
      trigger={trigger}
      open={isOpen}
      onOpenChange={setOpen}
      icon="/icons/material/material-short-text.svg"
      title={t(stage ? "editTitle" : "createTitle")}
      action={stage ? updateStageAction : createStageAction}
      submitLabel={t(stage ? "save" : "create")}
      successMessage={t(stage ? "saved" : "created")}
      hidden={stage ? { stageId: stage.id } : projectId ? { projectId } : undefined}
      extraActions={
        stage ? (
          <>
            {projectId && order ? <MoveStage projectId={projectId} stageId={stage.id} order={order} /> : null}
            <DeleteStageButton stageId={stage.id} onDeleted={() => setOpen(false)} />
          </>
        ) : null
      }
    >
      {(state) => (
        <FieldGroup>
          {!stage && !projectId && projects ? (
            <FormField name="projectId" label={t("project")} state={state}>
              {(p) => (
                <NativeSelect {...p} required defaultValue="">
                  <NativeSelectOption value="" disabled>
                    {t("projectPlaceholder")}
                  </NativeSelectOption>
                  {projects.map((project) => (
                    <NativeSelectOption key={project.id} value={project.id}>
                      {project.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            </FormField>
          ) : null}
          <FormField name="name" label={t("name")} state={state}>
            {(p) => <Input {...p} required maxLength={120} defaultValue={stage?.name} placeholder={t("namePlaceholder")} />}
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField name="startDate" label={t("start")} state={state}>
              {(p) => <Input {...p} type="date" defaultValue={stage?.start ? day(stage.start) : undefined} placeholder="yyyy-mm-dd" />}
            </FormField>
            <FormField name="endDate" label={t("end")} state={state}>
              {(p) => <Input {...p} type="date" defaultValue={stage?.end ? day(stage.end) : undefined} placeholder="yyyy-mm-dd" />}
            </FormField>
          </div>
        </FieldGroup>
      )}
    </ActionDialog>
  )
}

/** Up / down buttons: send the whole new order (reorderStagesAction). */
function MoveStage({ projectId, stageId, order }: { projectId: string; stageId: string; order: string[] }) {
  const t = useTranslations("forms.stage")
  const [pending, startTransition] = React.useTransition()
  const index = order.indexOf(stageId)

  function move(delta: -1 | 1) {
    const next = [...order]
    next.splice(index, 1)
    next.splice(index + delta, 0, stageId)
    startTransition(async () => {
      const r = await reorderStagesAction({ projectId, stageIds: next })
      if (r.status === "error") toast.add({ title: r.message, timeout: 4000 })
    })
  }

  return (
    <>
      <Button type="button" variant="outline" size="icon-32" aria-label={t("moveUp")} disabled={pending || index <= 0} onClick={() => move(-1)}>
        <ButtonIcon src="/icons/material-expand-less.svg" />
      </Button>
      <Button type="button" variant="outline" size="icon-32" aria-label={t("moveDown")} disabled={pending || index === order.length - 1} onClick={() => move(1)}>
        <ButtonIcon src="/icons/material-expand-more.svg" />
      </Button>
    </>
  )
}

function DeleteStageButton({ stageId, onDeleted }: { stageId: string; onDeleted: () => void }) {
  const t = useTranslations("forms.stage")

  return (
    <ActionDialog
      trigger={
        <Button type="button" variant="danger-soft" size="32">
          {t("delete")}
        </Button>
      }
      title={t("deleteTitle")}
      description={t("deleteDescription")}
      action={deleteStageAction}
      submitLabel={t("delete")}
      submitVariant="danger"
      successMessage={t("deleted")}
      onSuccess={onDeleted}
      hidden={{ stageId }}
    />
  )
}

export { StageFormDialog, type StageValues }
