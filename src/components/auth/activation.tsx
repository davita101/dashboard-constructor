import { Auth, AuthContent, AuthDescription, AuthFooter, AuthHead, AuthIcon, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { OtpCodeField } from "@/components/auth/otp-code-field"

// Figma Activation (9543:78538): 280 wide.
function Activation({ pinActive }: { pinActive?: boolean }) {
  return (
    <Auth gap="8" className="items-center">
      <AuthHead className="px-11">
        <AuthIcon src="/icons/material-mail-outline.svg" />
        <AuthTitle>Verify Your Email</AuthTitle>
        <AuthDescription tone="large">Please enter 6 digit code sent to example@gmail.com</AuthDescription>
      </AuthHead>
      <AuthContent>
        <OtpCodeField label="Label" description="Text Bottom" pinActive={pinActive} />
        <Button size="40" className="w-full">
          Confirm
        </Button>
      </AuthContent>
      <AuthFooter>
        Didn’t receive a code?
        <Link variant="blue" size="12" href="#">
          Resend
        </Link>
      </AuthFooter>
    </Auth>
  )
}

export { Activation }
