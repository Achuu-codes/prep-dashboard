import type { ProblemSeed } from '../../types';

export const dpGrid: ProblemSeed[] = [
  // --- path counting --------------------------------------------------------
  { slug: 'unique-paths', sub: 'path counting', why: 'The base recurrence; also a binomial coefficient.' },
  { slug: 'unique-paths-ii', sub: 'path counting' },
  { slug: 'out-of-boundary-paths', sub: 'path counting', why: 'Add the move count as a third dimension.' },
  { slug: 'knight-probability-in-chessboard', sub: 'path counting' },
  { slug: 'number-of-increasing-paths-in-a-grid', sub: 'path counting', why: 'Memoised DFS over an implicit DAG induced by the values.' },
  { slug: 'paths-in-matrix-whose-sum-is-divisible-by-k', sub: 'path counting', why: 'Carry the running sum mod k as state.' },
  { slug: 'number-of-paths-with-max-score', sub: 'path counting', why: 'Two values per cell: best score and the count achieving it.' },

  // --- minimum path cost ----------------------------------------------------
  { slug: 'minimum-path-sum', sub: 'minimum path cost' },
  { slug: 'triangle', sub: 'minimum path cost', why: 'Bottom-up in place, O(n) space.' },
  { slug: 'minimum-falling-path-sum', sub: 'minimum path cost' },
  { slug: 'minimum-path-cost-in-a-grid', sub: 'minimum path cost' },
  { slug: 'minimum-falling-path-sum-ii', sub: 'minimum path cost', why: 'Keep the best and second-best per row so each transition is O(1).' },
  { slug: 'dungeon-game', sub: 'minimum path cost', why: 'Must be solved backwards from the destination. Worth understanding why forward fails.' },

  // --- grid DP with extra state ---------------------------------------------
  { slug: 'minimum-swaps-to-arrange-a-binary-grid', sub: 'grid DP with extra state' },
  { slug: 'maximum-number-of-points-with-cost', sub: 'grid DP with extra state', why: 'Split |j-k| into two directional running maxima to get O(mn).' },
  { slug: 'stamping-the-grid', sub: 'grid DP with extra state', why: '2D prefix sums plus a 2D difference array, together.' },

  // --- two agents on one grid -----------------------------------------------
  { slug: 'cherry-pickup-ii', sub: 'two agents on one grid', why: 'Move both robots in lockstep by row; state is (row, c1, c2).' },
  { slug: 'cherry-pickup', sub: 'two agents on one grid', why: 'One round trip = two simultaneous forward walks. The reframing is the whole problem.' },

  // --- rectangles & submatrices ---------------------------------------------
  { slug: 'maximal-square', sub: 'rectangles & submatrices', why: 'dp[i][j] = 1 + min of three neighbours.' },
  { slug: 'count-square-submatrices-with-all-ones', sub: 'rectangles & submatrices', why: 'Same recurrence; the sum of dp is the count.' },
  { slug: 'maximal-rectangle', sub: 'rectangles & submatrices', why: 'Row heights plus the histogram routine — DP feeding a monotonic stack.' },
  { slug: 'count-submatrices-with-all-ones', sub: 'rectangles & submatrices' },
];
