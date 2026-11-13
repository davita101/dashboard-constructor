"use client"

import { useClerk, useSignIn } from "@clerk/nextjs"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { AuthField } from "@/components/auth/auth-field"
import { AuthSocialButtons } from "@/components/auth/auth-social-buttons"
import { rememberMe } from "@/components/auth/remember-me"
import {
  Auth,
  AuthContent,
  AuthFields,
  AuthHead,
  AuthRow,
  AuthTitle,
  AuthFooter,
} from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxField, CheckboxFieldContent, CheckboxFieldTitle } from "@/components/ui/checkbox-field"
import { FieldError } from "@/components/ui/field"
import { Link } from "@/components/ui/link"

const strategies = {
  google: "oauth_google",
  facebook: "oauth_facebook",
  apple: "oauth_apple",
} as const

// Figma Sign-In-01 (open form on the panel, social buttons), wired to Clerk's custom flow (password + OAuth).
function SignInForm({ redirectUrl = "/dashboard" }: { redirectUrl?: string }) {
  const { signIn, errors, fetchStatus } = useSignIn()
  const clerk = useClerk()
  const router = useRouter()
  const busy = fetchStatus === "fetching"
  const [failed, setFailed] = React.useState<string>()
  const [remember, setRemember] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFailed(undefined)
    const data = new FormData(event.currentTarget)
    rememberMe.set(remember)
    const { error } = await signIn.password({
      identifier: String(data.get("email")),
      password: String(data.get("password")),
    })
    if (error) return
    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: () => router.push(redirectUrl) })
    } else {
      setFailed("Additional verification is required. This step is not available yet.")
    }
  }

  async function onProvider(provider: keyof typeof strategies) {
    setFailed(undefined)
    rememberMe.set(remember)
    // Not signIn.sso(): it reuses an attempt already in progress (e.g. after a wrong password, status
    // needs_first_factor) and then resolves without redirecting. authenticateWithRedirect always starts a new one.
    try {
      await clerk.client?.signIn.authenticateWithRedirect({
        strategy: strategies[provider],
        redirectUrl: "/sso-callback",
        redirectUrlComplete: redirectUrl,
      })
    } catch (error) {
      setFailed(error instanceof Error ? error.message : "Could not start sign-in, try again")
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Auth gap="5">
        <AuthHead align="center" gap="compact">
          <AuthTitle>Sign in to Account</AuthTitle>
        </AuthHead>
        <AuthContent>
      <AuthFields>
        <AuthField
          name="email"
          label="Email Address"
          icon="/icons/material-mail-outline.svg"
          type="email"
          autoComplete="email"
          placeholder="username@google.com"
          error={errors.fields.identifier?.message}
          required
        />
        <AuthField
          name="password"
          label="Password"
          icon="/icons/material-lock.svg"
          type="password"
          autoComplete="current-password"
          placeholder="Enter Password"
          error={errors.fields.password?.message}
          required
        />
      </AuthFields>
      <AuthRow>
        <CheckboxField>
          <Checkbox checked={remember} onCheckedChange={setRemember} />
          <CheckboxFieldContent>
            <CheckboxFieldTitle>Remember Me</CheckboxFieldTitle>
          </CheckboxFieldContent>
        </CheckboxField>
        <Link variant="blue" size="12" render={<NextLink href="/forgot-password" />}>
          Forgot password?
        </Link>
      </AuthRow>
      {(failed || errors.global?.[0]) && <FieldError>{failed ?? errors.global?.[0]?.message}</FieldError>}
      <Button type="submit" size="40" className="w-full" disabled={busy}>
        Sign In
      </Button>
      <AuthSocialButtons providers={["google", "facebook", "apple"]} onProvider={onProvider} disabled={busy} />
        </AuthContent>
        <AuthFooter>
          Not a member?
          <Link variant="blue" size="12" render={<NextLink href="/sign-up" />}>
            Create Account
          </Link>
        </AuthFooter>
      </Auth>
    </form>
  )
}

export { SignInForm }
