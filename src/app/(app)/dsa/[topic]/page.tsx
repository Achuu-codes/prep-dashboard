import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProblemRow } from '@/components/problem-row';
import {
  Card,
  CardHeader,
  Empty,
  ProgressBar,
  SectionTitle,
  cx,
} from '@/components/ui';
import {
  getNav,
  getTopicBySlug,
  getTopicProblems,
  getTopicStats,
  groupBySubPattern,
  rollUp,
} from '@/db/queries/content';
import { loadNote } from '@/content/notes.generated';
import { endOfDay } from '@/lib/srs';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const row = await getTopicBySlug('dsa', topic);
  return { title: row?.title ?? 'Topic' };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicSlug } = await params;
  const topic = await getTopicBySlug('dsa', topicSlug);
  if (!topic) notFound();

  const [problems, stats, tree, Note] = await Promise.all([
    getTopicProblems(topic.id),
    getTopicStats(endOfDay()),
    getNav(),
    loadNote('dsa', topic.noteSlug),
  ]);

  const node = tree
    .find((s) => s.slug === 'dsa')
    ?.topics.flatMap((t) => [t, ...t.children])
    .find((t) => t.id === topic.id);
  const s = node
    ? rollUp(node, stats)
    : (stats.get(topic.id) ?? {
        topicId: topic.id,
        total: 0,
        solved: 0,
        attempted: 0,
        needsRevision: 0,
        due: 0,
      });

  const isGroup = Boolean(node?.children.length);
  const groups = groupBySubPattern(problems, topic.subPatterns);
  const solvedIn = (rows: typeof problems) =>
    rows.filter((r) => r.status === 'solved').length;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header>
        <nav className="mb-1 flex items-center gap-1.5 text-xs text-faint">
          <Link href="/dsa" className="hover:text-muted">
            DSA
          </Link>
          <span>/</span>
          <span className="text-muted">{topic.title}</span>
        </nav>
        <h1 className="text-lg font-semibold tracking-tight">{topic.title}</h1>
        {topic.summary ? (
          <p className="mt-1 max-w-3xl text-sm text-muted">{topic.summary}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <ProgressBar
            solved={s.solved}
            total={s.total}
            className="w-full max-w-xs"
          />
          {s.attempted > 0 ? (
            <span className="text-xs text-attempted">
              {s.attempted} attempted
            </span>
          ) : null}
          {s.needsRevision > 0 ? (
            <span className="text-xs text-revision">
              {s.needsRevision} need revision
            </span>
          ) : null}
          {s.due > 0 ? (
            <Link href="/revise" className="text-xs text-revision hover:underline">
              {s.due} due today
            </Link>
          ) : null}
        </div>
      </header>

      {/* 1 — Quick revision -------------------------------------------------- */}
      {Note ? (
        <Card as="section">
          <CardHeader
            title="Quick revision"
            subtitle="Patterns, recognition cues, templates, complexity, pitfalls"
          />
          <div className="note px-4 py-4 sm:px-5">
            <Note />
          </div>
        </Card>
      ) : (
        <Card as="section">
          <CardHeader title="Quick revision" />
          <div className="px-4 py-4">
            <Empty>
              No revision note yet. Add{' '}
              <code className="rounded bg-bg-subtle px-1 py-px font-mono text-[11px]">
                content/dsa/{topic.noteSlug ?? topic.slug}.mdx
              </code>{' '}
              and run{' '}
              <code className="rounded bg-bg-subtle px-1 py-px font-mono text-[11px]">
                npm run notes
              </code>
              .
            </Empty>
          </div>
        </Card>
      )}

      {/* 2–4 — Problem list, grouped, with per-sub-pattern progress --------- */}
      {isGroup ? (
        <section>
          <SectionTitle>Subpages</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {node?.children.map((child) => {
              const cs = rollUp(child, stats);
              return (
                <Link
                  key={child.slug}
                  href={`/dsa/${child.slug}`}
                  className="rounded-xl border border-border bg-surface p-3.5 hover:bg-surface-hover"
                >
                  <div className="text-[13px] font-semibold tracking-tight">
                    {child.title}
                  </div>
                  {child.summary ? (
                    <p className="mt-1 line-clamp-2 text-xs text-muted">
                      {child.summary}
                    </p>
                  ) : null}
                  <ProgressBar
                    solved={cs.solved}
                    total={cs.total}
                    className="mt-3"
                  />
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <section>
          <SectionTitle
            hint={`${problems.length} problems · solid → mastery`}
          >
            Problem list
          </SectionTitle>
          {groups.length === 0 ? (
            <Empty>No problems seeded for this topic yet.</Empty>
          ) : (
            <div className="space-y-4">
              {groups.map(({ sub, problems: rows }) => (
                <Card key={sub} as="section">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-border px-3 py-2">
                    <h3 className="text-[12px] font-semibold tracking-tight text-fg">
                      {sub}
                    </h3>
                    <span className="text-[11px] text-faint">
                      {rows.length} problem{rows.length === 1 ? '' : 's'}
                    </span>
                    <div className="ml-auto w-28 sm:w-36">
                      <ProgressBar
                        solved={solvedIn(rows)}
                        total={rows.length}
                        showLabel={false}
                      />
                    </div>
                    <span
                      className={cx(
                        'w-9 shrink-0 text-right text-[11px] tabular-nums',
                        solvedIn(rows) === rows.length
                          ? 'text-solved'
                          : 'text-faint',
                      )}
                    >
                      {solvedIn(rows)}/{rows.length}
                    </span>
                  </div>
                  <ul>
                    {rows.map((row) => (
                      <ProblemRow key={row.itemId} row={row} />
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
