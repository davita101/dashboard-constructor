"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { ActionDialog } from "@/components/projects/ActionDialog"
import { FormField } from "@/components/projects/FormField"
import { FieldGroup } from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { sendProjectMessageAction } from "@/lib/chat/actions"

/** Quick Add "Message": post a message to a project's chat. One project → no picker. */
function SendMessageDialog({ trigger, projects }: { trigger: React.ReactElement; projects: { id: string; name: string }[] }) {
  const t = useTranslations("forms.message")

  return (
    <ActionDialog
      trigger={trigger}
      icon="/icons/material/material-message.svg"
      title={t("title")}
      description={t("description")}
      action={sendProjectMessageAction}
      submitLabel={t("send")}
      successMessage={t("sent")}
    >
      {(state) => (
        <FieldGroup>
          {projects.length === 1 ? (
            <input type="hidden" name="projectId" value={projects[0].id} />
          ) : (
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
          )}
          <FormField name="body" label={t("body")} state={state}>
            {(p) => <Textarea {...p} required maxLength={4000} placeholder={t("bodyPlaceholder")} />}
          </FormField>
        </FieldGroup>
      )}
    </ActionDialog>
  )
}

export { SendMessageDialog }
