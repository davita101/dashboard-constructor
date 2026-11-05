import NextLink from "next/link"

import { Auth, AuthContent, AuthDescription, AuthHead, AuthIcon, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

// Figma Password-Reset-Done (9543:78530): 320 wide, green icon disc.
function PasswordResetDone({
  confirmHref = "/",
  loginHref = "/sign-in",
  size = "320",
}: {
  confirmHref?: string
  loginHref?: string
  size?: "280" | "320"
}) {
  return (
    <Auth size={size} gap="8" className="items-center">
      <AuthHead>
        <AuthIcon tone="success" src="/icons/material-check.svg" />
        <AuthTitle>Password Reset</AuthTitle>
        <AuthDescription>Your password has been successfully reset.</AuthDescription>
      </AuthHead>
      <AuthContent>
        <Button size="40" className="w-full" nativeButton={false} render={<NextLink href={confirmHref} />}>
          Confirm
        </Button>
      </AuthContent>
      <Link variant="blue" size="12" render={<NextLink href={loginHref} />}>
        Back to Log In
      </Link>
    </Auth>
  )
}

export { PasswordResetDone }
