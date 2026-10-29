import { Checkbox, type CheckboxColor, type CheckboxSize } from "@/components/ui/checkbox"
import {
  CheckboxCard,
  CheckboxCardContent,
  CheckboxCardDescription,
  CheckboxCardIcon,
  CheckboxCardLink,
  CheckboxCardLinks,
  CheckboxCardMedia,
  CheckboxCardTitle,
} from "@/components/ui/checkbox-card"
import {
  CheckboxField,
  CheckboxFieldContent,
  CheckboxFieldDescription,
  CheckboxFieldTitle,
} from "@/components/ui/checkbox-field"

// Mirrors the Figma Forms: Checkbox page (8985:336791): Checkbox (457:37), Checkbox-Text (9433:3484),
// Checkbox-Text-Card (9435:3667), Checkbox-Card (9427:3669).

const colors = ["primary-dark", "primary"] as const satisfies CheckboxColor[]
const sizes = ["20", "16"] as const satisfies CheckboxSize[]
const statuses = [
  { name: "Checked", props: { defaultChecked: true } },
  { name: "Indeterminate", props: { indeterminate: true } },
  { name: "Default", props: {} },
  { name: "Focus", props: { status: "focus" as const } },
  { name: "Disabled", props: { disabled: true } },
  { name: "Disabled checked", props: { disabled: true, defaultChecked: true } },
]
const states = [
  { name: "Default", props: {} },
  { name: "Active", props: { defaultChecked: true } },
  { name: "Disabled", props: { disabled: true } },
]
const orientations = ["horizontal", "vertical"] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

export default function CheckboxPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Checkbox: Checked, Indeterminate, Default, Focus, Disabled, Disabled checked">
        <div className="flex flex-col gap-8">
          {sizes.map((size) => (
            <div key={size} className="flex flex-wrap items-center gap-10">
              {colors.flatMap((color) =>
                statuses.map(({ name, props }) => (
                  <Checkbox key={`${color}-${name}`} color={color} size={size} aria-label={`${color} ${size} ${name}`} {...props} />
                ))
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Checkbox-Text">
        <div className="flex flex-col gap-10">
          {orientations.flatMap((orientation) =>
            states.map(({ name, props }) => (
              <CheckboxField key={`${orientation}-${name}`} orientation={orientation} className="w-fit">
                <Checkbox color="primary-dark" {...props} />
                <CheckboxFieldContent>
                  <CheckboxFieldTitle>Main Text</CheckboxFieldTitle>
                  <CheckboxFieldDescription>Additional Text</CheckboxFieldDescription>
                </CheckboxFieldContent>
              </CheckboxField>
            ))
          )}
        </div>
      </Section>

      <Section title="Checkbox-Text-Card">
        <div className="flex flex-col gap-10">
          {orientations.flatMap((orientation) =>
            states.map(({ name, props }) => (
              <CheckboxField key={`${orientation}-${name}`} variant="card" orientation={orientation} className="w-70">
                <Checkbox color="primary-dark" {...props} />
                <CheckboxFieldContent>
                  <CheckboxFieldTitle>Main Text</CheckboxFieldTitle>
                  <CheckboxFieldDescription>Additional Text</CheckboxFieldDescription>
                </CheckboxFieldContent>
              </CheckboxField>
            ))
          )}
        </div>
      </Section>

      <Section title="Checkbox-Card">
        <div className="flex flex-col gap-10">
          {states.map(({ name, props }) => (
            <CheckboxCard key={name} className="w-80">
              <CheckboxCardMedia>
                <CheckboxCardIcon />
              </CheckboxCardMedia>
              <CheckboxCardContent>
                <CheckboxCardTitle>Main Text</CheckboxCardTitle>
                <CheckboxCardDescription>Additional Text</CheckboxCardDescription>
                <CheckboxCardLinks>
                  <CheckboxCardLink href="#">Link 1</CheckboxCardLink>
                  <CheckboxCardLink href="#">Link 2</CheckboxCardLink>
                </CheckboxCardLinks>
              </CheckboxCardContent>
              <Checkbox color="primary-dark" {...props} />
            </CheckboxCard>
          ))}
        </div>
      </Section>
    </main>
  )
}
