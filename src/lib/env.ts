/**
 * Server-only environment access.
 *
 * `import 'server-only'` makes the build fail if a client component ever
 * imports this file, which is what keeps tokens and cookies off the client.
 * Nothing here is passed through props or serialised into the page — only
 * `publicProfile()`, which contains public handles and no credentials.
 */
import 'server-only';
import { z } from 'zod';

const optionalString = z.string().trim().min(1).optional().catch(undefined);

const schema = z.object({
  // --- database -----------------------------------------------------------
  DATABASE_URL: z.string().trim().min(1).default('file:./data/app.db'),
  DATABASE_AUTH_TOKEN: optionalString,

  // --- auth ---------------------------------------------------------------
  APP_PASSWORD: optionalString,
  AUTH_SECRET: optionalString,

  // --- identity (shown on the dashboard) ----------------------------------
  OWNER_NAME: z.string().trim().min(1).default('Me'),
  OWNER_TAGLINE: optionalString,
  OWNER_EMAIL: optionalString,
  OWNER_WEBSITE: optionalString,

  // --- leetcode -----------------------------------------------------------
  LEETCODE_USERNAME: optionalString,
  /** Optional cookies that unlock the full solved-problem list. */
  LEETCODE_SESSION: optionalString,
  LEETCODE_CSRF: optionalString,

  // --- github -------------------------------------------------------------
  GITHUB_USERNAME: optionalString,
  /** Read-only PAT: public_repo + read:user is enough. */
  GITHUB_TOKEN: optionalString,

  // --- ops ----------------------------------------------------------------
  CRON_SECRET: optionalString,
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

function read() {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    // Never print values, only the offending keys.
    const keys = Object.keys(parsed.error.flatten().fieldErrors).join(', ');
    throw new Error(`Invalid environment configuration for: ${keys}`);
  }
  return parsed.data;
}

export const env = read();

/** Which optional integrations are usable right now. */
export const features = {
  auth: Boolean(env.APP_PASSWORD && env.AUTH_SECRET),
  leetcode: Boolean(env.LEETCODE_USERNAME),
  leetcodeAuthed: Boolean(
    env.LEETCODE_USERNAME && env.LEETCODE_SESSION && env.LEETCODE_CSRF,
  ),
  github: Boolean(env.GITHUB_USERNAME && env.GITHUB_TOKEN),
} as const;

/**
 * Public, non-secret identity for the dashboard. Safe to render: usernames are
 * public handles and nothing here is a credential.
 */
export function publicProfile() {
  return {
    name: env.OWNER_NAME,
    tagline: env.OWNER_TAGLINE ?? null,
    email: env.OWNER_EMAIL ?? null,
    website: env.OWNER_WEBSITE ?? null,
    leetcode: env.LEETCODE_USERNAME ?? null,
    github: env.GITHUB_USERNAME ?? null,
  };
}
