"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { ActionDialog } from "@/components/projects/ActionDialog"
import { FormField } from "@/components/projects/FormField"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { FileUpload } from "@/components/ui/file-upload"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LOGO_TYPES } from "@/lib/files/paths"
import type { ActionState } from "@/lib/projects/action-state"
import { createProjectAction, deleteProjectAction, updateProjectAction } from "@/lib/projects/actions"

export type ProjectFormValues = {
  projectId: string
  name: string
  clientName: string
  clientDescription: string
  /** yyyy-mm-dd or "". */
  deadline: string
  income: number
  cost: number
}

/** Create (no `values`) or edit a project. Edit adds a Delete button with its own confirm dialog. */
function ProjectFormDialog({ trigger, values }: { trigger: React.ReactElement; values?: ProjectFormValues }) {
  const t = useTranslations("forms.project")
  const editing = Boolean(values)

  return (
    <ActionDialog
      trigger={trigger}
      icon="/icons/material/material-assignment.svg"
      title={t(editing ? "editTitle" : "createTitle")}
      description={t(editing ? "editDescription" : "createDescription")}
      action={editing ? updateProjectAction : createProjectAction}
      submitLabel={t(editing ? "save" : "create")}
      successMessage={editing ? t("saved") : undefined}
      hidden={values ? { projectId: values.projectId } : undefined}
      extraActions={values ? <DeleteProjectDialog projectId={values.projectId} name={values.name} /> : null}
    >
      {(state) => (
        <FieldGroup>
          <FormField name="name" label={t("name")} state={state}>
            {(p) => <Input {...p} required maxLength={120} defaultValue={values?.name} placeholder={t("namePlaceholder")} />}
          </FormField>
          <FormField name="clientName" label={t("client")} state={state}>
            {(p) => <Input {...p} maxLength={120} defaultValue={values?.clientName} placeholder={t("clientPlaceholder")} />}
          </FormField>
          <FormField name="clientDescription" label={t("clientDescription")} state={state}>
            {(p) => <Textarea {...p} maxLength={500} defaultValue={values?.clientDescription} placeholder={t("clientDescriptionPlaceholder")} />}
          </FormField>
          <FormField name="deadline" label={t("deadline")} state={state}>
            {(p) => <Input {...p} type="date" defaultValue={values?.deadline} placeholder="yyyy-mm-dd" />}
          </FormField>
          <LogoField name="logo" label={t("logo")} state={state} />
          <LogoField name="clientLogo" label={t("clientLogo")} state={state} />
          <div className="grid grid-cols-2 gap-3">
            <FormField name="income" label={t("income")} state={state}>
              {(p) => <Input {...p} type="number" min={0} step={1} inputMode="numeric" defaultValue={values?.income ?? ""} placeholder="0" />}
            </FormField>
            <FormField name="cost" label={t("cost")} state={state}>
              {(p) => <Input {...p} type="number" min={0} step={1} inputMode="numeric" defaultValue={values?.cost ?? ""} placeholder="0" />}
            </FormField>
          </div>
        </FieldGroup>
      )}
    </ActionDialog>
  )
}

/** Optional logo upload (Figma Form-Upload-Files-Images); the picked file name replaces the hint. */
function LogoField({ name, label, state }: { name: "logo" | "clientLogo"; label: string; state: ActionState }) {
  const t = useTranslations("forms.project")
  const [picked, setPicked] = React.useState<string>()

  return (
    <FormField name={name} label={label} state={state}>
      {(p) => (
        <FileUpload
          {...p}
          kind="images"
          accept={Object.keys(LOGO_TYPES).join(",")}
          hint={picked ? t("logoChosen", { name: picked }) : t("logoHint")}
          onFilesChange={(files) => setPicked(files[0]?.name)}
        />
      )}
    </FormField>
  )
}

function DeleteProjectDialog({ projectId, name }: { projectId: string; name: string }) {
  const t = useTranslations("forms.project")

  return (
    <ActionDialog
      trigger={
        <Button type="button" variant="danger-soft" size="32">
          {t("delete")}
        </Button>
      }
      icon="/icons/material-close.svg"
      title={t("deleteTitle", { name })}
      description={t("deleteDescription")}
      action={deleteProjectAction}
      submitLabel={t("delete")}
      submitVariant="danger"
      hidden={{ projectId }}
    />
  )
}

export { ProjectFormDialog }
