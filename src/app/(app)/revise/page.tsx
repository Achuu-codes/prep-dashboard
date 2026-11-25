import Link from 'next/link';
import { ReviewActions } from '@/components/review-actions';
import {
  Card,
  DifficultyBadge,
  Empty,
  Pill,
  RatingBadge,
  SectionTitle,
  StatusBadge,
  cx,
} from '@/components/ui';
import { getDueProblems } from '@/db/queries/content';
import { shortDate } from '@/lib/format';
import { REVIEW_OFFSETS_DAYS, endOfDay, startOfDay } from '@/lib/srs';

export const metadata = { title: 'Revise today' };
export const dynamic = 'force-dynamic';

export default async function RevisePage() {
  const due = await getDueProblems(endOfDay(), startOfDay());

  const overdue = due.filter((d) => d.daysOverdue > 0);
  const today = due.filter((d) => d.daysOverdue === 0);

  const buckets = [
    { label: 'Overdue', rows: overdue, tone: 'text-hard' },
    { label: 'Due today', rows: today, tone: 'text-accent' },
  ].filter((b) => b.rows.length > 0);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">Revise today</h1>
        <p className="mt-1 text-sm text-muted">
          Problems resurface {REVIEW_OFFSETS_DAYS.join(', ')} days after you
          solve them. Mark each one and it moves to the next interval.
        </p>
      </header>

      {due.length === 0 ? (
        <Empty>
          Nothing due. Solve something and it will come back in{' '}
          {REVIEW_OFFSETS_DAYS[0]} days.
        </Empty>
      ) : (
        buckets.map((bucket) => (
          <section key={bucket.label}>
            <SectionTitle hint={`${bucket.rows.length}`}>
              <span className={bucket.tone}>{bucket.label}</span>
            </SectionTitle>
            <Card>
              <ul>
                {bucket.rows.map((row) => (
                  <li
                    key={row.itemId}
                    className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-3 py-2 last:border-0"
                  >
                    <a
                      href={row.url ?? `https://leetcode.com/problems/${row.slug}/`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="min-w-0 flex-1 basis-48 truncate text-[13px] hover:text-accent hover:underline"
                    >
                      {row.title}
                    </a>
                    <Link
                      href={`/dsa/${row.topicSlug}`}
                      className="hidden max-w-[10rem] shrink-0 truncate text-[11px] text-faint hover:text-muted sm:block"
                    >
                      {row.topicTitle}
                    </Link>
                    <RatingBadge rating={row.rating} />
                    <DifficultyBadge difficulty={row.difficulty} short />
                    <Pill
                      className={cx(
                        row.daysOverdue > 0 && 'border-hard/30 text-hard',
                      )}
                      title={`Scheduled for ${shortDate(row.nextReviewAt)}`}
                    >
                      {row.daysOverdue > 0
                        ? `${row.daysOverdue}d late`
                        : `+${REVIEW_OFFSETS_DAYS[row.reviewStage] ?? '?'}d`}
                    </Pill>
                    <StatusBadge status={row.status} />
                    <ReviewActions itemId={row.itemId} />
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        ))
      )}
    </div>
  );
}
