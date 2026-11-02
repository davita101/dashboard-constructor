import {
  Auth,
  AuthActions,
  AuthContent,
  AuthDescription,
  AuthFields,
  AuthFooter,
  AuthHead,
  AuthPanel,
  AuthRow,
  AuthTitle,
} from "@/components/ui/auth"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxField, CheckboxFieldContent, CheckboxFieldTitle } from "@/components/ui/checkbox-field"
import { Link } from "@/components/ui/link"
import { AuthField } from "@/components/auth/auth-field"

// Figma Sign-Up-02 (9543:78546): long form in a card with Go Back / Continue, "Log In" footer below.
function SignUp02() {
  return (
    <Auth gap="5">
      <AuthPanel padding="tall">
        <AuthHead align="start" gap="compact">
          <AuthTitle className="text-base-800">Sign Up to Account</AuthTitle>
          <AuthDescription tone="subtle">Start New Project</AuthDescription>
        </AuthHead>
        <AuthContent>
          <AuthFields gap="5">
            <AuthField label="Username" icon="/icons/material-person.svg" placeholder="Username" />
            <AuthField label="Email Address" icon="/icons/material-mail-outline.svg" type="email" placeholder="Email" />
            <AuthField label="Create Password" icon="/icons/material-lock.svg" type="password" placeholder="Create Password" />
            <AuthField label="Repeat Password" icon="/icons/material-lock.svg" type="password" placeholder="Repeat Password" />
            <AuthField label="Company Name" icon="/icons/material-work.svg" placeholder="Company Name" />
            <AuthField label="VAT ID" icon="/icons/material-lock.svg" type="password" placeholder="000-000" />
          </AuthFields>
          <AuthRow className="justify-start gap-6">
            <CheckboxField>
              <Checkbox />
              <CheckboxFieldContent>
                <CheckboxFieldTitle>I agree with</CheckboxFieldTitle>
              </CheckboxFieldContent>
            </CheckboxField>
            <Link variant="blue" size="12" href="#">
              Terms and Policy
            </Link>
          </AuthRow>
          <AuthActions>
            <Button variant="outline" size="40">
              <ButtonIcon src="/icons/material-arrow-back.svg" />
              Go Back
            </Button>
            <Button size="40">Continue</Button>
          </AuthActions>
        </AuthContent>
      </AuthPanel>
      <AuthFooter>
        Already have an account?
        <Link variant="blue" size="12" href="#">
          Log In
        </Link>
      </AuthFooter>
    </Auth>
  )
}

export { SignUp02 }
