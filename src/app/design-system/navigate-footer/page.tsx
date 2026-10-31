import {
  NavigateFooter,
  NavigateFooterContent,
  NavigateFooterCopyright,
  NavigateFooterGroup,
  NavigateFooterIconButton,
  NavigateFooterLanguage,
  NavigateFooterRow,
} from "@/components/ui/navigate-footer"

// Mirrors the Figma Navigate Footer page (12492:252181): Type=Desktop 1026, Tablet 768, Mobile 360.
// Facebook and Pinterest glyphs are not in public/icons (brand PNGs are full-colour logos), so the default icon stands in; see design/known-gaps.md.

function Social() {
  return (
    <NavigateFooterGroup>
      <NavigateFooterIconButton icon="/icons/material-default-icon.svg" aria-label="Facebook" />
      <NavigateFooterIconButton icon="/icons/brands/x-twitter.png" aria-label="X" />
      <NavigateFooterIconButton icon="/icons/material-instagram.svg" aria-label="Instagram" />
      <NavigateFooterIconButton icon="/icons/material-default-icon.svg" aria-label="Pinterest" />
    </NavigateFooterGroup>
  )
}

function Actions() {
  return (
    <NavigateFooterGroup>
      <NavigateFooterIconButton icon="/icons/material-chat-bubble.svg" aria-label="Chat" />
      <NavigateFooterIconButton icon="/icons/material-arrow-upward.svg" aria-label="Back to top" />
    </NavigateFooterGroup>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return <h2 className="text-14 leading-24 font-bold text-base-800">{children}</h2>
}

export default function Page() {
  return (
    <main className="flex flex-col gap-10 p-10">
      {(["desktop", "tablet"] as const).map((size) => (
        <section key={size} className="flex flex-col gap-4">
          <Caption>Type={size === "desktop" ? "Desktop" : "Tablet"}</Caption>
          <NavigateFooter size={size} className={size === "desktop" ? "w-256.5" : "w-192"}>
            <NavigateFooterContent>
              <NavigateFooterCopyright>© 2078 Global Inc.</NavigateFooterCopyright>
              <Social />
              <NavigateFooterLanguage />
              <Actions />
            </NavigateFooterContent>
          </NavigateFooter>
        </section>
      ))}
      <section className="flex flex-col gap-4">
        <Caption>Type=Mobile</Caption>
        <NavigateFooter size="mobile" className="w-90">
          <NavigateFooterRow>
            <Social />
          </NavigateFooterRow>
          <NavigateFooterRow>
            <NavigateFooterLanguage />
            <Actions />
          </NavigateFooterRow>
          <NavigateFooterRow>
            <NavigateFooterCopyright>© 2078 Global Inc.</NavigateFooterCopyright>
          </NavigateFooterRow>
        </NavigateFooter>
      </section>
    </main>
  )
}
