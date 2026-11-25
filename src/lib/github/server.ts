import 'server-only';
import { env, features } from '@/lib/env';
import { fetchGitHubOverview, type GitHubOverview } from './api';
import { GitHubError } from './client';

/** Env-bound GitHub call. The PAT is read here and never leaves the server. */
export function getGitHubOverview(): Promise<GitHubOverview> {
  if (!env.GITHUB_USERNAME || !env.GITHUB_TOKEN) {
    throw new GitHubError(
      'auth',
      'GITHUB_USERNAME and GITHUB_TOKEN must both be set.',
    );
  }
  return fetchGitHubOverview(env.GITHUB_USERNAME, env.GITHUB_TOKEN);
}

export const githubFeatures = {
  get enabled() {
    return features.github;
  },
};
