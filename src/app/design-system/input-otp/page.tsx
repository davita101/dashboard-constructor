import {
  FieldDescription,
  FieldError,
  FieldHeader,
  FieldLabel,
  FieldLabelIcon,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPField,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  type InputOTPSize,
  type InputOTPSlotState,
} from "@/components/ui/input-otp"

// Mirrors the Figma Forms: Input OTP page (9402:26500): Input-OTP-Component (9480:4753) and Input-OTP (9483:1476).

const sizes = ["60", "48", "40"] as const satisfies InputOTPSize[]
const sizeLabel: Record<InputOTPSize, string> = { "60": "Extra Large (60)", "48": "Large (48)", "40": "Default (40)" }
const states = ["default", "filled", "active", "error", "success", "disabled"] as const satisfies InputOTPSlotState[]
const slots = [0, 1, 2, 3, 4, 5]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="font-default text-11 leading-20 font-semibold text-base-500 capitalize">{children}</span>
}

/** One Figma Input-OTP-Component, pinned to a state through the real input state where possible. */
function StateSlot({ size, state }: { size: InputOTPSize; state: (typeof states)[number] }) {
  const value = state === "default" || state === "active" || state === "disabled" ? undefined : "1"
  return (
    <InputOTP
      maxLength={1}
      size={size}
      defaultValue={value}
      aria-label={`${sizeLabel[size]} ${state}`}
      aria-invalid={state === "error" || undefined}
      status={state === "success" ? "success" : "default"}
      disabled={state === "disabled"}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} state={state === "active" ? "active" : undefined} />
      </InputOTPGroup>
    </InputOTP>
  )
}

type CompositeState = "figma" | "error" | "success" | "disabled"

/** Figma Input-OTP: Top label + 6 slots + Bottom text. "figma" = slot 1 Filled, slot 2 Active, rest Default. */
function Composite({ size, state = "figma", id }: { size: InputOTPSize; state?: CompositeState; id: string }) {
  return (
    <InputOTPField
      data-invalid={state === "error" || undefined}
      data-success={state === "success" || undefined}
      data-disabled={state === "disabled" || undefined}
    >
      <FieldHeader>
        <FieldLabel htmlFor={id}>
          Label
          <FieldLabelIcon />
        </FieldLabel>
      </FieldHeader>
      <InputOTP
        id={id}
        maxLength={6}
        size={size}
        defaultValue={state === "disabled" ? undefined : state === "figma" ? "1" : "123456"}
        aria-invalid={state === "error" || undefined}
        status={state === "success" ? "success" : "default"}
        disabled={state === "disabled"}
      >
        <InputOTPGroup>
          {slots.map((i) => (
            <InputOTPSlot key={i} index={i} state={state === "figma" && i === 1 ? "active" : undefined} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {state === "error" ? <FieldError>Wrong code</FieldError> : <FieldDescription>Text Bottom</FieldDescription>}
    </InputOTPField>
  )
}

export default function InputOTPPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Input-OTP (Figma composite)">
        <div className="flex flex-col gap-10">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col gap-3">
              <Caption>{sizeLabel[size]}</Caption>
              <Composite size={size} id={`otp-figma-${size}`} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Input-OTP-Component (Size × State)">
        <div className="flex flex-col gap-6 overflow-x-auto pb-2">
          <div className="flex items-center gap-10">
            <span className="w-28 shrink-0" />
            {states.map((state) => (
              <span key={state} className="w-16 shrink-0">
                <Caption>{state}</Caption>
              </span>
            ))}
          </div>
          {sizes.map((size) => (
            <div key={size} className="flex items-center gap-10">
              <span className="w-28 shrink-0">
                <Caption>{sizeLabel[size]}</Caption>
              </span>
              {states.map((state) => (
                <span key={state} className="flex w-16 shrink-0">
                  <StateSlot size={size} state={state} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Composite states (Error / Success / Disabled)">
        <div className="flex flex-col gap-10">
          {sizes.map((size) => (
            <div key={size} className="flex flex-wrap items-start gap-10">
              {(["error", "success", "disabled"] as const).map((state) => (
                <div key={state} className="flex flex-col gap-3">
                  <Caption>
                    {sizeLabel[size]} · {state}
                  </Caption>
                  <Composite size={size} state={state} id={`otp-${state}-${size}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interactive (type a code)">
        <div className="flex flex-wrap items-start gap-10">
          {sizes.map((size) => (
            <InputOTPField key={size}>
              <FieldHeader>
                <FieldLabel htmlFor={`otp-live-${size}`}>
                  Verification code
                  <FieldLabelIcon />
                </FieldLabel>
              </FieldHeader>
              <InputOTP id={`otp-live-${size}`} maxLength={6} size={size}>
                <InputOTPGroup>
                  {slots.map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>{sizeLabel[size]}</FieldDescription>
            </InputOTPField>
          ))}
        </div>
      </Section>

      <Section title="With separator (not in Figma)">
        <InputOTP maxLength={6} size="48" aria-label="Code with separator">
          <InputOTPGroup>
            {slots.slice(0, 3).map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            {slots.slice(3).map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </Section>
    </main>
  )
}
