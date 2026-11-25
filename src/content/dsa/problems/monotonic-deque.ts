import type { ProblemSeed } from '../../types';

export const monotonicDeque: ProblemSeed[] = [
  // --- sliding-window extrema ----------------------------------------------
  { slug: 'number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold', sub: 'sliding-window extrema', why: 'Fixed window warm-up before the deque itself.' },
  { slug: 'sliding-window-maximum', sub: 'sliding-window extrema', why: 'The template. Store indices, pop smaller from the back, expire from the front.' },
  { slug: 'sliding-subarray-beauty', sub: 'sliding-window extrema', why: 'A 101-bucket count array beats a deque when values are bounded.' },
  { slug: 'longest-subarray-with-maximum-bitwise-and', sub: 'sliding-window extrema' },
  { slug: 'minimum-number-of-k-consecutive-bit-flips', sub: 'sliding-window extrema', why: 'A queue of pending flips — the same expiry logic as a deque.' },

  // --- bounded-difference windows -------------------------------------------
  { slug: 'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit', sub: 'bounded-difference windows', why: 'Two deques, one for max and one for min, shrunk together.' },
  { slug: 'continuous-subarrays', sub: 'bounded-difference windows' },
  { slug: 'maximum-number-of-robots-within-budget', sub: 'bounded-difference windows', why: 'Max-deque plus a running sum inside one window.' },
  { slug: 'shortest-subarray-with-sum-at-least-k', sub: 'bounded-difference windows', why: 'Monotonic deque over prefix sums — the version negatives do not break.' },

  // --- deque-optimised DP ---------------------------------------------------
  { slug: 'jump-game-vi', sub: 'deque-optimised DP', why: 'dp[i] = nums[i] + max(dp[i-k..i-1]); the deque is the max.' },
  { slug: 'longest-well-performing-interval', sub: 'deque-optimised DP', why: 'Monotonic stack of prefix sums, scanned from the right.' },
  { slug: 'constrained-subsequence-sum', sub: 'deque-optimised DP' },
  { slug: 'maximum-number-of-points-with-cost', sub: 'deque-optimised DP', why: 'Split |j-k| into two directions, each a running max.' },
  { slug: 'max-value-of-equation', sub: 'deque-optimised DP', why: 'Rewrite as (yi - xi) + (yj + xj), then it is a window maximum.' },
  { slug: 'maximum-sum-of-3-non-overlapping-subarrays', sub: 'deque-optimised DP' },
  { slug: 'odd-even-jump', sub: 'deque-optimised DP', why: 'Monotonic stack to precompute next-greater/smaller, then DP backwards.' },
  { slug: 'delivering-boxes-from-storage-to-ports', sub: 'deque-optimised DP', why: 'Deque-optimised DP with a two-pointer feasible window. The mastery problem here.' },
  { slug: 'find-maximum-non-decreasing-array-length', sub: 'deque-optimised DP' },
];
