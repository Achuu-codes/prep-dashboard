/**
 * Transport for the unofficial LeetCode GraphQL endpoint.
 *
 * Pure on purpose: credentials are passed in, never read from the environment
 * here, so the seed scripts (which run outside Next and cannot import
 * `server-only`) can reuse it.
 */
const ENDPOINT = 'https://leetcode.com/graphql';

/** Generic UA. Never put the owner's identity in an outbound header. */
const USER_AGENT =
  'Mozilla/5.0 (compatible; prep-dashboard/0.1; +https://leetcode.com)';

export type LeetCodeErrorKind =
  | 'network' // DNS, timeout, connection reset
  | 'http' // non-2xx, including 403/429 rate limiting
  | 'graphql' // endpoint answered with an `errors` array
  | 'schema' // answered, but not in the shape we expect
  | 'auth' // cookies missing or expired
  | 'not-found'; // user or question does not exist

export class LeetCodeError extends Error {
  constructor(
    readonly kind: LeetCodeErrorKind,
    message: string,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = 'LeetCodeError';
  }
}

export interface LeetCodeCredentials {
  session?: string;
  csrfToken?: string;
}

export interface RequestOptions {
  credentials?: LeetCodeCredentials;
  timeoutMs?: number;
  retries?: number;
  /** Forwarded to fetch so Next can cache or revalidate the response. */
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
}

function headers(credentials?: LeetCodeCredentials): Record<string, string> {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // LeetCode 403s requests without a plausible Referer.
    Referer: 'https://leetcode.com',
    Origin: 'https://leetcode.com',
    'User-Agent': USER_AGENT,
  };
  if (credentials?.session) {
    const cookies = [`LEETCODE_SESSION=${credentials.session}`];
    if (credentials.csrfToken) {
      cookies.push(`csrftoken=${credentials.csrfToken}`);
      h['x-csrftoken'] = credentials.csrfToken;
    }
    h.Cookie = cookies.join('; ');
  }
  return h;
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Execute one GraphQL document. Retries transient failures (timeouts, 429,
 * 5xx) with exponential backoff; never retries a 4xx we caused.
 */
export async function leetcodeGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: RequestOptions = {},
): Promise<T> {
  const { credentials, timeoutMs = 15_000, retries = 2 } = options;
  let lastError: LeetCodeError | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleep(2 ** attempt * 400);

    let response: Response;
    try {
      response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: headers(credentials),
        body: JSON.stringify({ query, variables }),
        signal: AbortSignal.timeout(timeoutMs),
        cache: options.cache ?? (options.next ? undefined : 'no-store'),
        ...(options.next ? { next: options.next } : {}),
      });
    } catch (cause) {
      lastError = new LeetCodeError(
        'network',
        `LeetCode request failed: ${(cause as Error)?.message ?? 'unknown'}`,
        cause,
      );
      continue;
    }

    if (response.status === 429 || response.status >= 500) {
      lastError = new LeetCodeError(
        'http',
        `LeetCode returned HTTP ${response.status}`,
      );
      continue;
    }
    if (response.status === 401 || response.status === 403) {
      throw new LeetCodeError(
        'auth',
        `LeetCode returned HTTP ${response.status}; cookies are likely expired`,
      );
    }
    if (!response.ok) {
      throw new LeetCodeError(
        'http',
        `LeetCode returned HTTP ${response.status}`,
      );
    }

    let body: { data?: T; errors?: Array<{ message: string }> };
    try {
      body = await response.json();
    } catch (cause) {
      lastError = new LeetCodeError(
        'schema',
        'LeetCode returned a non-JSON body',
        cause,
      );
      continue;
    }

    if (body.errors?.length) {
      // Schema drift and bad arguments are both permanent; do not retry.
      throw new LeetCodeError(
        'graphql',
        body.errors.map((e) => e.message).join('; '),
        body.errors,
      );
    }
    if (!body.data) {
      throw new LeetCodeError('schema', 'LeetCode response had no data field');
    }
    return body.data;
  }

  throw lastError ?? new LeetCodeError('network', 'LeetCode request failed');
}
