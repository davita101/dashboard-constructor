"use client"

import { useTranslations } from "next-intl"

import { LanguageMenu, useLanguage } from "@/components/dashboard/language"
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
      <NavigateFooterIconButton icon="/icons/social/facebook-gray.svg" aria-label="Facebook" data-soon />
      <NavigateFooterIconButton icon="/icons/brands/x-twitter.png" aria-label="X" data-soon />
      <NavigateFooterIconButton icon="/icons/material-instagram.svg" aria-label="Instagram" data-soon />
      <NavigateFooterIconButton icon="/icons/social/pinterest-gray.svg" aria-label="Pinterest" data-soon />
    </NavigateFooterGroup>
  )
}

function Language() {
  const { language } = useLanguage()
  const t = useTranslations()
  return (
    <LanguageMenu
      trigger={<NavigateFooterLanguage>{t("footer.language", { name: language.native })}</NavigateFooterLanguage>}
    />
  )
}

function Actions() {
  const t = useTranslations("footer")
  return (
    <NavigateFooterGroup>
      <NavigateFooterIconButton icon="/icons/material-chat-bubble.svg" aria-label={t("chat")} data-soon />
      <NavigateFooterIconButton
        icon="/icons/material-arrow-upward.svg"
        aria-label={t("backToTop")}
        onClick={(e) => {
          // Desktop/tablet content scrolls in the shell's ScrollArea; mobile scrolls the window.
          const viewport = e.currentTarget.closest('[data-slot="scroll-area-viewport"]')
          ;(viewport ?? window).scrollTo({ top: 0, behavior: "smooth" })
        }}
      />
    </NavigateFooterGroup>
  )
}

/** Figma Footer: one row at 1600 and 768, three stacked rows at 360. */
function DashboardFooter({ size }: { size: DashboardSize }) {
  const t = useTranslations("footer")
  if (size === "mobile") {
    return (
      <NavigateFooter size="mobile">
        <NavigateFooterRow>
          <Social />
        </NavigateFooterRow>
        <NavigateFooterRow>
          <Language />
          <Actions />
        </NavigateFooterRow>
        <NavigateFooterRow>
          <NavigateFooterCopyright>{t("copyright")}</NavigateFooterCopyright>
        </NavigateFooterRow>
      </NavigateFooter>
    )
  }
  return (
    <NavigateFooter size={size}>
      <NavigateFooterContent>
        <NavigateFooterCopyright>{t("copyright")}</NavigateFooterCopyright>
        <Social />
        <Language />
        <Actions />
      </NavigateFooterContent>
    </NavigateFooter>
  )
}

export { DashboardFooter }
