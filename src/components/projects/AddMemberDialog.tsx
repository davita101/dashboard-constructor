"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { ActionDialog } from "@/components/projects/ActionDialog"
import { FormField } from "@/components/projects/FormField"
import { FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { addMemberAction } from "@/lib/projects/actions"

/** Quick Add "Member": pick a project, invite someone who signed up by email. */
function AddMemberDialog({ trigger, projects }: { trigger: React.ReactElement; projects: { id: string; name: string }[] }) {
  const t = useTranslations("forms.members")

  return (
    <ActionDialog
      trigger={trigger}
      icon="/icons/material/material-person-add.svg"
      title={t("addTitle")}
      description={t("description")}
      action={addMemberAction}
      submitLabel={t("add")}
      successMessage={t("added")}
    >
      {(state) => (
        <FieldGroup>
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
          <FormField name="email" label={t("email")} state={state}>
            {(p) => <Input {...p} type="email" required autoComplete="off" placeholder={t("emailPlaceholder")} />}
          </FormField>
          <FormField name="role" label={t("role")} state={state}>
            {(p) => <Input {...p} maxLength={80} placeholder={t("rolePlaceholder")} />}
          </FormField>
        </FieldGroup>
      )}
    </ActionDialog>
  )
}

export { AddMemberDialog }
