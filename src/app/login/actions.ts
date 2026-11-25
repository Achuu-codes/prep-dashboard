'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  COOKIE_NAME,
  MAX_AGE_SECONDS,
  checkPassword,
  signSession,
} from '@/lib/auth';
import { env } from '@/lib/env';

export interface LoginState {
  error?: string;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/');

  if (!env.APP_PASSWORD || !env.AUTH_SECRET) {
    return { error: 'APP_PASSWORD and AUTH_SECRET are not set on the server.' };
  }
  if (!(await checkPassword(password, env.APP_PASSWORD))) {
    // Deliberately vague, and deliberately slow enough to discourage guessing.
    await new Promise((r) => setTimeout(r, 400));
    return { error: 'Incorrect password.' };
  }

  const store = await cookies();
  store.set(COOKIE_NAME, await signSession(env.AUTH_SECRET), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });

  // Only allow same-site destinations back from the query string.
  redirect(next.startsWith('/') && !next.startsWith('//') ? next : '/');
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect('/login');
}
