/**
 * Single-user auth: one password, held in APP_PASSWORD, exchanged for a signed
 * cookie. Nothing secret is ever sent to the client — the cookie contains only
 * an issue/expiry timestamp plus an HMAC of it.
 *
 * Uses Web Crypto (not node:crypto) so the same verification runs in the Next
 * middleware as in route handlers.
 */
const COOKIE_NAME = 'prep_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export { COOKIE_NAME, MAX_AGE_SECONDS };

const encoder = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let out = '';
  for (const b of view) out += String.fromCharCode(b);
  return btoa(out).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return b64url(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

/** Constant-time string compare, so verification cannot be timed. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Builds the cookie value for a freshly authenticated session. */
export async function signSession(secret: string): Promise<string> {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(expires);
  return `${payload}.${await hmac(secret, payload)}`;
}

/** True when the cookie is well-formed, correctly signed and unexpired. */
export async function verifySession(
  value: string | undefined,
  secret: string | undefined,
): Promise<boolean> {
  if (!value || !secret) return false;
  const dot = value.lastIndexOf('.');
  if (dot <= 0) return false;
  const payload = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  if (!safeEqual(signature, await hmac(secret, payload))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

/**
 * Compares a submitted password to APP_PASSWORD without leaking length
 * through timing. Hashes both sides first so the compare is fixed-width.
 */
export async function checkPassword(
  submitted: string,
  expected: string,
): Promise<boolean> {
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(submitted)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  return safeEqual(b64url(a), b64url(b));
}
