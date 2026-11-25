import 'server-only';
import type { ContestEntry, ContestStanding, LeetCodeProfile } from '@/lib/leetcode/api';
import type { GitHubOverview } from '@/lib/github/api';
import { readSnapshot, readSnapshotSeries, type Resilient } from '@/lib/snapshots';
import { getCookieHealth, type CookieHealth } from '@/lib/sync';
import { getNav, getTopicStats, rollUp, countDue } from './content';
import { endOfDay } from '@/lib/srs';

export interface DashboardData {
  leetcode: {
    profile: Resilient<LeetCodeProfile>;
    contest: Resilient<ContestStanding | null>;
    history: Resilient<ContestEntry[]>;
    /** Solved totals over time, from the snapshot log. */
    solvedSeries: Array<{ at: Date; all: number }>;
    cookies: CookieHealth | null;
  };
  github: Resilient<GitHubOverview>;
  dsa: {
    topics: Array<{
      slug: string;
      title: string;
      solved: number;
      total: number;
      due: number;
    }>;
    solved: number;
    total: number;
  };
  dueCount: number;
}

/**
 * Everything the overview page needs, read from the snapshot store rather than
 * from LeetCode or GitHub, so the page renders fast and never fails because an
 * upstream API is down.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const endToday = endOfDay();

  const [
    profile,
    contest,
    history,
    solvedSnapshots,
    github,
    cookies,
    tree,
    stats,
    dueCount,
  ] = await Promise.all([
    readSnapshot<LeetCodeProfile>('leetcode', 'profile'),
    readSnapshot<ContestStanding | null>('leetcode', 'contest'),
    readSnapshot<ContestEntry[]>('leetcode', 'contest-history'),
    readSnapshotSeries<LeetCodeProfile>('leetcode', 'profile', 400),
    readSnapshot<GitHubOverview>('github', 'overview'),
    getCookieHealth(),
    getNav(),
    getTopicStats(endToday),
    countDue(endToday),
  ]);

  const dsaSection = tree.find((s) => s.slug === 'dsa');
  const topics = (dsaSection?.topics ?? []).map((topic) => {
    const s = rollUp(topic, stats);
    return {
      slug: topic.slug,
      title: topic.title,
      solved: s.solved,
      total: s.total,
      due: s.due,
    };
  });

  // One point per day, the last snapshot of each day.
  const byDay = new Map<string, { at: Date; all: number }>();
  for (const snap of solvedSnapshots) {
    const key = snap.at.toISOString().slice(0, 10);
    byDay.set(key, { at: snap.at, all: snap.payload?.solved?.all ?? 0 });
  }

  return {
    leetcode: {
      profile,
      contest,
      history,
      solvedSeries: [...byDay.values()],
      cookies,
    },
    github,
    dsa: {
      topics,
      solved: topics.reduce((n, t) => n + t.solved, 0),
      total: topics.reduce((n, t) => n + t.total, 0),
    },
    dueCount,
  };
}
