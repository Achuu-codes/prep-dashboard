import { Heatmap } from '@/components/charts/heatmap';
import { RatingChart } from '@/components/charts/rating-chart';
import { SegmentedBar } from '@/components/charts/segmented-bar';
import { SyncButton } from '@/components/sync-button';
import {
  Card,
  CardHeader,
  Empty,
  Pill,
  SectionTitle,
  StaleNotice,
  StatTile,
} from '@/components/ui';
import { getDashboardData } from '@/db/queries/dashboard';
import { getLastSyncRun } from '@/lib/snapshots';
import { countRecordedSubmissions } from '@/lib/sync';
import { bytes, compactNumber, describeAge, shortDate } from '@/lib/format';
import { features } from '@/lib/env';

export const metadata = { title: 'Stats' };
export const dynamic = 'force-dynamic';

const CAT = [
  'var(--cat-1)','var(--cat-2)','var(--cat-3)','var(--cat-4)',
  'var(--cat-5)','var(--cat-6)','var(--cat-7)','var(--cat-8)',
];

export default async function StatsPage() {
  const [data, lcRun, ghRun, recorded] = await Promise.all([
    getDashboardData(),
    getLastSyncRun('leetcode'),
    getLastSyncRun('github'),
    countRecordedSubmissions(),
  ]);

  const lc = data.leetcode.profile.data;
  const contest = data.leetcode.contest.data;
  const history = data.leetcode.history.data ?? [];
  const gh = data.github.data;

  const best = history.reduce(
    (acc, h) => (h.rating > acc ? h.rating : acc),
    0,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Stats</h1>
          <p className="mt-1 text-sm text-muted">
            Everything pulled from LeetCode and GitHub, with the last sync for
            each.
          </p>
        </div>
        <SyncButton />
      </header>

      {/* ---- sync health -------------------------------------------------- */}
      <section>
        <SectionTitle>Integrations</SectionTitle>
        <Card>
          <ul className="divide-y divide-border">
            {[
              {
                name: 'LeetCode',
                enabled: features.leetcode,
                run: lcRun,
                extra: features.leetcodeAuthed
                  ? data.leetcode.cookies?.ok === false
                    ? 'cookies expired'
                    : 'cookie auth active (full solved list)'
                  : `no cookies — counting recent submissions (${recorded} seen)`,
              },
              {
                name: 'GitHub',
                enabled: features.github,
                run: ghRun,
                extra: features.github ? 'read-only token' : 'no token set',
              },
            ].map((row) => (
              <li
                key={row.name}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5"
              >
                <span className="w-20 shrink-0 text-[13px] font-medium">
                  {row.name}
                </span>
                <Pill
                  className={
                    !row.enabled
                      ? 'text-faint'
                      : row.run?.status === 'ok'
                        ? 'border-solved/30 text-solved'
                        : row.run?.status === 'partial'
                          ? 'border-medium/30 text-medium'
                          : row.run
                            ? 'border-hard/30 text-hard'
                            : 'text-faint'
                  }
                >
                  {!row.enabled ? 'not configured' : (row.run?.status ?? 'never run')}
                </Pill>
                <span className="text-[11px] text-faint">{row.extra}</span>
                <div className="flex-1" />
                {row.run ? (
                  <span
                    className="max-w-sm truncate text-[11px] text-muted"
                    title={row.run.message ?? undefined}
                  >
                    {row.run.message}
                  </span>
                ) : null}
                <span className="shrink-0 text-[11px] text-faint">
                  {describeAge(row.run?.startedAt ?? null)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* ---- leetcode ----------------------------------------------------- */}
      <section className="space-y-4">
        <SectionTitle
          hint={
            data.leetcode.profile.fetchedAt
              ? `synced ${describeAge(data.leetcode.profile.fetchedAt)}`
              : undefined
          }
        >
          LeetCode
        </SectionTitle>

        {data.leetcode.profile.stale && lc ? (
          <StaleNotice
            provider="LeetCode"
            age={describeAge(data.leetcode.profile.fetchedAt)}
            error={data.leetcode.profile.error}
          />
        ) : null}

        {lc ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Rating"
                value={contest?.rating ? Math.round(contest.rating) : '—'}
                accent="var(--accent)"
                sub={best ? `peak ${Math.round(best)}` : undefined}
              />
              <StatTile
                label="Global rank"
                value={
                  contest?.globalRanking
                    ? compactNumber(contest.globalRanking)
                    : '—'
                }
                sub={
                  contest?.totalParticipants
                    ? `of ${compactNumber(contest.totalParticipants)}`
                    : undefined
                }
              />
              <StatTile
                label="Top percentage"
                value={
                  contest?.topPercentage ? `${contest.topPercentage.toFixed(1)}%` : '—'
                }
                sub={contest ? `${contest.attended} contests` : undefined}
              />
              <StatTile
                label="Site ranking"
                value={lc.ranking ? compactNumber(lc.ranking) : '—'}
                sub="overall profile rank"
              />
            </div>

            <Card>
              <CardHeader title="Rating history" />
              <div className="px-3 pb-3 pt-2">
                <RatingChart points={history} height={180} />
              </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader title="Solved by difficulty" />
                <div className="px-4 pb-4 pt-3">
                  <SegmentedBar
                    unit="problems"
                    labelCount={3}
                    segments={[
                      { label: 'Easy', value: lc.solved.easy, colour: 'var(--viz-easy)' },
                      { label: 'Medium', value: lc.solved.medium, colour: 'var(--viz-medium)' },
                      { label: 'Hard', value: lc.solved.hard, colour: 'var(--viz-hard)' },
                    ]}
                  />
                </div>
              </Card>
              <Card>
                <CardHeader
                  title="Badges"
                  subtitle={`${lc.badges.length} earned`}
                />
                <div className="flex flex-wrap gap-2 px-4 pb-4 pt-3">
                  {lc.badges.length === 0 ? (
                    <Empty>No badges yet.</Empty>
                  ) : (
                    lc.badges.map((badge) => (
                      <Pill key={badge.id} title={badge.earnedAt ?? undefined}>
                        {badge.name}
                      </Pill>
                    ))
                  )}
                </div>
              </Card>
            </div>

            <Card>
              <CardHeader
                title="Submission calendar"
                subtitle={`${lc.calendar.totalActiveDays} active days · current streak ${lc.calendar.streak}`}
              />
              <div className="px-3 pb-3 pt-3">
                <Heatmap days={lc.calendar.days} scale="blue" unit="submissions" />
              </div>
            </Card>
          </>
        ) : (
          <Empty>
            {features.leetcode
              ? 'No LeetCode snapshot yet — press Sync now.'
              : 'Set LEETCODE_USERNAME in .env.local to enable this.'}
          </Empty>
        )}
      </section>

      {/* ---- github ------------------------------------------------------- */}
      <section className="space-y-4">
        <SectionTitle
          hint={
            data.github.fetchedAt
              ? `synced ${describeAge(data.github.fetchedAt)}`
              : undefined
          }
        >
          GitHub
        </SectionTitle>

        {data.github.stale && gh ? (
          <StaleNotice
            provider="GitHub"
            age={describeAge(data.github.fetchedAt)}
            error={data.github.error}
          />
        ) : null}

        {gh ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Contributions"
                value={compactNumber(gh.contributions.total)}
                sub="last 12 months"
              />
              <StatTile
                label="Public repos"
                value={gh.profile.publicRepos}
                sub={`joined ${shortDate(gh.profile.joinedAt)}`}
              />
              <StatTile
                label="Followers"
                value={compactNumber(gh.profile.followers)}
                sub={`following ${gh.profile.following}`}
              />
              <StatTile
                label="Stars earned"
                value={compactNumber(
                  gh.topRepos.reduce((n, r) => n + r.stars, 0),
                )}
                sub="across top repos"
              />
            </div>

            <Card>
              <CardHeader
                title="Contribution calendar"
                subtitle={`${gh.contributions.commits} commits · ${gh.contributions.pullRequests} PRs · ${gh.contributions.issues} issues · ${gh.contributions.private} private`}
              />
              <div className="px-3 pb-3 pt-3">
                <Heatmap
                  days={gh.contributions.days}
                  scale="orange"
                  unit="contributions"
                />
              </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader
                  title="Language breakdown"
                  subtitle="by bytes across non-fork public repos"
                />
                <div className="px-4 pb-4 pt-3">
                  <SegmentedBar
                    unit="bytes"
                    labelCount={0}
                    segments={gh.languages.slice(0, 8).map((lang, i) => ({
                      label: `${lang.name} ${(lang.share * 100).toFixed(0)}%`,
                      value: lang.bytes,
                      colour: CAT[i],
                    }))}
                  />
                  <ul className="mt-3 space-y-1 border-t border-border pt-2.5">
                    {gh.languages.slice(0, 8).map((lang) => (
                      <li
                        key={lang.name}
                        className="flex items-center gap-2 text-[11px]"
                      >
                        <span className="flex-1 truncate text-muted">
                          {lang.name}
                        </span>
                        <span className="tabular-nums text-faint">
                          {bytes(lang.bytes)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              <Card>
                <CardHeader title="Top repositories" subtitle="by stars" />
                <ul className="divide-y divide-border">
                  {gh.topRepos.map((repo) => (
                    <li
                      key={repo.fullName}
                      className="flex items-center gap-2 px-3 py-1.5"
                    >
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="min-w-0 flex-1 truncate text-[13px] hover:text-accent hover:underline"
                      >
                        {repo.name}
                      </a>
                      {repo.language ? (
                        <span className="hidden shrink-0 text-[11px] text-faint sm:inline">
                          {repo.language.name}
                        </span>
                      ) : null}
                      <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-muted">
                        ★ {repo.stars}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </>
        ) : (
          <Empty>
            {features.github
              ? 'No GitHub snapshot yet — press Sync now.'
              : 'Set GITHUB_USERNAME and GITHUB_TOKEN in .env.local to enable this.'}
          </Empty>
        )}
      </section>
    </div>
  );
}
