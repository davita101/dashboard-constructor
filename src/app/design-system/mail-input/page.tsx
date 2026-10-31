import { MailInputDemo } from "@/components/mail/mail-input-demo"

// Mirrors Figma Add-Mail-Input (12273:40969): State Default, Active (focus-within; first one is focused).

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

/** Showcase backdrop, like the Figma set frame. Not part of the component. */
function Surface({ children }: { children: React.ReactNode }) {
  return <div className="w-max rounded-r40 bg-background-0 p-20">{children}</div>
}

export default function MailInputPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="State=Default">
        <Surface>
          <MailInputDemo />
        </Surface>
      </Section>
      <Section title="State=Active (focused)">
        <Surface>
          <MailInputDemo autoFocus />
        </Surface>
      </Section>
    </main>
  )
}
