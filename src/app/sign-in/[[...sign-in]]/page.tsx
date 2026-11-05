import { AuthShowcase } from "@/components/auth/auth-showcase"
import { SignInForm } from "@/components/auth/sign-in-form"
import { AuthPanel } from "@/components/ui/auth"

// Figma "Main (360)" below lg: one column, 20px padding, 16px between a form panel and a photo panel.
// Figma "Sing In (1600)" from lg: two 24px-inset panels 24px apart.
// The showcase panel keeps one fixed height, whatever slide is showing.
export default function SignInPage() {
  return (
    <main className="mx-auto grid min-h-svh w-full max-w-160 grid-cols-1 gap-4 bg-background-20 p-5 lg:max-w-none lg:grid-cols-2 lg:gap-6 lg:p-6">
      <section className="flex items-center justify-center rounded-r20 bg-background-0 p-5 lg:p-6">
        <AuthPanel padding="responsive" className="mx-auto max-w-70 lg:max-w-80">
          <SignInForm />
        </AuthPanel>
      </section>
      <aside className="relative h-213 overflow-hidden rounded-r20 lg:sticky lg:top-6 lg:h-[calc(100svh-3rem)] lg:min-h-160">
        <AuthShowcase />
      </aside>
    </main>
  )
}
