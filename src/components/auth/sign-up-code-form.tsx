"use client"

import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import * as React from "react"

import { OtpCodeField } from "@/components/auth/otp-code-field"
import { authStep, useStepGuard } from "@/components/auth/use-reset-guard"
import { Auth, AuthContent, AuthDescription, AuthFooter, AuthHead, AuthIcon, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Link } from "@/components/ui/link"

// Figma Activation (9543:78538), sign-up flavour, shown on /check-email, wired to Clerk: confirms the email code sent by Sign Up, then finishes the sign-up.
function SignUpCodeForm({ redirectUrl = "/dashboard" }: { redirectUrl?: string }) {
  const { signUp, errors, fetchStatus } = useSignUp()
  const router = useRouter()
  const ready = useStepGuard("signup-code", signUp.status === "missing_requirements")
  const busy = fetchStatus === "fetching"
  const [code, setCode] = React.useState("")
  const [failed, setFailed] = React.useState<string>()
  const [resent, setResent] = React.useState(false)

  async function confirm(event?: React.FormEvent) {
    event?.preventDefault()
    setFailed(undefined)
    const { error } = await signUp.verifications.verifyEmailCode({ code })
    if (error) return
    if (signUp.status === "complete") {
      authStep.clear()
      await signUp.finalize({ navigate: () => router.push(redirectUrl) })
    } else {
      setFailed("Sign up is not complete. Go back to Sign Up and start again.")
    }
  }

  async function resend(event: React.MouseEvent) {
    event.preventDefault()
    setResent(false)
    setFailed(undefined)
    const { error } = await signUp.verifications.sendEmailCode()
    if (!error) setResent(true)
  }

  const message = failed ?? errors.fields.code?.message ?? errors.global?.[0]?.message

  return (
    <form onSubmit={confirm} noValidate inert={!ready} className={ready ? undefined : "invisible"}>
      <Auth gap="8" className="items-center">
        <AuthHead className="px-11">
          <AuthIcon src="/icons/material-mail-outline.svg" />
          <AuthTitle>Verify Your Email</AuthTitle>
          <AuthDescription tone="large">
            Please enter 6 digit code sent to {signUp.emailAddress ?? "your email"}
          </AuthDescription>
        </AuthHead>
        <AuthContent>
          <OtpCodeField label="Code" value={code} onChange={setCode} invalid={!!message} disabled={busy} />
          {message && <FieldError>{message}</FieldError>}
          <Button type="submit" size="40" className="w-full" disabled={busy || code.length < 6}>
            Confirm
          </Button>
        </AuthContent>
        <AuthFooter role="status">
          {resent ? (
            "We sent you a new code."
          ) : (
            <>
              Didn’t receive a code?
              <Link variant="blue" size="12" href="#" onClick={resend} aria-disabled={busy}>
                Resend
              </Link>
            </>
          )}
        </AuthFooter>
      </Auth>
    </form>
  )
}

export { SignUpCodeForm }
