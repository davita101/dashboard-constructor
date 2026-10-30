"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { OTPInput, OTPInputContext } from "input-otp"

import { Field } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Figma Forms: Input OTP (9402:26500): slot set Input-OTP-Component (9480:4753, Size × State)
// and composite Input-OTP (9483:1476: Top label + 6 slots + Bottom text).
// Slots are separate boxes 8px apart (not shadcn's joined border). Size keys match Input.

const inputOTPSlotVariants = cva(
  "relative flex shrink-0 items-center justify-center bg-(--otp-bg) font-default font-semibold tracking-default text-(--otp-fg) shadow-[0_0_0_4px_var(--otp-ring)] outline outline-(--otp-stroke) -outline-offset-1 transition-[outline-color,box-shadow,color] [--otp-bg:var(--background-0)] [--otp-fg:var(--base-900)] [--otp-ring:transparent] [--otp-stroke:var(--base-100)]",
  {
    variants: {
      size: {
        "60": "h-15 w-13 rounded-r16 text-16 leading-24 [--otp-caret:--spacing(5)]",
        "48": "h-12 w-10 rounded-r12 text-14 leading-24 [--otp-caret:--spacing(4)]",
        "40": "h-10 w-9 rounded-r8 text-12 leading-20 [--otp-caret:--spacing(4)]",
      },
      // Figma State. The ring is 4px OUTSIDE the slot at 20% (Active / Error / Succes).
      state: {
        default: "[--otp-fg:var(--base-600)]",
        filled: "[--otp-stroke:var(--base-150)]",
        active: "[--otp-ring:var(--base-alpha-20)] [--otp-stroke:var(--base-200)]",
        error: "[--otp-fg:var(--danger-600)] [--otp-ring:var(--danger-alpha-20)] [--otp-stroke:var(--danger-600)]",
        success: "[--otp-fg:var(--success-600)] [--otp-ring:var(--success-alpha-20)] [--otp-stroke:var(--success-600)]",
        disabled: "cursor-not-allowed [--otp-bg:var(--background-20)] [--otp-fg:var(--base-600)] [--otp-stroke:var(--base-100)]",
      },
    },
    defaultVariants: {
      size: "40",
      state: "default",
    },
  }
)

type InputOTPSize = NonNullable<VariantProps<typeof inputOTPSlotVariants>["size"]>
type InputOTPSlotState = NonNullable<VariantProps<typeof inputOTPSlotVariants>["state"]>
type InputOTPStatus = "default" | "success"

// OTPInput props are a union (render | children); omit the native numeric `size` from each member.
type OTPInputProps = React.ComponentProps<typeof OTPInput>
type OTPInputPropsWithoutSize = OTPInputProps extends infer P ? (P extends unknown ? Omit<P, "size"> : never) : never

type InputOTPStyle = {
  size: InputOTPSize
  status: InputOTPStatus
  invalid: boolean
  disabled: boolean
}

const InputOTPStyleContext = React.createContext<InputOTPStyle>({
  size: "40",
  status: "default",
  invalid: false,
  disabled: false,
})

/**
 * Figma Content row. `size` drives every slot; `aria-invalid` = Error, `status="success"` = Succes,
 * `disabled` = Disabled. Priority: Disabled > Error > Success > Active > Filled > Default.
 */
function InputOTP({
  className,
  containerClassName,
  size = "40",
  status = "default",
  value,
  defaultValue,
  onChange,
  ...props
}: OTPInputPropsWithoutSize & {
  containerClassName?: string
  size?: InputOTPSize
  status?: InputOTPStatus
}) {
  // input-otp forwards defaultValue to its controlled <input> (React warns), so keep it here.
  const [uncontrolled, setUncontrolled] = React.useState(typeof defaultValue === "string" ? defaultValue : "")
  const controlled = value !== undefined
  const handleChange = React.useCallback(
    (next: string) => {
      if (!controlled) setUncontrolled(next)
      onChange?.(next)
    },
    [controlled, onChange]
  )
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"
  const disabled = !!props.disabled
  const style = React.useMemo(() => ({ size, status, invalid, disabled }), [size, status, invalid, disabled])

  return (
    <InputOTPStyleContext.Provider value={style}>
      <OTPInput
        data-slot="input-otp"
        containerClassName={cn("flex items-center gap-2 has-disabled:cursor-not-allowed", containerClassName)}
        spellCheck={false}
        className={cn("disabled:cursor-not-allowed", className)}
        value={controlled ? value : uncontrolled}
        onChange={handleChange}
        {...props}
      />
    </InputOTPStyleContext.Provider>
  )
}

/** Holds the slots, 8px apart at every size (Figma: one group of 6). */
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center gap-2", className)} {...props} />
}

/** Figma Input-OTP-Component. `state` pins a Figma state (previews); otherwise it follows the input. */
function InputOTPSlot({
  index,
  state,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
  state?: InputOTPSlotState
}) {
  const otp = React.useContext(OTPInputContext)
  const { size, status, invalid, disabled } = React.useContext(InputOTPStyleContext)
  const { char, placeholderChar, hasFakeCaret, isActive } = otp?.slots[index] ?? {}

  let resolved: InputOTPSlotState = "default"
  if (state) resolved = state
  else if (disabled) resolved = "disabled"
  else if (invalid) resolved = "error"
  else if (status === "success") resolved = "success"
  else if (isActive) resolved = "active"
  else if (char) resolved = "filled"
  const showCaret = state === "active" ? !char : !!hasFakeCaret && !disabled

  return (
    <div
      data-slot="input-otp-slot"
      data-size={size}
      data-state={resolved}
      data-active={isActive || undefined}
      className={cn(inputOTPSlotVariants({ size, state: resolved }), className)}
      {...props}
    >
      {char ?? placeholderChar}
      {showCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-(--otp-caret) w-px animate-caret-blink bg-base-900 duration-1000" />
        </div>
      )}
    </div>
  )
}

/** Not in Figma (kept for shadcn API parity): a short Separator between groups. */
function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" className={cn("flex w-3 items-center", className)} {...props}>
      <Separator />
    </div>
  )
}

/**
 * Figma Input-OTP Top / Bottom wrapper: a Field with OTP typography at every size
 * (label 12/20 bold + 16px help icon 8px away, bottom 11/20 base-500, gap 12, labels flush left).
 * fieldVariants is unchanged; data-invalid / data-success / data-disabled work as on Field.
 */
function InputOTPField({ className, ...props }: Omit<React.ComponentProps<typeof Field>, "size" | "shape">) {
  return (
    <Field
      size="48"
      data-slot="input-otp-field"
      className={cn(
        "w-fit [--field-px:0] [&_[data-slot=field-description]]:text-11 [&_[data-slot=field-error]]:text-11 not-data-[invalid=true]:not-data-[success=true]:[&_[data-slot=field-description]]:text-base-500",
        className
      )}
      {...props}
    />
  )
}

export {
  InputOTP,
  InputOTPField,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  inputOTPSlotVariants,
  type InputOTPSize,
  type InputOTPSlotState,
  type InputOTPStatus,
}
