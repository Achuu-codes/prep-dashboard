import type { ProblemSeed } from '../../types';

export const binarySearch: ProblemSeed[] = [
  // --- boundaries on sorted data -------------------------------------------
  { slug: 'find-first-and-last-position-of-element-in-sorted-array', sub: 'boundaries on sorted data', why: 'lower_bound and upper_bound. Everything else is a variation on these two.' },
  { slug: 'random-pick-with-weight', sub: 'boundaries on sorted data', why: 'Prefix sums plus lower_bound on a random draw.' },
  { slug: 'find-k-closest-elements', sub: 'boundaries on sorted data', why: 'Binary search the window start — the predicate is a comparison, not equality.' },

  // --- rotated & unknown pivot ---------------------------------------------
  { slug: 'find-minimum-in-rotated-sorted-array', sub: 'rotated & unknown pivot', why: 'Compare mid to the right end, not to the left.' },
  { slug: 'search-in-rotated-sorted-array', sub: 'rotated & unknown pivot', why: 'Decide which half is sorted, then test containment.' },
  { slug: 'search-in-rotated-sorted-array-ii', sub: 'rotated & unknown pivot', why: 'Duplicates break the sorted-half test; the shrink fallback makes it O(n) worst case.' },
  { slug: 'find-minimum-in-rotated-sorted-array-ii', sub: 'rotated & unknown pivot' },
  { slug: 'find-peak-element', sub: 'rotated & unknown pivot', why: 'Binary search without sortedness: the slope is the predicate.' },
  { slug: 'peak-index-in-a-mountain-array', sub: 'rotated & unknown pivot' },

  // --- binary search on the answer -----------------------------------------
  { slug: 'koko-eating-bananas', sub: 'binary search on the answer', why: 'The canonical shape: guess a rate, check feasibility in O(n).' },
  { slug: 'capacity-to-ship-packages-within-d-days', sub: 'binary search on the answer' },
  { slug: 'minimum-time-to-complete-trips', sub: 'binary search on the answer' },
  { slug: 'find-the-smallest-divisor-given-a-threshold', sub: 'binary search on the answer' },
  { slug: 'minimum-speed-to-arrive-on-time', sub: 'binary search on the answer', why: 'Watch the last-leg exception in the feasibility check.' },
  { slug: 'minimum-number-of-days-to-make-m-bouquets', sub: 'binary search on the answer' },
  { slug: 'minimum-time-to-repair-cars', sub: 'binary search on the answer' },
  { slug: 'minimized-maximum-of-products-distributed-to-any-store', sub: 'binary search on the answer' },
  { slug: 'maximum-candies-allocated-to-k-children', sub: 'binary search on the answer' },
  { slug: 'magnetic-force-between-two-balls', sub: 'binary search on the answer', why: 'Maximise the minimum gap — the greedy placement check.' },
  { slug: 'minimum-limit-of-balls-in-a-bag', sub: 'binary search on the answer' },
  { slug: 'split-array-largest-sum', sub: 'binary search on the answer', why: 'Minimise the maximum part. The reference "BS + greedy partition" problem.' },
  { slug: 'house-robber-iv', sub: 'binary search on the answer', why: 'Binary search the answer with a DP/greedy feasibility check inside.' },
  { slug: 'maximum-running-time-of-n-computers', sub: 'binary search on the answer', why: 'The feasibility argument is the hard part, not the search.' },
  { slug: 'nth-magical-number', sub: 'binary search on the answer', why: 'Count-how-many-below predicate with lcm and inclusion-exclusion.' },
  { slug: 'preimage-size-of-factorial-zeroes-function', sub: 'binary search on the answer' },

  // --- search in a matrix ---------------------------------------------------
  { slug: 'search-a-2d-matrix', sub: 'search in a matrix', why: 'Treat the matrix as one flat sorted array.' },
  { slug: 'search-a-2d-matrix-ii', sub: 'search in a matrix', why: 'Staircase from the top-right in O(m+n) — not a binary search at all.' },
  { slug: 'kth-smallest-element-in-a-sorted-matrix', sub: 'search in a matrix', why: 'Binary search the value, count cells <= it with a staircase walk.' },
  { slug: 'kth-smallest-number-in-multiplication-table', sub: 'search in a matrix' },
  { slug: 'find-the-kth-smallest-sum-of-a-matrix-with-sorted-rows', sub: 'search in a matrix' },

  // --- binary search + greedy check ----------------------------------------
  { slug: 'find-k-th-smallest-pair-distance', sub: 'binary search + greedy check', why: 'Binary search the distance, count pairs with a sliding window.' },
  { slug: 'median-of-two-sorted-arrays', sub: 'binary search + greedy check', why: 'Binary search the partition, not the value. Index arithmetic is the whole difficulty.' },
  { slug: 'maximum-number-of-tasks-you-can-assign', sub: 'binary search + greedy check', why: 'Binary search the count, verify with a greedy over a multiset. The hardest shape in this family.' },
];
