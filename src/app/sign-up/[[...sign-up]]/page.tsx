import { AuthSplit } from "@/components/auth/auth-split"
import { SignUpForm } from "@/components/auth/sign-up-form"

export default function SignUpPage() {
  return (
    <AuthSplit>
      <SignUpForm />
    </AuthSplit>
  )
}
