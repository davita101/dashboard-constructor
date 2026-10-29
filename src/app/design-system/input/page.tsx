import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { BadgeSize } from "@/components/ui/badge"
import type { ButtonSize } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldHeader,
  FieldHint,
  FieldLabel,
  FieldLabelIcon,
} from "@/components/ui/field"
import { Input, type InputShape, type InputSize } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupAvatar,
  InputGroupButton,
  InputGroupIcon,
  InputGroupInput,
  InputGroupKbd,
  InputGroupTag,
  InputGroupText,
} from "@/components/ui/input-group"
import { KbdGroup } from "@/components/ui/kbd"

// Mirrors the Figma Forms: Inputs page (8928:37150): Input-Rounded (358:528) and Input-Pilled (10464:507752).

const sizes = ["60", "48", "40", "32", "24"] as const satisfies InputSize[]
const states = ["default", "filled", "active", "error", "success", "disabled"] as const
type State = (typeof states)[number]

// Slot sizes per input size (Figma: 32px tags/buttons/avatar at 60, scaled down below).
const tagSize: Record<InputSize, BadgeSize> = { "60": "32", "48": "24", "40": "24", "32": "20", "24": "16" }
const buttonSize: Record<InputSize, ButtonSize> = { "60": "32", "48": "32", "40": "24", "32": "20", "24": "16" }
const kbdSize = { "60": "32", "48": "24", "40": "20", "32": "16", "24": "16" } as const
const avatarSize = { "60": "32", "48": "24", "40": "24", "32": "20", "24": "16" } as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function StateField({ shape, size, state }: { shape: InputShape; size: InputSize; state: State }) {
  const id = `input-${shape}-${size}-${state}`
  return (
    <Field
      size={size}
      shape={shape}
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

function StateMatrix({ shape }: { shape: InputShape }) {
  return (
    <div className="flex flex-col gap-10 overflow-x-auto pb-2">
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

function SlotRow({ shape, size }: { shape: InputShape; size: InputSize }) {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <InputGroup size={size} shape={shape} className="w-75">
        <InputGroupAddon>
          <InputGroupIcon src="/icons/material-default-icon.svg" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Left icon" aria-label="Left icon" />
        <InputGroupAddon align="inline-end">
          <InputGroupIcon src="/icons/material-default-icon.svg" />
        </InputGroupAddon>
      </InputGroup>

      <InputGroup size={size} shape={shape} className="w-75">
        <InputGroupAddon>
          <InputGroupTag size={tagSize[size]} shape={shape === "pill" ? "pill" : "rounded"}>Tag</InputGroupTag>
          <InputGroupTag size={tagSize[size]} shape={shape === "pill" ? "pill" : "rounded"}>Design</InputGroupTag>
        </InputGroupAddon>
        <InputGroupInput placeholder="Tags" aria-label="Tags" />
      </InputGroup>

      <InputGroup size={size} shape={shape} className="w-75">
        <InputGroupInput placeholder="Button" aria-label="With button" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size={buttonSize[size]} shape={shape === "pill" ? "pill" : "rounded"}>
            Button
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup size={size} shape={shape} className="w-75">
        <InputGroupInput placeholder="Amount" aria-label="Amount" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup size={size} shape={shape} className="w-75">
        <InputGroupInput placeholder="Search" aria-label="Search" />
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <InputGroupKbd size={kbdSize[size]}>⌘</InputGroupKbd>
            <InputGroupKbd size={kbdSize[size]}>K</InputGroupKbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup size={size} shape={shape} className="w-75">
        <InputGroupAddon>
          <InputGroupAvatar size={avatarSize[size]} shape={shape === "pill" ? "circle" : "rounded"}>
            <AvatarImage src="/images/avatars/avatar-1.png" alt="" />
            <AvatarFallback>M</AvatarFallback>
          </InputGroupAvatar>
        </InputGroupAddon>
        <InputGroupInput placeholder="Avatar" aria-label="Avatar" />
      </InputGroup>
    </div>
  )
}

export default function InputPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Input-Rounded">
        <StateMatrix shape="rounded" />
      </Section>

      <Section title="Input-Pilled">
        <StateMatrix shape="pill" />
      </Section>

      <Section title="Input (standalone, no addons): try focus and typing">
        <div className="flex flex-col gap-4">
          {(["rounded", "pill"] as const).map((shape) => (
            <div key={shape} className="flex flex-wrap items-center gap-6">
              {sizes.map((size) => (
                <Input key={size} size={size} shape={shape} className="w-60" placeholder="Text" aria-label={`Input ${size}`} />
              ))}
              <Input shape={shape} className="w-60" placeholder="Error" aria-label="Error" aria-invalid />
              <Input shape={shape} status="success" className="w-60" placeholder="Success" aria-label="Success" />
            </div>
          ))}
        </div>
      </Section>

      {(["rounded", "pill"] as const).map((shape) => (
        <Section key={shape} title={`Slots (${shape === "pill" ? "Pilled" : "Rounded"})`}>
          <div className="flex flex-col gap-6">
            {sizes.map((size) => (
              <SlotRow key={size} shape={shape} size={size} />
            ))}
          </div>
        </Section>
      ))}
    </main>
  )
}
