import { Auth, AuthContent, AuthDescription, AuthHead, AuthIcon, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { AuthField } from "@/components/auth/auth-field"

// Figma Forgot-Password (9543:78003): 320 wide.
function ForgotPassword() {
  return (
    <Auth size="320" gap="8" className="items-center">
      <AuthHead>
        <AuthIcon src="/icons/material-lock.svg" />
        <AuthTitle>Forgot Password?</AuthTitle>
        <AuthDescription>Leave your email and we will send you a link</AuthDescription>
      </AuthHead>
      <AuthContent>
        <AuthField label="Email Address" icon="/icons/material-mail-outline.svg" type="email" placeholder="Email" />
        <Button size="40" className="w-full">
          Confirm
        </Button>
      </AuthContent>
      <Link variant="blue" size="12" href="#">
        Back to Log In
      </Link>
    </Auth>
  )
}

export { ForgotPassword }
