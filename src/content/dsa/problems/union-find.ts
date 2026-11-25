import type { ProblemSeed } from '../../types';

export const unionFind: ProblemSeed[] = [
  // --- component counting ---------------------------------------------------
  { slug: 'number-of-provinces', sub: 'component counting', why: 'Start the count at n and decrement on every successful union.' },
  { slug: 'number-of-operations-to-make-network-connected', sub: 'component counting' },
  { slug: 'count-unreachable-pairs-of-nodes-in-an-undirected-graph', sub: 'component counting', why: 'Component sizes plus a running pair count.' },
  { slug: 'count-the-number-of-complete-components', sub: 'component counting' },
  { slug: 'accounts-merge', sub: 'component counting', why: 'Union by shared email, then group and sort. The canonical "DSU over strings".' },
  { slug: 'similar-string-groups', sub: 'component counting' },

  // --- cycle detection (undirected) -----------------------------------------
  { slug: 'redundant-connection', sub: 'cycle detection (undirected)', why: 'The first union that fails is the answer.' },
  { slug: 'redundant-connection-ii', sub: 'cycle detection (undirected)', why: 'Directed: handle the two-parent case and the cycle case separately.' },

  // --- DSU with extra state -------------------------------------------------
  { slug: 'satisfiability-of-equality-equations', sub: 'DSU with extra state', why: 'Union all equalities first, then test the inequalities.' },
  { slug: 'most-stones-removed-with-same-row-or-column', sub: 'DSU with extra state', why: 'Union rows with columns; the answer is n - components.' },
  { slug: 'evaluate-division', sub: 'DSU with extra state', why: 'Weighted DSU: store a ratio to the parent and compose on find.' },
  { slug: 'regions-cut-by-slashes', sub: 'DSU with extra state', why: 'Split each cell into four triangles. The modelling is the difficulty.' },
  { slug: 'largest-component-size-by-common-factor', sub: 'DSU with extra state', why: 'Union each number with its prime factors, not with other numbers.' },

  // --- offline / reverse-time DSU -------------------------------------------
  { slug: 'checking-existence-of-edge-length-limited-paths', sub: 'offline / reverse-time DSU', why: 'Sort queries and edges together; add edges as the limit grows.' },
  { slug: 'remove-max-number-of-edges-to-keep-graph-fully-traversable', sub: 'offline / reverse-time DSU', why: 'Two DSUs, type-3 edges first.' },
  { slug: 'number-of-good-paths', sub: 'offline / reverse-time DSU', why: 'Process nodes in increasing value, counting maxima per component.' },
  { slug: 'last-day-where-you-can-still-cross', sub: 'offline / reverse-time DSU', why: 'Run time backwards so removals become unions.' },
  { slug: 'bricks-falling-when-hit', sub: 'offline / reverse-time DSU', why: 'Reverse time and add bricks back. The hardest idea in this group.' },

  // --- grid DSU -------------------------------------------------------------
  { slug: 'number-of-islands', sub: 'grid DSU', why: 'Worth doing a second time with DSU instead of DFS.' },
  { slug: 'making-a-large-island', sub: 'grid DSU' },
  { slug: 'smallest-string-with-swaps', sub: 'grid DSU' },
];
