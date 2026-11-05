"use client"

import { NextIntlClientProvider, useTranslations } from "next-intl"

import { WidgetBoard } from "@/components/dashboard/widgets/widget-board"
import { useWidgetPicker, WidgetPickerProvider } from "@/components/dashboard/widgets/widget-picker"
import { Button, ButtonIcon } from "@/components/ui/button"
import messages from "../../../../messages/en.json"

// Same actions as Head-Dashboard-03 (Customize, Add Widget) above the board, without needing a sign-in.
function Actions() {
  const t = useTranslations("widgets")
  const { open, customizing, setCustomizing } = useWidgetPicker()
  return (
    <div className="flex gap-3">
      <Button variant="outline" shape="pill" size="32" aria-pressed={customizing} onClick={() => setCustomizing(!customizing)}>
        <ButtonIcon src={customizing ? "/icons/material-done.svg" : "/icons/material-mode.svg"} />
        {customizing ? t("done") : t("customize")}
      </Button>
      <Button variant="dark" shape="pill" size="32" onClick={open}>
        <ButtonIcon src="/icons/material-add-circle.svg" />
        {t("add")}
      </Button>
    </div>
  )
}

export default function WidgetPickerPreviewPage() {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <WidgetPickerProvider>
        <main className="mx-auto flex max-w-282 flex-col gap-8 p-8">
          <Actions />
          <WidgetBoard />
        </main>
      </WidgetPickerProvider>
    </NextIntlClientProvider>
  )
}
