import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// SQLite dialect covers both a local file (file:./data/app.db) and Turso (libsql://...).
// See README "Swapping the database" for the Postgres path.
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'file:./data/app.db',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  strict: true,
  verbose: true,
});
