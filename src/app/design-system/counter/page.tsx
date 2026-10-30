import { Counter, type CounterShape, type CounterSize } from "@/components/ui/counter"
import {
  Field,
  FieldDescription,
  FieldHeader,
  FieldHint,
  FieldLabel,
  FieldLabelIcon,
} from "@/components/ui/field"

// Mirrors the Figma Forms: Counter page (9402:27553): Counter-Button (9440:765),
// Counter-Input-Pilled (15848:89546) and Counter-Input-Rounded (15893:566329).

const sizes = ["60", "48", "40", "32", "24"] as const satisfies CounterSize[]
const sizeLabel: Record<CounterSize, string> = {
  "60": "Extra Large (60)",
  "48": "Large (48)",
  "40": "Default (40)",
  "32": "Small (32)",
  "24": "Micro (24)",
}
const shapes = [
  { shape: "pill", label: "Pilled" },
  { shape: "rounded", label: "Rounded" },
] as const satisfies { shape: CounterShape; label: string }[]

const buttonStates = ["default", "hover-decrement", "hover-increment", "disabled"] as const
const buttonStateLabel: Record<(typeof buttonStates)[number], string> = {
  default: "Default",
  "hover-decrement": "Hover Remove",
  "hover-increment": "Hover Add",
  disabled: "Disabled",
}
// Figma shows "0" with both buttons enabled, so the matrices lift the default min (0) out of the way.
const matrixMin = -999

const inputStates = ["default", "filled", "active", "error", "success", "disabled"] as const
type InputState = (typeof inputStates)[number]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="font-default text-11 leading-20 font-semibold text-base-500">{children}</span>
}

function ButtonMatrix() {
  return (
    <div className="flex flex-col gap-10 overflow-x-auto pb-2">
      {buttonStates.map((state) => (
        <div key={state} className="flex flex-col gap-3">
          <Caption>{buttonStateLabel[state]}</Caption>
          <div className="flex items-center gap-10">
            {shapes.map(({ shape, label }) =>
              sizes.map((size) => (
                <Counter
                  key={`${shape}-${size}`}
                  size={size}
                  shape={shape}
                  status={state === "disabled" ? "default" : state}
                  disabled={state === "disabled"}
                  defaultValue={0}
                  min={matrixMin}
                  aria-label={`${label} ${sizeLabel[size]} ${buttonStateLabel[state]}`}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function StateField({ shape, size, state }: { shape: CounterShape; size: CounterSize; state: InputState }) {
  const id = `counter-${shape}-${size}-${state}`
  return (
    <Field
      size={size}
      shape={shape}
      className={shape === "pill" ? "w-60 shrink-0" : "w-75 shrink-0"}
      data-invalid={state === "error" || undefined}
      data-success={state === "success" || undefined}
      data-disabled={state === "disabled" || undefined}
    >
      <FieldHeader>
        <FieldLabel htmlFor={id}>
          Label
          <FieldLabelIcon />
        </FieldLabel>
        <FieldHint>Add Text</FieldHint>
      </FieldHeader>
      <Counter
        id={id}
        appearance="input"
        size={size}
        shape={shape}
        status={state === "filled" || state === "active" || state === "success" ? state : "default"}
        aria-invalid={state === "error" || undefined}
        disabled={state === "disabled"}
        defaultValue={0}
        min={matrixMin}
      />
      <FieldDescription>Add Text Bottom</FieldDescription>
    </Field>
  )
}

function InputMatrix({ shape }: { shape: CounterShape }) {
  return (
    <div className="flex flex-col gap-10 overflow-x-auto pb-2">
      {inputStates.map((state) => (
        <div key={state} className="flex flex-col gap-3">
          <Caption>{state === "default" ? "Default" : state.charAt(0).toUpperCase() + state.slice(1)}</Caption>
          <div className="flex items-start gap-10">
            {sizes.map((size) => (
              <StateField key={size} shape={shape} size={size} state={state} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CounterPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Counter-Button: Size × State × Corner (Pilled 60–24, then Rounded 60–24)">
        <ButtonMatrix />
      </Section>

      <Section title="Counter-Input-Pilled: Size × State">
        <InputMatrix shape="pill" />
      </Section>

      <Section title="Counter-Input-Rounded: Size × State">
        <InputMatrix shape="rounded" />
      </Section>

      <Section title="Limits and interaction">
        <div className="flex flex-wrap items-center gap-10">
          <div className="flex flex-col gap-3">
            <Caption>min 0, max 5, starts at 0 (− disabled)</Caption>
            <Counter size="48" shape="pill" defaultValue={0} max={5} aria-label="Quantity 0 to 5" />
          </div>
          <div className="flex flex-col gap-3">
            <Caption>at max 5 (+ disabled)</Caption>
            <Counter size="48" shape="pill" defaultValue={5} max={5} aria-label="Quantity at max" />
          </div>
          <div className="flex flex-col gap-3">
            <Caption>step 5, three digits</Caption>
            <Counter size="40" defaultValue={120} step={5} aria-label="Step by 5" />
          </div>
          <Field size="40" shape="rounded" className="w-75">
            <FieldHeader>
              <FieldLabel htmlFor="counter-quantity">
                Quantity
                <FieldLabelIcon />
              </FieldLabel>
              <FieldHint>max 10</FieldHint>
            </FieldHeader>
            <Counter id="counter-quantity" appearance="input" size="40" defaultValue={1} min={1} max={10} />
            <FieldDescription>Default turns Filled after a change</FieldDescription>
          </Field>
        </div>
      </Section>
    </main>
  )
}
