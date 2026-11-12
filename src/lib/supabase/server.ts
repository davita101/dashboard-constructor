import "server-only"

import { auth } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

// Supabase client for Server Components / Actions / Route Handlers, acting as the signed-in Clerk user.
// Needs Clerk added as a third-party auth provider in Supabase (Authentication → Sign In / Providers),
// so RLS policies can read the Clerk user id from auth.jwt()->>'sub'.
export function createServerSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    async accessToken() {
      return (await auth()).getToken()
    },
  })
}
