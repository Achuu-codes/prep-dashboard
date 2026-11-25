import type { ProblemSeed } from '../../types';

export const topologicalSort: ProblemSeed[] = [
  // --- Kahn's indegree BFS --------------------------------------------------
  { slug: 'course-schedule', sub: "Kahn's indegree BFS", why: 'Processing fewer than n nodes means a cycle. That check is the whole algorithm.' },
  { slug: 'course-schedule-ii', sub: "Kahn's indegree BFS", why: 'Same loop, but emit the order.' },
  { slug: 'find-all-possible-recipes-from-given-supplies', sub: "Kahn's indegree BFS" },
  { slug: 'all-ancestors-of-a-node-in-a-directed-acyclic-graph', sub: "Kahn's indegree BFS" },
  { slug: 'build-a-matrix-with-conditions', sub: "Kahn's indegree BFS", why: 'Two independent topological sorts, one per axis.' },

  // --- DFS postorder ordering -----------------------------------------------
  { slug: 'find-eventual-safe-states', sub: 'DFS postorder ordering' },
  { slug: 'longest-increasing-path-in-a-matrix', sub: 'DFS postorder ordering', why: 'Memoised DFS on an implicit DAG — topological order without building it.' },
  { slug: 'sort-items-by-groups-respecting-dependencies', sub: 'DFS postorder ordering', why: 'Two-level topological sort: groups, then items inside groups.' },

  // --- prerequisite feasibility ---------------------------------------------
  { slug: 'course-schedule-iv', sub: 'prerequisite feasibility', why: 'Reachability closure — Floyd-Warshall on booleans, or BFS per source.' },
  { slug: 'minimum-height-trees', sub: 'prerequisite feasibility', why: 'Peel leaves layer by layer; the last 1 or 2 nodes are the centroids.' },
  { slug: 'maximum-employees-to-be-invited-to-a-meeting', sub: 'prerequisite feasibility', why: 'Functional graph: peel the tails, then measure every cycle. Mastery problem.' },

  // --- lexicographic ordering -----------------------------------------------
  { slug: 'smallest-string-with-swaps', sub: 'lexicographic ordering', why: 'Group by connected component, sort each group independently.' },
  { slug: 'find-the-most-competitive-subsequence', sub: 'lexicographic ordering', why: 'Greedy monotonic build — the ordering intuition without a graph.' },

  // --- DP over topological order --------------------------------------------
  { slug: 'number-of-ways-to-arrive-at-destination', sub: 'DP over topological order', why: 'Dijkstra first, then count paths in the shortest-path DAG.' },
  { slug: 'number-of-restricted-paths-from-first-to-last-node', sub: 'DP over topological order' },
  { slug: 'parallel-courses-iii', sub: 'DP over topological order', why: 'Longest path in a DAG = max over predecessors, in topological order.' },
  { slug: 'longest-path-with-different-adjacent-characters', sub: 'DP over topological order' },
  { slug: 'largest-color-value-in-a-directed-graph', sub: 'DP over topological order', why: '26 counters carried per node through Kahn\'s loop.' },
];
