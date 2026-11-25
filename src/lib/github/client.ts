/**
 * Transport for the GitHub GraphQL API.
 *
 * Pure: the token is an argument. It is read from the environment exactly once,
 * in `src/lib/github/server.ts`, and never leaves the server.
 */
const ENDPOINT = 'https://api.github.com/graphql';

/**
 * GitHub asks automated clients to identify themselves. A generic product name
 * only - never the owner's name or email.
 */
const USER_AGENT = 'prep-dashboard/0.1';

export type GitHubErrorKind =
  | 'network'
  | 'http'
  | 'graphql'
  | 'schema'
  | 'auth'
  | 'rate-limit'
  | 'not-found';

export class GitHubError extends Error {
  constructor(
    readonly kind: GitHubErrorKind,
    message: string,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

export interface RequestOptions {
  timeoutMs?: number;
  retries?: number;
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function githubGraphQL<T>(
  token: string,
  query: string,
  variables: Record<string, unknown> = {},
  options: RequestOptions = {},
): Promise<T> {
  const { timeoutMs = 15_000, retries = 2 } = options;
  let lastError: GitHubError | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleep(2 ** attempt * 400);

    let response: Response;
    try {
      response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': USER_AGENT,
        },
        body: JSON.stringify({ query, variables }),
        signal: AbortSignal.timeout(timeoutMs),
        cache: options.cache ?? (options.next ? undefined : 'no-store'),
        ...(options.next ? { next: options.next } : {}),
      });
    } catch (cause) {
      lastError = new GitHubError(
        'network',
        `GitHub request failed: ${(cause as Error)?.message ?? 'unknown'}`,
        cause,
      );
      continue;
    }

    if (response.status === 401) {
      throw new GitHubError(
        'auth',
        'GitHub rejected the token (401). Check GITHUB_TOKEN.',
      );
    }
    if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
      throw new GitHubError('rate-limit', 'GitHub API rate limit exhausted');
    }
    if (response.status === 429 || response.status >= 500) {
      lastError = new GitHubError('http', `GitHub returned HTTP ${response.status}`);
      continue;
    }
    if (!response.ok) {
      throw new GitHubError('http', `GitHub returned HTTP ${response.status}`);
    }

    let body: { data?: T; errors?: Array<{ message: string; type?: string }> };
    try {
      body = await response.json();
    } catch (cause) {
      lastError = new GitHubError('schema', 'GitHub returned a non-JSON body', cause);
      continue;
    }

    if (body.errors?.length) {
      const notFound = body.errors.some((e) => e.type === 'NOT_FOUND');
      throw new GitHubError(
        notFound ? 'not-found' : 'graphql',
        body.errors.map((e) => e.message).join('; '),
        body.errors,
      );
    }
    if (!body.data) {
      throw new GitHubError('schema', 'GitHub response had no data field');
    }
    return body.data;
  }

  throw lastError ?? new GitHubError('network', 'GitHub request failed');
}
