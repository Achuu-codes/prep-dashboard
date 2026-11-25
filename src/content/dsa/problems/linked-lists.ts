import type { ProblemSeed } from '../../types';

export const linkedLists: ProblemSeed[] = [
  // --- reversal in place ----------------------------------------------------
  { slug: 'reverse-linked-list-ii', sub: 'reversal in place', why: 'Dummy head plus a fixed predecessor pointer; the index arithmetic is the trap.' },
  { slug: 'swap-nodes-in-pairs', sub: 'reversal in place' },
  { slug: 'odd-even-linked-list', sub: 'reversal in place' },
  { slug: 'rotate-list', sub: 'reversal in place', why: 'Close the ring, walk n - k%n, cut.' },
  { slug: 'reorder-list', sub: 'reversal in place', why: 'Three primitives composed: find middle, reverse second half, merge alternately.' },
  { slug: 'reverse-nodes-in-k-group', sub: 'reversal in place', why: 'The hardest pointer surgery that still comes up regularly.' },
  { slug: 'reverse-nodes-in-even-length-groups', sub: 'reversal in place' },

  // --- fast & slow pointers -------------------------------------------------
  { slug: 'remove-nth-node-from-end-of-list', sub: 'fast & slow pointers' },
  { slug: 'delete-the-middle-node-of-a-linked-list', sub: 'fast & slow pointers' },
  { slug: 'linked-list-cycle-ii', sub: 'fast & slow pointers', why: 'Floyd, then restart one pointer at the head. Know why the meeting point works.' },
  { slug: 'find-the-duplicate-number', sub: 'fast & slow pointers', why: 'Same algorithm on an array that encodes a linked list.' },

  // --- merge & sort ---------------------------------------------------------
  { slug: 'add-two-numbers-ii', sub: 'merge & sort', why: 'Reverse, or use a stack; carry propagation is the detail.' },
  { slug: 'merge-nodes-in-between-zeros', sub: 'merge & sort' },
  { slug: 'merge-in-between-linked-lists', sub: 'merge & sort' },
  { slug: 'insertion-sort-list', sub: 'merge & sort' },
  { slug: 'sort-list', sub: 'merge & sort', why: 'Bottom-up merge sort for true O(1) space; recursion is O(log n) stack.' },
  { slug: 'merge-k-sorted-lists', sub: 'merge & sort', why: 'Heap, or divide and conquer pairwise. Know the complexity of both.' },

  // --- k-group surgery ------------------------------------------------------
  { slug: 'partition-list', sub: 'k-group surgery', why: 'Two dummy heads, splice at the end — stable by construction.' },
  { slug: 'split-linked-list-in-parts', sub: 'k-group surgery' },
  { slug: 'swapping-nodes-in-a-linked-list', sub: 'k-group surgery' },
  { slug: 'remove-zero-sum-consecutive-nodes-from-linked-list', sub: 'k-group surgery', why: 'Prefix sums in a hash map, on a list.' },

  // --- copy & restructure ---------------------------------------------------
  { slug: 'copy-list-with-random-pointer', sub: 'copy & restructure', why: 'Interleave copies into the original list for O(1) extra space.' },
  { slug: 'flatten-a-multilevel-doubly-linked-list', sub: 'copy & restructure' },
  { slug: 'flatten-binary-tree-to-linked-list', sub: 'copy & restructure', why: 'Morris-style rewiring in O(1) space.' },

  // --- design with lists ----------------------------------------------------
  { slug: 'design-browser-history', sub: 'design with lists' },
  { slug: 'design-front-middle-back-queue', sub: 'design with lists' },
  { slug: 'lru-cache', sub: 'design with lists', why: 'Hash map to node plus a doubly linked list. Be able to write it without a library.' },
  { slug: 'lfu-cache', sub: 'design with lists', why: 'Frequency buckets, each an LRU list. The step up from LRU.' },
  { slug: 'all-oone-data-structure', sub: 'design with lists', why: 'Doubly linked list of count buckets, O(1) everywhere.' },
  { slug: 'design-skiplist', sub: 'design with lists' },
];
