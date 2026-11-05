import { AuthSplit } from "@/components/auth/auth-split"

// One shared shell for every auth page: the carousel and the card stay mounted while the user moves
// between sign-in, sign-up and forgot-password, so only the form inside the card changes (no reload feel).
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthSplit>{children}</AuthSplit>
}
