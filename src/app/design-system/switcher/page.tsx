import { Switch, type SwitchColor, type SwitchSize } from "@/components/ui/switch"
import {
  SwitchCard,
  SwitchCardContent,
  SwitchCardDescription,
  SwitchCardIcon,
  SwitchCardLink,
  SwitchCardLinks,
  SwitchCardMedia,
  SwitchCardTitle,
} from "@/components/ui/switch-card"
import { SwitchField, SwitchFieldContent, SwitchFieldDescription, SwitchFieldTitle } from "@/components/ui/switch-field"

// Mirrors the Figma Forms: Switcher page (8985:342542): Switcher (457:75), Switcher-Text (9433:3537),
// Switcher-Text-Card (9435:3720), Switcher-Card (9427:4066).

const colors = ["primary-dark", "primary"] as const satisfies SwitchColor[]
const sizes = ["default", "sm"] as const satisfies SwitchSize[]
const statuses = [
  { name: "On", props: { defaultChecked: true } },
  { name: "Off", props: {} },
  { name: "On Disabled", props: { defaultChecked: true, disabled: true } },
  { name: "Off Disabled", props: { disabled: true } },
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

export default function SwitcherPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Switcher: On, Off, On Disabled, Off Disabled (Primary Dark, Primary; Default 20, Small 16)">
        <div className="flex flex-col gap-8">
          {sizes.map((size) => (
            <div key={size} className="flex flex-wrap items-center gap-10">
              {colors.flatMap((color) =>
                statuses.map(({ name, props }) => (
                  <Switch key={`${color}-${name}`} color={color} size={size} aria-label={`${color} ${size} ${name}`} {...props} />
                ))
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Switcher-Text">
        <div className="flex flex-col gap-10">
          {orientations.flatMap((orientation) =>
            [states[1], states[0], states[2]].map(({ name, props }) => (
              <SwitchField key={`${orientation}-${name}`} orientation={orientation} className="w-fit">
                <Switch color="primary-dark" {...props} />
                <SwitchFieldContent>
                  <SwitchFieldTitle>Main Text</SwitchFieldTitle>
                  <SwitchFieldDescription>Additional Text</SwitchFieldDescription>
                </SwitchFieldContent>
              </SwitchField>
            ))
          )}
        </div>
      </Section>

      <Section title="Switcher-Text-Card">
        <div className="flex flex-col gap-10">
          {orientations.flatMap((orientation) =>
            states.map(({ name, props }) => (
              <SwitchField key={`${orientation}-${name}`} variant="card" orientation={orientation} className="w-58">
                <Switch color="primary-dark" {...props} />
                <SwitchFieldContent>
                  <SwitchFieldTitle>Main Text</SwitchFieldTitle>
                  <SwitchFieldDescription>Additional Text</SwitchFieldDescription>
                </SwitchFieldContent>
              </SwitchField>
            ))
          )}
        </div>
      </Section>

      <Section title="Switcher-Card">
        <div className="flex flex-col gap-10">
          {states.map(({ name, props }) => (
            <SwitchCard key={name} className="w-80">
              <SwitchCardMedia>
                <SwitchCardIcon />
              </SwitchCardMedia>
              <SwitchCardContent>
                <SwitchCardTitle>Main Text</SwitchCardTitle>
                <SwitchCardDescription>Additional Text</SwitchCardDescription>
                <SwitchCardLinks>
                  <SwitchCardLink href="#">Link</SwitchCardLink>
                  <SwitchCardLink href="#">Link</SwitchCardLink>
                </SwitchCardLinks>
              </SwitchCardContent>
              <Switch color="primary-dark" {...props} />
            </SwitchCard>
          ))}
        </div>
      </Section>
    </main>
  )
}
