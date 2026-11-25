import type { ProblemSeed } from '../../types';

export const dpString: ProblemSeed[] = [
  // --- edit distance family -------------------------------------------------
  { slug: 'delete-operation-for-two-strings', sub: 'edit distance family', why: 'Deletions only: n + m - 2*LCS.' },
  { slug: 'minimum-ascii-delete-sum-for-two-strings', sub: 'edit distance family', why: 'Same table, weighted by character cost.' },
  { slug: 'edit-distance', sub: 'edit distance family', why: 'The reference 2D DP. Be able to write the O(min(n,m)) space version.' },

  // --- LCS family -----------------------------------------------------------
  { slug: 'longest-common-subsequence', sub: 'LCS family', why: 'The base table every problem in this group reshapes.' },
  { slug: 'uncrossed-lines', sub: 'LCS family', why: 'LCS in disguise — recognising it is the entire problem.' },
  { slug: 'shortest-common-supersequence', sub: 'LCS family', why: 'LCS plus reconstruction by walking the table backwards.' },
  { slug: 'distinct-subsequences', sub: 'LCS family', why: 'Counting, not matching; the mismatch case drops a term rather than branching.' },

  // --- palindromic subsequence ----------------------------------------------
  { slug: 'longest-palindromic-substring', sub: 'palindromic subsequence', why: 'Expand around 2n-1 centres; the DP table is the slower answer.' },
  { slug: 'palindromic-substrings', sub: 'palindromic subsequence' },
  { slug: 'longest-palindromic-subsequence', sub: 'palindromic subsequence', why: 'LCS of s and reverse(s), or interval DP. Both worth knowing.' },
  { slug: 'minimum-insertion-steps-to-make-a-string-palindrome', sub: 'palindromic subsequence', why: 'n - longest palindromic subsequence.' },
  { slug: 'count-different-palindromic-subsequences', sub: 'palindromic subsequence', why: 'Distinctness forces a different recurrence. Genuinely hard.' },

  // --- pattern matching DP --------------------------------------------------
  { slug: 'wildcard-matching', sub: 'pattern matching DP', why: 'The star case is "match empty or consume one char" — two transitions, not a loop.' },
  { slug: 'regular-expression-matching', sub: 'pattern matching DP', why: 'Look at p[j-1] == star and branch on zero-or-more. Index care required.' },
  { slug: 'strange-printer', sub: 'pattern matching DP' },

  // --- interleaving & decoding ----------------------------------------------
  { slug: 'interleaving-string', sub: 'interleaving & decoding', why: '2D DP over consumed prefixes; the greedy answer is wrong.' },
  { slug: 'decode-ways-ii', sub: 'interleaving & decoding', why: 'Wildcards turn each transition into a multiplicity count.' },
  { slug: 'scramble-string', sub: 'interleaving & decoding', why: 'Memoised split recursion over (i, j, len).' },
  { slug: 'word-break-ii', sub: 'interleaving & decoding' },
];
