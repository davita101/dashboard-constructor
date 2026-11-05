"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import * as React from "react"

// A signed-in user has nothing to do on Sign In / Sign Up (Clerk would answer "already signed in" on submit).
// Client-side on purpose: reading the session on the server would make these pages dynamic.
function RedirectIfSignedIn({ to = "/" }: { to?: string }) {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (isLoaded && isSignedIn) router.replace(to)
  }, [isLoaded, isSignedIn, router, to])

  return null
}

export { RedirectIfSignedIn }
