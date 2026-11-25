import Link from 'next/link';
import {
  Card,
  DifficultyBadge,
  Empty,
  RatingBadge,
  StatusBadge,
} from '@/components/ui';
import { getTopicOptions, searchProblems } from '@/db/queries/search';
import { DIFFICULTIES, PROGRESS_STATUSES, type Difficulty, type ProgressStatus } from '@/db/schema';
import { shortDate } from '@/lib/format';
import { Filters } from './filters';

export const metadata = { title: 'All problems' };
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 100;

function asArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toNumber(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, toNumber(sp.page) ?? 1);

  const [{ rows, total }, topics] = await Promise.all([
    searchProblems({
      q: Array.isArray(sp.q) ? sp.q[0] : sp.q,
      topics: asArray(sp.topic),
      difficulty: asArray(sp.difficulty).filter((d): d is Difficulty =>
        (DIFFICULTIES as readonly string[]).includes(d),
      ),
      status: asArray(sp.status).filter((s): s is ProgressStatus =>
        (PROGRESS_STATUSES as readonly string[]).includes(s),
      ),
      minRating: toNumber(sp.min),
      maxRating: toNumber(sp.max),
      includeUnrated: sp.unrated === '1',
      sort: (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) as
        | 'curated'
        | 'rating'
        | 'rating-desc'
        | 'title'
        | 'recent'
        | undefined,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    getTopicOptions(),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (n: number) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (key === 'page') continue;
      for (const v of asArray(value)) next.append(key, v);
    }
    if (n > 1) next.set('page', String(n));
    return next.toString() ? `/problems?${next}` : '/problems';
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">All problems</h1>
        <p className="mt-1 text-sm text-muted">
          Search and filter across every tracked problem.
        </p>
      </header>

      <Filters topics={topics} total={total} shown={rows.length} />

      {rows.length === 0 ? (
        <Empty>No problems match these filters.</Empty>
      ) : (
        <Card>
          <ul>
            {rows.map((row) => (
              <li
                key={row.itemId}
                className="flex items-center gap-2 border-b border-border px-3 py-1.5 last:border-0 hover:bg-surface-hover/60 sm:gap-3"
              >
                <a
                  href={row.url ?? `https://leetcode.com/problems/${row.slug}/`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="min-w-0 flex-1 truncate text-[13px] hover:text-accent hover:underline"
                >
                  {row.title}
                </a>
                <Link
                  href={`/${row.sectionSlug}/${row.topicSlug}`}
                  className="hidden max-w-[11rem] shrink-0 truncate text-[11px] text-faint hover:text-muted md:block"
                  title={row.subPattern ?? undefined}
                >
                  {row.topicTitle}
                </Link>
                {row.solvedAt ? (
                  <span className="hidden w-20 shrink-0 text-right text-[11px] text-faint lg:block">
                    {shortDate(row.solvedAt)}
                  </span>
                ) : (
                  <span className="hidden w-20 shrink-0 lg:block" />
                )}
                <span className="w-8 shrink-0 text-right">
                  <RatingBadge rating={row.rating} />
                </span>
                <DifficultyBadge difficulty={row.difficulty} short />
                <span className="hidden sm:block">
                  <StatusBadge status={row.status} />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {pages > 1 ? (
        <nav className="flex items-center justify-center gap-2 text-xs">
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className="rounded-md border border-border px-2 py-1 text-muted hover:bg-surface-hover hover:text-fg"
            >
              Previous
            </Link>
          ) : null}
          <span className="text-faint">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link
              href={pageHref(page + 1)}
              className="rounded-md border border-border px-2 py-1 text-muted hover:bg-surface-hover hover:text-fg"
            >
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
