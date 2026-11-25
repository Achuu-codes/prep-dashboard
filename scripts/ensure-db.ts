/**
 * Creates ./data if needed and applies every pending migration from ./drizzle.
 * Safe to run repeatedly; this is what `npm run dev` calls first.
 */
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { DATABASE_URL, log, openDb } from './_bootstrap';

async function main() {
  if (DATABASE_URL.startsWith('file:')) {
    const file = DATABASE_URL.slice('file:'.length);
    mkdirSync(resolve(process.cwd(), file, '..'), { recursive: true });
  }
  const { db, client } = openDb();
  log.step(`Applying migrations -> ${DATABASE_URL}`);
  await migrate(db, { migrationsFolder: './drizzle' });
  log.ok('database up to date');
  client.close();
}

main().catch((err) => {
  log.fail(String(err?.message ?? err));
  process.exit(1);
});
