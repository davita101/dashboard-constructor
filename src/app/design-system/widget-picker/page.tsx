"use client"

import { NextIntlClientProvider } from "next-intl"

import { useWidgetPicker, WidgetPickerProvider } from "@/components/dashboard/widgets/widget-picker"
import { Button } from "@/components/ui/button"
import messages from "../../../../messages/en.json"

function OpenButton() {
  const { open } = useWidgetPicker()
  return (
    <Button variant="dark" size="32" shape="pill" onClick={open}>
      Open picker
    </Button>
  )
}

export default function WidgetPickerPreviewPage() {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <WidgetPickerProvider>
        <main className="mx-auto flex max-w-desktop flex-col gap-4 p-8">
          <OpenButton />
        </main>
      </WidgetPickerProvider>
    </NextIntlClientProvider>
  )
}
