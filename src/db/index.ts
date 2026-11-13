import "server-only"

import { attachDatabasePool } from "@vercel/functions"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schema from "./schema"

// Server-only Postgres client. Connects as the DB owner, so RLS does NOT apply here:
// every query must scope by the current Clerk user itself (auth() in the caller).
// The browser talks to Supabase (Realtime, Storage) through src/lib/supabase/, where RLS does apply.

const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is not set (see .env.example)")

// Reuse one pool across dev hot reloads.
const globalForDb = globalThis as unknown as { pgPool?: Pool }

// node-postgres + attachDatabasePool instead of postgres-js: on Vercel Fluid compute an instance can be suspended
// between requests. postgres-js connections could freeze mid-query there, holding Supabase pooler slots (state
// "active / ClientRead") until every /dashboard query queued into the statement timeout. attachDatabasePool keeps the
// instance alive until idle clients are released. pg sends unnamed statements, which the transaction pooler accepts.
const pool =
  globalForDb.pgPool ??
  new Pool({
    connectionString: url,
    max: 5,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 10_000,
    // Fail a stuck query fast instead of hanging the function until its 300 s limit.
    query_timeout: 20_000,
  })
if (!globalForDb.pgPool) attachDatabasePool(pool)
if (process.env.NODE_ENV !== "production") globalForDb.pgPool = pool

export const db = drizzle({ client: pool, schema, casing: "snake_case" })
