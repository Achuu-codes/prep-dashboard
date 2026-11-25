/**
 * EVERY GitHub GraphQL document lives in this file.
 *
 * The contribution calendar and pinned repositories are only available through
 * the GraphQL API (v4), not REST, so one query covers profile + pinned + repos
 * + calendar in a single round trip.
 *
 * `contributionsCollection` accepts at most a one-year window, so `from`/`to`
 * are always set to the trailing 12 months.
 */
export const GITHUB_OVERVIEW = /* GraphQL */ `
  query githubOverview($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      login
      name
      bio
      company
      location
      websiteUrl
      avatarUrl
      url
      createdAt
      followers {
        totalCount
      }
      following {
        totalCount
      }

      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            nameWithOwner
            description
            url
            stargazerCount
            forkCount
            isArchived
            pushedAt
            primaryLanguage {
              name
              color
            }
            repositoryTopics(first: 6) {
              nodes {
                topic {
                  name
                }
              }
            }
          }
        }
      }

      repositories(
        first: 100
        privacy: PUBLIC
        isFork: false
        ownerAffiliations: OWNER
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          nameWithOwner
          description
          url
          stargazerCount
          forkCount
          isArchived
          pushedAt
          primaryLanguage {
            name
            color
          }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            totalSize
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }

      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              weekday
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;
