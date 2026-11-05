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
      <NavigateFooterIconButton icon="/icons/material-default-icon.svg" aria-label="Facebook" />
      <NavigateFooterIconButton icon="/icons/brands/x-twitter.png" aria-label="X" />
      <NavigateFooterIconButton icon="/icons/material-instagram.svg" aria-label="Instagram" />
      <NavigateFooterIconButton icon="/icons/material-default-icon.svg" aria-label="Pinterest" />
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
      <NavigateFooterIconButton icon="/icons/material-chat-bubble.svg" aria-label={t("chat")} />
      <NavigateFooterIconButton icon="/icons/material-arrow-upward.svg" aria-label={t("backToTop")} />
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
