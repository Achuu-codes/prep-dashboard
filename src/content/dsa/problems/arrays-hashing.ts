import type { ProblemSeed } from '../../types';

export const arraysHashing: ProblemSeed[] = [
  // --- hash map counting ---------------------------------------------------
  { slug: 'top-k-frequent-elements', sub: 'hash map counting', why: 'Bucket sort by frequency beats the heap: O(n).' },
  { slug: 'sort-characters-by-frequency', sub: 'hash map counting' },
  { slug: 'longest-consecutive-sequence', sub: 'hash map counting', why: 'Only start a walk at a sequence head — that is what makes it O(n).' },
  { slug: '4sum-ii', sub: 'hash map counting', why: 'Split 4 lists into 2+2 and meet in the middle with a map.' },
  { slug: 'max-number-of-k-sum-pairs', sub: 'hash map counting' },
  { slug: 'determine-if-two-strings-are-close', sub: 'hash map counting', why: 'The invariant is the multiset of counts, not the counts per letter.' },
  { slug: 'count-number-of-bad-pairs', sub: 'hash map counting', why: 'Rewrite the condition as j - i != nums[j] - nums[i], then count on the key i - nums[i].' },

  // --- canonical-key grouping ---------------------------------------------
  { slug: 'group-anagrams', sub: 'canonical-key grouping', why: 'Sorted string or 26-count tuple as the key.' },
  { slug: 'find-duplicate-file-in-system', sub: 'canonical-key grouping' },

  // --- prefix & suffix products -------------------------------------------
  { slug: 'product-of-array-except-self', sub: 'prefix & suffix products', why: 'Two sweeps, O(1) extra space by reusing the output array.' },
  { slug: 'product-of-the-last-k-numbers', sub: 'prefix & suffix products', why: 'The zero reset is the whole problem.' },

  // --- index as hash -------------------------------------------------------
  { slug: 'find-the-duplicate-number', sub: 'index as hash', why: 'Floyd cycle detection on the value-as-pointer graph; read-only, O(1) space.' },
  { slug: 'first-missing-positive', sub: 'index as hash', why: 'Place v at index v-1 by swapping. The canonical O(1)-space placement trick.' },
  { slug: 'couples-holding-hands', sub: 'index as hash', why: 'Position map plus greedy swaps; each swap fixes one couple.' },

  // --- matrix as array -----------------------------------------------------
  { slug: 'rotate-image', sub: 'matrix as array', why: 'Transpose then reverse rows.' },
  { slug: 'spiral-matrix', sub: 'matrix as array', why: 'Four moving bounds; shrink after each edge.' },
  { slug: 'set-matrix-zeroes', sub: 'matrix as array', why: 'Use row 0 and column 0 as the marker storage for O(1) space.' },
  { slug: 'diagonal-traverse', sub: 'matrix as array', why: 'Group by i+j, then flip alternate diagonals.' },
  { slug: 'game-of-life', sub: 'matrix as array', why: 'Encode the next state in high bits to update in place.' },

  // --- design with hashing -------------------------------------------------
  { slug: 'insert-delete-getrandom-o1', sub: 'design with hashing', why: 'Array + index map; delete by swapping with the last element.' },
  { slug: 'design-underground-system', sub: 'design with hashing' },
  { slug: 'time-based-key-value-store', sub: 'design with hashing', why: 'Append-only list per key plus binary search on timestamp.' },
  { slug: 'snapshot-array', sub: 'design with hashing', why: 'Store (snapId, value) history per index; binary search on read.' },
  { slug: 'tweet-counts-per-frequency', sub: 'design with hashing' },
];
