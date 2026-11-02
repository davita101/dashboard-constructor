import { Auth, AuthContent, AuthDescription, AuthFooter, AuthHead, AuthIcon, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

// Figma Check-Email (9543:78360): 320 wide.
function CheckEmail() {
  return (
    <Auth size="320" gap="8" className="items-center">
      <AuthHead>
        <AuthIcon src="/icons/material-mail-outline.svg" />
        <AuthTitle className="text-base-800">Check Your Email</AuthTitle>
        <AuthDescription>We sent a password reset link</AuthDescription>
      </AuthHead>
      <AuthContent>
        <Button size="40" className="w-full">
          Open Email App
        </Button>
      </AuthContent>
      <AuthFooter>
        Didn’t receive a Link?
        <Link variant="blue" size="12" href="#">
          Resend
        </Link>
      </AuthFooter>
      <Link variant="blue" size="12" href="#">
        Back to Log In
      </Link>
    </Auth>
  )
}

export { CheckEmail }
