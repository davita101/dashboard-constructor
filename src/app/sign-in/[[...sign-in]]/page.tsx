import { AuthShowcase } from "@/components/auth/auth-showcase"
import { SignInForm } from "@/components/auth/sign-in-form"
import { AuthPanel } from "@/components/ui/auth"

// Figma "Sing In (1600)" (14056:126280): form card left, "New Features" image panel right.
export default function SignInPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 gap-3 bg-background-10 p-3 lg:grid-cols-2">
      <section className="flex items-center justify-center rounded-r20 bg-background-0 p-6">
        <AuthPanel className="max-w-80 shadow-md">
          <SignInForm />
        </AuthPanel>
      </section>
      <aside className="hidden overflow-hidden rounded-r20 lg:block">
        <AuthShowcase />
      </aside>
    </main>
  )
}
