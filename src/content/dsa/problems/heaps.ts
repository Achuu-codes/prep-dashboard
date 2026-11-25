import type { ProblemSeed } from '../../types';

export const heaps: ProblemSeed[] = [
  // --- top-K with a bounded heap --------------------------------------------
  { slug: 'kth-largest-element-in-an-array', sub: 'top-K with a bounded heap', why: 'Size-k min-heap, or quickselect for O(n) average. Know both.' },
  { slug: 'k-closest-points-to-origin', sub: 'top-K with a bounded heap' },
  { slug: 'top-k-frequent-words', sub: 'top-K with a bounded heap', why: 'The comparator has to break ties lexicographically in the opposite direction.' },
  { slug: 'find-the-kth-largest-integer-in-the-array', sub: 'top-K with a bounded heap' },
  { slug: 'maximum-subsequence-score', sub: 'top-K with a bounded heap', why: 'Sort on one field, keep a size-k heap on the other.' },
  { slug: 'maximum-performance-of-a-team', sub: 'top-K with a bounded heap', why: 'Same shape, harder to spot: sort by efficiency, heap on speed.' },

  // --- k-way merge ----------------------------------------------------------
  { slug: 'ugly-number-ii', sub: 'k-way merge', why: 'Three pointers beat the heap, but the heap is the natural first answer.' },
  { slug: 'super-ugly-number', sub: 'k-way merge' },
  { slug: 'find-k-pairs-with-smallest-sums', sub: 'k-way merge', why: 'Push only the frontier, not all n*m pairs.' },
  { slug: 'merge-k-sorted-lists', sub: 'k-way merge' },
  { slug: 'smallest-range-covering-elements-from-k-lists', sub: 'k-way merge', why: 'Heap holds one element per list; advance the minimum.' },

  // --- two heaps ------------------------------------------------------------
  { slug: 'find-median-from-data-stream', sub: 'two heaps', why: 'Max-heap for the low half, min-heap for the high half, rebalanced every insert.' },
  { slug: 'ipo', sub: 'two heaps', why: 'One heap ordered by capital to unlock, one by profit to take.' },
  { slug: 'sliding-window-median', sub: 'two heaps', why: 'Two heaps plus lazy deletion. The hardest version of this pattern.' },

  // --- scheduling with a heap -----------------------------------------------
  { slug: 'task-scheduler', sub: 'scheduling with a heap', why: 'The formula answer is faster, but the heap simulation is what generalises.' },
  { slug: 'seat-reservation-manager', sub: 'scheduling with a heap' },
  { slug: 'the-number-of-the-smallest-unoccupied-chair', sub: 'scheduling with a heap', why: 'Two heaps: free chairs and leave-times.' },
  { slug: 'single-threaded-cpu', sub: 'scheduling with a heap', why: 'Available-pool heap fed by a time-ordered pointer.' },
  { slug: 'process-tasks-using-servers', sub: 'scheduling with a heap' },
  { slug: 'meeting-rooms-iii', sub: 'scheduling with a heap', why: 'Free-room heap plus busy-room heap keyed by end time.' },
  { slug: 'course-schedule-iii', sub: 'scheduling with a heap', why: 'Take greedily, then evict the longest course when infeasible. Classic regret heap.' },
  { slug: 'number-of-flowers-in-full-bloom', sub: 'scheduling with a heap' },

  // --- heap + greedy --------------------------------------------------------
  { slug: 'minimum-operations-to-halve-array-sum', sub: 'heap + greedy' },
  { slug: 'maximum-average-pass-ratio', sub: 'heap + greedy', why: 'Order by marginal gain, not by current value.' },
  { slug: 'reorganize-string', sub: 'heap + greedy', why: 'Always place the two most frequent remaining characters.' },
  { slug: 'furthest-building-you-can-reach', sub: 'heap + greedy', why: 'Spend ladders greedily, then convert the smallest into bricks.' },
  { slug: 'minimum-number-of-refueling-stops', sub: 'heap + greedy', why: 'Retroactive greedy: refuel from the best station already passed.' },
  { slug: 'minimum-cost-to-hire-k-workers', sub: 'heap + greedy', why: 'Sort by wage ratio, keep a size-k max-heap on quality.' },

  // --- lazy deletion --------------------------------------------------------
  { slug: 'total-cost-to-hire-k-workers', sub: 'lazy deletion' },
  { slug: 'maximum-number-of-events-that-can-be-attended', sub: 'lazy deletion', why: 'Push events as days advance, pop expired ones lazily.' },
  { slug: 'maximum-number-of-events-that-can-be-attended-ii', sub: 'lazy deletion', why: 'Where the heap stops being enough: sort + DP + binary search.' },
];
