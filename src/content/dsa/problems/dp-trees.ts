import type { ProblemSeed } from '../../types';

export const dpTrees: ProblemSeed[] = [
  // --- child aggregation ----------------------------------------------------
  { slug: 'maximum-product-of-splitted-binary-tree', sub: 'child aggregation', why: 'Subtree sums in one pass, then test every edge.' },
  { slug: 'count-nodes-equal-to-average-of-subtree', sub: 'child aggregation', why: 'Return (sum, count) upward — the simplest tuple aggregation.' },
  { slug: 'number-of-good-leaf-nodes-pairs', sub: 'child aggregation', why: 'Return a depth histogram from each child and combine pairwise.' },
  { slug: 'binary-tree-maximum-path-sum', sub: 'child aggregation', why: 'Return the best arm, update a global with the through-path.' },
  { slug: 'longest-path-with-different-adjacent-characters', sub: 'child aggregation', why: 'Keep the two best child chains per node.' },

  // --- include / exclude ----------------------------------------------------
  { slug: 'house-robber-iii', sub: 'include / exclude', why: 'The template: return (take, skip) as a pair.' },
  { slug: 'maximum-score-after-applying-operations-on-a-tree', sub: 'include / exclude' },
  { slug: 'delete-nodes-and-return-forest', sub: 'include / exclude' },
  { slug: 'binary-tree-cameras', sub: 'include / exclude', why: 'Three states per node; greedy from the leaves also works.' },

  // --- tree knapsack --------------------------------------------------------
  { slug: 'minimum-time-to-collect-all-apples-in-a-tree', sub: 'tree knapsack', why: 'Each edge costs 2 if its subtree contains anything worth visiting.' },
  { slug: 'time-needed-to-inform-all-employees', sub: 'tree knapsack' },
  { slug: 'number-of-ways-to-divide-a-long-corridor', sub: 'tree knapsack' },
  { slug: 'create-components-with-same-value', sub: 'tree knapsack', why: 'Try every divisor of the total, then greedily cut bottom-up.' },
  { slug: 'maximize-sum-of-weights-after-edge-removals', sub: 'tree knapsack', why: 'Per-node knapsack over child gains with a degree cap. Mastery problem.' },

  // --- rerooting ------------------------------------------------------------
  { slug: 'count-nodes-with-the-highest-score', sub: 'rerooting', why: 'Subtree sizes plus "everything else" — rerooting in its easiest form.' },
  { slug: 'minimum-edge-reversals-so-every-node-is-reachable', sub: 'rerooting', why: 'Two passes: down to accumulate, up to redistribute.' },
  { slug: 'sum-of-distances-in-tree', sub: 'rerooting', why: 'The reference rerooting problem. Derive the parent-to-child update.' },
  { slug: 'find-minimum-diameter-after-merging-two-trees', sub: 'rerooting' },
  { slug: 'collect-coins-in-a-tree', sub: 'rerooting', why: 'Peel leaves twice, then measure what remains.' },
  { slug: 'count-visited-nodes-in-a-directed-graph', sub: 'rerooting', why: 'Functional graph: find each cycle, then propagate outward.' },
];
