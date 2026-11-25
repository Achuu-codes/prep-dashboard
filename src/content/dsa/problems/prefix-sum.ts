import type { ProblemSeed } from '../../types';

export const prefixSum: ProblemSeed[] = [
  // --- 1D prefix sums ------------------------------------------------------
  { slug: 'number-of-ways-to-split-array', sub: '1D prefix sums' },
  { slug: 'sum-of-absolute-differences-in-a-sorted-array', sub: '1D prefix sums', why: 'Split the sum at i: a prefix term and a suffix term.' },
  { slug: 'minimum-number-of-operations-to-move-all-balls-to-each-box', sub: '1D prefix sums', why: 'Two sweeps carrying a running count and a running cost.' },
  { slug: 'ways-to-split-array-into-three-subarrays', sub: '1D prefix sums', why: 'Prefix sums plus two binary searches for the valid split window.' },

  // --- prefix + hash map ---------------------------------------------------
  { slug: 'subarray-sum-equals-k', sub: 'prefix + hash map', why: 'The template: count of prefix[j] - k seen so far. Seed the map with {0:1}.' },
  { slug: 'contiguous-array', sub: 'prefix + hash map', why: 'Map 0 to -1 and it becomes "longest subarray summing to 0".' },
  { slug: 'continuous-subarray-sum', sub: 'prefix + hash map', why: 'Store the first index per remainder, not the count.' },
  { slug: 'subarray-sums-divisible-by-k', sub: 'prefix + hash map', why: 'Count by remainder; watch the negative-modulo fix.' },
  { slug: 'path-sum-iii', sub: 'prefix + hash map', why: 'Same trick on a root-to-node path; undo the map entry on the way back up.' },
  { slug: 'make-sum-divisible-by-p', sub: 'prefix + hash map' },
  { slug: 'count-of-interesting-subarrays', sub: 'prefix + hash map' },

  // --- difference array ----------------------------------------------------
  { slug: 'corporate-flight-bookings', sub: 'difference array', why: 'The plain form: +v at l, -v at r+1, then prefix-sum once.' },
  { slug: 'car-pooling', sub: 'difference array' },
  { slug: 'describe-the-painting', sub: 'difference array', why: 'Difference map over sparse coordinates.' },
  { slug: 'shifting-letters-ii', sub: 'difference array' },
  { slug: 'zero-array-transformation-ii', sub: 'difference array', why: 'Binary search the answer with a difference-array feasibility check.' },
  { slug: 'minimum-moves-to-make-array-complementary', sub: 'difference array', why: 'Each pair contributes four ranges to a difference array. Hard to see, worth the time.' },

  // --- 2D prefix sums ------------------------------------------------------
  { slug: 'range-sum-query-2d-immutable', sub: '2D prefix sums', why: 'Inclusion-exclusion on the corner formula.' },
  { slug: 'matrix-block-sum', sub: '2D prefix sums' },
  { slug: 'maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold', sub: '2D prefix sums' },
  { slug: 'count-submatrices-with-all-ones', sub: '2D prefix sums' },
  { slug: 'number-of-submatrices-that-sum-to-target', sub: '2D prefix sums', why: 'Collapse rows, then run subarray-sum-equals-k per column pair.' },
  { slug: 'max-sum-of-rectangle-no-larger-than-k', sub: '2D prefix sums', why: 'Row-collapse plus an ordered set over prefix sums.' },
  { slug: 'sum-of-total-strength-of-wizards', sub: '2D prefix sums', why: 'Prefix-of-prefix sums combined with a monotonic stack. The mastery problem for this topic.' },

  // --- prefix XOR & parity -------------------------------------------------
  { slug: 'xor-queries-of-a-subarray', sub: 'prefix XOR & parity', why: 'XOR is its own inverse, so prefix XOR works exactly like prefix sum.' },
  { slug: 'count-triplets-that-can-form-two-arrays-of-equal-xor', sub: 'prefix XOR & parity' },
  { slug: 'find-the-longest-substring-containing-vowels-in-even-counts', sub: 'prefix XOR & parity', why: 'A 5-bit parity mask is the prefix state.' },
  { slug: 'number-of-wonderful-substrings', sub: 'prefix XOR & parity', why: 'Parity bitmask plus "at most one odd" means 11 lookups per prefix.' },
];
