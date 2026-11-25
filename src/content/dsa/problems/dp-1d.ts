import type { ProblemSeed } from '../../types';

export const dp1d: ProblemSeed[] = [
  // --- linear recurrence ----------------------------------------------------
  { slug: 'house-robber', sub: 'linear recurrence', why: 'The two-term recurrence, rolled into two variables.' },
  { slug: 'house-robber-ii', sub: 'linear recurrence', why: 'Circular: run the line twice, excluding one end each time.' },
  { slug: 'delete-and-earn', sub: 'linear recurrence', why: 'Bucket by value and it becomes house-robber on the value axis.' },
  { slug: 'decode-ways', sub: 'linear recurrence', why: 'Leading-zero handling is where this one is lost.' },
  { slug: 'count-ways-to-build-good-strings', sub: 'linear recurrence' },
  { slug: 'domino-and-tromino-tiling', sub: 'linear recurrence', why: 'Derive the recurrence from the partial-tiling states, do not guess it.' },
  { slug: 'number-of-ways-to-stay-in-the-same-place-after-some-steps', sub: 'linear recurrence', why: 'Cap the reachable index at min(steps, arrLen) or the state space explodes.' },

  // --- state machine --------------------------------------------------------
  { slug: 'best-time-to-buy-and-sell-stock-ii', sub: 'state machine', why: 'Two states, hold and free. Every other stock problem extends this.' },
  { slug: 'best-time-to-buy-and-sell-stock-with-transaction-fee', sub: 'state machine' },
  { slug: 'best-time-to-buy-and-sell-stock-with-cooldown', sub: 'state machine', why: 'Three states; the cooldown edge is the only change.' },
  { slug: 'best-time-to-buy-and-sell-stock-iii', sub: 'state machine', why: 'Four states, or two passes. Know the state version.' },
  { slug: 'best-time-to-buy-and-sell-stock-iv', sub: 'state machine', why: 'Generalised to k transactions; watch the k >= n/2 shortcut.' },

  // --- counting decompositions ----------------------------------------------
  { slug: 'word-break', sub: 'counting decompositions', why: 'dp[i] over prefixes; a set lookup per split point.' },
  { slug: 'combination-sum-iv', sub: 'counting decompositions', why: 'Permutations, so the target loop goes outside. The loop order IS the answer.' },
  { slug: 'count-number-of-texts', sub: 'counting decompositions' },
  { slug: 'student-attendance-record-ii', sub: 'counting decompositions', why: 'State is (absences, trailing lates) — small, fixed, and easy to miss.' },

  // --- max subarray / Kadane DP ---------------------------------------------
  { slug: 'maximum-subarray', sub: 'max subarray / Kadane DP', why: 'Kadane as DP: extend or restart. Be able to state it as dp[i].' },
  { slug: 'maximum-absolute-sum-of-any-subarray', sub: 'max subarray / Kadane DP', why: 'Run Kadane for max and min; the answer is the larger magnitude.' },
  { slug: 'maximum-product-subarray', sub: 'max subarray / Kadane DP', why: 'Carry both the max and min product: a negative flips them.' },
  { slug: 'best-sightseeing-pair', sub: 'max subarray / Kadane DP', why: 'Split the score so one half is a running maximum.' },
  { slug: 'maximum-sum-circular-subarray', sub: 'max subarray / Kadane DP', why: 'Total minus the minimum subarray, with the all-negative special case.' },
  { slug: 'k-concatenation-maximum-sum', sub: 'max subarray / Kadane DP' },

  // --- reachability & jumps -------------------------------------------------
  { slug: 'minimum-cost-for-tickets', sub: 'reachability & jumps', why: 'DP over days with three backward transitions.' },
  { slug: 'minimum-sideway-jumps', sub: 'reachability & jumps' },
  { slug: 'filling-bookcase-shelves', sub: 'reachability & jumps' },
  { slug: 'jump-game-vii', sub: 'reachability & jumps', why: 'Prefix sums over reachable positions, or a sliding window of the dp array.' },
  { slug: 'frog-jump', sub: 'reachability & jumps', why: 'State is (stone, lastJump) — a map of reachable jump sizes per stone.' },
];
