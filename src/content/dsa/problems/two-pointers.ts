import type { ProblemSeed } from '../../types';

export const twoPointers: ProblemSeed[] = [
  // --- opposite ends -------------------------------------------------------
  { slug: 'two-sum-ii-input-array-is-sorted', sub: 'opposite ends', why: 'The base case: sortedness lets one comparison discard a whole side.' },
  { slug: 'container-with-most-water', sub: 'opposite ends', why: 'Always move the shorter wall — the exchange argument worth being able to state.' },
  { slug: '3sum-closest', sub: 'opposite ends' },
  { slug: 'valid-triangle-number', sub: 'opposite ends', why: 'Fix the largest side, then two pointers count all valid pairs at once.' },
  { slug: 'boats-to-save-people', sub: 'opposite ends' },
  { slug: 'minimize-maximum-pair-sum-in-array', sub: 'opposite ends' },
  { slug: 'number-of-subsequences-that-satisfy-the-given-sum-condition', sub: 'opposite ends', why: 'Counting 2^(r-l) subsequences per valid left end.' },
  { slug: 'trapping-rain-water', sub: 'opposite ends', why: 'Two pointers with running maxima; the O(1)-space answer, not the prefix-array one.' },

  // --- same direction ------------------------------------------------------
  { slug: 'remove-duplicates-from-sorted-array-ii', sub: 'same direction', why: 'Write pointer with a keep-at-most-k rule.' },
  { slug: 'rearrange-array-elements-by-sign', sub: 'same direction' },
  { slug: 'longest-word-in-dictionary-through-deleting', sub: 'same direction', why: 'Subsequence check is a two-pointer walk.' },
  { slug: 'number-of-matching-subsequences', sub: 'same direction', why: 'Bucket the words by their next needed character instead of checking each.' },
  { slug: 'longest-mountain-in-array', sub: 'same direction' },
  { slug: 'shortest-subarray-to-be-removed-to-make-array-sorted', sub: 'same direction', why: 'Find the sorted prefix and suffix, then merge them with two pointers.' },

  // --- partitioning --------------------------------------------------------
  { slug: 'sort-colors', sub: 'partitioning', why: 'Dutch national flag: three regions, one pass.' },
  { slug: 'partition-array-according-to-given-pivot', sub: 'partitioning' },
  { slug: 'next-permutation', sub: 'partitioning', why: 'Find the pivot from the right, swap with its successor, reverse the tail.' },
  { slug: 'push-dominoes', sub: 'partitioning', why: 'Process each span between two fixed dominoes independently.' },

  // --- k-sum reduction -----------------------------------------------------
  { slug: '3sum', sub: 'k-sum reduction', why: 'Sort, fix one, two-pointer the rest. Duplicate skipping is the bug source.' },
  { slug: '4sum', sub: 'k-sum reduction', why: 'Generalise to kSum recursion bottoming out at the two-pointer case.' },
  { slug: '3sum-with-multiplicity', sub: 'k-sum reduction', why: 'Counting version: combinatorics on equal values.' },

  // --- merging sorted inputs ----------------------------------------------
  { slug: 'find-k-closest-elements', sub: 'merging sorted inputs', why: 'Binary search the window start, or shrink from both ends.' },
  { slug: 'interval-list-intersections', sub: 'merging sorted inputs', why: 'Advance whichever interval ends first.' },
  { slug: 'expressive-words', sub: 'merging sorted inputs', why: 'Run-length compare with two walkers.' },
  { slug: 'most-profit-assigning-work', sub: 'merging sorted inputs' },
  { slug: 'bag-of-tokens', sub: 'merging sorted inputs' },
];
