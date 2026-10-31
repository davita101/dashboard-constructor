import {
  ActionPanel,
  ActionPanelActions,
  ActionPanelClose,
  ActionPanelContent,
  ActionPanelDescription,
  ActionPanelHead,
  ActionPanelTitle,
} from "@/components/ui/action-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RadioCard, RadioCardContent, RadioCardDescription, RadioCardTitle } from "@/components/ui/radio-card"
import {
  SwitchCard,
  SwitchCardContent,
  SwitchCardDescription,
  SwitchCardLink,
  SwitchCardLinks,
  SwitchCardTitle,
} from "@/components/ui/switch-card"
import { Switch } from "@/components/ui/switch"

// Mirrors Figma Action Panel page (11531:349716): Action-Panel (15596:91926),
// Action-List-Panel (11542:2751), Action-List-Card-Panel (11535:89553).

const about =
  "In the industrial design field of human–computer interaction, a user interface (UI) is the space where interactions between humans and machines occur."
const items = [0, 1, 2, 3]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  )
}

function Head() {
  return (
    <>
      <ActionPanelHead>
        <ActionPanelTitle>Heading</ActionPanelTitle>
        <ActionPanelClose />
      </ActionPanelHead>
      <ActionPanelDescription>{about}</ActionPanelDescription>
    </>
  )
}

export default function ActionPanelPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Action-Panel">
        <ActionPanel className="w-59.5" aria-label="Action Panel">
          <Head />
          <Input shape="pill" size="40" placeholder="Text" aria-label="Text" />
          <ActionPanelActions>
            <Button variant="dark" size="40">
              Save
            </Button>
            <Button variant="outline" size="40">
              Cancel
            </Button>
          </ActionPanelActions>
        </ActionPanel>
      </Section>

      <Section title="Action-List-Panel">
        <ActionPanel className="w-70" aria-label="Action List Panel">
          <Head />
          <RadioGroup aria-label="Options" render={<ActionPanelContent />} className="gap-2">
            {items.map((i) => (
              <RadioCard key={i} layout="compact">
                <RadioGroupItem value={String(i)} color="primary-dark" />
                <RadioCardContent>
                  <RadioCardTitle>Main Text</RadioCardTitle>
                  <RadioCardDescription>Additional Text</RadioCardDescription>
                </RadioCardContent>
              </RadioCard>
            ))}
          </RadioGroup>
          <ActionPanelActions className="gap-3">
            <Button variant="dark" size="40">
              Save Settings
            </Button>
            <Button variant="outline" size="40">
              Cancel
            </Button>
          </ActionPanelActions>
        </ActionPanel>
      </Section>

      <Section title="Action-List-Card-Panel">
        <ActionPanel className="w-70" aria-label="Action List Card Panel">
          <Head />
          <ActionPanelContent>
            {items.map((i) => (
              <SwitchCard key={i}>
                <SwitchCardContent>
                  <SwitchCardTitle>Main Text</SwitchCardTitle>
                  <SwitchCardDescription>Additional Text</SwitchCardDescription>
                  <SwitchCardLinks>
                    <SwitchCardLink href="#">Link</SwitchCardLink>
                    <SwitchCardLink href="#">Link</SwitchCardLink>
                  </SwitchCardLinks>
                </SwitchCardContent>
                <Switch color="primary-dark" aria-label={`Option ${i + 1}`} />
              </SwitchCard>
            ))}
          </ActionPanelContent>
          <ActionPanelActions className="gap-3">
            <Button variant="dark" size="40">
              Save Settings
            </Button>
            <Button variant="outline" size="40">
              Cancel
            </Button>
          </ActionPanelActions>
        </ActionPanel>
      </Section>
    </main>
  )
}
