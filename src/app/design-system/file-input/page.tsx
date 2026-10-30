import {
  Field,
  FieldDescription,
  FieldHeader,
  FieldHint,
  FieldLabel,
  FieldLabelIcon,
} from "@/components/ui/field"
import { FileInput } from "@/components/ui/file-input"
import type { InputShape, InputSize } from "@/components/ui/input"

// Mirrors the Figma Forms: File Input page (12015:2400): File-Input-Rounded (12015:19184) and
// File-Input-Pilled (12015:25962). Rows are Figma's State (Default, Hover, Active, Disabled),
// columns its Size. Hover / Active are pinned with `status`; pointer and keyboard focus apply them live.

const sizes = ["60", "48", "40", "32", "24"] as const satisfies InputSize[]
const states = ["default", "hover", "active", "disabled"] as const
type State = (typeof states)[number]

const sets: { title: string; shape: InputShape }[] = [
  { title: "File-Input-Rounded", shape: "rounded" },
  { title: "File-Input-Pilled", shape: "pill" },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

/** Showcase backdrop, like the Figma set frame. Not part of the component. */
function Surface({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-r40 bg-background-0 p-10">{children}</div>
}

function StateField({ shape, size, state }: { shape: InputShape; size: InputSize; state: State }) {
  const id = `file-input-${shape}-${size}-${state}`
  return (
    <Field size={size} shape={shape} className="w-75 shrink-0" data-disabled={state === "disabled" || undefined}>
      <FieldHeader>
        <FieldLabel htmlFor={id}>
          Label
          <FieldLabelIcon />
        </FieldLabel>
        <FieldHint>Add Text</FieldHint>
      </FieldHeader>
      <FileInput
        id={id}
        size={size}
        shape={shape}
        status={state === "hover" || state === "active" ? state : "default"}
        disabled={state === "disabled"}
      />
      <FieldDescription>Add Text Bottom</FieldDescription>
    </Field>
  )
}

export default function FileInputPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      {sets.map((set) => (
        <Section key={set.title} title={`${set.title} (rows: default, hover, active, disabled)`}>
          <Surface>
            <div className="flex flex-col gap-10">
              {states.map((state) => (
                <div key={state} className="flex items-start gap-10">
                  {sizes.map((size) => (
                    <StateField key={size} shape={set.shape} size={size} state={state} />
                  ))}
                </div>
              ))}
            </div>
          </Surface>
        </Section>
      ))}

      <Section title="Live: hover, Tab to focus, pick one or several files">
        <Surface>
          <div className="flex flex-wrap items-start gap-10">
            {(["rounded", "pill"] as const).map((shape) => (
              <Field key={shape} size="48" shape={shape} className="w-75">
                <FieldHeader>
                  <FieldLabel htmlFor={`live-${shape}`}>
                    Attachments
                    <FieldLabelIcon />
                  </FieldLabel>
                  <FieldHint>PDF, PNG</FieldHint>
                </FieldHeader>
                <FileInput id={`live-${shape}`} size="48" shape={shape} multiple accept=".pdf,.png" />
                <FieldDescription>Up to 10 MB each</FieldDescription>
              </Field>
            ))}
          </div>
        </Surface>
      </Section>
    </main>
  )
}
