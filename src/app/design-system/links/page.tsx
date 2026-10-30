import NextLink from "next/link"

import {
  Link,
  LinkBadge,
  LinkDropdown,
  LinkIcon,
  type LinkSize,
  type LinkState,
  type LinkVariant,
} from "@/components/ui/link"

// Mirrors the Figma Links page (12123:27015), component set Link 12123:27019.

const sizes = ["24", "20", "16", "15", "14", "13", "12", "11"] as const satisfies LinkSize[]

const states = [
  { state: "default", label: "Default" },
  { state: "hover", label: "Hover" },
  { state: "active", label: "Active" },
  { state: "active-2", label: "Active 2" },
] as const satisfies { state: LinkState; label: string }[]

const styles = [
  { variant: "900", label: "900" },
  { variant: "700", label: "700" },
  { variant: "500", label: "500" },
  { variant: "white", label: "White", onDark: true },
  { variant: "white-50", label: "White 50%", onDark: true },
  { variant: "white-30", label: "White 30%", onDark: true },
  { variant: "danger", label: "Danger" },
  { variant: "primary", label: "Primary" },
  { variant: "success", label: "Succes" },
] as const satisfies { variant: LinkVariant; label: string; onDark?: boolean }[]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="font-default text-11 leading-20 font-semibold text-base-500">{children}</span>
}

export default function LinksPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Interactive (hover, press, keyboard focus)">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="#" size="16">
            Link
          </Link>
          <Link render={<NextLink href="/design-system/links" />} size="16" variant="primary">
            next/link
          </Link>
          <Link href="#" size="16" variant="700" aria-current="page">
            Current page
          </Link>
          <Link href="#" size="16" variant="danger" aria-disabled="true">
            Disabled
          </Link>
        </div>
      </Section>

      <Section title="Slots: icons, badge, dropdown">
        <div className="flex flex-wrap items-center gap-6">
          {(["24", "16", "12"] as const).map((size) => (
            <Link key={size} href="#" size={size} variant="700">
              <LinkIcon />
              Link
              <LinkBadge size={size}>8</LinkBadge>
              <LinkIcon />
              <LinkDropdown />
            </Link>
          ))}
          <Link href="#" size="14" variant="primary" state="active-2">
            <LinkIcon icon="/icons/material-home.svg" />
            Home
            <LinkDropdown />
          </Link>
        </div>
      </Section>

      {styles.map(({ variant, label, ...rest }) => {
        const onDark = "onDark" in rest
        return (
          <Section key={variant} title={`Style ${label}: Size × State`}>
            <div
              data-on-dark={onDark || undefined}
              className="w-fit overflow-x-auto rounded-r8 p-4 data-on-dark:bg-base-800"
            >
              <table className="border-separate border-spacing-x-8 border-spacing-y-3">
                <thead>
                  <tr>
                    <th />
                    {states.map(({ state, label: stateLabel }) => (
                      <th key={state} className="text-left">
                        <Caption>{stateLabel}</Caption>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((size) => (
                    <tr key={size}>
                      <th className="text-left">
                        <Caption>{size}</Caption>
                      </th>
                      {states.map(({ state }) => (
                        <td key={state}>
                          <Link href="#" variant={variant} size={size} state={state}>
                            Link
                          </Link>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )
      })}
    </main>
  )
}
