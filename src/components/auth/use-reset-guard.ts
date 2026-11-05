"use client"

import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import * as React from "react"

// Guards the code/password steps (/check-email, /set-new-password, /password-reset) so they cannot be opened
// by URL. A page opens only when BOTH hold:
//  1. a step marker (sessionStorage) set by the previous step of this same tab, and
//  2. Clerk's own attempt is in the matching state (`statusOk`, e.g. a reset code was sent -> needs_first_factor).
//     The attempt lives on Clerk's server, so it cannot be faked here.
// The real enforcement is Clerk's backend: verifyCode / submitPassword fail without a valid attempt.
// "/password-reset" additionally requires a Clerk session (see proxy.ts), because finishing the reset signs you in.

type Step = "reset-code" | "signup-code" | "password" | "done"

const KEY = "auth-step"
const EVENT = "auth-step-change"

const authStep = {
  set(step: Step) {
    sessionStorage.setItem(KEY, step)
    window.dispatchEvent(new Event(EVENT))
  },
  get() {
    return sessionStorage.getItem(KEY)
  },
  clear() {
    sessionStorage.removeItem(KEY)
    window.dispatchEvent(new Event(EVENT))
  },
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  return () => window.removeEventListener(EVENT, onChange)
}

/** The step marker; null on the server and before hydration. */
function useAuthStep() {
  return React.useSyncExternalStore(subscribe, authStep.get, () => null)
}

/**
 * True when the page may show its content; otherwise redirects (replace, no history entry).
 * Render the page invisible, not empty, while this is false so the layout does not jump.
 */
function useStepGuard(step: Step, statusOk: boolean) {
  const { loaded } = useClerk()
  const router = useRouter()
  const marker = useAuthStep()
  const ready = loaded && marker === step

  // Decided once, when Clerk has loaded. Later status changes (verifyCode -> needs_new_password) must not redirect.
  const checked = React.useRef(false)
  React.useEffect(() => {
    if (!loaded || checked.current) return
    checked.current = true
    if (authStep.get() !== step || !statusOk) router.replace(step === "done" ? "/" : "/forgot-password")
  }, [loaded, step, statusOk, router])

  return ready
}

export { authStep, useAuthStep, useStepGuard }
