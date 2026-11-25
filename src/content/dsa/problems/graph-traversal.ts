import type { ProblemSeed } from '../../types';

export const graphTraversal: ProblemSeed[] = [
  // --- grid flood fill ------------------------------------------------------
  { slug: 'number-of-islands', sub: 'grid flood fill', why: 'The base case. Sink the island as you visit it instead of keeping a visited grid.' },
  { slug: 'max-area-of-island', sub: 'grid flood fill' },
  { slug: 'number-of-enclaves', sub: 'grid flood fill', why: 'Flood from the border and count what survives — the inversion trick.' },
  { slug: 'number-of-closed-islands', sub: 'grid flood fill' },
  { slug: 'surrounded-regions', sub: 'grid flood fill' },
  { slug: 'coloring-a-border', sub: 'grid flood fill' },
  { slug: 'pacific-atlantic-water-flow', sub: 'grid flood fill', why: 'Reverse the direction of flow and start from both oceans.' },
  { slug: 'count-sub-islands', sub: 'grid flood fill' },
  { slug: 'making-a-large-island', sub: 'grid flood fill', why: 'Label components once, then test each 0 against its distinct neighbours.' },

  // --- multi-source BFS -----------------------------------------------------
  { slug: 'rotting-oranges', sub: 'multi-source BFS', why: 'Seed the queue with every source, then BFS level by level.' },
  { slug: '01-matrix', sub: 'multi-source BFS', why: 'All zeros are sources; one BFS gives every distance.' },
  { slug: 'map-of-highest-peak', sub: 'multi-source BFS' },
  { slug: 'as-far-from-land-as-possible', sub: 'multi-source BFS' },
  { slug: 'shortest-bridge', sub: 'multi-source BFS', why: 'Flood one island to find all its cells, then BFS outward from all of them.' },

  // --- connected components -------------------------------------------------
  { slug: 'number-of-provinces', sub: 'connected components' },
  { slug: 'clone-graph', sub: 'connected components', why: 'Map from original node to copy, built during the traversal.' },
  { slug: 'number-of-operations-to-make-network-connected', sub: 'connected components', why: 'Need components - 1 spare edges; count both.' },
  { slug: 'count-unreachable-pairs-of-nodes-in-an-undirected-graph', sub: 'connected components' },

  // --- cycle detection ------------------------------------------------------
  { slug: 'course-schedule', sub: 'cycle detection', why: 'Three-colour DFS or indegree BFS. Both worth writing once.' },
  { slug: 'redundant-connection', sub: 'cycle detection' },
  { slug: 'detect-cycles-in-2d-grid', sub: 'cycle detection', why: 'The "do not walk straight back to the parent" guard.' },
  { slug: 'find-eventual-safe-states', sub: 'cycle detection', why: 'Reverse graph plus topological peeling, or memoised colour DFS.' },
  { slug: 'longest-cycle-in-a-graph', sub: 'cycle detection', why: 'Functional graph: each node has one out-edge, so visit-order stamps find the cycle length.' },

  // --- bipartite / 2-colouring ----------------------------------------------
  { slug: 'is-graph-bipartite', sub: 'bipartite / 2-colouring', why: 'BFS colouring; a same-colour edge is the contradiction.' },
  { slug: 'possible-bipartition', sub: 'bipartite / 2-colouring' },

  // --- implicit state graph -------------------------------------------------
  { slug: 'minimum-genetic-mutation', sub: 'implicit state graph' },
  { slug: 'open-the-lock', sub: 'implicit state graph', why: 'States are strings; neighbours are generated, not stored.' },
  { slug: 'snakes-and-ladders', sub: 'implicit state graph' },
  { slug: 'shortest-path-in-binary-matrix', sub: 'implicit state graph' },
  { slug: 'word-ladder', sub: 'implicit state graph', why: 'Bucket by wildcard pattern so neighbour generation is not O(26*L*N).' },
  { slug: 'jump-game-iv', sub: 'implicit state graph', why: 'Clear each value bucket after first use or it degrades to O(n^2).' },
  { slug: 'bus-routes', sub: 'implicit state graph', why: 'BFS over routes, not stops. Choosing the right node set is the problem.' },
  { slug: 'sliding-puzzle', sub: 'implicit state graph', why: 'Encode the board as a string and BFS the permutation space.' },
  { slug: 'shortest-path-visiting-all-nodes', sub: 'implicit state graph', why: 'BFS over (node, visited-mask). The bridge to bitmask DP.' },
];
