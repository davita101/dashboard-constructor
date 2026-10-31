import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldHeader,
  FieldHint,
  FieldLabel,
  FieldLabelIcon,
} from "@/components/ui/field"
import { textareaFieldSize } from "@/components/ui/textarea"
import {
  TextareaEditor,
  TextareaEditorAction,
  TextareaEditorActions,
  TextareaEditorFooter,
  TextareaEditorInput,
  TextareaEditorToolbar,
  type TextareaEditorShape,
  type TextareaEditorSize,
} from "@/components/ui/textarea-editor"

// Mirrors the Figma Forms: Text Area Editors page (15267:48550): Textarea-Editor-Rounded/Pilled and Textarea-Footer-Rounded/Pilled.

const sizes = ["xl", "lg", "default", "sm"] as const satisfies TextareaEditorSize[]
const sizeLabel: Record<TextareaEditorSize, string> = { xl: "Extra Large", lg: "Large", default: "Default", sm: "Small" }
const states = ["default", "filled", "active", "error", "success", "disabled"] as const
type State = (typeof states)[number]
type Kind = "editor" | "footer"

const toolbar = [
  ["format-bold", "Bold"],
  ["format-italic", "Italic"],
  ["format-underlined", "Underline"],
  ["format-size", "Size"],
  ["list", "Bulleted list"],
  ["format-list-numbered", "Numbered list"],
  ["format-align-left", "Align left"],
  ["format-align-right", "Align right"],
] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function StateField({ kind, shape, size, state }: { kind: Kind; shape: TextareaEditorShape; size: TextareaEditorSize; state: State }) {
  const id = `editor-${kind}-${shape}-${size}-${state}`
  return (
    <Field
      size={textareaFieldSize[size]}
      className={kind === "editor" ? "w-70 shrink-0" : "w-50 shrink-0"}
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
      <TextareaEditor size={size} shape={shape} status={state === "success" ? "success" : state === "active" ? "active" : "default"}>
        {kind === "editor" ? (
          <TextareaEditorToolbar aria-label="Formatting">
            {toolbar.map(([icon, label]) => (
              <TextareaEditorAction key={icon} icon={`/icons/material-${icon}.svg`} label={label} disabled={state === "disabled"} />
            ))}
          </TextareaEditorToolbar>
        ) : null}
        <TextareaEditorInput
          id={id}
          placeholder="Text Area"
          defaultValue={state === "default" || state === "disabled" ? undefined : "Text Area"}
          aria-invalid={state === "error" || undefined}
          disabled={state === "disabled"}
        />
        {kind === "footer" ? (
          <TextareaEditorFooter>
            <TextareaEditorActions>
              <TextareaEditorAction icon="/icons/material-attachment.svg" label="Attach" disabled={state === "disabled"} />
              <TextareaEditorAction icon="/icons/material-mic-none.svg" label="Record" disabled={state === "disabled"} />
              <TextareaEditorAction icon="/icons/material-mood.svg" label="Emoji" disabled={state === "disabled"} />
            </TextareaEditorActions>
            <Button type="button" variant="outline" size="24" shape={shape} disabled={state === "disabled"}>
              Button
            </Button>
          </TextareaEditorFooter>
        ) : null}
      </TextareaEditor>
      <FieldDescription>Add Text Bottom</FieldDescription>
    </Field>
  )
}

function StateMatrix({ kind, shape }: { kind: Kind; shape: TextareaEditorShape }) {
  return (
    <div className="flex flex-col gap-10 overflow-x-auto pb-2">
      <div className="flex items-start gap-10">
        {sizes.map((size) => (
          <span
            key={size}
            className={`${kind === "editor" ? "w-70" : "w-50"} shrink-0 font-default text-11 leading-20 font-semibold text-base-500`}
          >
            {sizeLabel[size]}
          </span>
        ))}
      </div>
      {states.map((state) => (
        <div key={state} className="flex flex-col gap-3">
          <span className="font-default text-11 leading-20 font-semibold text-base-500 capitalize">{state}</span>
          <div className="flex items-start gap-10">
            {sizes.map((size) => (
              <StateField key={size} kind={kind} shape={shape} size={size} state={state} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TextAreaEditorPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Textarea-Editor-Rounded">
        <StateMatrix kind="editor" shape="rounded" />
      </Section>
      <Section title="Textarea-Editor-Pilled">
        <StateMatrix kind="editor" shape="pill" />
      </Section>
      <Section title="Textarea-Footer-Rounded">
        <StateMatrix kind="footer" shape="rounded" />
      </Section>
      <Section title="Textarea-Footer-Pilled">
        <StateMatrix kind="footer" shape="pill" />
      </Section>
    </main>
  )
}
