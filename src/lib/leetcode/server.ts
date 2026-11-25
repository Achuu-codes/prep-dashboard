import 'server-only';
import { env, features } from '@/lib/env';
import {
  fetchAllSolved,
  fetchContestHistory,
  fetchContestRanking,
  fetchProfile,
  fetchRecentAcSubmissions,
  type AcSubmission,
  type ContestEntry,
  type ContestStanding,
  type LeetCodeProfile,
  type SolvedProblem,
} from './api';
import { LeetCodeError } from './client';

/**
 * Env-bound LeetCode calls. The username and cookies are read here and only
 * here; nothing in this module is importable from a client component.
 */

function username(): string {
  if (!env.LEETCODE_USERNAME) {
    throw new LeetCodeError(
      'not-found',
      'LEETCODE_USERNAME is not set. Add it to .env.local.',
    );
  }
  return env.LEETCODE_USERNAME;
}

export function leetcodeCredentials() {
  if (!env.LEETCODE_SESSION) return undefined;
  return { session: env.LEETCODE_SESSION, csrfToken: env.LEETCODE_CSRF };
}

export const leetcodeFeatures = {
  get enabled() {
    return features.leetcode;
  },
  get authed() {
    return features.leetcodeAuthed;
  },
};

export function getProfile(): Promise<LeetCodeProfile> {
  return fetchProfile(username());
}

export function getContestRanking(): Promise<ContestStanding | null> {
  return fetchContestRanking(username());
}

export function getContestHistory(): Promise<ContestEntry[]> {
  return fetchContestHistory(username());
}

export function getRecentAc(limit = 20): Promise<AcSubmission[]> {
  return fetchRecentAcSubmissions(username(), limit);
}

/**
 * Full solved list. Requires the cookies; throws LeetCodeError('auth') when
 * they are absent or expired, which the sync turns into a visible warning.
 */
export function getAllSolved(): Promise<SolvedProblem[]> {
  const credentials = leetcodeCredentials();
  if (!credentials) {
    throw new LeetCodeError(
      'auth',
      'LEETCODE_SESSION is not set, so the full solved list is unavailable.',
    );
  }
  return fetchAllSolved(credentials);
}
