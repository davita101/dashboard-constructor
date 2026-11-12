"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { toast, Toaster } from "@/components/ui/toast"

// Controls whose feature isn't built yet: mark them `data-soon` (or link to "#") and a click shows a "Coming soon" toast.
// One listener for the whole app, so Server Components only need the attribute.
const SOON = '[data-soon], a[href="#"]'

export function ComingSoon() {
  const t = useTranslations("comingSoon")

  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest(SOON) : null
      if (!target) return
      event.preventDefault()
      toast.add({ title: t("title"), timeout: 3000 })
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [t])

  return <Toaster limit={1} />
}
