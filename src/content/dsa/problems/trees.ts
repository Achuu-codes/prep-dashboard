import type { ProblemSeed } from '../../types';

export const trees: ProblemSeed[] = [
  // --- traversal ------------------------------------------------------------
  { slug: 'binary-tree-level-order-traversal', sub: 'traversal', why: 'Level-size loop — the BFS skeleton every other level problem reuses.' },
  { slug: 'binary-tree-right-side-view', sub: 'traversal' },
  { slug: 'find-largest-value-in-each-tree-row', sub: 'traversal' },
  { slug: 'binary-tree-zigzag-level-order-traversal', sub: 'traversal' },
  { slug: 'vertical-order-traversal-of-a-binary-tree', sub: 'traversal', why: 'Sort key is (column, row, value) — the tie-breaking is the whole problem.' },

  // --- depth & path problems ------------------------------------------------
  { slug: 'path-sum-ii', sub: 'depth & path problems', why: 'Backtracking on a path vector; pop on the way out.' },
  { slug: 'sum-root-to-leaf-numbers', sub: 'depth & path problems' },
  { slug: 'path-sum-iii', sub: 'depth & path problems', why: 'Prefix-sum hash map along the current root path.' },
  { slug: 'count-good-nodes-in-binary-tree', sub: 'depth & path problems' },
  { slug: 'maximum-difference-between-node-and-ancestor', sub: 'depth & path problems', why: 'Carry min and max of the ancestor path downward.' },
  { slug: 'pseudo-palindromic-paths-in-a-binary-tree', sub: 'depth & path problems', why: 'A 9-bit parity mask as the carried state.' },
  { slug: 'longest-univalue-path', sub: 'depth & path problems' },
  { slug: 'longest-zigzag-path-in-a-binary-tree', sub: 'depth & path problems' },

  // --- construction from traversals -----------------------------------------
  { slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', sub: 'construction from traversals', why: 'Index map on inorder plus a moving preorder cursor.' },
  { slug: 'construct-binary-tree-from-inorder-and-postorder-traversal', sub: 'construction from traversals' },
  { slug: 'maximum-binary-tree', sub: 'construction from traversals', why: 'O(n) with a monotonic stack instead of the obvious O(n^2) recursion.' },
  { slug: 'construct-binary-tree-from-preorder-and-postorder-traversal', sub: 'construction from traversals' },
  { slug: 'recover-a-tree-from-preorder-traversal', sub: 'construction from traversals', why: 'Depth-annotated preorder; a stack keyed by depth.' },

  // --- lowest common ancestor -----------------------------------------------
  { slug: 'lowest-common-ancestor-of-a-binary-tree', sub: 'lowest common ancestor', why: 'Post-order: return non-null from both sides means you are the LCA.' },
  { slug: 'lowest-common-ancestor-of-deepest-leaves', sub: 'lowest common ancestor', why: 'Return (depth, node) upward — the tuple-return habit.' },
  { slug: 'smallest-subtree-with-all-the-deepest-nodes', sub: 'lowest common ancestor' },
  { slug: 'step-by-step-directions-from-a-binary-tree-node-to-another', sub: 'lowest common ancestor', why: 'Find both root paths, strip the common prefix.' },
  { slug: 'kth-ancestor-of-a-tree-node', sub: 'lowest common ancestor', why: 'Binary lifting. The one LCA technique worth memorising cold.' },

  // --- serialisation --------------------------------------------------------
  { slug: 'find-duplicate-subtrees', sub: 'serialisation', why: 'Canonical serialisation as a hash-map key, or subtree id interning.' },
  { slug: 'serialize-and-deserialize-bst', sub: 'serialisation' },
  { slug: 'serialize-and-deserialize-binary-tree', sub: 'serialisation', why: 'Preorder with null markers; the deserialiser is a cursor-driven recursion.' },

  // --- tree DP returning tuples ---------------------------------------------
  { slug: 'house-robber-iii', sub: 'tree DP returning tuples', why: 'Return (take, skip) from each child. The template for this whole group.' },
  { slug: 'distribute-coins-in-binary-tree', sub: 'tree DP returning tuples', why: 'Return surplus; the answer accumulates |surplus| on each edge.' },
  { slug: 'binary-tree-maximum-path-sum', sub: 'tree DP returning tuples', why: 'Return the best downward arm, update a global with the through-path.' },
  { slug: 'maximum-sum-bst-in-binary-tree', sub: 'tree DP returning tuples', why: 'Return (isBST, min, max, sum) — four-field aggregation.' },
  { slug: 'binary-tree-cameras', sub: 'tree DP returning tuples', why: 'Three-state greedy/DP per node. The hardest of this family.' },
];
