import type { ProblemSeed } from '../../types';

export const dpLis: ProblemSeed[] = [
  // --- LIS in O(n log n) ----------------------------------------------------
  { slug: 'longest-increasing-subsequence', sub: 'LIS in O(n log n)', why: 'Know both: O(n^2) DP and the tails array with lower_bound.' },
  { slug: 'number-of-longest-increasing-subsequence', sub: 'LIS in O(n log n)', why: 'Counting forces the O(n^2) DP, or a BIT over values.' },
  { slug: 'find-the-longest-valid-obstacle-course-at-each-position', sub: 'LIS in O(n log n)', why: 'Non-decreasing variant: upper_bound instead of lower_bound.' },
  { slug: 'longest-increasing-subsequence-ii', sub: 'LIS in O(n log n)', why: 'A bounded gap breaks the tails array; you need a segment tree over values.' },
  { slug: 'minimum-operations-to-make-the-array-k-increasing', sub: 'LIS in O(n log n)', why: 'k independent subsequences, each a longest-non-decreasing problem.' },

  // --- chains & dominance ---------------------------------------------------
  { slug: 'maximum-length-of-pair-chain', sub: 'chains & dominance', why: 'Greedy by end beats the DP; know why.' },
  { slug: 'largest-divisible-subset', sub: 'chains & dominance', why: 'Sort, then LIS with a divisibility predicate plus parent reconstruction.' },
  { slug: 'longest-string-chain', sub: 'chains & dominance' },
  { slug: 'best-team-with-no-conflicts', sub: 'chains & dominance', why: 'Sort by age, then weighted LIS on score.' },
  { slug: 'russian-doll-envelopes', sub: 'chains & dominance', why: 'Sort width ascending, height descending, then LIS on height. The tie-break is the trick.' },
  { slug: 'maximum-height-by-stacking-cuboids', sub: 'chains & dominance', why: 'Sort each cuboid internally first — that is the non-obvious reduction.' },
  { slug: 'delete-columns-to-make-sorted-iii', sub: 'chains & dominance', why: 'LIS over column indices with an all-rows-sorted predicate.' },

  // --- LIS variants ---------------------------------------------------------
  { slug: 'increasing-triplet-subsequence', sub: 'LIS variants', why: 'LIS of length 3 with two running minima, O(1) space.' },
  { slug: 'longest-arithmetic-subsequence-of-given-difference', sub: 'LIS variants', why: 'Fixed difference collapses it to a hash map, not a DP table.' },
  { slug: 'longest-arithmetic-subsequence', sub: 'LIS variants', why: 'State is (index, difference) — a map per index.' },
  { slug: 'minimum-number-of-removals-to-make-mountain-array', sub: 'LIS variants', why: 'LIS from the left and from the right, combined at each peak.' },
  { slug: 'make-array-strictly-increasing', sub: 'LIS variants', why: 'DP over (index, last value used) with binary search into the replacement array.' },
];
