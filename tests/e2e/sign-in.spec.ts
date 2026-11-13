import { expect, test } from "@playwright/test"

// Smoke test: the public sign-in page renders without signing in and logs no console errors.
test("sign-in page renders without console errors", async ({ page }) => {
  const errors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  page.on("pageerror", (error) => errors.push(error.message))

  await page.goto("/sign-in")

  await expect(page.getByRole("heading", { name: "Sign in to Account" })).toBeVisible()
  await expect(page.getByLabel("Email Address")).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign In with Google" })).toBeVisible()

  await page.waitForLoadState("networkidle")
  expect(errors).toEqual([])
})
