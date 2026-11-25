import type { ProblemSeed } from '../../types';

export const slidingWindow: ProblemSeed[] = [
  // --- fixed window --------------------------------------------------------
  { slug: 'maximum-number-of-vowels-in-a-substring-of-given-length', sub: 'fixed window' },
  { slug: 'maximum-sum-of-distinct-subarrays-with-length-k', sub: 'fixed window', why: 'Fixed width plus a distinctness counter.' },
  { slug: 'k-radius-subarray-averages', sub: 'fixed window' },
  { slug: 'grumpy-bookstore-owner', sub: 'fixed window', why: 'Split into a fixed base plus the best window of recoverable loss.' },
  { slug: 'maximum-points-you-can-obtain-from-cards', sub: 'fixed window', why: 'Taking from both ends = a fixed window on the complement. Worth internalising.' },
  { slug: 'permutation-in-string', sub: 'fixed window', why: 'Fixed-width frequency match with a single match counter.' },
  { slug: 'find-all-anagrams-in-a-string', sub: 'fixed window' },
  { slug: 'substring-with-concatenation-of-all-words', sub: 'fixed window', why: 'Run the window once per offset modulo word length.' },

  // --- variable window -----------------------------------------------------
  { slug: 'longest-substring-without-repeating-characters', sub: 'variable window', why: 'The template: expand right, shrink while invalid.' },
  { slug: 'minimum-size-subarray-sum', sub: 'variable window', why: 'Shortest valid window — shrink while still valid, not while invalid.' },
  { slug: 'longest-repeating-character-replacement', sub: 'variable window', why: 'Validity uses windowLen - maxCount <= k; the non-shrinking maxCount is the famous subtlety.' },
  { slug: 'max-consecutive-ones-iii', sub: 'variable window' },
  { slug: 'longest-subarray-of-1s-after-deleting-one-element', sub: 'variable window' },
  { slug: 'fruit-into-baskets', sub: 'variable window', why: 'At most 2 distinct — the at-most-K skeleton.' },
  { slug: 'maximum-erasure-value', sub: 'variable window' },
  { slug: 'maximize-the-confusion-of-an-exam', sub: 'variable window' },
  { slug: 'longest-nice-subarray', sub: 'variable window', why: 'Window validity tracked by an OR mask instead of a count map.' },
  { slug: 'minimum-operations-to-reduce-x-to-zero', sub: 'variable window', why: 'Reframe as the longest middle subarray summing to total - x.' },
  { slug: 'frequency-of-the-most-frequent-element', sub: 'variable window', why: 'Sort first; window validity is a cost formula, not a count.' },
  { slug: 'take-k-of-each-character-from-left-and-right', sub: 'variable window', why: 'Minimise the prefix+suffix by maximising the complement window.' },

  // --- exactly K via at-most K ---------------------------------------------
  { slug: 'binary-subarrays-with-sum', sub: 'exactly K via at-most K', why: 'atMost(k) - atMost(k-1). Learn it here.' },
  { slug: 'count-number-of-nice-subarrays', sub: 'exactly K via at-most K' },
  { slug: 'subarrays-with-k-different-integers', sub: 'exactly K via at-most K', why: 'The canonical exactly-K decomposition.' },
  { slug: 'count-complete-subarrays-in-an-array', sub: 'exactly K via at-most K' },

  // --- frequency-map window ------------------------------------------------
  { slug: 'number-of-substrings-containing-all-three-characters', sub: 'frequency-map window', why: 'Count by last-seen index instead of sliding.' },
  { slug: 'minimum-window-substring', sub: 'frequency-map window', why: 'The reference problem: need-map plus a satisfied counter.' },
  { slug: 'minimum-number-of-operations-to-make-array-continuous', sub: 'frequency-map window', why: 'Dedupe, sort, then slide a fixed-value-range window.' },

  // --- window with auxiliary structure -------------------------------------
  { slug: 'count-subarrays-with-fixed-bounds', sub: 'window with auxiliary structure', why: 'Track last-bad, last-min, last-max indices; no map at all.' },
  { slug: 'count-of-interesting-subarrays', sub: 'window with auxiliary structure', why: 'Prefix-count plus hash map — the point where windows stop working.' },
];
