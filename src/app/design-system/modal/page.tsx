import {
  ModalDateRange,
  ModalFiles,
  ModalForm,
  ModalPayment,
  ModalPin,
  ModalRadioList,
  ModalSwitcherList,
  ModalSwitcherPayment,
  ModalSwitcherUsers,
  ModalTwoFactor,
  ModalWelcome,
} from "@/components/modal/modal-sets"
import { Button } from "@/components/ui/button"
import {
  DialogModalActions,
  DialogModalClose,
  DialogModalFooter,
  DialogModalHead,
  DialogModalHeading,
  DialogModalIcon,
  DialogModalDescription,
  DialogModalTitle,
  DialogPanel,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxField, CheckboxFieldContent, CheckboxFieldTitle } from "@/components/ui/checkbox-field"

// Mirrors Figma `❖ Modal` (6980:969): Modal-Default (Primary / Base / Danger), Head, Footer and the 11 content modals.

const types = [
  { name: "Primary", save: "dark", close: "outline" },
  { name: "Base", save: "outline", close: "ghost" },
  { name: "Danger", save: "danger", close: "danger-soft" },
] as const

const layouts = ["left", "block", "center"] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  )
}

function Footer({
  layout,
  save,
  close,
}: {
  layout: (typeof layouts)[number]
  save: (typeof types)[number]["save"]
  close: (typeof types)[number]["close"]
}) {
  return (
    <DialogModalFooter layout={layout}>
      <CheckboxField>
        <Checkbox color="primary-dark" />
        <CheckboxFieldContent>
          <CheckboxFieldTitle>Don&apos;t ask again</CheckboxFieldTitle>
        </CheckboxFieldContent>
      </CheckboxField>
      <DialogModalActions>
        <Button variant={close} size="32">
          Close
        </Button>
        <Button variant={save} size="32">
          Save Changes
        </Button>
      </DialogModalActions>
    </DialogModalFooter>
  )
}

export default function ModalPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Modal-Default">
        {types.map((type) => (
          <DialogPanel key={type.name} variant="modal" layout="modal" size="sm" aria-label={`Modal ${type.name}`}>
            <DialogModalHead>
              <DialogModalIcon />
              <DialogModalHeading>
                <DialogModalTitle>Heading Modal</DialogModalTitle>
                <DialogModalDescription>About Text</DialogModalDescription>
              </DialogModalHeading>
              <DialogModalClose />
            </DialogModalHead>
            <Footer layout="left" save={type.save} close={type.close} />
          </DialogPanel>
        ))}
      </Section>

      <Section title="Head-Modal-Component: Default / Center">
        {(["left", "center"] as const).map((align) => (
          <DialogPanel key={align} variant="modal" layout="modal" size="md" aria-label={`Head ${align}`}>
            <DialogModalHead align={align}>
              <DialogModalIcon />
              <DialogModalHeading>
                <DialogModalTitle>Heading Modal</DialogModalTitle>
                <DialogModalDescription>About Text</DialogModalDescription>
              </DialogModalHeading>
              <DialogModalClose />
            </DialogModalHead>
          </DialogPanel>
        ))}
      </Section>

      {types.map((type) => (
        <Section key={type.name} title={`Footer-Modal-Component Style=${type.name}`}>
          {layouts.map((layout) => (
            <DialogPanel key={layout} variant="modal" layout="modal" size="md" aria-label={`Footer ${layout}`}>
              <Footer layout={layout} save={type.save} close={type.close} />
            </DialogPanel>
          ))}
        </Section>
      ))}

      <Section title="Modal-Payment / Modal-Form">
        <ModalPayment />
        <ModalForm />
      </Section>
      <Section title="Modal-Radio-List / Modal-Switcher-List / Modal-Switcher-Payment">
        <ModalRadioList />
        <ModalSwitcherList />
        <ModalSwitcherPayment />
      </Section>
      <Section title="Modal-Switcher-Users / Modal-Files">
        <ModalSwitcherUsers />
        <ModalFiles />
      </Section>
      <Section title="Modal-Two-Factor-Authentication / Modal-Pin / Modal-Welcome">
        <ModalTwoFactor />
        <ModalPin />
        <ModalWelcome />
      </Section>
      <Section title="Modal-Date-Range">
        <ModalDateRange />
      </Section>
    </main>
  )
}
