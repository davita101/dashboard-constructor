"use client"

import { useSignUp } from "@clerk/nextjs"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { AuthField } from "@/components/auth/auth-field"
import { AuthSocialButtons } from "@/components/auth/auth-social-buttons"
import { rememberMe } from "@/components/auth/remember-me"
import { authStep } from "@/components/auth/use-reset-guard"
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
function SignUpForm({ redirectUrl = "/dashboard" }: { redirectUrl?: string }) {
  const { signUp, errors, fetchStatus } = useSignUp()
  const router = useRouter()
  const busy = fetchStatus === "fetching"
  const [failed, setFailed] = React.useState<string>()
  const [remember, setRemember] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFailed(undefined)
    rememberMe.set(remember)
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
      authStep.set("signup-code")
      router.push("/check-email")
    }
  }

  async function onProvider(provider: keyof typeof strategies) {
    setFailed(undefined)
    rememberMe.set(remember)
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
              <Checkbox checked={remember} onCheckedChange={setRemember} />
              <CheckboxFieldContent>
                <CheckboxFieldTitle>Remember Me</CheckboxFieldTitle>
              </CheckboxFieldContent>
            </CheckboxField>
            <Link variant="blue" size="12" href="#">
              Terms and Policy
            </Link>
          </AuthRow>
          {(failed || errors.global?.[0]) && <FieldError>{failed ?? errors.global?.[0]?.message}</FieldError>}
          {/* Clerk renders its bot-protection challenge here when it needs one. */}
          <div id="clerk-captcha" />
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
