import type { ProblemSeed } from '../../types';

export const dpInterval: ProblemSeed[] = [
  // --- burst balloons style -------------------------------------------------
  { slug: 'minimum-cost-tree-from-leaf-values', sub: 'burst balloons style', why: 'Interval DP first, then notice the monotonic-stack O(n) solution.' },
  { slug: 'minimum-score-triangulation-of-polygon', sub: 'burst balloons style', why: 'The cleanest "pick the last vertex in the range" recurrence.' },
  { slug: 'burst-balloons', sub: 'burst balloons style', why: 'Think about which balloon pops LAST, not first. The defining insight of interval DP.' },
  { slug: 'strange-printer', sub: 'burst balloons style' },
  { slug: 'remove-boxes', sub: 'burst balloons style', why: 'Three-dimensional state (l, r, k). The hardest interval DP on the site.' },

  // --- merge cost / matrix chain --------------------------------------------
  { slug: 'minimum-cost-to-merge-stones', sub: 'merge cost / matrix chain', why: 'The (len - 1) % (k - 1) == 0 feasibility condition is the whole trick.' },
  { slug: 'palindrome-partitioning-iii', sub: 'merge cost / matrix chain' },

  // --- range games ----------------------------------------------------------
  { slug: 'predict-the-winner', sub: 'range games', why: 'Score difference as the DP value; the opponent minimises what you maximise.' },
  { slug: 'stone-game', sub: 'range games' },
  { slug: 'stone-game-vii', sub: 'range games' },
  { slug: 'stone-game-ii', sub: 'range games', why: 'State is (index, M) with a suffix-sum formulation.' },
  { slug: 'stone-game-iii', sub: 'range games' },
  { slug: 'guess-number-higher-or-lower-ii', sub: 'range games', why: 'Minimise the worst case — a minimax interval DP.' },

  // --- palindrome partitioning ----------------------------------------------
  { slug: 'palindrome-partitioning-ii', sub: 'palindrome partitioning', why: 'Precompute the palindrome table, then a 1D min-cuts DP.' },
  { slug: 'palindrome-partitioning-iv', sub: 'palindrome partitioning' },
];
