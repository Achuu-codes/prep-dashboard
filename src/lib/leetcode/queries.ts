/**
 * EVERY LeetCode GraphQL document lives in this file.
 *
 * LeetCode has no official API and changes this schema without notice, so when
 * something breaks this is the only file you need to edit. Each document below
 * was verified against https://leetcode.com/graphql.
 *
 * The endpoint rejects browser requests (no CORS headers), so all of this is
 * server-side only.
 */

/** Resolve a single problem by slug. Used by the seed validator. */
export const QUESTION_BY_SLUG = /* GraphQL */ `
  query questionBySlug($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      questionFrontendId
      title
      titleSlug
      difficulty
      isPaidOnly
      topicTags {
        name
        slug
      }
    }
  }
`;

/** Profile, solved counts by difficulty, badges and the submission calendar. */
export const USER_PROFILE = /* GraphQL */ `
  query userProfile($username: String!, $year: Int) {
    matchedUser(username: $username) {
      username
      githubUrl
      twitterUrl
      linkedinUrl
      profile {
        realName
        userAvatar
        ranking
        reputation
        countryName
        company
        school
        aboutMe
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      badges {
        id
        displayName
        icon
        creationDate
      }
      userCalendar(year: $year) {
        streak
        totalActiveDays
        submissionCalendar
        activeYears
      }
    }
  }
`;

/** Current contest standing. Returns null for users who never contested. */
export const CONTEST_RANKING = /* GraphQL */ `
  query contestRanking($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
      badge {
        name
      }
    }
  }
`;

/** Full per-contest rating history, for the rating chart. */
export const CONTEST_HISTORY = /* GraphQL */ `
  query contestHistory($username: String!) {
    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking
      trendDirection
      problemsSolved
      totalProblems
      finishTimeInSeconds
      contest {
        title
        startTime
      }
    }
  }
`;

/** Public recent accepted submissions. The no-cookie auto-mark path. */
export const RECENT_AC_SUBMISSIONS = /* GraphQL */ `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

/**
 * Paginated problem list. With LEETCODE_SESSION + csrftoken cookies attached,
 * `filters: { status: "AC" }` returns the caller's complete solved list; without
 * them it returns zero rows (verified), which is how we detect expired cookies.
 */
export const PROBLEMSET_LIST = /* GraphQL */ `
  query problemsetList(
    $categorySlug: String
    $limit: Int
    $skip: Int
    $filters: QuestionListFilterInput
  ) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        questionFrontendId
        title
        titleSlug
        difficulty
        status
      }
    }
  }
`;

/**
 * Whole public problem catalogue, paginated. Run once at seed time to build
 * the offline slug index that guarantees zero dead links.
 */
export const PROBLEM_CATALOG = /* GraphQL */ `
  query problemCatalog($limit: Int!, $skip: Int!) {
    questionList(categorySlug: "", limit: $limit, skip: $skip, filters: {}) {
      totalNum
      data {
        questionFrontendId
        title
        titleSlug
        difficulty
        isPaidOnly
        acRate
      }
    }
  }
`;
