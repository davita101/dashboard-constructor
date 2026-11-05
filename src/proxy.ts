import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/forgot-password(.*)",
  "/check-email(.*)",
  "/two-factor(.*)",
  "/set-new-password(.*)",
  "/design-system(.*)",
]);

// Pages a signed-in user has no use for. set-new-password / password-reset / sso-callback are left out on purpose:
// they run while Clerk is creating the session, so redirecting them would cut the flow short.
const isGuestOnlyRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/check-email(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  if (userId && isGuestOnlyRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
