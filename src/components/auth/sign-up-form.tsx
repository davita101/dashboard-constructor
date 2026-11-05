"use client"

import { useSignUp } from "@clerk/nextjs"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { AuthField } from "@/components/auth/auth-field"
import { AuthSocialButtons } from "@/components/auth/auth-social-buttons"
import {
  Auth,
  AuthContent,
  AuthDescription,
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

// Figma Sign-Up-01 (open form on the panel, social buttons), wired to Clerk's custom flow (password + OAuth).
function SignUpForm({ redirectUrl = "/" }: { redirectUrl?: string }) {
  const { signUp, errors, fetchStatus } = useSignUp()
  const router = useRouter()
  const busy = fetchStatus === "fetching"
  const [failed, setFailed] = React.useState<string>()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFailed(undefined)
    const data = new FormData(event.currentTarget)
    const username = String(data.get("username") ?? "").trim()
    const { error } = await signUp.password({
      emailAddress: String(data.get("email")),
      password: String(data.get("password")),
      ...(username ? { username } : {}),
    })
    if (error) return
    if (signUp.status === "complete") {
      await signUp.finalize({ navigate: () => router.push(redirectUrl) })
    } else {
      const sent = await signUp.verifications.sendEmailCode()
      if (sent.error) return
      router.push("/verify")
    }
  }

  async function onProvider(provider: keyof typeof strategies) {
    setFailed(undefined)
    const { error } = await signUp.sso({
      strategy: strategies[provider],
      redirectUrl,
      redirectCallbackUrl: "/sso-callback",
    })
    if (error) setFailed(error.message)
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Auth gap="5">
        <AuthHead gap="compact">
          <AuthTitle className="text-base-800">Sign Up to Account</AuthTitle>
          <AuthDescription tone="subtle">Start New Project</AuthDescription>
        </AuthHead>
        <AuthContent>
          <AuthFields>
            <AuthField
              name="username"
              label="Username"
              icon="/icons/material-person.svg"
              autoComplete="username"
              placeholder="Username"
              error={errors.fields.username?.message}
            />
            <AuthField
              name="email"
              label="Email Address"
              icon="/icons/material-mail-outline.svg"
              type="email"
              autoComplete="email"
              placeholder="Email"
              error={errors.fields.emailAddress?.message}
              required
            />
            <AuthField
              name="password"
              label="Password"
              icon="/icons/material-lock.svg"
              type="password"
              autoComplete="new-password"
              placeholder="Enter Password"
              error={errors.fields.password?.message}
              required
            />
          </AuthFields>
          <AuthRow>
            <CheckboxField>
              <Checkbox />
              <CheckboxFieldContent>
                <CheckboxFieldTitle>Remember Me</CheckboxFieldTitle>
              </CheckboxFieldContent>
            </CheckboxField>
            <Link variant="blue" size="12" href="#">
              Terms and Policy
            </Link>
          </AuthRow>
          {(failed || errors.global?.[0]) && <FieldError>{failed ?? errors.global?.[0]?.message}</FieldError>}
          <Button type="submit" size="40" className="w-full" disabled={busy}>
            Create Account
          </Button>
          <AuthSocialButtons providers={["google", "facebook", "apple"]} onProvider={onProvider} disabled={busy} />
        </AuthContent>
        <AuthFooter>
          Already have an account?
          <Link variant="blue" size="12" render={<NextLink href="/sign-in" />}>
            Sign In
          </Link>
        </AuthFooter>
      </Auth>
    </form>
  )
}

export { SignUpForm }
