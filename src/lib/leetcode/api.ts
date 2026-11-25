/**
 * Typed LeetCode operations. Every response is validated with zod: if LeetCode
 * changes a field, we throw `LeetCodeError('schema', ...)` instead of rendering
 * `undefined`, which is what lets callers fall back to the last good snapshot.
 *
 * Pure module - credentials and username are arguments, not env reads.
 */
import { z } from 'zod';
import {
  LeetCodeError,
  leetcodeGraphQL,
  type RequestOptions,
} from './client';
import {
  CONTEST_HISTORY,
  CONTEST_RANKING,
  PROBLEM_CATALOG,
  PROBLEMSET_LIST,
  QUESTION_BY_SLUG,
  RECENT_AC_SUBMISSIONS,
  USER_PROFILE,
} from './queries';

const Difficulty = z.enum(['Easy', 'Medium', 'Hard']);

/* -------------------------------------------------------------- question -- */

const QuestionSchema = z.object({
  question: z
    .object({
      questionId: z.string().nullish(),
      questionFrontendId: z.string(),
      title: z.string(),
      titleSlug: z.string(),
      difficulty: Difficulty,
      isPaidOnly: z.boolean(),
      topicTags: z
        .array(z.object({ name: z.string(), slug: z.string() }))
        .default([]),
    })
    .nullable(),
});

export type LeetCodeQuestion = NonNullable<
  z.infer<typeof QuestionSchema>['question']
>;

/**
 * Resolve one problem by slug. Returns null when the slug does not exist,
 * which is exactly the signal the seed validator needs.
 */
export async function fetchQuestionBySlug(
  titleSlug: string,
  options: RequestOptions = {},
): Promise<LeetCodeQuestion | null> {
  const raw = await leetcodeGraphQL<unknown>(
    QUESTION_BY_SLUG,
    { titleSlug },
    options,
  );
  const parsed = QuestionSchema.safeParse(raw);
  if (!parsed.success) {
    throw new LeetCodeError(
      'schema',
      `question(${titleSlug}) did not match the expected shape`,
      parsed.error.issues,
    );
  }
  return parsed.data.question;
}

/* --------------------------------------------------------------- profile -- */

const ProfileSchema = z.object({
  matchedUser: z
    .object({
      username: z.string(),
      githubUrl: z.string().nullish(),
      twitterUrl: z.string().nullish(),
      linkedinUrl: z.string().nullish(),
      profile: z.object({
        realName: z.string().nullish(),
        userAvatar: z.string().nullish(),
        ranking: z.number().nullish(),
        reputation: z.number().nullish(),
        countryName: z.string().nullish(),
        company: z.string().nullish(),
        school: z.string().nullish(),
        aboutMe: z.string().nullish(),
      }),
      submitStatsGlobal: z.object({
        acSubmissionNum: z.array(
          z.object({
            difficulty: z.string(),
            count: z.number(),
            submissions: z.number(),
          }),
        ),
      }),
      badges: z
        .array(
          z.object({
            id: z.string(),
            displayName: z.string(),
            icon: z.string().nullish(),
            creationDate: z.string().nullish(),
          }),
        )
        .default([]),
      userCalendar: z
        .object({
          streak: z.number().nullish(),
          totalActiveDays: z.number().nullish(),
          // A JSON *string* of { epochSeconds: submissionCount }.
          submissionCalendar: z.string().nullish(),
          activeYears: z.array(z.number()).nullish(),
        })
        .nullish(),
    })
    .nullable(),
});

export interface CalendarDay {
  /** ISO date, YYYY-MM-DD, in UTC. */
  date: string;
  count: number;
}

export interface LeetCodeProfile {
  username: string;
  realName: string | null;
  avatar: string | null;
  ranking: number | null;
  country: string | null;
  company: string | null;
  school: string | null;
  about: string | null;
  links: { github: string | null; twitter: string | null; linkedin: string | null };
  solved: { all: number; easy: number; medium: number; hard: number };
  submissions: { all: number; easy: number; medium: number; hard: number };
  badges: Array<{ id: string; name: string; icon: string | null; earnedAt: string | null }>;
  calendar: {
    streak: number;
    totalActiveDays: number;
    activeYears: number[];
    days: CalendarDay[];
  };
}

function bucket(
  rows: Array<{ difficulty: string; count: number; submissions: number }>,
) {
  const pick = (d: string) => rows.find((r) => r.difficulty === d);
  return {
    solved: {
      all: pick('All')?.count ?? 0,
      easy: pick('Easy')?.count ?? 0,
      medium: pick('Medium')?.count ?? 0,
      hard: pick('Hard')?.count ?? 0,
    },
    submissions: {
      all: pick('All')?.submissions ?? 0,
      easy: pick('Easy')?.submissions ?? 0,
      medium: pick('Medium')?.submissions ?? 0,
      hard: pick('Hard')?.submissions ?? 0,
    },
  };
}

/** `{"1700000000":3}` -> [{ date: '2023-11-14', count: 3 }, ...] sorted. */
export function parseSubmissionCalendar(raw: string | null | undefined): CalendarDay[] {
  if (!raw) return [];
  let obj: Record<string, number | string>;
  try {
    obj = JSON.parse(raw);
  } catch {
    return [];
  }
  return Object.entries(obj)
    .map(([seconds, count]) => ({
      date: new Date(Number(seconds) * 1000).toISOString().slice(0, 10),
      count: Number(count) || 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchProfile(
  username: string,
  year = new Date().getUTCFullYear(),
  options: RequestOptions = {},
): Promise<LeetCodeProfile> {
  const raw = await leetcodeGraphQL<unknown>(
    USER_PROFILE,
    { username, year },
    options,
  );
  const parsed = ProfileSchema.safeParse(raw);
  if (!parsed.success) {
    throw new LeetCodeError(
      'schema',
      'matchedUser did not match the expected shape',
      parsed.error.issues,
    );
  }
  const user = parsed.data.matchedUser;
  if (!user) {
    throw new LeetCodeError('not-found', `No LeetCode user "${username}"`);
  }
  const counts = bucket(user.submitStatsGlobal.acSubmissionNum);
  return {
    username: user.username,
    realName: user.profile.realName ?? null,
    avatar: user.profile.userAvatar ?? null,
    ranking: user.profile.ranking ?? null,
    country: user.profile.countryName ?? null,
    company: user.profile.company ?? null,
    school: user.profile.school ?? null,
    about: user.profile.aboutMe ?? null,
    links: {
      github: user.githubUrl ?? null,
      twitter: user.twitterUrl ?? null,
      linkedin: user.linkedinUrl ?? null,
    },
    ...counts,
    badges: user.badges.map((b) => ({
      id: b.id,
      name: b.displayName,
      icon: b.icon ?? null,
      earnedAt: b.creationDate ?? null,
    })),
    calendar: {
      streak: user.userCalendar?.streak ?? 0,
      totalActiveDays: user.userCalendar?.totalActiveDays ?? 0,
      activeYears: user.userCalendar?.activeYears ?? [],
      days: parseSubmissionCalendar(user.userCalendar?.submissionCalendar),
    },
  };
}

/* --------------------------------------------------------------- contest -- */

const ContestRankingSchema = z.object({
  userContestRanking: z
    .object({
      attendedContestsCount: z.number(),
      rating: z.number(),
      globalRanking: z.number().nullish(),
      totalParticipants: z.number().nullish(),
      topPercentage: z.number().nullish(),
      badge: z.object({ name: z.string() }).nullish(),
    })
    .nullable(),
});

export interface ContestStanding {
  rating: number;
  attended: number;
  globalRanking: number | null;
  totalParticipants: number | null;
  topPercentage: number | null;
  badge: string | null;
}

/** Null for users who have never entered a contest - not an error. */
export async function fetchContestRanking(
  username: string,
  options: RequestOptions = {},
): Promise<ContestStanding | null> {
  const raw = await leetcodeGraphQL<unknown>(
    CONTEST_RANKING,
    { username },
    options,
  );
  const parsed = ContestRankingSchema.safeParse(raw);
  if (!parsed.success) {
    throw new LeetCodeError(
      'schema',
      'userContestRanking did not match the expected shape',
      parsed.error.issues,
    );
  }
  const r = parsed.data.userContestRanking;
  if (!r) return null;
  return {
    rating: r.rating,
    attended: r.attendedContestsCount,
    globalRanking: r.globalRanking ?? null,
    totalParticipants: r.totalParticipants ?? null,
    topPercentage: r.topPercentage ?? null,
    badge: r.badge?.name ?? null,
  };
}

const ContestHistorySchema = z.object({
  userContestRankingHistory: z
    .array(
      z.object({
        attended: z.boolean(),
        rating: z.number().nullish(),
        ranking: z.number().nullish(),
        trendDirection: z.string().nullish(),
        problemsSolved: z.number().nullish(),
        totalProblems: z.number().nullish(),
        finishTimeInSeconds: z.number().nullish(),
        contest: z.object({ title: z.string(), startTime: z.number() }),
      }),
    )
    .nullable(),
});

export interface ContestEntry {
  title: string;
  /** ISO timestamp of the contest start. */
  at: string;
  rating: number;
  ranking: number | null;
  problemsSolved: number | null;
  totalProblems: number | null;
}

/** Only contests actually attended, oldest first - ready for the chart. */
export async function fetchContestHistory(
  username: string,
  options: RequestOptions = {},
): Promise<ContestEntry[]> {
  const raw = await leetcodeGraphQL<unknown>(
    CONTEST_HISTORY,
    { username },
    options,
  );
  const parsed = ContestHistorySchema.safeParse(raw);
  if (!parsed.success) {
    throw new LeetCodeError(
      'schema',
      'userContestRankingHistory did not match the expected shape',
      parsed.error.issues,
    );
  }
  return (parsed.data.userContestRankingHistory ?? [])
    .filter((e) => e.attended && typeof e.rating === 'number')
    .map((e) => ({
      title: e.contest.title,
      at: new Date(e.contest.startTime * 1000).toISOString(),
      rating: e.rating as number,
      ranking: e.ranking ?? null,
      problemsSolved: e.problemsSolved ?? null,
      totalProblems: e.totalProblems ?? null,
    }))
    .sort((a, b) => a.at.localeCompare(b.at));
}

/* ------------------------------------------------------------ submissions -- */

const RecentAcSchema = z.object({
  recentAcSubmissionList: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        titleSlug: z.string(),
        timestamp: z.string(),
      }),
    )
    .nullable(),
});

export interface AcSubmission {
  id: string;
  title: string;
  titleSlug: string;
  submittedAt: Date;
}

/**
 * Public list of recent accepted submissions (LeetCode caps this around 20).
 * This is the no-cookie auto-mark path: poll it every sync and accumulate.
 */
export async function fetchRecentAcSubmissions(
  username: string,
  limit = 20,
  options: RequestOptions = {},
): Promise<AcSubmission[]> {
  const raw = await leetcodeGraphQL<unknown>(
    RECENT_AC_SUBMISSIONS,
    { username, limit },
    options,
  );
  const parsed = RecentAcSchema.safeParse(raw);
  if (!parsed.success) {
    throw new LeetCodeError(
      'schema',
      'recentAcSubmissionList did not match the expected shape',
      parsed.error.issues,
    );
  }
  return (parsed.data.recentAcSubmissionList ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    titleSlug: s.titleSlug,
    submittedAt: new Date(Number(s.timestamp) * 1000),
  }));
}

const ProblemsetSchema = z.object({
  problemsetQuestionList: z
    .object({
      total: z.number(),
      questions: z.array(
        z.object({
          questionFrontendId: z.string(),
          title: z.string(),
          titleSlug: z.string(),
          difficulty: Difficulty,
          status: z.string().nullish(),
        }),
      ),
    })
    .nullable(),
});

export interface SolvedProblem {
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: z.infer<typeof Difficulty>;
}

/**
 * Complete solved list, cookie-backed.
 *
 * Requires LEETCODE_SESSION (+ csrftoken). Without valid cookies the endpoint
 * answers 200 with zero rows rather than an error, so an empty first page is
 * treated as an auth failure - that is what surfaces the "cookies expired"
 * warning instead of silently reporting zero solved problems.
 */
export async function fetchAllSolved(
  credentials: { session: string; csrfToken?: string },
  options: RequestOptions = {},
): Promise<SolvedProblem[]> {
  const pageSize = 100;
  const out: SolvedProblem[] = [];

  for (let skip = 0; ; skip += pageSize) {
    const raw = await leetcodeGraphQL<unknown>(
      PROBLEMSET_LIST,
      {
        categorySlug: '',
        limit: pageSize,
        skip,
        filters: { status: 'AC' },
      },
      { ...options, credentials },
    );
    const parsed = ProblemsetSchema.safeParse(raw);
    if (!parsed.success) {
      throw new LeetCodeError(
        'schema',
        'problemsetQuestionList did not match the expected shape',
        parsed.error.issues,
      );
    }
    const page = parsed.data.problemsetQuestionList;
    if (!page) {
      throw new LeetCodeError('schema', 'problemsetQuestionList was null');
    }
    if (skip === 0 && page.questions.length === 0) {
      throw new LeetCodeError(
        'auth',
        'LeetCode returned an empty solved list, which means LEETCODE_SESSION is missing or expired',
      );
    }
    out.push(
      ...page.questions.map((q) => ({
        questionFrontendId: q.questionFrontendId,
        title: q.title,
        titleSlug: q.titleSlug,
        difficulty: q.difficulty,
      })),
    );
    if (out.length >= page.total || page.questions.length < pageSize) break;
    // Be polite to an endpoint that has no published rate limit.
    await new Promise((r) => setTimeout(r, 250));
  }
  return out;
}

/* ------------------------------------------------------------- catalogue -- */

const CatalogSchema = z.object({
  questionList: z.object({
    totalNum: z.number(),
    data: z.array(
      z.object({
        questionFrontendId: z.string(),
        title: z.string(),
        titleSlug: z.string(),
        difficulty: Difficulty,
        isPaidOnly: z.boolean(),
        acRate: z.number().nullish(),
      }),
    ),
  }),
});

export interface CatalogEntry {
  id: string;
  title: string;
  slug: string;
  difficulty: z.infer<typeof Difficulty>;
  paidOnly: boolean;
  acRate: number | null;
}

/**
 * Download the entire public problem catalogue (~4100 problems).
 * No credentials needed. Used by `npm run ratings` to build the slug index.
 */
export async function fetchProblemCatalog(
  onProgress?: (loaded: number, total: number) => void,
  options: RequestOptions = {},
): Promise<CatalogEntry[]> {
  const pageSize = 100;
  const out: CatalogEntry[] = [];
  let total = Infinity;

  for (let skip = 0; skip < total; skip += pageSize) {
    const raw = await leetcodeGraphQL<unknown>(
      PROBLEM_CATALOG,
      { limit: pageSize, skip },
      options,
    );
    const parsed = CatalogSchema.safeParse(raw);
    if (!parsed.success) {
      throw new LeetCodeError(
        'schema',
        'questionList (catalogue) did not match the expected shape',
        parsed.error.issues,
      );
    }
    total = parsed.data.questionList.totalNum;
    const page = parsed.data.questionList.data;
    out.push(
      ...page.map((q) => ({
        id: q.questionFrontendId,
        title: q.title,
        slug: q.titleSlug,
        difficulty: q.difficulty,
        paidOnly: q.isPaidOnly,
        acRate: q.acRate ?? null,
      })),
    );
    onProgress?.(out.length, total);
    if (page.length === 0) break;
    await new Promise((r) => setTimeout(r, 150));
  }
  return out;
}
