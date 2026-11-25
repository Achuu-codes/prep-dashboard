import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { syncAll } from '@/lib/sync';

/**
 * Scheduled sync, every 6 hours (see vercel.json).
 *
 * This path is excluded from the session middleware, so it authenticates
 * itself: Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. If
 * CRON_SECRET is unset the route only answers on localhost, so a deployed
 * instance can never be triggered anonymously.
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function authorise(request: Request): boolean {
  const secret = env.CRON_SECRET;
  if (secret) {
    const header = request.headers.get('authorization');
    return header === `Bearer ${secret}`;
  }
  const host = request.headers.get('host') ?? '';
  return host.startsWith('localhost') || host.startsWith('127.0.0.1');
}

async function run(request: Request) {
  if (!authorise(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const results = await syncAll('cron');
  const failed = results.some((r) => r.status === 'error');
  return NextResponse.json(
    { ok: !failed, ranAt: new Date().toISOString(), results },
    { status: failed ? 502 : 200 },
  );
}

export const GET = run;
export const POST = run;
