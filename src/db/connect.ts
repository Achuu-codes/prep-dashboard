/**
 * Pure connection factory, importable from anywhere (Next server code *and*
 * plain `tsx` scripts). Deliberately free of `server-only` and of `@/lib/env`
 * so the seed scripts can reuse it.
 */
import { createClient, type Client } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './schema';

export type Database = LibSQLDatabase<typeof schema>;

export function connect(url: string, authToken?: string): {
  client: Client;
  db: Database;
} {
  const client = createClient({ url, authToken });
  return { client, db: drizzle(client, { schema }) };
}
