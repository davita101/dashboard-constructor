"use client"

import {
  AiInput,
  AiInputAction,
  AiInputAttachment,
  AiInputAttachments,
  AiInputError,
  AiInputFooter,
  AiInputGroup,
  AiInputModel,
  AiInputRoot,
  AiInputSend,
  AiInputText,
} from "@/components/ui/ai-input"

// Mirrors Figma Forms: AI (12814:6371). Hover/Active are real :hover / :focus-within; Active rows are focused via autoFocus.

type Tone = "light" | "inverse"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-wrap items-start gap-8">{children}</div>
    </section>
  )
}

/** Showcase backdrop, like the Figma set frame. Not part of the component. */
function Surface({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <div className={tone === "inverse" ? "w-max rounded-r40 bg-primary-600 p-10" : "w-max rounded-r40 bg-background-10 p-10"}>
      {children}
    </div>
  )
}

function Chat({ tone, autoFocus, withImage }: { tone: Tone; autoFocus?: boolean; withImage?: boolean }) {
  return (
    <AiInput tone={tone}>
      {withImage ? (
        <AiInputAttachments>
          <AiInputAttachment look={tone === "inverse" ? "black" : "default"} image="/icons/material-image.svg" />
          <AiInputAttachment look={tone === "inverse" ? "black" : "default"} image="/icons/material-image.svg" />
        </AiInputAttachments>
      ) : null}
      <AiInputText tone={tone} rows={3} autoFocus={autoFocus} placeholder="Assign a task or ask anything" aria-label="Message" />
      <AiInputFooter>
        <AiInputGroup>
          <AiInputAction tone={tone} icon="/icons/material-add.svg" label="Add" />
          <AiInputAction tone={tone} icon="/icons/material-tune.svg" label="Settings" />
        </AiInputGroup>
        <AiInputGroup>
          <AiInputAction tone={tone} icon="/icons/material-mic-none.svg" label="Voice" />
          <AiInputSend tone={tone} />
        </AiInputGroup>
      </AiInputFooter>
    </AiInput>
  )
}

function Mini({ tone, autoFocus }: { tone: Tone; autoFocus?: boolean }) {
  return (
    <AiInput shape="mini" tone={tone}>
      <AiInputGroup className="flex-1">
        <AiInputAction tone={tone} icon="/icons/material-add.svg" label="Add" />
        <AiInputText tone={tone} rows={1} autoFocus={autoFocus} placeholder="Ask anything" aria-label="Message" className="min-h-5" />
      </AiInputGroup>
      <AiInputGroup>
        <AiInputAction tone={tone} icon="/icons/material-mic-none.svg" label="Voice" />
        <AiInputSend tone={tone} />
      </AiInputGroup>
    </AiInput>
  )
}

function Create({ tone, autoFocus, error }: { tone: Tone; autoFocus?: boolean; error?: boolean }) {
  const look = tone === "inverse" ? "black" : "default"
  return (
    <AiInputRoot>
      <AiInput tone={tone} invalid={error} className={error ? "rounded-b-none" : undefined}>
        <AiInputAttachments>
          <AiInputAttachment look={look} name="Design.md" image="/icons/material-image.svg" onRemove={() => {}} />
          <AiInputAttachment look={look} name="Design.md" onRemove={() => {}} />
        </AiInputAttachments>
        <AiInputText tone={tone} rows={2} autoFocus={autoFocus} placeholder="To Build Site" aria-label="Prompt" />
        <AiInputFooter>
          <AiInputGroup>
            <AiInputAction tone={tone} icon="/icons/material-add.svg" label="Add" />
            <AiInputModel tone={tone}>GPT</AiInputModel>
          </AiInputGroup>
          <AiInputSend tone={tone} />
        </AiInputFooter>
      </AiInput>
      {error ? <AiInputError>File Type now Allowed</AiInputError> : null}
    </AiInputRoot>
  )
}

export default function AiInputPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      {(["light", "inverse"] as const).map((tone) => (
        <Surface key={tone} tone={tone}>
          <div className="flex flex-col gap-12">
            <Section title={`AI-Form-Chat${tone === "inverse" ? "-White" : ""}: Default | Hover (pointer) | Active (focused) | With Image`}>
              <Chat tone={tone} />
              <Chat tone={tone} autoFocus={tone === "light"} />
              <Chat tone={tone} withImage />
            </Section>
            <Section title={`AI-Mini-Form${tone === "inverse" ? "-White" : ""}: Default | Active`}>
              <Mini tone={tone} />
              <Mini tone={tone} autoFocus={tone === "light"} />
            </Section>
            <Section title={`AI-Create-Form${tone === "inverse" ? "-White" : ""}: Default | Error`}>
              <Create tone={tone} />
              <Create tone={tone} error />
            </Section>
          </div>
        </Surface>
      ))}
    </main>
  )
}
