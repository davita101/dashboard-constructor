import { RedirectIfSignedIn } from "@/components/auth/redirect-if-signed-in"
import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInPage() {
  return (
    <>
      <RedirectIfSignedIn />
      <SignInForm demo={Boolean(process.env.DEMO_EMAIL && process.env.DEMO_PASSWORD)} />
    </>
  )
}
