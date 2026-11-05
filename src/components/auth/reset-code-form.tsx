"use client"

import { useSignIn } from "@clerk/nextjs"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { OtpCodeField } from "@/components/auth/otp-code-field"
import { authStep, useStepGuard } from "@/components/auth/use-reset-guard"
import { Auth, AuthContent, AuthDescription, AuthFooter, AuthHead, AuthIcon, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Link } from "@/components/ui/link"

// Figma Check-Email (9543:78360), reset flavour, wired to Clerk: enter the reset code (Activation code field), then go to
// /set-new-password. "Resend" sends the code again.
function ResetCodeForm() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const [resent, setResent] = React.useState(false)
  const [failed, setFailed] = React.useState<string>()
  const busy = fetchStatus === "fetching"
  const router = useRouter()
  const ready = useStepGuard("reset-code", signIn.status === "needs_first_factor")
  const [code, setCode] = React.useState("")

  async function confirm(event: React.FormEvent) {
    event.preventDefault()
    setFailed(undefined)
    try {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code })
      if (!error) {
        authStep.set("password")
        router.push("/set-new-password")
      }
    } catch {
      setFailed("This reset has expired. Go back to Forgot Password and request a new code.")
    }
  }

  const message = failed ?? errors.fields.code?.message ?? errors.global?.[0]?.message

  async function resend(event: React.MouseEvent) {
    event.preventDefault()
    setResent(false)
    setFailed(undefined)
    try {
      const { error } = await signIn.resetPasswordEmailCode.sendCode()
      if (error) setFailed(error.message)
      else setResent(true)
    } catch {
      // Clerk throws when there is no active reset (page opened directly, or the attempt expired).
      setFailed("This reset has expired. Go back to Forgot Password and request a new code.")
    }
  }

  return (
    <form onSubmit={confirm} noValidate inert={!ready} className={ready ? undefined : "invisible"}>
    <Auth size="280" gap="8" className="items-center">
      <AuthHead>
        <AuthIcon src="/icons/material-mail-outline.svg" />
        <AuthTitle className="text-base-800">Check Your Email</AuthTitle>
        <AuthDescription>We sent a password reset code</AuthDescription>
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
      <Link variant="blue" size="12" render={<NextLink href="/sign-in" />}>
        Back to Log In
      </Link>
    </Auth>
    </form>
  )
}

export { ResetCodeForm }
