import type { ProblemSeed } from '../../types';

export const bst: ProblemSeed[] = [
  // --- validation & search --------------------------------------------------
  { slug: 'validate-binary-search-tree', sub: 'validation & search', why: 'Bounds passed downward, not a parent comparison. The classic wrong answer.' },
  { slug: 'closest-nodes-queries-in-a-binary-search-tree', sub: 'validation & search', why: 'Flatten to a sorted array, then two binary searches per query.' },
  { slug: 'count-nodes-equal-to-average-of-subtree', sub: 'validation & search' },

  // --- in-order as sorted stream --------------------------------------------
  { slug: 'kth-smallest-element-in-a-bst', sub: 'in-order as sorted stream', why: 'Iterative in-order with a stack, stopping early.' },
  { slug: 'binary-search-tree-iterator', sub: 'in-order as sorted stream', why: 'The same stack, exposed as next()/hasNext() with O(h) space.' },
  { slug: 'convert-bst-to-greater-tree', sub: 'in-order as sorted stream', why: 'Reverse in-order with a running sum.' },
  { slug: 'recover-binary-search-tree', sub: 'in-order as sorted stream', why: 'Two swapped nodes show up as one or two inversions in the in-order stream.' },

  // --- insert & delete ------------------------------------------------------
  { slug: 'insert-into-a-binary-search-tree', sub: 'insert & delete' },
  { slug: 'trim-a-binary-search-tree', sub: 'insert & delete' },
  { slug: 'delete-node-in-a-bst', sub: 'insert & delete', why: 'Two-child case: replace with the in-order successor, then delete it recursively.' },

  // --- build from sorted / preorder -----------------------------------------
  { slug: 'convert-sorted-list-to-binary-search-tree', sub: 'build from sorted / preorder', why: 'In-order construction over a list cursor in O(n).' },
  { slug: 'construct-binary-search-tree-from-preorder-traversal', sub: 'build from sorted / preorder', why: 'Upper-bound recursion, single pass.' },
  { slug: 'balance-a-binary-search-tree', sub: 'build from sorted / preorder' },
  { slug: 'unique-binary-search-trees', sub: 'build from sorted / preorder', why: 'Catalan numbers as interval DP.' },
  { slug: 'unique-binary-search-trees-ii', sub: 'build from sorted / preorder' },
  { slug: 'number-of-ways-to-reorder-array-to-get-same-bst', sub: 'build from sorted / preorder', why: 'Tree recursion times a binomial interleaving count.' },

  // --- ordered-set tricks ---------------------------------------------------
  { slug: 'my-calendar-i', sub: 'ordered-set tricks', why: 'std::map::lower_bound to find the neighbouring booking.' },
  { slug: 'my-calendar-ii', sub: 'ordered-set tricks' },
  { slug: 'serialize-and-deserialize-bst', sub: 'ordered-set tricks', why: 'Preorder plus bounds means no null markers are needed.' },
  { slug: 'contains-duplicate-iii', sub: 'ordered-set tricks', why: 'Sliding window over an ordered set, or bucketing by value/t.' },
  { slug: 'my-calendar-iii', sub: 'ordered-set tricks', why: 'Sweep line on a map, or a dynamic segment tree.' },
  { slug: 'count-of-range-sum', sub: 'ordered-set tricks', why: 'Prefix sums plus merge sort or a BIT. The mastery problem here.' },
];
