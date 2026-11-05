"use client"

import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import * as React from "react"

import { ResetCodeForm } from "@/components/auth/reset-code-form"
import { SignUpCodeForm } from "@/components/auth/sign-up-code-form"
import { authStep, useAuthStep } from "@/components/auth/use-reset-guard"

// /check-email serves both code steps: after Sign Up (verify the email) and after Forgot Password (reset code).
// The step marker says which one; with no marker (page opened by URL) the user goes back to Forgot Password.
// While the marker is unknown a same-height placeholder is shown, so the card never collapses or jumps.
function CheckEmailForm() {
  const marker = useAuthStep()
  const { loaded } = useClerk()
  const router = useRouter()

  React.useEffect(() => {
    const current = authStep.get()
    if (loaded && current !== "reset-code" && current !== "signup-code") router.replace("/forgot-password")
  }, [loaded, router])

  if (marker === "signup-code") return <SignUpCodeForm />
  if (marker === "reset-code") return <ResetCodeForm />
  return <div aria-hidden className="h-81 w-70" />
}

export { CheckEmailForm }
