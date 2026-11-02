import { Auth, AuthContent, AuthDescription, AuthFields, AuthHead, AuthRow, AuthTitle } from "@/components/ui/auth"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxField, CheckboxFieldContent, CheckboxFieldTitle } from "@/components/ui/checkbox-field"
import { Link } from "@/components/ui/link"
import { AuthField } from "@/components/auth/auth-field"
import { AuthSocialButtons } from "@/components/auth/auth-social-buttons"

// Figma Sign-Up-01 (9543:78093): open form, 280 wide.
function SignUp01() {
  return (
    <Auth gap="5">
      <AuthHead gap="compact">
        <AuthTitle className="text-base-800">Sign Up to Account</AuthTitle>
        <AuthDescription tone="subtle">Start New Project</AuthDescription>
      </AuthHead>
      <AuthContent>
        <AuthFields>
          <AuthField label="Username" icon="/icons/material-person.svg" placeholder="Username" />
          <AuthField label="Email Address" icon="/icons/material-mail-outline.svg" type="email" placeholder="Email" />
          <AuthField label="Password" icon="/icons/material-lock.svg" type="password" placeholder="Enter Password" />
        </AuthFields>
        <AuthRow>
          <CheckboxField>
            <Checkbox />
            <CheckboxFieldContent>
              <CheckboxFieldTitle>Remember Me</CheckboxFieldTitle>
            </CheckboxFieldContent>
          </CheckboxField>
          <Link variant="blue" size="12" href="#">
            Terms and Policy
          </Link>
        </AuthRow>
        <Button size="40" className="w-full">
          Create Account
        </Button>
        <AuthSocialButtons providers={["google", "facebook"]} />
      </AuthContent>
    </Auth>
  )
}

export { SignUp01 }
