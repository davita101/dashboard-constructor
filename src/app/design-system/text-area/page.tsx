import {
  Field,
  FieldDescription,
  FieldHeader,
  FieldHint,
  FieldLabel,
  FieldLabelIcon,
} from "@/components/ui/field"
import { Textarea, textareaFieldSize, type TextareaShape, type TextareaSize } from "@/components/ui/textarea"

// Mirrors the Figma Forms: Text Area page (8985:334025): Text-Area-Rounded (10461:655695) and Text-Area-Pilled (10926:63289).

const sizes = ["xl", "lg", "default", "sm"] as const satisfies TextareaSize[]
const sizeLabel: Record<TextareaSize, string> = { xl: "Extra Large", lg: "Large", default: "Default", sm: "Small" }
const states = ["default", "filled", "active", "error", "success", "disabled"] as const
type State = (typeof states)[number]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function StateField({ shape, size, state }: { shape: TextareaShape; size: TextareaSize; state: State }) {
  const id = `text-area-${shape}-${size}-${state}`
  return (
    <Field
      size={textareaFieldSize[size]}
      className="w-50 shrink-0"
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
      <Textarea
        id={id}
        size={size}
        shape={shape}
        status={state === "success" ? "success" : state === "active" ? "active" : "default"}
        placeholder="Text Area"
        defaultValue={state === "default" || state === "disabled" ? undefined : "Text Area"}
        aria-invalid={state === "error" || undefined}
        disabled={state === "disabled"}
      />
      <FieldDescription>Add Text Bottom</FieldDescription>
    </Field>
  )
}

function StateMatrix({ shape }: { shape: TextareaShape }) {
  return (
    <div className="flex flex-col gap-10 overflow-x-auto pb-2">
      <div className="flex items-start gap-10">
        {sizes.map((size) => (
          <span key={size} className="w-50 shrink-0 font-default text-11 leading-20 font-semibold text-base-500">
            {sizeLabel[size]}
          </span>
        ))}
      </div>
      {states.map((state) => (
        <div key={state} className="flex flex-col gap-3">
          <span className="font-default text-11 leading-20 font-semibold text-base-500 capitalize">{state}</span>
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

export default function TextAreaPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Text-Area-Rounded">
        <StateMatrix shape="rounded" />
      </Section>

      <Section title="Text-Area-Pilled">
        <StateMatrix shape="pill" />
      </Section>

      <Section title="Textarea (standalone): try focus, typing and resizing">
        <div className="flex flex-col gap-4">
          {(["rounded", "pill"] as const).map((shape) => (
            <div key={shape} className="flex flex-wrap items-start gap-6">
              {sizes.map((size) => (
                <Textarea
                  key={size}
                  size={size}
                  shape={shape}
                  className="w-60"
                  placeholder="Text Area"
                  aria-label={`Text area ${sizeLabel[size]}`}
                />
              ))}
              <Textarea shape={shape} className="w-60" placeholder="Error" aria-label="Error" aria-invalid />
              <Textarea shape={shape} status="success" className="w-60" placeholder="Success" aria-label="Success" />
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
