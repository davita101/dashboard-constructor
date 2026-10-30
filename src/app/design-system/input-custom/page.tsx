import Image from "next/image"

import {
  Field,
  FieldDescription,
  FieldHeader,
  FieldHint,
  FieldLabel,
  FieldLabelIcon,
} from "@/components/ui/field"
import type { InputShape, InputSize } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupIcon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

// Mirrors the Figma Forms: Inputs Custom page (12509:89789): Input-Rounded-White (12509:89791),
// Input-Rounded-Black (12513:173072), Input-Pilled-White (12509:91203), Input-Pilled-Black (12518:181280).
// Glass inputs: InputGroup tone="white" | "black" inside a Field tone="glass".

const sizes = ["60", "48", "40", "32", "24"] as const satisfies InputSize[]
const states = ["default", "filled", "active", "error", "success", "disabled"] as const
type State = (typeof states)[number]
type Tone = "white" | "black"

const sets: { title: string; shape: InputShape; tone: Tone }[] = [
  { title: "Input-Rounded-White", shape: "rounded", tone: "white" },
  { title: "Input-Rounded-Black", shape: "rounded", tone: "black" },
  { title: "Input-Pilled-White", shape: "pill", tone: "white" },
  { title: "Input-Pilled-Black", shape: "pill", tone: "black" },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

/** Showcase backdrop, like the Figma set frame (black 60%). Not part of the component. */
function Surface({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-r40 bg-black-alpha-60 p-10">{children}</div>
}

function StateField({ shape, tone, size, state }: { shape: InputShape; tone: Tone; size: InputSize; state: State }) {
  const id = `input-custom-${tone}-${shape}-${size}-${state}`
  return (
    <Field
      size={size}
      shape={shape}
      tone="glass"
      className="w-75 shrink-0"
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
      <InputGroup
        size={size}
        shape={shape}
        tone={tone}
        status={state === "success" ? "success" : state === "active" ? "active" : "default"}
      >
        <InputGroupInput
          id={id}
          placeholder="Text"
          defaultValue={state === "default" || state === "disabled" ? undefined : "Text"}
          aria-invalid={state === "error" || undefined}
          disabled={state === "disabled"}
        />
      </InputGroup>
      <FieldDescription>Add Text Bottom</FieldDescription>
    </Field>
  )
}

function StateMatrix({ shape, tone }: { shape: InputShape; tone: Tone }) {
  return (
    <Surface>
      <div className="flex flex-col gap-10">
        {states.map((state) => (
          <div key={state} className="flex items-start gap-10">
            {sizes.map((size) => (
              <StateField key={size} shape={shape} tone={tone} size={size} state={state} />
            ))}
          </div>
        ))}
      </div>
    </Surface>
  )
}

export default function InputCustomPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      {sets.map((set) => (
        <Section key={set.title} title={`${set.title} (rows: default, filled, active, error, success, disabled)`}>
          <StateMatrix shape={set.shape} tone={set.tone} />
        </Section>
      ))}

      <Section title="Over a photo: try focus and typing">
        <div className="relative isolate overflow-hidden rounded-r40 p-10">
          <Image src="/images/banners/banner-1.png" alt="" fill sizes="100vw" className="-z-10 object-cover" />
          <div className="flex flex-wrap items-start gap-10">
            {(["white", "black"] as const).map((tone) =>
              (["rounded", "pill"] as const).map((shape) => (
                <Field key={`${tone}-${shape}`} size="48" shape={shape} tone="glass" className="w-75">
                  <FieldHeader>
                    <FieldLabel htmlFor={`photo-${tone}-${shape}`}>
                      Email
                      <FieldLabelIcon />
                    </FieldLabel>
                    <FieldHint>Optional</FieldHint>
                  </FieldHeader>
                  <InputGroup size="48" shape={shape} tone={tone}>
                    <InputGroupAddon>
                      <InputGroupIcon src="/icons/material-default-icon.svg" />
                    </InputGroupAddon>
                    <InputGroupInput id={`photo-${tone}-${shape}`} type="email" placeholder="you@example.com" />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>Add Text</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>{tone === "white" ? "White glass" : "Black glass"}</FieldDescription>
                </Field>
              ))
            )}
          </div>
        </div>
      </Section>
    </main>
  )
}
