import "server-only"

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

// Server-only Postgres client. Connects as the DB owner, so RLS does NOT apply here:
// every query must scope by the current Clerk user itself (auth() in the caller).
// The browser talks to Supabase (Realtime, Storage) through src/lib/supabase/, where RLS does apply.

const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is not set (see .env.example)")

// Reuse one pool across dev hot reloads.
const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof postgres> }

// Supabase transaction pooler (port 6543) doesn't support prepared statements.
const client = globalForDb.pg ?? postgres(url, { prepare: false })
if (process.env.NODE_ENV !== "production") globalForDb.pg = client

export const db = drizzle(client, { schema, casing: "snake_case" })
