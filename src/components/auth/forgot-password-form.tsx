"use client"

import { useSignIn } from "@clerk/nextjs"
import NextLink from "next/link"
import { useRouter } from "next/navigation"

import { AuthField } from "@/components/auth/auth-field"
import { Auth, AuthContent, AuthDescription, AuthHead, AuthIcon, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Link } from "@/components/ui/link"

// Figma Forgot-Password (9543:78003), wired to Clerk: send a reset code, then go to /check-email.
function ForgotPasswordForm() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()
  const busy = fetchStatus === "fetching"

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const created = await signIn.create({ identifier: String(data.get("email")) })
    if (created.error) return
    const sent = await signIn.resetPasswordEmailCode.sendCode()
    if (sent.error) return
    router.push("/check-email")
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Auth size="280" gap="8" className="items-center">
        <AuthHead>
          <AuthIcon src="/icons/material-lock.svg" />
          <AuthTitle>Forgot Password?</AuthTitle>
          <AuthDescription>Leave your email and we will send you a link</AuthDescription>
        </AuthHead>
        <AuthContent>
          <AuthField
            name="email"
            label="Email Address"
            icon="/icons/material-mail-outline.svg"
            type="email"
            autoComplete="email"
            placeholder="Email"
            error={errors.fields.identifier?.message}
            required
          />
          {errors.global?.[0] && <FieldError>{errors.global[0].message}</FieldError>}
          <Button type="submit" size="40" className="w-full" disabled={busy}>
            Confirm
          </Button>
        </AuthContent>
        <Link variant="blue" size="12" render={<NextLink href="/sign-in" />}>
          Back to Log In
        </Link>
      </Auth>
    </form>
  )
}

export { ForgotPasswordForm }
