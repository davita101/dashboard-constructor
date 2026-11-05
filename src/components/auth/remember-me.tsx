"use client"

import { useAuth, useClerk } from "@clerk/nextjs"
import * as React from "react"

// "Remember Me". Clerk keeps a session for its configured lifetime and has no per-sign-in switch, so this is
// enforced here: the choice is stored (localStorage), plus a browser-session cookie (no expiry, so the browser
// drops it when it closes). If a user who did NOT tick the box is still signed in but the cookie is gone,
// the browser was closed in between, so the session is ended. Tick the box and nothing is ever ended here.
const STORE = "auth-remember"
const ALIVE = "auth_alive"

const rememberMe = {
  set(remember: boolean) {
    localStorage.setItem(STORE, remember ? "1" : "0")
    document.cookie = `${ALIVE}=1; path=/; SameSite=Lax`
  },
  expired() {
    return localStorage.getItem(STORE) === "0" && !document.cookie.split("; ").some((c) => c.startsWith(`${ALIVE}=`))
  },
}

function RememberMeGuard() {
  const { isLoaded, isSignedIn } = useAuth()
  const { signOut } = useClerk()

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    if (rememberMe.expired()) void signOut({ redirectUrl: "/sign-in" })
    else document.cookie = `${ALIVE}=1; path=/; SameSite=Lax`
  }, [isLoaded, isSignedIn, signOut])

  return null
}

export { RememberMeGuard, rememberMe }
