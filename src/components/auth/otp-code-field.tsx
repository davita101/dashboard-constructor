import * as React from "react"

import { FieldDescription, FieldHeader, FieldLabel, FieldLabelIcon } from "@/components/ui/field"
import { InputOTP, InputOTPField, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

// Figma Input-OTP composite used by Two-factor Authentication and Activation: label, 6 slots of size 48
// and optional bottom text. `pinActive` pins the Figma "Active" look on the second slot (previews only).
function OtpCodeField({ label, description, pinActive }: { label: string; description?: string; pinActive?: boolean }) {
  const id = React.useId()
  return (
    <InputOTPField className="w-full">
      <FieldHeader>
        <FieldLabel htmlFor={id}>
          {label}
          <FieldLabelIcon />
        </FieldLabel>
      </FieldHeader>
      <InputOTP id={id} maxLength={6} size="48" defaultValue="1">
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot key={i} index={i} state={pinActive && i === 1 ? "active" : undefined} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {description && <FieldDescription>{description}</FieldDescription>}
    </InputOTPField>
  )
}

export { OtpCodeField }
