import Link from 'next/link';
import { Card, ProgressBar, SectionTitle, cx } from '@/components/ui';
import {
  getNav,
  getTopicStats,
  rollUp,
  type TopicNode,
} from '@/db/queries/content';
import { endOfDay } from '@/lib/srs';

export const metadata = { title: 'DSA' };
export const dynamic = 'force-dynamic';

function TopicCard({
  topic,
  stats,
}: {
  topic: TopicNode;
  stats: Map<string, ReturnType<typeof rollUp>>;
}) {
  const s = rollUp(topic, stats);
  const isGroup = topic.children.length > 0;
  const href = `/dsa/${topic.slug}`;

  return (
    <Card className="flex flex-col p-3.5">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={href}
          className="text-[13px] font-semibold tracking-tight hover:text-accent"
        >
          {topic.title}
        </Link>
        {s.due > 0 ? (
          <Link
            href="/revise"
            className="shrink-0 rounded-full border border-revision/35 bg-revision/10 px-1.5 text-[10px] font-medium text-revision"
            title={`${s.due} due for revision`}
          >
            {s.due}
          </Link>
        ) : null}
      </div>

      {topic.summary ? (
        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">
          {topic.summary}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      <ProgressBar solved={s.solved} total={s.total} className="mt-3" />

      {isGroup ? (
        <ul className="mt-2.5 space-y-0.5 border-t border-border pt-2">
          {topic.children.map((child) => {
            const cs = rollUp(child, stats);
            const pct = cs.total ? Math.round((cs.solved / cs.total) * 100) : 0;
            return (
              <li key={child.slug}>
                <Link
                  href={`/dsa/${child.slug}`}
                  className="flex items-center gap-2 rounded px-1 py-0.5 text-[11px] text-muted hover:bg-surface-hover hover:text-fg"
                >
                  <span className="flex-1 truncate">{child.title}</span>
                  <span
                    className={cx(
                      'tabular-nums',
                      pct === 100 ? 'text-solved' : 'text-faint',
                    )}
                  >
                    {cs.solved}/{cs.total}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </Card>
  );
}

export default async function DsaIndexPage() {
  const [tree, stats] = await Promise.all([
    getNav(),
    getTopicStats(endOfDay()),
  ]);
  const section = tree.find((s) => s.slug === 'dsa');
  if (!section) return null;

  const totals = section.topics.reduce(
    (acc, t) => {
      const s = rollUp(t, stats);
      return {
        solved: acc.solved + s.solved,
        total: acc.total + s.total,
        due: acc.due + s.due,
      };
    },
    { solved: 0, total: 0, due: 0 },
  );

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">DSA</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          {section.description}
        </p>
        <div className="mt-3 flex max-w-sm items-center gap-3">
          <ProgressBar solved={totals.solved} total={totals.total} />
          {totals.due > 0 ? (
            <Link
              href="/revise"
              className="shrink-0 text-xs text-revision hover:underline"
            >
              {totals.due} due
            </Link>
          ) : null}
        </div>
      </header>

      <div>
        <SectionTitle hint={`${section.topics.length} topics`}>
          Topics
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {section.topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} stats={stats} />
          ))}
        </div>
      </div>
    </div>
  );
}
