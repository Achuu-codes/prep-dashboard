import { NextResponse } from 'next/server';
import { syncAll, syncGitHub, syncLeetCode } from '@/lib/sync';

/**
 * Manual sync. Reachable only behind the session cookie — the middleware
 * returns 401 for unauthenticated /api requests.
 *
 *   POST /api/sync                  both providers
 *   POST /api/sync?provider=github  one provider
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  const provider = new URL(request.url).searchParams.get('provider');

  try {
    const results =
      provider === 'leetcode'
        ? [await syncLeetCode('manual')]
        : provider === 'github'
          ? [await syncGitHub('manual')]
          : await syncAll('manual');

    const failed = results.some((r) => r.status === 'error');
    return NextResponse.json(
      { ok: !failed, results },
      { status: failed ? 502 : 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error)?.message ?? 'sync failed' },
      { status: 500 },
    );
  }
}
