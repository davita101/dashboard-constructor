import {
  Auth,
  AuthContent,
  AuthDescription,
  AuthFields,
  AuthFooter,
  AuthHead,
  AuthPanel,
  AuthRow,
  AuthTitle,
} from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxField, CheckboxFieldContent, CheckboxFieldTitle } from "@/components/ui/checkbox-field"
import { Link } from "@/components/ui/link"
import { AuthField } from "@/components/auth/auth-field"

// Figma Sign-In-02 (9540:8559): form in a card, "Not a member?" footer below it.
function SignIn02() {
  return (
    <Auth gap="5">
      <AuthPanel>
        <AuthHead align="start" gap="compact">
          <AuthTitle>Sign in to Account</AuthTitle>
          <AuthDescription tone="accent">Start Your 14 day free trial</AuthDescription>
        </AuthHead>
        <AuthContent>
          <AuthFields>
            <AuthField label="Email Address" icon="/icons/material-mail-outline.svg" type="email" placeholder="username@google.com" />
            <AuthField label="Password" icon="/icons/material-lock.svg" type="password" placeholder="Enter Password" defaultValue="123456" />
          </AuthFields>
          <AuthRow className="px-1">
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
        </AuthContent>
      </AuthPanel>
      <AuthFooter>
        Not a member?
        <Link variant="blue" size="12" href="#">
          Create Account
        </Link>
      </AuthFooter>
    </Auth>
  )
}

export { SignIn02 }
