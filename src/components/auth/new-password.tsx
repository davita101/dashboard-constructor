import { Auth, AuthContent, AuthDescription, AuthFields, AuthHead, AuthIcon, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { AuthField } from "@/components/auth/auth-field"

// Figma New-Password (9543:78368): 320 wide.
function NewPassword() {
  return (
    <Auth size="320" gap="8" className="items-center">
      <AuthHead className="px-14">
        <AuthIcon src="/icons/material-lock.svg" />
        <AuthTitle>Set New Password</AuthTitle>
        <AuthDescription>Your New Password Must be Different to perviousle used passwords.</AuthDescription>
      </AuthHead>
      <AuthContent>
        <AuthFields gap="5">
          <AuthField
            label="Password"
            icon="/icons/material-lock.svg"
            type="password"
            placeholder="Enter Password"
            description="Must Be at Least 12 Characters"
          />
          <AuthField label="Repeat Password" icon="/icons/material-lock.svg" type="password" placeholder="Enter Password" />
        </AuthFields>
        <Button size="40" className="w-full">
          Reset Password
        </Button>
      </AuthContent>
      <Link variant="blue" size="12" href="#">
        Back to Log In
      </Link>
    </Auth>
  )
}

export { NewPassword }
