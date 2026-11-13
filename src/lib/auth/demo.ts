"use server"

import { clerkClient } from "@clerk/nextjs/server"

// Demo login for portfolio visitors. The credentials live only in server env vars (DEMO_EMAIL / DEMO_PASSWORD):
// the server checks them against Clerk and returns a short-lived one-time sign-in token, which the browser
// redeems with the `ticket` strategy. The password never reaches the client.

export type DemoSignInResult = { ticket: string } | { error: string }

const UNAVAILABLE = "The demo account is not available right now."

export async function startDemoSignIn(): Promise<DemoSignInResult> {
  const email = process.env.DEMO_EMAIL
  const password = process.env.DEMO_PASSWORD
  if (!email || !password) return { error: UNAVAILABLE }

  try {
    const clerk = await clerkClient()
    const { data } = await clerk.users.getUserList({ emailAddress: [email], limit: 1 })
    const user = data[0]
    if (!user) return { error: UNAVAILABLE }
    // Throws when the password in the env no longer matches the account.
    await clerk.users.verifyPassword({ userId: user.id, password })
    const { token } = await clerk.signInTokens.createSignInToken({ userId: user.id, expiresInSeconds: 60 })
    return { ticket: token }
  } catch (error) {
    console.error("startDemoSignIn failed", error)
    return { error: UNAVAILABLE }
  }
}
