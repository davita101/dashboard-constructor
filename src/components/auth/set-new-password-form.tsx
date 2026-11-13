"use client"

import { useSignIn } from "@clerk/nextjs"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { AuthField } from "@/components/auth/auth-field"
import { rememberMe } from "@/components/auth/remember-me"
import { authStep, useStepGuard } from "@/components/auth/use-reset-guard"
import { Auth, AuthContent, AuthDescription, AuthFields, AuthHead, AuthIcon, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Link } from "@/components/ui/link"

// Figma New-Password (9543:78368) wired to Clerk, 280 wide so it fits the 320 auth card padding: the reset code is already verified on /check-email.
function SetNewPasswordForm({ redirectUrl = "/password-reset" }: { redirectUrl?: string }) {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()
  const busy = fetchStatus === "fetching"
  const ready = useStepGuard("password", signIn.status === "needs_new_password")
  const [failed, setFailed] = React.useState<string>()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFailed(undefined)
    const data = new FormData(event.currentTarget)
    const password = String(data.get("password"))
    if (password !== String(data.get("repeat"))) {
      setFailed("Passwords do not match.")
      return
    }
    try {
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({ password })
      if (error) return
      if (signIn.status === "complete") {
        authStep.set("done")
        rememberMe.set(true)
        await signIn.finalize({ navigate: () => router.push(redirectUrl) })
      } else {
        setFailed("Additional verification is required. This step is not available yet.")
      }
    } catch {
      setFailed("This reset has expired. Go back to Forgot Password and request a new code.")
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate inert={!ready} className={ready ? undefined : "invisible"}>
      <Auth size="280" gap="8" className="items-center">
        <AuthHead className="px-9">
          <AuthIcon src="/icons/material-lock.svg" />
          <AuthTitle>Set New Password</AuthTitle>
          <AuthDescription>Your new password must be different from previously used passwords.</AuthDescription>
        </AuthHead>
        <AuthContent>
          <AuthFields gap="5">
            <AuthField
              name="password"
              label="Password"
              icon="/icons/material-lock.svg"
              type="password"
              autoComplete="new-password"
              placeholder="Enter Password"
              description="Must Be at Least 12 Characters"
              error={errors.fields.password?.message}
              required
            />
            <AuthField
              name="repeat"
              label="Repeat Password"
              icon="/icons/material-lock.svg"
              type="password"
              autoComplete="new-password"
              placeholder="Enter Password"
              required
            />
          </AuthFields>
          {(failed || errors.global?.[0]) && <FieldError>{failed ?? errors.global?.[0]?.message}</FieldError>}
          <Button type="submit" size="40" className="w-full" disabled={busy}>
            Reset Password
          </Button>
        </AuthContent>
        <Link variant="blue" size="12" render={<NextLink href="/sign-in" />}>
          Back to Log In
        </Link>
      </Auth>
    </form>
  )
}

export { SetNewPasswordForm }
