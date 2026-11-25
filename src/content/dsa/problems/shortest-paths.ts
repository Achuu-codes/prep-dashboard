import type { ProblemSeed } from '../../types';

export const shortestPaths: ProblemSeed[] = [
  // --- Dijkstra -------------------------------------------------------------
  { slug: 'network-delay-time', sub: 'Dijkstra', why: 'The plain template: lazy heap, skip stale entries.' },
  { slug: 'path-with-maximum-probability', sub: 'Dijkstra', why: 'Maximising a product — flip the comparator, do not take logs.' },
  { slug: 'path-with-minimum-effort', sub: 'Dijkstra', why: 'Minimax path: relax with max(dist, edge) instead of a sum.' },
  { slug: 'swim-in-rising-water', sub: 'Dijkstra', why: 'Same minimax relaxation on a grid; also solvable with DSU or binary search.' },
  { slug: 'number-of-restricted-paths-from-first-to-last-node', sub: 'Dijkstra' },
  { slug: 'number-of-ways-to-arrive-at-destination', sub: 'Dijkstra', why: 'Count paths during relaxation: reset on improve, add on tie.' },
  { slug: 'minimum-time-to-reach-destination-in-directed-graph', sub: 'Dijkstra' },
  { slug: 'find-minimum-time-to-reach-last-room-ii', sub: 'Dijkstra', why: 'Dijkstra on a grid where the edge cost depends on the move parity.' },
  { slug: 'minimum-weighted-subgraph-with-the-required-paths', sub: 'Dijkstra', why: 'Three Dijkstra runs, one on the reversed graph.' },

  // --- Dijkstra over augmented state ----------------------------------------
  { slug: 'second-minimum-time-to-reach-destination', sub: 'Dijkstra over augmented state' },
  { slug: 'minimum-cost-to-reach-destination-in-time', sub: 'Dijkstra over augmented state', why: 'State is (node, timeSpent); cost and constraint are different dimensions.' },
  { slug: 'shortest-path-to-get-all-keys', sub: 'Dijkstra over augmented state', why: 'State is (cell, keyMask) — BFS because all edges cost 1.' },
  { slug: 'shortest-path-visiting-all-nodes', sub: 'Dijkstra over augmented state' },

  // --- 0-1 BFS --------------------------------------------------------------
  { slug: 'minimum-obstacle-removal-to-reach-corner', sub: '0-1 BFS', why: 'Weights are 0 or 1: push-front for 0, push-back for 1. O(V+E).' },
  { slug: 'minimum-cost-to-make-at-least-one-valid-path-in-a-grid', sub: '0-1 BFS', why: 'Following the arrow is free, turning costs 1.' },

  // --- Bellman-Ford & edge limits -------------------------------------------
  { slug: 'cheapest-flights-within-k-stops', sub: 'Bellman-Ford & edge limits', why: 'k+1 relaxation rounds over a snapshot of distances — the snapshot is mandatory.' },
  { slug: 'modify-graph-edge-weights', sub: 'Bellman-Ford & edge limits', why: 'Repeated Dijkstra with incremental weight assignment. Genuinely hard.' },

  // --- Floyd-Warshall -------------------------------------------------------
  { slug: 'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance', sub: 'Floyd-Warshall', why: 'The three-loop template, k outermost.' },
  { slug: 'course-schedule-iv', sub: 'Floyd-Warshall', why: 'Transitive closure is Floyd-Warshall over booleans.' },

  // --- shortest path + binary search ----------------------------------------
  { slug: 'last-day-where-you-can-still-cross', sub: 'shortest path + binary search', why: 'Binary search the day, BFS to check crossability.' },
  { slug: 'minimize-the-maximum-edge-weight-of-graph', sub: 'shortest path + binary search', why: 'Binary search the weight cap, then check reachability on the filtered graph.' },
  { slug: 'minimum-time-to-reach-target-with-limited-power', sub: 'shortest path + binary search' },
  { slug: 'minimum-number-of-visited-cells-in-a-grid', sub: 'shortest path + binary search', why: 'BFS with a segment tree or sorted sets to skip already-reached cells.' },
];
