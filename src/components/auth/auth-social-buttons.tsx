import Image from "next/image"

import { AuthSocial } from "@/components/ui/auth"
import { Button, ButtonIcon } from "@/components/ui/button"
import { SeparatorGroup, SeparatorLabel } from "@/components/ui/separator"

// Figma Divider-Horizontal "OR" + Other: one Outline-Button per provider.
// Google and Apple art are not in public/icons/brands yet (google.svg, apple.svg).
function AuthSocialButtons({ providers }: { providers: ("google" | "facebook" | "apple")[] }) {
  return (
    <>
      <SeparatorGroup>
        <SeparatorLabel>OR</SeparatorLabel>
      </SeparatorGroup>
      <AuthSocial>
        {providers.includes("google") && (
          <Button variant="outline" size="40" className="w-full">
            <Image src="/icons/brands/google.svg" alt="" width={14} height={14} unoptimized />
            Sign In with Google
          </Button>
        )}
        {providers.includes("facebook") && (
          <Button variant="outline" size="40" className="w-full">
            <Image src="/icons/brands/facebook.png" alt="" width={14} height={14} unoptimized />
            Continue with Facebook
          </Button>
        )}
        {providers.includes("apple") && (
          <Button variant="outline" size="40" className="w-full">
            <ButtonIcon src="/icons/brands/apple.svg" />
            Continue with Apple
          </Button>
        )}
      </AuthSocial>
    </>
  )
}

export { AuthSocialButtons }
