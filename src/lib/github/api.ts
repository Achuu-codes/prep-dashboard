/**
 * Typed GitHub operations with zod validation, so schema drift surfaces as a
 * `GitHubError('schema', ...)` and the caller can fall back to the last good
 * snapshot instead of rendering a broken page.
 */
import { z } from 'zod';
import { GitHubError, githubGraphQL, type RequestOptions } from './client';
import { GITHUB_OVERVIEW } from './queries';

const LanguageRef = z
  .object({ name: z.string(), color: z.string().nullish() })
  .nullish();

const RepoSchema = z.object({
  name: z.string(),
  nameWithOwner: z.string(),
  description: z.string().nullish(),
  url: z.string(),
  stargazerCount: z.number(),
  forkCount: z.number(),
  isArchived: z.boolean(),
  pushedAt: z.string().nullish(),
  primaryLanguage: LanguageRef,
  languages: z
    .object({
      totalSize: z.number(),
      edges: z.array(
        z.object({
          size: z.number(),
          node: z.object({ name: z.string(), color: z.string().nullish() }),
        }),
      ),
    })
    .nullish(),
  repositoryTopics: z
    .object({
      nodes: z.array(z.object({ topic: z.object({ name: z.string() }) })),
    })
    .nullish(),
});

const OverviewSchema = z.object({
  user: z
    .object({
      login: z.string(),
      name: z.string().nullish(),
      bio: z.string().nullish(),
      company: z.string().nullish(),
      location: z.string().nullish(),
      websiteUrl: z.string().nullish(),
      avatarUrl: z.string(),
      url: z.string(),
      createdAt: z.string(),
      followers: z.object({ totalCount: z.number() }),
      following: z.object({ totalCount: z.number() }),
      pinnedItems: z.object({ nodes: z.array(RepoSchema.partial().passthrough()) }),
      repositories: z.object({
        totalCount: z.number(),
        nodes: z.array(RepoSchema),
      }),
      contributionsCollection: z.object({
        totalCommitContributions: z.number(),
        totalPullRequestContributions: z.number(),
        totalIssueContributions: z.number(),
        totalPullRequestReviewContributions: z.number(),
        restrictedContributionsCount: z.number(),
        contributionCalendar: z.object({
          totalContributions: z.number(),
          weeks: z.array(
            z.object({
              contributionDays: z.array(
                z.object({
                  date: z.string(),
                  weekday: z.number(),
                  contributionCount: z.number(),
                  color: z.string(),
                }),
              ),
            }),
          ),
        }),
      }),
    })
    .nullable(),
});

export interface GitHubRepo {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  archived: boolean;
  pushedAt: string | null;
  language: { name: string; color: string | null } | null;
  topics: string[];
}

export interface LanguageSlice {
  name: string;
  color: string | null;
  bytes: number;
  share: number; // 0..1
}

export interface ContributionDay {
  date: string;
  count: number;
  color: string;
}

export interface GitHubOverview {
  profile: {
    login: string;
    name: string | null;
    bio: string | null;
    company: string | null;
    location: string | null;
    website: string | null;
    avatar: string;
    url: string;
    joinedAt: string;
    followers: number;
    following: number;
    publicRepos: number;
  };
  pinned: GitHubRepo[];
  topRepos: GitHubRepo[];
  languages: LanguageSlice[];
  contributions: {
    total: number;
    commits: number;
    pullRequests: number;
    issues: number;
    reviews: number;
    private: number;
    days: ContributionDay[];
  };
}

function toRepo(r: z.infer<typeof RepoSchema>): GitHubRepo {
  return {
    name: r.name,
    fullName: r.nameWithOwner,
    description: r.description ?? null,
    url: r.url,
    stars: r.stargazerCount,
    forks: r.forkCount,
    archived: r.isArchived,
    pushedAt: r.pushedAt ?? null,
    language: r.primaryLanguage
      ? { name: r.primaryLanguage.name, color: r.primaryLanguage.color ?? null }
      : null,
    topics: r.repositoryTopics?.nodes.map((n) => n.topic.name) ?? [],
  };
}

/** Sum language bytes across every non-fork public repo. */
function rollUpLanguages(repos: z.infer<typeof RepoSchema>[]): LanguageSlice[] {
  const totals = new Map<string, { bytes: number; color: string | null }>();
  for (const repo of repos) {
    for (const edge of repo.languages?.edges ?? []) {
      const prev = totals.get(edge.node.name);
      totals.set(edge.node.name, {
        bytes: (prev?.bytes ?? 0) + edge.size,
        color: prev?.color ?? edge.node.color ?? null,
      });
    }
  }
  const grand = [...totals.values()].reduce((a, b) => a + b.bytes, 0) || 1;
  return [...totals.entries()]
    .map(([name, v]) => ({
      name,
      color: v.color,
      bytes: v.bytes,
      share: v.bytes / grand,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

export async function fetchGitHubOverview(
  login: string,
  token: string,
  options: RequestOptions = {},
): Promise<GitHubOverview> {
  const to = new Date();
  const from = new Date(to.getTime() - 365 * 24 * 60 * 60 * 1000);

  const raw = await githubGraphQL<unknown>(
    token,
    GITHUB_OVERVIEW,
    { login, from: from.toISOString(), to: to.toISOString() },
    options,
  );
  const parsed = OverviewSchema.safeParse(raw);
  if (!parsed.success) {
    throw new GitHubError(
      'schema',
      'GitHub overview did not match the expected shape',
      parsed.error.issues,
    );
  }
  const user = parsed.data.user;
  if (!user) throw new GitHubError('not-found', `No GitHub user "${login}"`);

  const repos = user.repositories.nodes;
  const cc = user.contributionsCollection;

  return {
    profile: {
      login: user.login,
      name: user.name ?? null,
      bio: user.bio ?? null,
      company: user.company ?? null,
      location: user.location ?? null,
      website: user.websiteUrl ?? null,
      avatar: user.avatarUrl,
      url: user.url,
      joinedAt: user.createdAt,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      publicRepos: user.repositories.totalCount,
    },
    // Pinned nodes come back as a union; anything non-repo is filtered out.
    pinned: user.pinnedItems.nodes
      .filter((n): n is z.infer<typeof RepoSchema> =>
        Boolean(n && typeof n.name === 'string' && typeof n.url === 'string'),
      )
      .map(toRepo),
    topRepos: repos.slice(0, 12).map(toRepo),
    languages: rollUpLanguages(repos),
    contributions: {
      total: cc.contributionCalendar.totalContributions,
      commits: cc.totalCommitContributions,
      pullRequests: cc.totalPullRequestContributions,
      issues: cc.totalIssueContributions,
      reviews: cc.totalPullRequestReviewContributions,
      private: cc.restrictedContributionsCount,
      days: cc.contributionCalendar.weeks.flatMap((w) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          color: d.color,
        })),
      ),
    },
  };
}
