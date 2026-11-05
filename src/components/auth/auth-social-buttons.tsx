"use client"

import Image from "next/image"

import { AuthSocial } from "@/components/ui/auth"
import { Button, ButtonIcon } from "@/components/ui/button"
import { SeparatorGroup, SeparatorLabel } from "@/components/ui/separator"

// Figma Divider-Horizontal "OR" + Other: one Outline-Button per provider.
// Google and Apple art are not in public/icons/brands yet (google.svg, apple.svg).
type Provider = "google" | "facebook" | "apple"

function AuthSocialButtons({
  providers,
  onProvider,
  disabled,
}: {
  providers: Provider[]
  onProvider?: (provider: Provider) => void
  disabled?: boolean
}) {
  return (
    <>
      <SeparatorGroup>
        <SeparatorLabel>OR</SeparatorLabel>
      </SeparatorGroup>
      <AuthSocial>
        {providers.includes("google") && (
          <Button type="button" variant="outline" size="40" className="w-full" disabled={disabled} onClick={() => onProvider?.("google")}>
            <Image src="/icons/brands/google.svg" alt="" width={14} height={14} unoptimized />
            Sign In with Google
          </Button>
        )}
        {providers.includes("facebook") && (
          <Button type="button" variant="outline" size="40" className="w-full" disabled={disabled} onClick={() => onProvider?.("facebook")}>
            <Image src="/icons/brands/facebook.png" alt="" width={14} height={14} unoptimized />
            Continue with Facebook
          </Button>
        )}
        {providers.includes("apple") && (
          <Button type="button" variant="outline" size="40" className="w-full" disabled={disabled} onClick={() => onProvider?.("apple")}>
            <Image src="/icons/brands/apple.svg" alt="" width={16} height={16} unoptimized />
            Continue with Apple
          </Button>
        )}
      </AuthSocial>
    </>
  )
}

export { AuthSocialButtons }
