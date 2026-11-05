"use client"

import { PasswordResetDone } from "@/components/auth/password-reset-done"
import { useStepGuard } from "@/components/auth/use-reset-guard"

// /password-reset: the done screen only shows right after a successful reset (marker set by Set New Password).
function PasswordResetGate() {
  const ready = useStepGuard("done", true)
  return (
    <div inert={!ready} className={ready ? undefined : "invisible"}>
      <PasswordResetDone size="280" />
    </div>
  )
}

export { PasswordResetGate }
