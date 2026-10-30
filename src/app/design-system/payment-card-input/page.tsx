import { DoubleInput } from "@/components/ui/double-input"
import { Field, FieldDescription, FieldHeader, FieldHint, FieldLabel, FieldLabelIcon } from "@/components/ui/field"
import type { InputShape, InputSize, InputStatus } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupJoin } from "@/components/ui/input-group"
import { PaymentCardBrand, type PaymentCardBrandShape } from "@/components/ui/payment-card-brand"

// Mirrors the Figma Forms: Payment Card Input page (12008:2462):
// Input-Payment-Rounded (11999:48375) and Input-Payment-Pilled (12012:1345).
// Both sets draw the same box; only the brand tile changes shape.

const sizes = ["60", "48", "40", "32", "24"] as const satisfies InputSize[]
const states = ["default", "filled", "active", "success", "error", "disabled"] as const
type State = (typeof states)[number]

// Figma puts the ring and the colored text on the card number row only; the three cells below
// keep the plain stroke in every state except Disabled.
const cells = [
  { label: "Expiry date", placeholder: "00 / 00", value: "12 / 26" },
  { label: "CSV", placeholder: "CSV", value: "123" },
  { label: "Zip code", placeholder: "Zip Code", value: "10001" },
]

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

// Figma's Pilled set draws the same box as the Rounded one (size radius, size padding); only the
// brand tile is pilled. So the inputs always run shape="rounded" and only the tile takes the shape.
function PaymentField({ brandShape, size, state }: { brandShape: PaymentCardBrandShape; size: InputSize; state: State }) {
  const id = `payment-${brandShape}-${size}-${state}`
  const shape: InputShape = "rounded"
  const filled = state !== "default" && state !== "disabled"
  const disabled = state === "disabled"
  const invalid = state === "error"
  const status: InputStatus = state === "success" ? "success" : state === "active" ? "active" : "default"
  return (
    <Field
      size={size}
      shape={shape}
      className={size === "24" ? "w-50 shrink-0" : "w-75 shrink-0"}
      data-invalid={invalid || undefined}
      data-success={(state === "success") || undefined}
      data-disabled={disabled || undefined}
    >
      <FieldHeader>
        <FieldLabel htmlFor={`${id}-number`}>
          Label
          <FieldLabelIcon />
        </FieldLabel>
        <FieldHint>Add Text</FieldHint>
      </FieldHeader>
      <DoubleInput layout="joined" size={size} aria-label="Payment card">
        <InputGroup size={size} shape={shape} status={status}>
          <InputGroupInput
            id={`${id}-number`}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="Card Number"
            defaultValue={filled ? "4242 4242 4242 4242" : undefined}
            aria-invalid={invalid || undefined}
            disabled={disabled}
          />
          <InputGroupAddon align="inline-end">
            <PaymentCardBrand shape={brandShape} size={size} />
          </InputGroupAddon>
        </InputGroup>
        <InputGroupJoin size={size} shape={shape}>
          {cells.map((cell) => (
            <InputGroup key={cell.label}>
              <InputGroupInput
                id={`${id}-${cell.label.replace(" ", "-")}`}
                inputMode="numeric"
                aria-label={cell.label}
                placeholder={cell.placeholder}
                defaultValue={filled ? cell.value : undefined}
                disabled={disabled}
              />
            </InputGroup>
          ))}
        </InputGroupJoin>
      </DoubleInput>
      <FieldDescription>Add Text Bottom</FieldDescription>
    </Field>
  )
}

function StateMatrix({ brandShape }: { brandShape: PaymentCardBrandShape }) {
  return (
    <div className="flex flex-col gap-10 overflow-x-auto pb-2">
      {states.map((state) => (
        <div key={state} className="flex flex-col gap-3">
          <Caption>{state}</Caption>
          <div className="flex items-start gap-10">
            {sizes.map((size) => (
              <PaymentField key={size} brandShape={brandShape} size={size} state={state} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PaymentCardInputPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Input-Payment-Rounded (11999:48375)">
        <StateMatrix brandShape="rounded" />
      </Section>
      <Section title="Input-Payment-Pilled (12012:1345) — pilled brand tile">
        <StateMatrix brandShape="pilled" />
      </Section>
    </main>
  )
}
