'use server';

import { revalidatePath } from 'next/cache';
import { syncAll } from '@/lib/sync';

export interface SyncSummary {
  ok: boolean;
  lines: string[];
  autoMarked: number;
}

/** Backs the "Sync now" button. Same code path as the cron job. */
export async function syncNow(): Promise<SyncSummary> {
  const results = await syncAll('manual');
  revalidatePath('/', 'layout');

  return {
    ok: results.every((r) => r.status === 'ok' || r.status === 'skipped'),
    autoMarked: results.reduce((n, r) => n + r.autoMarked, 0),
    lines: results.map(
      (r) => `${r.provider}: ${r.status}${r.message ? ` — ${r.message}` : ''}`,
    ),
  };
}
