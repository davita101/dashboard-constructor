import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ButtonSize } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldHeader, FieldHint, FieldLabel, FieldLabelIcon } from "@/components/ui/field"
import type { InputShape, InputSize } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupAvatar,
  InputGroupButton,
  InputGroupIcon,
  InputGroupInput,
  InputGroupJoin,
  InputGroupKbd,
  InputGroupSegment,
  InputGroupSwatch,
  InputGroupText,
} from "@/components/ui/input-group"
import { KbdGroup } from "@/components/ui/kbd"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

// Mirrors the Figma Forms: Input Groups page (12015:28362): Input-Left-Group, Input-Right-Group and
// Input-Double-Group, each Rounded and Pilled.

const sizes = ["60", "48", "40", "32", "24"] as const satisfies InputSize[]
const layouts = ["left", "right", "double"] as const
type Layout = (typeof layouts)[number]
const baseStates = ["default", "filled", "active 1", "active 2", "error", "success", "disabled"] as const
const doubleStates = ["default", "filled", "active 1", "active 2", "active 3", "error", "success", "disabled"] as const
type State = (typeof doubleStates)[number]

// Slot sizes per input size, as on /design-system/input.
const buttonSize: Record<InputSize, ButtonSize> = { "60": "32", "48": "32", "40": "24", "32": "20", "24": "16" }
const kbdSize = { "60": "32", "48": "24", "40": "20", "32": "16", "24": "16" } as const
const avatarSize = { "60": "32", "48": "24", "40": "24", "32": "20", "24": "16" } as const
const controlSize = { "60": "20", "48": "20", "40": "20", "32": "16", "24": "16" } as const
const switchSize = { "60": "default", "48": "default", "40": "default", "32": "sm", "24": "sm" } as const

const layoutName: Record<Layout, string> = { left: "Left", right: "Right", double: "Double" }

// Segment order per layout; "input" is the InputGroup. Active N focuses segment N (Figma).
const segments: Record<Layout, ("group" | "input")[]> = {
  left: ["group", "input"],
  right: ["input", "group"],
  double: ["group", "input", "group"],
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

function GroupField({
  layout,
  shape,
  size,
  state,
}: {
  layout: Layout
  shape: InputShape
  size: InputSize
  state: State
}) {
  const id = `group-${layout}-${shape}-${size}-${state.replace(" ", "-")}`
  const active = state.startsWith("active") ? Number(state.slice(-1)) - 1 : -1
  const disabled = state === "disabled"
  return (
    <Field
      size={size}
      shape={shape}
      className="w-75 shrink-0"
      data-invalid={state === "error" || undefined}
      data-success={state === "success" || undefined}
      data-disabled={disabled || undefined}
    >
      <FieldHeader>
        <FieldLabel htmlFor={id}>
          Label
          <FieldLabelIcon />
        </FieldLabel>
        <FieldHint>Add Text</FieldHint>
      </FieldHeader>
      <InputGroupJoin size={size} shape={shape} status={state === "success" ? "success" : "default"}>
        {segments[layout].map((kind, i) =>
          kind === "input" ? (
            <InputGroup key={i} status={active === i ? "active" : undefined}>
              <InputGroupInput
                id={id}
                placeholder="Text"
                defaultValue={state === "default" || disabled ? undefined : "Text"}
                aria-invalid={state === "error" || undefined}
                disabled={disabled}
              />
            </InputGroup>
          ) : (
            <InputGroupSegment key={i} status={active === i ? "active" : "default"}>
              Text
            </InputGroupSegment>
          )
        )}
      </InputGroupJoin>
      <FieldDescription>Add Text Bottom</FieldDescription>
    </Field>
  )
}

function StateMatrix({ layout, shape }: { layout: Layout; shape: InputShape }) {
  const states = layout === "double" ? doubleStates : baseStates
  return (
    <div className="flex flex-col gap-10 overflow-x-auto pb-2">
      {states.map((state) => (
        <div key={state} className="flex flex-col gap-3">
          <Caption>{state}</Caption>
          <div className="flex items-start gap-10">
            {sizes.map((size) => (
              <GroupField key={size} layout={layout} shape={shape} size={size} state={state} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Figma Group slot alternatives (Button, Checkbox, Radio, Switcher, Icon, Avatar, Colors, Select)
// and the Input's Right slots (Add Text, Right Icon, Command Keys, Select).
function Slots({ shape, size }: { shape: InputShape; size: InputSize }) {
  const name = `slots-${shape}-${size}`
  const pill = shape === "pill"
  return (
    <div className="flex w-75 shrink-0 flex-col gap-3">
      <InputGroupJoin size={size} shape={shape}>
        <InputGroupSegment>
          <InputGroupButton size={buttonSize[size]} shape={pill ? "pill" : "rounded"}>
            Button
          </InputGroupButton>
        </InputGroupSegment>
        <InputGroup>
          <InputGroupInput placeholder="Text" aria-label={`${name} button`} />
          <InputGroupAddon align="inline-end">
            <InputGroupText>Add Text</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </InputGroupJoin>

      <InputGroupJoin size={size} shape={shape}>
        <InputGroupSegment>
          <Checkbox size={controlSize[size]} defaultChecked aria-label="Select" />
        </InputGroupSegment>
        <InputGroup>
          <InputGroupInput placeholder="Text" aria-label={`${name} checkbox`} />
        </InputGroup>
        <InputGroupSegment>
          <Switch size={switchSize[size]} defaultChecked aria-label="Enable" />
        </InputGroupSegment>
      </InputGroupJoin>

      <InputGroupJoin size={size} shape={shape}>
        <InputGroupSegment>
          <RadioGroup defaultValue="on" aria-label="Choice">
            <RadioGroupItem value="on" size={controlSize[size]} aria-label="On" />
          </RadioGroup>
        </InputGroupSegment>
        <InputGroup>
          <InputGroupInput placeholder="Text" aria-label={`${name} radio`} />
          <InputGroupAddon align="inline-end">
            <KbdGroup>
              <InputGroupKbd size={kbdSize[size]}>⌘</InputGroupKbd>
              <InputGroupKbd size={kbdSize[size]}>K</InputGroupKbd>
            </KbdGroup>
          </InputGroupAddon>
        </InputGroup>
      </InputGroupJoin>

      <InputGroupJoin size={size} shape={shape}>
        <InputGroupSegment>
          <InputGroupIcon src="/icons/material-default-icon.svg" />
        </InputGroupSegment>
        <InputGroup>
          <InputGroupInput placeholder="Text" aria-label={`${name} icon`} />
          <InputGroupAddon align="inline-end">
            <InputGroupIcon src="/icons/material-default-icon.svg" />
          </InputGroupAddon>
        </InputGroup>
        <InputGroupSegment>
          <InputGroupAvatar size={avatarSize[size]} shape={pill ? "circle" : "rounded"}>
            <AvatarImage src="/images/avatars/avatar-1.png" alt="" />
            <AvatarFallback>M</AvatarFallback>
          </InputGroupAvatar>
        </InputGroupSegment>
      </InputGroupJoin>

      <InputGroupJoin size={size} shape={shape}>
        <InputGroupSegment>
          <InputGroupSwatch color="primary" shape={shape} />
        </InputGroupSegment>
        <InputGroup>
          <InputGroupInput placeholder="Text" aria-label={`${name} color`} />
        </InputGroup>
        <InputGroupSegment>
          USD
          <InputGroupIcon src="/icons/material-unfold-more.svg" />
        </InputGroupSegment>
      </InputGroupJoin>
    </div>
  )
}

export default function InputGroupPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      {(["rounded", "pill"] as const).map((shape) => (
        <Section key={`slots-${shape}`} title={`Group slots (${shape === "pill" ? "Pilled" : "Rounded"})`}>
          <div className="flex items-start gap-10 overflow-x-auto pb-2">
            {sizes.map((size) => (
              <Slots key={size} shape={shape} size={size} />
            ))}
          </div>
        </Section>
      ))}
      {layouts.map((layout) =>
        (["rounded", "pill"] as const).map((shape) => (
          <Section
            key={`${layout}-${shape}`}
            title={`Input-${layoutName[layout]}-Group-${shape === "pill" ? "Pilled" : "Rounded"}`}
          >
            <StateMatrix layout={layout} shape={shape} />
          </Section>
        ))
      )}
    </main>
  )
}
