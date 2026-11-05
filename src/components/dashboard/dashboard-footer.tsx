"use client"

import type { DashboardSize } from "@/components/dashboard/use-dashboard-size"
import {
  NavigateFooter,
  NavigateFooterContent,
  NavigateFooterCopyright,
  NavigateFooterGroup,
  NavigateFooterIconButton,
  NavigateFooterLanguage,
  NavigateFooterRow,
} from "@/components/ui/navigate-footer"

// Facebook and Pinterest glyphs are not in public/icons (see design/known-gaps.md): the default icon stands in.
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

/** Figma Footer: one row at 1600 and 768, three stacked rows at 360. */
function DashboardFooter({ size }: { size: DashboardSize }) {
  if (size === "mobile") {
    return (
      <NavigateFooter size="mobile">
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
    )
  }
  return (
    <NavigateFooter size={size}>
      <NavigateFooterContent>
        <NavigateFooterCopyright>© 2078 Global Inc.</NavigateFooterCopyright>
        <Social />
        <NavigateFooterLanguage />
        <Actions />
      </NavigateFooterContent>
    </NavigateFooter>
  )
}

export { DashboardFooter }
