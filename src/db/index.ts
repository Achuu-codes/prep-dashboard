import 'server-only';
import type { Client } from '@libsql/client';
import { env } from '@/lib/env';
import { connect, type Database } from './connect';
import * as schema from './schema';

/**
 * One connection, reused across hot reloads and serverless invocations.
 *
 * DATABASE_URL drives everything:
 *   file:./data/app.db   -> local SQLite file
 *   libsql://x.turso.io  -> Turso (also set DATABASE_AUTH_TOKEN)
 * Same Drizzle dialect either way, so no query changes when you switch.
 */
const g = globalThis as unknown as {
  __prepConn?: { client: Client; db: Database };
};

const conn = (g.__prepConn ??= connect(
  env.DATABASE_URL,
  env.DATABASE_AUTH_TOKEN,
));

export const client = conn.client;
export const db = conn.db;
export { schema };
export * from './schema';
