import { type NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, verifySession } from '@/lib/auth';

/**
 * Gates the whole site behind the single-user session cookie.
 *
 * Runs before every page and API route except the login screen, the cron
 * endpoint (which authenticates with CRON_SECRET instead) and static assets.
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|login|api/cron|.*\\.\\w+$).*)'],
};

export async function middleware(request: NextRequest) {
  // If no password is configured, the app runs open locally rather than
  // locking you out of your own dashboard. The login page says so.
  if (!process.env.APP_PASSWORD || !process.env.AUTH_SECRET) {
    return NextResponse.next();
  }

  const ok = await verifySession(
    request.cookies.get(COOKIE_NAME)?.value,
    process.env.AUTH_SECRET,
  );
  if (ok) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const login = new URL('/login', request.url);
  if (request.nextUrl.pathname !== '/') {
    login.searchParams.set('next', request.nextUrl.pathname);
  }
  return NextResponse.redirect(login);
}
