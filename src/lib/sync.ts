import 'server-only';
import { eq, inArray, sql } from 'drizzle-orm';
import { db } from '@/db';
import { kv, lcSubmissions, progress, syncRuns } from '@/db/schema';
import { findTrackedItemsBySlugs } from '@/db/queries/content';
import { getGitHubOverview, githubFeatures } from './github/server';
import { GitHubError } from './github/client';
import { LeetCodeError } from './leetcode/client';
import {
  getAllSolved,
  getContestHistory,
  getContestRanking,
  getProfile,
  getRecentAc,
  leetcodeFeatures,
} from './leetcode/server';
import { writeReviewLadder } from './reviews';
import { saveFailure, saveSnapshot } from './snapshots';
import { scheduleFromSolve } from './srs';

export type Trigger = 'cron' | 'manual' | 'seed';

export interface SyncResult {
  provider: 'leetcode' | 'github';
  status: 'ok' | 'partial' | 'error' | 'skipped';
  message: string;
  autoMarked: number;
  /** Per-fetch outcome, so a partial sync can say exactly what failed. */
  parts: Record<string, 'ok' | string>;
}

const KV_COOKIE_HEALTH = 'leetcode.cookieHealth';

export interface CookieHealth {
  ok: boolean;
  checkedAt: string;
  message?: string;
}

async function setCookieHealth(value: CookieHealth) {
  await db
    .insert(kv)
    .values({ key: KV_COOKIE_HEALTH, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: kv.key,
      set: { value, updatedAt: new Date() },
    });
}

export async function getCookieHealth(): Promise<CookieHealth | null> {
  const [row] = await db
    .select()
    .from(kv)
    .where(eq(kv.key, KV_COOKIE_HEALTH))
    .limit(1);
  return (row?.value as CookieHealth | undefined) ?? null;
}

/**
 * Runs one fetch, stores the payload on success and the reason on failure.
 * Never throws: a broken part must not take the whole sync down, because the
 * page falls back to the last good snapshot per kind.
 */
async function attempt<T>(
  provider: 'leetcode' | 'github',
  kind: string,
  fn: () => Promise<T>,
  parts: Record<string, 'ok' | string>,
): Promise<T | null> {
  try {
    const data = await fn();
    await saveSnapshot(provider, kind, data);
    parts[kind] = 'ok';
    return data;
  } catch (err) {
    const message =
      err instanceof LeetCodeError || err instanceof GitHubError
        ? `${err.kind}: ${err.message}`
        : ((err as Error)?.message ?? 'unknown error');
    await saveFailure(provider, kind, message);
    parts[kind] = message;
    return null;
  }
}

/* --------------------------------------------------------------- auto-mark */

/**
 * Flips tracked problems to Solved based on LeetCode activity.
 *
 * Only promotes from Todo/Attempted. A problem the user marked "needs
 * revision" by hand is left alone — their judgement outranks the sync.
 */
async function autoMark(
  slugs: Map<string, Date | null>,
): Promise<number> {
  if (slugs.size === 0) return 0;

  const tracked = await findTrackedItemsBySlugs([...slugs.keys()]);
  if (tracked.size === 0) return 0;

  const itemIds = [...tracked.values()];
  const existing = new Map<string, string>();
  for (let i = 0; i < itemIds.length; i += 400) {
    const rows = await db
      .select({ itemId: progress.itemId, status: progress.status })
      .from(progress)
      .where(inArray(progress.itemId, itemIds.slice(i, i + 400)));
    for (const r of rows) existing.set(r.itemId, r.status);
  }

  const now = new Date();
  let marked = 0;

  for (const [slug, itemId] of tracked) {
    const status = existing.get(itemId);
    if (status === 'solved' || status === 'needs_revision') continue;

    const solvedAt = slugs.get(slug) ?? now;
    const schedule = scheduleFromSolve(solvedAt, now);

    await db
      .insert(progress)
      .values({
        itemId,
        status: 'solved',
        solvedAt,
        autoMarked: true,
        reviewStage: schedule.reviewStage,
        nextReviewAt: schedule.nextReviewAt,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: progress.itemId,
        set: {
          status: 'solved',
          solvedAt,
          autoMarked: true,
          reviewStage: schedule.reviewStage,
          nextReviewAt: schedule.nextReviewAt,
          updatedAt: now,
        },
      });
    // Same revision history a manual solve would produce.
    await writeReviewLadder(itemId, solvedAt);
    marked++;
  }

  return marked;
}

/** Stores recent accepted submissions, ignoring ones already seen. */
async function recordSubmissions(
  rows: Array<{ titleSlug: string; title: string; submittedAt: Date }>,
  source: 'recent' | 'authed',
) {
  for (const row of rows) {
    await db
      .insert(lcSubmissions)
      .values({
        titleSlug: row.titleSlug,
        title: row.title,
        submittedAt: row.submittedAt,
        source,
      })
      .onConflictDoNothing();
  }
}

/* ------------------------------------------------------------------ leetcode */

export async function syncLeetCode(trigger: Trigger): Promise<SyncResult> {
  const parts: Record<string, 'ok' | string> = {};

  if (!leetcodeFeatures.enabled) {
    return {
      provider: 'leetcode',
      status: 'skipped',
      message: 'LEETCODE_USERNAME is not set',
      autoMarked: 0,
      parts,
    };
  }

  const startedAt = new Date();

  /**
   * The profile fetch runs first and alone, because it is the only query that
   * fails loudly for a bad username or a changed schema. The others answer 200
   * with null or an empty list in exactly those cases, so persisting them as
   * successes would quietly overwrite good snapshots with blanks. If the
   * profile fetch fails, nothing this run is trustworthy.
   */
  const profile = await attempt('leetcode', 'profile', getProfile, parts);

  if (!profile) {
    const reason = `not fetched: the profile query failed (${parts.profile})`;
    for (const kind of ['contest', 'contest-history', 'recent-ac', 'solved']) {
      if (kind === 'solved' && !leetcodeFeatures.authed) continue;
      await saveFailure('leetcode', kind, reason);
      parts[kind] = reason;
    }
    await db.insert(syncRuns).values({
      provider: 'leetcode',
      trigger,
      startedAt,
      finishedAt: new Date(),
      status: 'error',
      message: String(parts.profile).slice(0, 1000),
      itemsAutoMarked: 0,
    });
    return {
      provider: 'leetcode',
      status: 'error',
      message: String(parts.profile),
      autoMarked: 0,
      parts,
    };
  }

  const [contest, history, recent] = await Promise.all([
    attempt('leetcode', 'contest', getContestRanking, parts),
    attempt('leetcode', 'contest-history', getContestHistory, parts),
    attempt('leetcode', 'recent-ac', () => getRecentAc(20), parts),
  ]);

  /** slug -> solve time (null when unknown). */
  const solvedSlugs = new Map<string, Date | null>();

  if (recent?.length) {
    await recordSubmissions(recent, 'recent');
    for (const s of recent) solvedSlugs.set(s.titleSlug, s.submittedAt);
  }

  // The cookie-backed full list, when available, is authoritative.
  if (leetcodeFeatures.authed) {
    const solved = await attempt('leetcode', 'solved', getAllSolved, parts);
    if (solved) {
      for (const p of solved) {
        if (!solvedSlugs.has(p.titleSlug)) solvedSlugs.set(p.titleSlug, null);
      }
      await setCookieHealth({ ok: true, checkedAt: new Date().toISOString() });
    } else {
      await setCookieHealth({
        ok: false,
        checkedAt: new Date().toISOString(),
        message: String(parts.solved ?? 'the solved-list fetch failed'),
      });
    }
  }

  const autoMarked = await autoMark(solvedSlugs);

  const failed = Object.entries(parts).filter(([, v]) => v !== 'ok');
  const status: 'ok' | 'partial' | 'error' =
    failed.length === 0
      ? 'ok'
      : failed.length === Object.keys(parts).length
        ? 'error'
        : 'partial';

  const message =
    failed.length === 0
      ? `rating ${contest?.rating ? Math.round(contest.rating) : '—'}, ${profile.solved.all} solved, ${history?.length ?? 0} contests`
      : failed.map(([k, v]) => `${k} → ${v}`).join(' | ');

  await db.insert(syncRuns).values({
    provider: 'leetcode',
    trigger,
    startedAt,
    finishedAt: new Date(),
    // 'skipped' already returned above, so this is always a real outcome.
    status,
    message: message.slice(0, 1000),
    itemsAutoMarked: autoMarked,
  });

  return { provider: 'leetcode', status, message, autoMarked, parts };
}

/* -------------------------------------------------------------------- github */

export async function syncGitHub(trigger: Trigger): Promise<SyncResult> {
  const parts: Record<string, 'ok' | string> = {};

  if (!githubFeatures.enabled) {
    return {
      provider: 'github',
      status: 'skipped',
      message: 'GITHUB_USERNAME or GITHUB_TOKEN is not set',
      autoMarked: 0,
      parts,
    };
  }

  const startedAt = new Date();
  const overview = await attempt('github', 'overview', getGitHubOverview, parts);
  const status: SyncResult['status'] = overview ? 'ok' : 'error';
  const message = overview
    ? `${overview.contributions.total} contributions, ${overview.profile.publicRepos} repos`
    : String(parts.overview ?? 'failed');

  await db.insert(syncRuns).values({
    provider: 'github',
    trigger,
    startedAt,
    finishedAt: new Date(),
    status,
    message: message.slice(0, 1000),
    itemsAutoMarked: 0,
  });

  return { provider: 'github', status, message, autoMarked: 0, parts };
}

export async function syncAll(trigger: Trigger): Promise<SyncResult[]> {
  // Sequential on purpose: two providers, no reason to hammer both at once.
  const leetcode = await syncLeetCode(trigger);
  const github = await syncGitHub(trigger);
  return [leetcode, github];
}

/** Total submissions ever recorded, for the "counted over time" fallback. */
export async function countRecordedSubmissions(): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(distinct ${lcSubmissions.titleSlug})` })
    .from(lcSubmissions);
  return Number(row?.n ?? 0);
}
