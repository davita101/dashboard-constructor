import { AuthSplit } from "@/components/auth/auth-split"
import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInPage() {
  return (
    <AuthSplit>
      <SignInForm />
    </AuthSplit>
  )
}
