"use client"

import { useSignIn } from "@clerk/nextjs"
import NextLink from "next/link"
import * as React from "react"

import { Auth, AuthContent, AuthDescription, AuthFooter, AuthHead, AuthIcon, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Link } from "@/components/ui/link"

// Figma Check-Email (9543:78360) wired to Clerk: "Resend" sends the reset code again.
function CheckEmailForm() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const [resent, setResent] = React.useState(false)
  const [failed, setFailed] = React.useState<string>()
  const busy = fetchStatus === "fetching"

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
    <Auth size="280" gap="8" className="items-center">
      <AuthHead>
        <AuthIcon src="/icons/material-mail-outline.svg" />
        <AuthTitle className="text-base-800">Check Your Email</AuthTitle>
        <AuthDescription>We sent a password reset code</AuthDescription>
      </AuthHead>
      <AuthContent>
        {(failed || errors.global?.[0]) && <FieldError>{failed ?? errors.global?.[0]?.message}</FieldError>}
        <Button size="40" className="w-full" nativeButton={false} render={<a href="mailto:" />}>
          Open Email App
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
  )
}

export { CheckEmailForm }
