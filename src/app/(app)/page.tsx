import Link from 'next/link';
import { Heatmap } from '@/components/charts/heatmap';
import { RatingChart } from '@/components/charts/rating-chart';
import { SegmentedBar } from '@/components/charts/segmented-bar';
import { SyncButton } from '@/components/sync-button';
import {
  Card,
  CardHeader,
  Empty,
  Pill,
  ProgressBar,
  SectionTitle,
  StaleNotice,
  StatTile,
  cx,
} from '@/components/ui';
import { getDashboardData } from '@/db/queries/dashboard';
import { bytes, compactNumber, describeAge } from '@/lib/format';
import { features, publicProfile } from '@/lib/env';
import { REVIEW_OFFSETS_DAYS } from '@/lib/srs';

export const metadata = { title: 'Overview' };
export const dynamic = 'force-dynamic';

const CAT = [
  'var(--cat-1)',
  'var(--cat-2)',
  'var(--cat-3)',
  'var(--cat-4)',
  'var(--cat-5)',
  'var(--cat-6)',
  'var(--cat-7)',
  'var(--cat-8)',
];

export default async function OverviewPage() {
  const data = await getDashboardData();
  const profile = publicProfile();
  const lc = data.leetcode.profile.data;
  const contest = data.leetcode.contest.data;
  const history = data.leetcode.history.data ?? [];
  const gh = data.github.data;

  const links = [
    profile.leetcode
      ? { label: 'LeetCode', href: `https://leetcode.com/u/${profile.leetcode}/` }
      : null,
    profile.github
      ? { label: 'GitHub', href: `https://github.com/${profile.github}` }
      : null,
    profile.website ? { label: 'Website', href: profile.website } : null,
    profile.email ? { label: 'Email', href: `mailto:${profile.email}` } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  const nothingSynced = !lc && !gh;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ---- identity ---------------------------------------------------- */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {profile.name}
          </h1>
          {profile.tagline ? (
            <p className="mt-0.5 text-sm text-muted">{profile.tagline}</p>
          ) : null}
          {links.length ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer noopener"
                  className="text-xs text-accent hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <SyncButton />
      </header>

      {nothingSynced ? (
        <Empty>
          No integration data yet. Set <code className="font-mono text-[11px]">LEETCODE_USERNAME</code>{' '}
          and <code className="font-mono text-[11px]">GITHUB_USERNAME</code> /{' '}
          <code className="font-mono text-[11px]">GITHUB_TOKEN</code> in{' '}
          <code className="font-mono text-[11px]">.env.local</code>, then press
          Sync now.
        </Empty>
      ) : null}

      {data.leetcode.cookies && !data.leetcode.cookies.ok ? (
        <div className="rounded-lg border border-medium/30 bg-medium/5 px-3 py-2 text-xs text-medium">
          <span className="font-medium">LeetCode cookies have expired.</span>{' '}
          Refresh <code className="font-mono">LEETCODE_SESSION</code> and{' '}
          <code className="font-mono">LEETCODE_CSRF</code> to keep pulling the
          full solved list. Until then, solved problems are picked up from recent
          accepted submissions only.
        </div>
      ) : null}

      {/* ---- headline tiles ---------------------------------------------- */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Contest rating"
          value={contest?.rating ? Math.round(contest.rating) : '—'}
          accent="var(--accent)"
          sub={
            contest
              ? `${contest.attended} contests · top ${contest.topPercentage?.toFixed(1) ?? '—'}%`
              : 'no contest history'
          }
        />
        <StatTile
          label="Problems solved"
          value={lc ? compactNumber(lc.solved.all) : '—'}
          sub={
            contest?.globalRanking
              ? `global rank ${compactNumber(contest.globalRanking)}`
              : lc
                ? `${lc.submissions.all} submissions`
                : undefined
          }
        />
        <StatTile
          label="Current streak"
          value={lc ? lc.calendar.streak : '—'}
          sub={lc ? `${lc.calendar.totalActiveDays} active days` : undefined}
        />
        <StatTile
          label="Due for revision"
          value={data.dueCount}
          href="/revise"
          accent={data.dueCount > 0 ? 'var(--revision)' : undefined}
          sub={`resurfaces at ${REVIEW_OFFSETS_DAYS.join('/')} days`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ---- rating history -------------------------------------------- */}
        <Card as="section">
          <CardHeader
            title="Contest rating history"
            subtitle={
              contest?.badge ? `Badge: ${contest.badge}` : 'LeetCode contests'
            }
          />
          <div className="px-3 pb-3 pt-2">
            {data.leetcode.history.stale && data.leetcode.history.data ? (
              <div className="mb-2">
                <StaleNotice
                  provider="LeetCode"
                  age={describeAge(data.leetcode.history.fetchedAt)}
                  error={data.leetcode.history.error}
                />
              </div>
            ) : null}
            <RatingChart
              points={history.map((h) => ({
                at: h.at,
                rating: h.rating,
                title: h.title,
                ranking: h.ranking,
              }))}
            />
          </div>
        </Card>

        {/* ---- solved by difficulty -------------------------------------- */}
        <Card as="section">
          <CardHeader
            title="Solved by difficulty"
            subtitle={lc ? `${lc.solved.all} accepted problems` : undefined}
          />
          <div className="space-y-4 px-4 pb-4 pt-3">
            {data.leetcode.profile.stale && lc ? (
              <StaleNotice
                provider="LeetCode"
                age={describeAge(data.leetcode.profile.fetchedAt)}
                error={data.leetcode.profile.error}
              />
            ) : null}
            {lc ? (
              <>
                <SegmentedBar
                  unit="problems"
                  labelCount={3}
                  segments={[
                    { label: 'Easy', value: lc.solved.easy, colour: 'var(--viz-easy)' },
                    { label: 'Medium', value: lc.solved.medium, colour: 'var(--viz-medium)' },
                    { label: 'Hard', value: lc.solved.hard, colour: 'var(--viz-hard)' },
                  ]}
                />
                <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
                  {(['easy', 'medium', 'hard'] as const).map((key) => (
                    <div key={key}>
                      <div className="text-[10px] uppercase tracking-wider text-faint">
                        {key}
                      </div>
                      <div
                        className="text-lg font-semibold tabular-nums leading-tight"
                        style={{ color: `var(--viz-${key})` }}
                      >
                        {lc.solved[key]}
                      </div>
                      <div className="text-[10px] text-faint tabular-nums">
                        {lc.submissions[key]} submissions
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Empty>
                {features.leetcode
                  ? 'Press Sync now to pull LeetCode stats.'
                  : 'Set LEETCODE_USERNAME to enable this.'}
              </Empty>
            )}
          </div>
        </Card>
      </div>

      {/* ---- activity heatmaps ------------------------------------------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section">
          <CardHeader
            title="LeetCode submissions"
            subtitle={
              lc
                ? `${lc.calendar.totalActiveDays} active days · streak ${lc.calendar.streak}`
                : undefined
            }
          />
          <div className="px-3 pb-3 pt-3">
            {lc?.calendar.days.length ? (
              <Heatmap days={lc.calendar.days} scale="blue" unit="submissions" />
            ) : (
              <Empty>No submission calendar yet.</Empty>
            )}
          </div>
        </Card>

        <Card as="section">
          <CardHeader
            title="GitHub contributions"
            subtitle={
              gh
                ? `${gh.contributions.commits} commits · ${gh.contributions.pullRequests} PRs · ${gh.contributions.reviews} reviews`
                : undefined
            }
            action={
              data.github.stale && gh ? (
                <Pill className="border-medium/30 text-medium">stale</Pill>
              ) : null
            }
          />
          <div className="px-3 pb-3 pt-3">
            {gh?.contributions.days.length ? (
              <Heatmap
                days={gh.contributions.days}
                scale="orange"
                unit="contributions"
              />
            ) : (
              <Empty>
                {features.github
                  ? 'Press Sync now to pull GitHub activity.'
                  : 'Set GITHUB_USERNAME and GITHUB_TOKEN to enable this.'}
              </Empty>
            )}
          </div>
        </Card>
      </div>

      {/* ---- DSA progress ------------------------------------------------- */}
      <section>
        <SectionTitle
          hint={
            <Link href="/dsa" className="hover:text-muted">
              {data.dsa.solved}/{data.dsa.total} solved →
            </Link>
          }
        >
          DSA progress
        </SectionTitle>
        <Card>
          <ul className="divide-y divide-border">
            {data.dsa.topics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/dsa/${topic.slug}`}
                  className="flex items-center gap-3 px-3 py-1.5 hover:bg-surface-hover/60"
                >
                  <span className="w-40 shrink-0 truncate text-[13px] sm:w-52">
                    {topic.title}
                  </span>
                  <ProgressBar
                    solved={topic.solved}
                    total={topic.total}
                    showLabel={false}
                    className="flex-1"
                  />
                  <span
                    className={cx(
                      'w-12 shrink-0 text-right text-[11px] tabular-nums',
                      topic.total > 0 && topic.solved === topic.total
                        ? 'text-solved'
                        : 'text-faint',
                    )}
                  >
                    {topic.solved}/{topic.total}
                  </span>
                  {topic.due > 0 ? (
                    <span className="w-6 shrink-0 text-right text-[11px] tabular-nums text-revision">
                      {topic.due}
                    </span>
                  ) : (
                    <span className="w-6 shrink-0" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* ---- GitHub repos & languages ------------------------------------ */}
      {gh ? (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <section>
            <SectionTitle hint={`${gh.profile.publicRepos} public repos`}>
              Pinned repositories
            </SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              {(gh.pinned.length ? gh.pinned : gh.topRepos.slice(0, 6)).map(
                (repo) => (
                  <Card key={repo.fullName} className="p-3">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[13px] font-semibold tracking-tight hover:text-accent"
                    >
                      {repo.name}
                    </a>
                    {repo.description ? (
                      <p className="mt-1 line-clamp-2 text-xs text-muted">
                        {repo.description}
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-faint">
                      {repo.language ? (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="size-2 rounded-full"
                            style={{
                              background: repo.language.color ?? 'var(--cat-other)',
                            }}
                          />
                          {repo.language.name}
                        </span>
                      ) : null}
                      <span className="tabular-nums">★ {repo.stars}</span>
                      {repo.forks > 0 ? (
                        <span className="tabular-nums">⑂ {repo.forks}</span>
                      ) : null}
                    </div>
                  </Card>
                ),
              )}
            </div>
          </section>

          <section>
            <SectionTitle>Languages</SectionTitle>
            <Card className="px-4 py-4">
              <SegmentedBar
                unit="bytes"
                labelCount={0}
                segments={gh.languages.slice(0, 8).map((lang, i) => ({
                  label: `${lang.name} ${(lang.share * 100).toFixed(0)}%`,
                  value: lang.bytes,
                  colour: CAT[i],
                  detail: bytes(lang.bytes),
                }))}
              />
            </Card>
          </section>
        </div>
      ) : null}
    </div>
  );
}
