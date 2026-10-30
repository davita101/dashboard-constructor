import {
  Step,
  StepContent,
  StepDescription,
  StepHead,
  StepIndicator,
  Steps,
  StepsDot,
  StepsDotGroup,
  StepsDotLabel,
  StepsDotList,
  StepSeparator,
  StepTitle,
  type StepStatus,
} from "@/components/ui/steps"

// Mirrors the Figma Steps page (4313:48088): Step-Component-01..04, Steps-Dot and the groups
// Step-Group-01 (+ Vertical), 02, 03, 04, 05 and Steps-Group-Dot.

const sizes = ["60", "48", "40", "32"] as const
type Size = (typeof sizes)[number]
const sizeNames: Record<Size, string> = { "60": "Extra Large", "48": "Large", "40": "Default", "32": "Small" }
// Step-Group-01 Size -> step circle and Hug gap.
const groupSizes = [
  { name: "Large", size: "60", spacing: "lg" },
  { name: "Default", size: "48", spacing: "lg" },
  { name: "Small", size: "40", spacing: "md" },
  { name: "Extra Small", size: "32", spacing: "sm" },
] as const

type Variant = "primary" | "primary-dark"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="w-32 shrink-0 font-default text-12 leading-20 text-base-500">{children}</span>
}

function InlineStep({
  n,
  size,
  status,
  variant = "primary",
}: {
  n: number
  size: Size
  status: StepStatus
  variant?: Variant
}) {
  return (
    <Step layout="inline" size={size} status={status} variant={variant}>
      <StepIndicator>{n}</StepIndicator>
      <StepContent>
        <StepTitle>Step</StepTitle>
        {size !== "32" && <StepDescription>Description</StepDescription>}
      </StepContent>
    </Step>
  )
}

function TabStep({
  status,
  variant = "primary",
  line,
}: {
  status: StepStatus
  variant?: Variant
  line: "top" | "bottom" | "none"
}) {
  const reached = status === "current"
  return (
    <Step layout="tab" status={status} variant={variant}>
      {line === "top" && <StepSeparator reached={reached} />}
      <StepContent>
        <StepDescription>Step</StepDescription>
        <StepTitle>Heading Step</StepTitle>
      </StepContent>
      {line === "bottom" && <StepSeparator reached={reached} />}
    </Step>
  )
}

function StackedStep({
  status,
  variant = "primary",
  lines,
  number,
}: {
  status: StepStatus
  variant?: Variant
  lines: "left" | "right" | "both"
  number?: number
}) {
  return (
    <Step layout="stacked" status={status} variant={variant}>
      <StepHead>
        <StepSeparator reached={status !== "upcoming"} spacer={lines === "right"} />
        <StepIndicator>{number}</StepIndicator>
        {/* Figma colors the first step's right line when it is Active (Lines=Right Line). */}
        <StepSeparator
          reached={status === "done" || (status === "current" && lines === "right")}
          spacer={lines === "left"}
        />
      </StepHead>
      <StepContent>
        <StepTitle>Heading Step</StepTitle>
        <StepDescription>About Heading Step</StepDescription>
      </StepContent>
    </Step>
  )
}

function ListStep({
  status,
  variant = "primary",
  first = false,
  number,
}: {
  status: StepStatus
  variant?: Variant
  first?: boolean
  number?: number
}) {
  return (
    <Step layout="list" status={status} variant={variant}>
      <StepHead>
        {!first && <StepSeparator orientation="vertical" reached={status !== "upcoming"} />}
        <StepIndicator>{number}</StepIndicator>
      </StepHead>
      <StepContent>
        <StepTitle>Heading Step</StepTitle>
        <StepDescription>About Heading Step</StepDescription>
      </StepContent>
    </Step>
  )
}

function statusAt(index: number, selected: number): StepStatus {
  if (index < selected) return "done"
  return index === selected ? "current" : "upcoming"
}

function Group05({ selected, type }: { selected: number; type: "dot" | "number" }) {
  return (
    <Steps aria-label={`Step ${selected + 1} of 8`}>
      {Array.from({ length: 8 }, (_, i) => (
        <Step key={i} layout="compact" status={statusAt(i, selected)}>
          {i > 0 && <StepSeparator reached={i <= selected} />}
          <StepIndicator>{type === "number" ? i + 1 : undefined}</StepIndicator>
        </Step>
      ))}
    </Steps>
  )
}

export default function StepsPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Step-Component-01: Type x Size">
        {sizes.map((size) => (
          <div key={size} className="flex flex-wrap items-center gap-10">
            <Caption>{sizeNames[size]} ({size})</Caption>
            <ol className="flex flex-wrap items-center gap-10">
              <InlineStep n={1} size={size} status="current" />
              <InlineStep n={1} size={size} status="upcoming" />
              <InlineStep n={1} size={size} status="done" />
              <InlineStep n={1} size={size} status="disabled" />
              <InlineStep n={1} size={size} status="current" variant="primary-dark" />
            </ol>
          </div>
        ))}
      </Section>

      <Section title="Step-Component-02: State x Type (Line Top, Line Bottom, No Line)">
        {(["top", "bottom", "none"] as const).map((line) => (
          <div key={line} className="flex flex-wrap items-center gap-10">
            <Caption>Line {line}</Caption>
            <ol className="flex flex-wrap gap-10">
              <TabStep line={line} status="current" />
              <TabStep line={line} status="current" variant="primary-dark" />
              <TabStep line={line} status="upcoming" />
            </ol>
          </div>
        ))}
      </Section>

      <Section title="Step-Component-03: State x Lines">
        <div className="flex flex-wrap items-center gap-10">
          <Caption>Active</Caption>
          <ol className="flex flex-wrap gap-10">
            <StackedStep status="current" lines="both" />
            <StackedStep status="current" lines="right" />
            <StackedStep status="current" variant="primary-dark" lines="both" />
            <StackedStep status="current" variant="primary-dark" lines="right" />
          </ol>
        </div>
        <div className="flex flex-wrap items-center gap-10">
          <Caption>Done</Caption>
          <ol className="flex flex-wrap gap-10">
            <StackedStep status="done" lines="both" />
            <StackedStep status="done" lines="right" />
            <StackedStep status="done" variant="primary-dark" lines="both" />
            <StackedStep status="done" variant="primary-dark" lines="right" />
          </ol>
        </div>
        <div className="flex flex-wrap items-center gap-10">
          <Caption>Not Active (+ Number)</Caption>
          <ol className="flex flex-wrap gap-10">
            <StackedStep status="upcoming" lines="both" />
            <StackedStep status="upcoming" lines="left" />
            <StackedStep status="upcoming" lines="both" number={1} />
            <StackedStep status="upcoming" lines="left" number={1} />
          </ol>
        </div>
      </Section>

      <Section title="Step-Component-04: State (Primary, Dark)">
        {(["primary", "primary-dark"] as const).map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-10">
            <Caption>{variant}</Caption>
            <ol className="flex flex-wrap gap-10">
              <ListStep status="current" variant={variant} />
              <ListStep status="done" variant={variant} />
              <ListStep status="upcoming" variant={variant} />
              <ListStep status="upcoming" variant={variant} number={1} />
            </ol>
          </div>
        ))}
      </Section>

      <Section title="Steps-Dot: Default, Select Primary, Select Dark, Hover">
        <div className="flex items-center gap-10">
          <StepsDot aria-label="Default" />
          <StepsDot selected aria-label="Select Primary" />
          <StepsDot selected variant="primary-dark" aria-label="Select Dark" />
          <StepsDot selected state="hover" aria-label="Hover" />
        </div>
      </Section>

      <Section title="Step-Group-01: Size x Type (Hug, Fill)">
        {groupSizes.map(({ name, size, spacing }) => (
          <div key={name} className="flex flex-col gap-4">
            <Caption>{name} Hug</Caption>
            <div className="overflow-x-auto">
              <Steps spacing={spacing} aria-label={`${name} steps`}>
                {Array.from({ length: 9 }, (_, i) => (
                  <InlineStep key={i} n={i + 1} size={size} status={i === 0 ? "current" : "upcoming"} />
                ))}
              </Steps>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-4">
          <Caption>Default Fill</Caption>
          <div className="overflow-x-auto">
            <Steps fill aria-label="Fill steps">
              {Array.from({ length: 9 }, (_, i) => (
                <InlineStep key={i} n={i + 1} size="48" status={i === 0 ? "current" : "upcoming"} />
              ))}
            </Steps>
          </div>
        </div>
      </Section>

      <Section title="Step-Group-01-Vertical: Size">
        <div className="flex flex-wrap gap-16">
          {groupSizes.map(({ name, size }) => (
            <Steps key={name} orientation="vertical" spacing="sm" aria-label={`${name} vertical steps`}>
              {Array.from({ length: 9 }, (_, i) => (
                <InlineStep key={i} n={i + 1} size={size} status={i === 0 ? "current" : "upcoming"} />
              ))}
            </Steps>
          ))}
        </div>
      </Section>

      <Section title="Step-Group-02: Type (Hug, Fill)">
        <div className="overflow-x-auto">
          <Steps aria-label="Tab steps hug">
            {Array.from({ length: 6 }, (_, i) => (
              <TabStep key={i} line="top" status={i === 0 ? "current" : "upcoming"} />
            ))}
          </Steps>
        </div>
        <Steps fill aria-label="Tab steps fill">
          {Array.from({ length: 6 }, (_, i) => (
            <TabStep key={i} line="bottom" status={i === 0 ? "current" : "upcoming"} />
          ))}
        </Steps>
      </Section>

      <Section title="Step-Group-03">
        <div className="overflow-x-auto">
          <Steps aria-label="Stacked steps">
            {Array.from({ length: 6 }, (_, i) => (
              <StackedStep
                key={i}
                status={i === 0 ? "current" : "upcoming"}
                lines={i === 0 ? "right" : i === 5 ? "left" : "both"}
              />
            ))}
          </Steps>
        </div>
      </Section>

      <Section title="Step-Group-04">
        <Steps orientation="vertical" aria-label="List steps">
          {Array.from({ length: 8 }, (_, i) => (
            <ListStep key={i} first={i === 0} status={i === 0 ? "current" : "upcoming"} />
          ))}
        </Steps>
      </Section>

      <Section title="Step-Group-05: Type (Dot, Number) x Selected (1..8)">
        <div className="flex flex-wrap gap-16">
          {(["dot", "number"] as const).map((type) => (
            <div key={type} className="flex flex-col gap-10">
              {Array.from({ length: 8 }, (_, i) => (
                <Group05 key={i} type={type} selected={i} />
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Steps-Group-Dot">
        <StepsDotGroup aria-label="Steps">
          <StepsDotLabel>Step 1 of 4</StepsDotLabel>
          <StepsDotList>
            {Array.from({ length: 4 }, (_, i) => (
              <StepsDot key={i} selected={i === 0} aria-label={`Go to step ${i + 1}`} />
            ))}
          </StepsDotList>
        </StepsDotGroup>
      </Section>
    </main>
  )
}
