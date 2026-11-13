import { defineConfig, devices } from "@playwright/test"

// Smoke tests. By default they start the production server (run `pnpm build` first); set PLAYWRIGHT_BASE_URL to run
// them against an already running app or a deployment instead.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000"

export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : { command: "pnpm start", url: baseURL, reuseExistingServer: !process.env.CI, timeout: 120_000 },
})
