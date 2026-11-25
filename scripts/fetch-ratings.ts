/**
 * Builds content/.problem-index.json: the offline problem index.
 *
 * Two sources, both public:
 *   1. The whole LeetCode public catalogue (titles, difficulty, paid-only flag)
 *   2. zerotrac/leetcode_problem_rating -> contest rating per problem
 *
 * The index is what makes the curated lists safe: a slug that is not in it is a
 * typo, and `npm run seed` refuses to continue. Re-run this whenever you want
 * fresh ratings or newly released problems.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fetchProblemCatalog } from '../src/lib/leetcode/api';
import { log } from './_bootstrap';

const RATINGS_URL =
  'https://raw.githubusercontent.com/zerotrac/leetcode_problem_rating/main/ratings.txt';

export const INDEX_PATH = resolve(process.cwd(), 'content/.problem-index.json');

export interface IndexedProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  paidOnly: boolean;
  acRate: number | null;
  /** zerotrac contest rating, absent for non-contest problems. */
  rating: number | null;
  contest: string | null;
}

export interface ProblemIndex {
  builtAt: string;
  counts: { catalogue: number; rated: number };
  problems: Record<string, IndexedProblem>;
}

/** Parse the zerotrac TSV: Rating, ID, Title, Title ZH, Slug, Contest, Index. */
async function fetchRatings(): Promise<
  Map<string, { rating: number; contest: string | null }>
> {
  const res = await fetch(RATINGS_URL, {
    signal: AbortSignal.timeout(30_000),
    headers: { 'User-Agent': 'prep-dashboard/0.1' },
  });
  if (!res.ok) {
    throw new Error(`zerotrac ratings returned HTTP ${res.status}`);
  }
  const text = await res.text();
  const lines = text.split('\n').filter(Boolean);
  const header = lines.shift();
  if (!header?.startsWith('Rating')) {
    throw new Error(
      'zerotrac ratings.txt no longer starts with a "Rating" header; check the format',
    );
  }
  const out = new Map<string, { rating: number; contest: string | null }>();
  for (const line of lines) {
    const cols = line.split('\t');
    if (cols.length < 6) continue;
    const rating = Number(cols[0]);
    const slug = cols[4]?.trim();
    if (!slug || !Number.isFinite(rating)) continue;
    out.set(slug, { rating: Math.round(rating), contest: cols[5]?.trim() || null });
  }
  return out;
}

async function main() {
  log.step('Fetching zerotrac contest ratings');
  const ratings = await fetchRatings();
  log.ok(`${ratings.size} rated problems`);

  log.step('Fetching LeetCode problem catalogue');
  let lastLogged = 0;
  const catalogue = await fetchProblemCatalog((loaded, total) => {
    if (loaded - lastLogged >= 500 || loaded === total) {
      log.info(`${loaded}/${total}`);
      lastLogged = loaded;
    }
  });
  log.ok(`${catalogue.length} problems in catalogue`);

  const problems: Record<string, IndexedProblem> = {};
  for (const q of catalogue) {
    const r = ratings.get(q.slug);
    problems[q.slug] = {
      id: q.id,
      title: q.title,
      slug: q.slug,
      difficulty: q.difficulty,
      paidOnly: q.paidOnly,
      acRate: q.acRate,
      rating: r?.rating ?? null,
      contest: r?.contest ?? null,
    };
  }

  const index: ProblemIndex = {
    builtAt: new Date().toISOString(),
    counts: {
      catalogue: catalogue.length,
      rated: Object.values(problems).filter((p) => p.rating !== null).length,
    },
    problems,
  };

  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 0));
  log.step('Wrote content/.problem-index.json');
  log.ok(
    `${index.counts.catalogue} problems, ${index.counts.rated} with a contest rating`,
  );
}

main().catch((err) => {
  log.fail(String(err?.message ?? err));
  process.exit(1);
});
