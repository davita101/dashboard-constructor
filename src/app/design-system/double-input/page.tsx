import { DoubleInput, type DoubleInputLayout } from "@/components/ui/double-input"
import { Field, FieldDescription, FieldHeader, FieldHint, FieldLabel, FieldLabelIcon } from "@/components/ui/field"
import type { InputShape, InputSize, InputStatus } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupIcon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

// Mirrors the Figma Forms: Double Inputs page (11956:50138).

const sizes = ["60", "48", "40", "32", "24"] as const satisfies InputSize[]
const joinedStates = ["default", "filled", "active", "success", "error", "disabled"] as const
const splitStates = ["default", "filled", "active 1", "active 2", "error", "success", "disabled"] as const
type State = (typeof joinedStates)[number] | (typeof splitStates)[number]

type Row = { status: InputStatus; filled: boolean; invalid: boolean; disabled: boolean }

// Joined sets state only the first input (Figma): the second stays Default, the helper text stays gray.
// Horizontal / Vertical sets state both inputs, except Active 1 / Active 2 (one focused input).
function rows(layout: DoubleInputLayout, state: State): [Row, Row] {
  const base: Row = { status: "default", filled: false, invalid: false, disabled: state === "disabled" }
  const stated: Row = {
    ...base,
    status: state === "success" ? "success" : state.startsWith("active") ? "active" : "default",
    filled: state !== "default" && state !== "disabled",
    invalid: state === "error",
  }
  if (layout === "joined") return [stated, base]
  if (state === "active 1") return [stated, base]
  if (state === "active 2") return [base, stated]
  return [stated, stated]
}

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

function DoubleField({
  layout,
  shape,
  size,
  state,
}: {
  layout: DoubleInputLayout
  shape: InputShape
  size: InputSize
  state: State
}) {
  const id = `double-${layout}-${shape}-${size}-${state.replace(" ", "-")}`
  const split = layout !== "joined"
  return (
    <Field
      size={size}
      shape={shape}
      className="w-75 shrink-0"
      data-invalid={(split && state === "error") || undefined}
      data-success={(split && state === "success") || undefined}
      data-disabled={state === "disabled" || undefined}
    >
      <FieldHeader>
        <FieldLabel htmlFor={`${id}-1`}>
          Label
          <FieldLabelIcon />
        </FieldLabel>
        <FieldHint>Add Text</FieldHint>
      </FieldHeader>
      <DoubleInput layout={layout} size={size} aria-label="Label">
        {rows(layout, state).map((row, i) => (
          <InputGroup key={i} size={size} shape={shape} status={row.status}>
            {!split && (
              <InputGroupAddon>
                <InputGroupIcon src="/icons/material-default-icon.svg" />
              </InputGroupAddon>
            )}
            <InputGroupInput
              id={`${id}-${i + 1}`}
              placeholder="Text"
              aria-label={i === 0 ? undefined : "Second value"}
              defaultValue={row.filled ? "Text" : undefined}
              aria-invalid={row.invalid || undefined}
              disabled={row.disabled}
            />
            <InputGroupAddon align="inline-end">
              {!split && <InputGroupText>Text</InputGroupText>}
              {!split && <InputGroupIcon src="/icons/material-default-icon.svg" />}
              <InputGroupIcon src="/icons/material-unfold-more.svg" />
            </InputGroupAddon>
          </InputGroup>
        ))}
      </DoubleInput>
      <FieldDescription>Add Text Bottom</FieldDescription>
    </Field>
  )
}

function StateMatrix({ layout, shape }: { layout: DoubleInputLayout; shape: InputShape }) {
  const states = layout === "joined" ? joinedStates : splitStates
  return (
    <div className="flex flex-col gap-10 overflow-x-auto pb-2">
      {states.map((state) => (
        <div key={state} className="flex flex-col gap-3">
          <Caption>{state}</Caption>
          <div className="flex items-start gap-10">
            {sizes.map((size) => (
              <DoubleField key={size} layout={layout} shape={shape} size={size} state={state} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DoubleInputPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Input-Double-Rounded / Input-Double-Pilled (joined; Figma draws both the same)">
        <StateMatrix layout="joined" shape="rounded" />
      </Section>
      {(["rounded", "pill"] as const).map((shape) => (
        <Section key={`h-${shape}`} title={`Input-Horizontal-Double-${shape === "pill" ? "Pilled" : "Rounded"}`}>
          <StateMatrix layout="horizontal" shape={shape} />
        </Section>
      ))}
      {(["rounded", "pill"] as const).map((shape) => (
        <Section key={`v-${shape}`} title={`Input-Vertical-Double-${shape === "pill" ? "Pilled" : "Rounded"}`}>
          <StateMatrix layout="vertical" shape={shape} />
        </Section>
      ))}
    </main>
  )
}
