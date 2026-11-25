/**
 * Snapshot store: the resilience layer for both integrations.
 *
 * Pages never call LeetCode or GitHub while rendering. Syncs write whole
 * payloads here; pages read the most recent *successful* payload. If an
 * upstream API breaks or changes shape, the page keeps showing the last good
 * data with a "stale since ..." note, and the failure is recorded separately.
 */
import 'server-only';
import { and, desc, eq, gte } from 'drizzle-orm';
import { db } from '@/db';
import { snapshots, syncRuns } from '@/db/schema';

export type Provider = 'leetcode' | 'github';

export interface SnapshotRecord<T> {
  payload: T;
  fetchedAt: Date;
}

/** How old a snapshot may be before the UI calls it stale. */
export const STALE_AFTER_MS = 8 * 60 * 60 * 1000; // cron runs every 6h

export async function saveSnapshot(
  provider: Provider,
  kind: string,
  payload: unknown,
): Promise<void> {
  await db
    .insert(snapshots)
    .values({ provider, kind, payload, ok: true, fetchedAt: new Date() });
}

export async function saveFailure(
  provider: Provider,
  kind: string,
  error: string,
): Promise<void> {
  await db.insert(snapshots).values({
    provider,
    kind,
    ok: false,
    error: error.slice(0, 2000),
    fetchedAt: new Date(),
  });
}

/** Most recent successful snapshot, or null if we have never fetched one. */
export async function getLatestSnapshot<T>(
  provider: Provider,
  kind: string,
): Promise<SnapshotRecord<T> | null> {
  const [row] = await db
    .select({ payload: snapshots.payload, fetchedAt: snapshots.fetchedAt })
    .from(snapshots)
    .where(
      and(
        eq(snapshots.provider, provider),
        eq(snapshots.kind, kind),
        eq(snapshots.ok, true),
      ),
    )
    .orderBy(desc(snapshots.fetchedAt))
    .limit(1);
  if (!row) return null;
  return { payload: row.payload as T, fetchedAt: row.fetchedAt };
}

/** Most recent failure that happened *after* the last success, if any. */
export async function getLatestFailure(
  provider: Provider,
  kind: string,
): Promise<{ error: string; at: Date } | null> {
  const [row] = await db
    .select({ error: snapshots.error, fetchedAt: snapshots.fetchedAt })
    .from(snapshots)
    .where(
      and(
        eq(snapshots.provider, provider),
        eq(snapshots.kind, kind),
        eq(snapshots.ok, false),
      ),
    )
    .orderBy(desc(snapshots.fetchedAt))
    .limit(1);
  if (!row) return null;
  return { error: row.error ?? 'unknown error', at: row.fetchedAt };
}

export interface Resilient<T> {
  data: T | null;
  fetchedAt: Date | null;
  /** True when data is missing or older than STALE_AFTER_MS. */
  stale: boolean;
  /** Set when the most recent attempt failed after the last success. */
  error: string | null;
}

/**
 * What a page should call. Returns the last good payload plus the staleness
 * verdict, so the UI can render data and a warning at the same time.
 */
export async function readSnapshot<T>(
  provider: Provider,
  kind: string,
): Promise<Resilient<T>> {
  const [latest, failure] = await Promise.all([
    getLatestSnapshot<T>(provider, kind),
    getLatestFailure(provider, kind),
  ]);

  if (!latest) {
    return {
      data: null,
      fetchedAt: null,
      stale: true,
      error: failure?.error ?? null,
    };
  }

  const age = Date.now() - latest.fetchedAt.getTime();
  const failedSinceSuccess = Boolean(
    failure && failure.at.getTime() > latest.fetchedAt.getTime(),
  );

  return {
    data: latest.payload,
    fetchedAt: latest.fetchedAt,
    stale: age > STALE_AFTER_MS || failedSinceSuccess,
    error: failedSinceSuccess ? (failure?.error ?? null) : null,
  };
}

/**
 * Time series of a numeric field across snapshots, for the history charts.
 * Reads straight from the snapshot log, so charts cover everything ever synced.
 */
export async function readSnapshotSeries<T>(
  provider: Provider,
  kind: string,
  sinceDays = 365,
): Promise<Array<{ at: Date; payload: T }>> {
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({ payload: snapshots.payload, fetchedAt: snapshots.fetchedAt })
    .from(snapshots)
    .where(
      and(
        eq(snapshots.provider, provider),
        eq(snapshots.kind, kind),
        eq(snapshots.ok, true),
        gte(snapshots.fetchedAt, since),
      ),
    )
    .orderBy(snapshots.fetchedAt);
  return rows.map((r) => ({ at: r.fetchedAt, payload: r.payload as T }));
}

export async function getLastSyncRun(provider: Provider) {
  const [row] = await db
    .select()
    .from(syncRuns)
    .where(eq(syncRuns.provider, provider))
    .orderBy(desc(syncRuns.startedAt))
    .limit(1);
  return row ?? null;
}
