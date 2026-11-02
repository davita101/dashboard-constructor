import * as React from "react"

import {
  Auth,
  AuthContent,
  AuthDescription,
  AuthFooter,
  AuthHead,
  AuthIcon,
  AuthQr,
  AuthTitle,
} from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { QrCode, QrCodeCode } from "@/components/ui/qr-code"
import { OtpCodeField } from "@/components/auth/otp-code-field"

// Figma Two-Factor-Authentication (9543:78351): 280 wide. `qr` is the code image/svg (Figma ships none).
function TwoFactorAuthentication({ qr, pinActive }: { qr?: React.ReactNode; pinActive?: boolean }) {
  return (
    <Auth gap="8" className="items-center">
      <AuthHead>
        <AuthIcon src="/icons/material-lock.svg" />
        <AuthTitle className="text-base-800">Two-factor Authentication</AuthTitle>
        <AuthDescription>We have sent a code to your mobile phone</AuthDescription>
      </AuthHead>
      <AuthQr>
        <QrCode size="lg">
          <QrCodeCode>{qr}</QrCodeCode>
        </QrCode>
      </AuthQr>
      <AuthContent>
        <OtpCodeField label="Code" pinActive={pinActive} />
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

export { TwoFactorAuthentication }
