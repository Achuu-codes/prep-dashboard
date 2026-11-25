/**
 * Shared setup for the CLI scripts. Loads .env.local then .env, and opens the
 * database through the pure connector (scripts cannot import `server-only`).
 */
import 'dotenv/config';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { connect } from '../src/db/connect';

const localEnv = resolve(process.cwd(), '.env.local');
if (existsSync(localEnv)) loadEnv({ path: localEnv, override: true });

export const DATABASE_URL = process.env.DATABASE_URL ?? 'file:./data/app.db';
export const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN || undefined;

export function openDb() {
  return connect(DATABASE_URL, DATABASE_AUTH_TOKEN);
}

/** Pretty console helpers so script output is scannable. */
export const log = {
  step: (m: string) => console.log(`\n\x1b[1m\x1b[36m${m}\x1b[0m`),
  info: (m: string) => console.log(`  ${m}`),
  ok: (m: string) => console.log(`  \x1b[32m✓\x1b[0m ${m}`),
  warn: (m: string) => console.log(`  \x1b[33m!\x1b[0m ${m}`),
  fail: (m: string) => console.log(`  \x1b[31m✗\x1b[0m ${m}`),
};
