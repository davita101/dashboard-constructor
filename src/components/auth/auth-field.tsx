"use client"

import * as React from "react"

import { Field, FieldDescription, FieldHeader, FieldLabel, FieldLabelIcon } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupIcon, InputGroupInput } from "@/components/ui/input-group"

// One Input-Pilled of the Figma auth templates: Field (label + help icon) over a pill InputGroup with a
// left icon and, for passwords, the eye toggle on the right.
function AuthField({
  label,
  icon,
  type = "text",
  placeholder,
  description,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  label: string
  icon: string
  description?: string
}) {
  const id = React.useId()
  const password = type === "password"
  const [visible, setVisible] = React.useState(false)

  return (
    <Field size="40" shape="pill">
      <FieldHeader>
        <FieldLabel htmlFor={id}>
          {label}
          <FieldLabelIcon />
        </FieldLabel>
      </FieldHeader>
      <InputGroup size="40" shape="pill">
        <InputGroupAddon>
          <InputGroupIcon src={icon} />
        </InputGroupAddon>
        <InputGroupInput id={id} type={password && visible ? "text" : type} placeholder={placeholder} {...props} />
        {password && (
          <InputGroupAddon align="inline-end">
            <button
              type="button"
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              onClick={() => setVisible((v) => !v)}
              className="flex cursor-pointer items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-primary-alpha-30"
            >
              <InputGroupIcon src="/icons/material-remove-red-eye.svg" />
            </button>
          </InputGroupAddon>
        )}
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

export { AuthField }
