import type { ProblemSeed } from '../../types';

export const segmentTree: ProblemSeed[] = [
  // --- Fenwick prefix sums --------------------------------------------------
  { slug: 'range-sum-query-mutable', sub: 'Fenwick prefix sums', why: 'Write the BIT here: three lines for update, three for query.' },
  { slug: 'queries-on-a-permutation-with-key', sub: 'Fenwick prefix sums' },
  { slug: 'create-sorted-array-through-instructions', sub: 'Fenwick prefix sums', why: 'BIT over values, counting strictly-less and strictly-greater.' },

  // --- inversion & order statistics -----------------------------------------
  { slug: 'count-of-smaller-numbers-after-self', sub: 'inversion & order statistics', why: 'Compress values, then sweep right-to-left with a BIT.' },
  { slug: 'reverse-pairs', sub: 'inversion & order statistics', why: 'Merge-sort counting, or a BIT. Both are standard; know one cold.' },
  { slug: 'count-of-range-sum', sub: 'inversion & order statistics', why: 'Prefix sums plus counting in a range — the two ideas combined.' },
  { slug: 'number-of-pairs-satisfying-inequality', sub: 'inversion & order statistics', why: 'Rewrite as a[i]-b[i] <= a[j]-b[j]+diff, then it is inversion counting.' },
  { slug: 'count-good-triplets-in-an-array', sub: 'inversion & order statistics', why: 'Two BITs: how many fit before, how many after.' },

  // --- segment tree range query ---------------------------------------------
  { slug: 'longest-increasing-subsequence-ii', sub: 'segment tree range query', why: 'Max-query segment tree over values; where the LIS tails array runs out.' },
  { slug: 'peaks-in-array', sub: 'segment tree range query' },
  { slug: 'maximum-sum-queries', sub: 'segment tree range query', why: 'Offline by one coordinate, max-segment-tree on the other.' },
  { slug: 'my-calendar-iii', sub: 'segment tree range query' },

  // --- lazy propagation -----------------------------------------------------
  { slug: 'handling-sum-queries-after-update', sub: 'lazy propagation', why: 'Range flip with a lazy XOR flag. The clearest lazy-propagation exercise.' },
  { slug: 'zero-array-transformation-iii', sub: 'lazy propagation' },
  { slug: 'falling-squares', sub: 'lazy propagation', why: 'Range assign plus range max, with coordinate compression.' },
  { slug: 'range-module', sub: 'lazy propagation' },

  // --- coordinate compression -----------------------------------------------
  { slug: 'count-integers-in-intervals', sub: 'coordinate compression', why: 'An ordered map of disjoint intervals beats a segment tree here.' },
  { slug: 'the-skyline-problem', sub: 'coordinate compression' },
  { slug: 'rectangle-area-ii', sub: 'coordinate compression', why: 'Sweep line plus a segment tree over compressed y-coordinates.' },
];
