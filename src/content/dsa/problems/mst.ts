import type { ProblemSeed } from '../../types';

/**
 * LeetCode's MST coverage is genuinely thin — there are only a handful of
 * non-premium MST problems in the whole catalogue. This list is short on
 * purpose rather than padded with unrelated DSU problems; the Kruskal-flavoured
 * offline problems that do exist are included because they exercise the same
 * sort-edges-then-union machinery.
 */
export const mst: ProblemSeed[] = [
  // --- Kruskal with DSU -----------------------------------------------------
  { slug: 'min-cost-to-connect-all-points', sub: 'Kruskal with DSU', why: 'The reference MST problem. Solve it twice: Kruskal over all n^2/2 edges, then Prim in O(n^2), which wins on a dense graph.' },
  { slug: 'checking-existence-of-edge-length-limited-paths', sub: 'Kruskal with DSU', why: 'Offline Kruskal: the MST prefix answers every threshold query.' },
  { slug: 'remove-max-number-of-edges-to-keep-graph-fully-traversable', sub: 'Kruskal with DSU', why: 'Maximum spanning forest with edge priorities.' },

  // --- implicit complete graph ----------------------------------------------
  { slug: 'number-of-good-paths', sub: 'implicit complete graph', why: 'Kruskal-style sweep over node values rather than edge weights.' },

  // --- critical & pseudo-critical edges -------------------------------------
  { slug: 'maximize-spanning-tree-stability-with-upgrades', sub: 'critical & pseudo-critical edges', why: 'Forced edges first, then greedy on the rest.' },
  { slug: 'find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree', sub: 'critical & pseudo-critical edges', why: 'Recompute the MST with each edge forced in and forced out. The mastery problem.' },
];
