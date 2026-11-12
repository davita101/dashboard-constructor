import { defineConfig } from "drizzle-kit"

// drizzle-kit runs outside Next, so load .env.local ourselves (Node >= 20.12).
try {
  process.loadEnvFile(".env.local")
} catch {
  // CI / hosted: env comes from the environment.
}

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set (see .env.example)")

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dbCredentials: { url: process.env.DATABASE_URL },
  // Supabase owns auth/storage/realtime schemas; only manage ours.
  schemaFilter: ["public"],
  casing: "snake_case",
  strict: true,
  verbose: true,
})
