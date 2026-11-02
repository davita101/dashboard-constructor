import { Auth, AuthContent, AuthDescription, AuthHead, AuthIcon, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

// Figma Password-Reset-Done (9543:78530): 320 wide, green icon disc.
function PasswordResetDone() {
  return (
    <Auth size="320" gap="8" className="items-center">
      <AuthHead>
        <AuthIcon tone="success" src="/icons/material-check.svg" />
        <AuthTitle>Password Reset</AuthTitle>
        <AuthDescription>Your password has been successfully reset.</AuthDescription>
      </AuthHead>
      <AuthContent>
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

export { PasswordResetDone }
