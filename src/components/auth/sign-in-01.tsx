import { Auth, AuthContent, AuthDescription, AuthFields, AuthHead, AuthRow, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxField, CheckboxFieldContent, CheckboxFieldTitle } from "@/components/ui/checkbox-field"
import { Link } from "@/components/ui/link"
import { AuthField } from "@/components/auth/auth-field"
import { AuthSocialButtons } from "@/components/auth/auth-social-buttons"

// Figma Sign-In-01 (9540:8379): open form, 280 wide.
function SignIn01() {
  return (
    <Auth gap="5">
      <AuthHead gap="compact">
        <AuthTitle>Sign in to Account</AuthTitle>
        <AuthDescription tone="accent">Start Your 14 day free trial</AuthDescription>
      </AuthHead>
      <AuthContent>
        <AuthFields>
          <AuthField label="Email Address" icon="/icons/material-mail-outline.svg" type="email" placeholder="username@google.com" />
          <AuthField label="Password" icon="/icons/material-lock.svg" type="password" placeholder="Enter Password" defaultValue="123456" />
        </AuthFields>
        <AuthRow>
          <CheckboxField>
            <Checkbox />
            <CheckboxFieldContent>
              <CheckboxFieldTitle>Remember Me</CheckboxFieldTitle>
            </CheckboxFieldContent>
          </CheckboxField>
          <Link variant="blue" size="12" href="#">
            Forgot password?
          </Link>
        </AuthRow>
        <Button size="40" className="w-full">
          Sign In
        </Button>
        <AuthSocialButtons providers={["google", "facebook", "apple"]} />
      </AuthContent>
    </Auth>
  )
}

export { SignIn01 }
