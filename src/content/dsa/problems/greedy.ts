import type { ProblemSeed } from '../../types';

export const greedy: ProblemSeed[] = [
  // --- sort then pick -------------------------------------------------------
  { slug: 'least-number-of-unique-integers-after-k-removals', sub: 'sort then pick' },
  { slug: 'reduce-array-size-to-the-half', sub: 'sort then pick' },
  { slug: 'two-city-scheduling', sub: 'sort then pick', why: 'Sort by the cost difference, not by either cost.' },
  { slug: 'boats-to-save-people', sub: 'sort then pick' },
  { slug: 'hand-of-straights', sub: 'sort then pick', why: 'Always start a run at the smallest remaining card.' },
  { slug: 'minimum-deletions-to-make-character-frequencies-unique', sub: 'sort then pick' },
  { slug: 'queue-reconstruction-by-height', sub: 'sort then pick', why: 'Tallest first, insert at index k. The ordering insight is everything.' },
  { slug: 'advantage-shuffle', sub: 'sort then pick', why: 'Greedy assignment with a fallback dump of the weakest cards.' },

  // --- exchange argument ----------------------------------------------------
  { slug: 'task-scheduler', sub: 'exchange argument', why: 'Idle slots are set by the most frequent task; prove the formula.' },
  { slug: 'gas-station', sub: 'exchange argument', why: 'If total >= 0 a start exists, and it is right after the lowest prefix.' },
  { slug: 'largest-number', sub: 'exchange argument', why: 'Comparator a+b > b+a. The transitivity question is a good interview follow-up.' },
  { slug: 'candy', sub: 'exchange argument', why: 'Two passes, left then right, taking the max.' },
  { slug: 'course-schedule-iii', sub: 'exchange argument', why: 'Regret: take everything, then undo the worst choice.' },
  { slug: 'minimum-number-of-increments-on-subarrays-to-form-a-target-array', sub: 'exchange argument', why: 'Answer is the sum of positive first differences. One line once you see it.' },

  // --- reachability & jumps -------------------------------------------------
  { slug: 'jump-game', sub: 'reachability & jumps', why: 'Track the furthest reach as you scan.' },
  { slug: 'jump-game-ii', sub: 'reachability & jumps', why: 'Level-by-level BFS over index ranges, in O(n).' },
  { slug: 'video-stitching', sub: 'reachability & jumps' },
  { slug: 'minimum-number-of-taps-to-open-to-water-a-garden', sub: 'reachability & jumps' },

  // --- lexicographic construction -------------------------------------------
  { slug: 'remove-k-digits', sub: 'lexicographic construction', why: 'Monotonic stack as a greedy: pop a larger digit while budget remains.' },
  { slug: 'remove-duplicate-letters', sub: 'lexicographic construction' },
  { slug: 'find-the-most-competitive-subsequence', sub: 'lexicographic construction' },
  { slug: 'create-maximum-number', sub: 'lexicographic construction', why: 'Split k across both arrays, build the best subsequence of each, then merge greedily.' },

  // --- greedy with a heap ---------------------------------------------------
  { slug: 'furthest-building-you-can-reach', sub: 'greedy with a heap' },
  { slug: 'maximum-average-pass-ratio', sub: 'greedy with a heap' },
  { slug: 'ipo', sub: 'greedy with a heap' },
  { slug: 'minimum-number-of-refueling-stops', sub: 'greedy with a heap' },

  // --- local swap arguments -------------------------------------------------
  { slug: 'wiggle-subsequence', sub: 'local swap arguments', why: 'Count direction changes; greedy equals the DP here.' },
  { slug: 'minimum-swaps-to-make-sequences-increasing', sub: 'local swap arguments', why: 'Two-state DP, but the reasoning is a local exchange argument.' },
  { slug: 'minimum-adjacent-swaps-for-k-consecutive-ones', sub: 'local swap arguments', why: 'Gather around the median position; prefix sums give the cost.' },
  { slug: 'set-intersection-size-at-least-two', sub: 'local swap arguments' },
];
