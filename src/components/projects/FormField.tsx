"use client"

import * as React from "react"

import { Field, FieldError, FieldHeader, FieldLabel } from "@/components/ui/field"
import type { ActionState } from "@/lib/projects/action-state"

/**
 * One labelled control in an ActionDialog form. `children` gets the control props (id, name, aria-invalid)
 * so the error from the Server Action lands on the right input.
 */
function FormField({
  name,
  label,
  state,
  children,
}: {
  name: string
  label: string
  state: ActionState
  children: (control: { id: string; name: string; "aria-invalid"?: true }) => React.ReactNode
}) {
  const id = `${React.useId()}-${name}`
  const error = state.fieldErrors?.[name]?.[0]

  return (
    <Field size="40" data-invalid={error ? true : undefined}>
      <FieldHeader>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      </FieldHeader>
      {children({ id, name, "aria-invalid": error ? true : undefined })}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}

export { FormField }
