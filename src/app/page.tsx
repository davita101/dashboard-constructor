import { redirect } from "next/navigation";

// No landing page in the design: `/` goes straight to the app. Signed-out visitors are sent on to sign-in by the
// dashboard's auth.protect() in middleware, which keeps /dashboard as the redirect_url.
export default function Home() {
  redirect("/dashboard");
}
