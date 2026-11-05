import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Suspense } from "react"

function SiteHeader() {
  return (
    <header className="flex items-center justify-end gap-4 p-4">
      <Suspense>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </Suspense>
    </header>
  )
}

export { SiteHeader }
