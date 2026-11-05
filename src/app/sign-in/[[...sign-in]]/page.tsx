import { AuthShowcase } from "@/components/auth/auth-showcase"
import { SignInForm } from "@/components/auth/sign-in-form"
import { AuthPanel } from "@/components/ui/auth"

// Figma "Sing In (1600)" (14056:126280): page #fafafa, two 24px-inset panels 24px apart.
// The showcase panel keeps one fixed height, whatever slide is showing.
export default function SignInPage() {
  return (
    <main className="grid min-h-svh grid-cols-1 gap-6 p-6 lg:grid-cols-2">
      <section className="flex items-center justify-center rounded-r20 bg-background-0 p-6">
        <AuthPanel className="max-w-80 shadow-md">
          <SignInForm />
        </AuthPanel>
      </section>
      <aside className="relative hidden overflow-hidden rounded-r20 lg:sticky lg:top-6 lg:block lg:h-[calc(100svh-3rem)] lg:min-h-160">
        <AuthShowcase />
      </aside>
    </main>
  )
}
