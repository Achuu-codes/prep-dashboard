import type { TopicDef } from '../types';

/**
 * The DSA topic tree: the patterns big-tech interviews actually ask.
 *
 * `subPatterns` order matters — it is the order sub-pattern groups render in on
 * the topic page, and it is the order the progress bars appear in. Every
 * problem's `sub` field must match one of these labels exactly; the seeder
 * fails if it does not.
 */
export const dsaTopics: TopicDef[] = [
  {
    slug: 'arrays-hashing',
    title: 'Arrays & Hashing',
    summary:
      'Counting with maps, index-as-hash, prefix/suffix products, grouping by canonical key.',
    subPatterns: [
      'hash map counting',
      'canonical-key grouping',
      'prefix & suffix products',
      'index as hash',
      'matrix as array',
      'design with hashing',
    ],
  },
  {
    slug: 'two-pointers',
    title: 'Two Pointers',
    summary:
      'Opposite-end convergence, same-direction scanning, partitioning and k-sum reductions.',
    subPatterns: [
      'opposite ends',
      'same direction',
      'partitioning',
      'k-sum reduction',
      'merging sorted inputs',
    ],
  },
  {
    slug: 'sliding-window',
    title: 'Sliding Window',
    summary:
      'Fixed and variable windows, the at-most-K trick for exactly-K, windows over frequency maps.',
    subPatterns: [
      'fixed window',
      'variable window',
      'exactly K via at-most K',
      'frequency-map window',
      'window with auxiliary structure',
    ],
  },
  {
    slug: 'prefix-sum',
    title: 'Prefix Sum & Difference Arrays',
    summary:
      'Range sums in O(1), prefix + hash map for subarray counting, difference arrays for range updates.',
    subPatterns: [
      '1D prefix sums',
      'prefix + hash map',
      'difference array',
      '2D prefix sums',
      'prefix XOR & parity',
    ],
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    summary:
      'Boundary search on sorted data, rotated arrays, and binary search on the answer with a monotone predicate.',
    subPatterns: [
      'boundaries on sorted data',
      'rotated & unknown pivot',
      'binary search on the answer',
      'search in a matrix',
      'binary search + greedy check',
    ],
  },
  {
    slug: 'stacks',
    title: 'Stacks & Monotonic Stack',
    summary:
      'Next greater/smaller element, histogram rectangles, expression parsing, contribution counting.',
    subPatterns: [
      'stack simulation',
      'next greater / smaller',
      'histogram & rectangles',
      'expression parsing',
      'stack with extra state',
      'contribution counting',
    ],
  },
  {
    slug: 'monotonic-deque',
    title: 'Monotonic Deque',
    summary:
      'Sliding-window extrema in O(n) and deque-optimised DP transitions.',
    subPatterns: [
      'sliding-window extrema',
      'bounded-difference windows',
      'deque-optimised DP',
    ],
  },
  {
    slug: 'linked-lists',
    title: 'Linked Lists',
    summary:
      'Reversal in place, fast/slow pointers, k-group surgery, and pointer-heavy designs.',
    subPatterns: [
      'reversal in place',
      'fast & slow pointers',
      'merge & sort',
      'k-group surgery',
      'copy & restructure',
      'design with lists',
    ],
  },
  {
    slug: 'trees',
    title: 'Trees',
    summary:
      'DFS/BFS traversals, path problems, construction from traversals, LCA, and tuple-returning tree DP.',
    subPatterns: [
      'traversal',
      'depth & path problems',
      'construction from traversals',
      'lowest common ancestor',
      'serialisation',
      'tree DP returning tuples',
    ],
  },
  {
    slug: 'bst',
    title: 'Binary Search Trees',
    summary:
      'Order invariants, in-order as a sorted stream, insert/delete surgery, and ordered-set tricks.',
    subPatterns: [
      'validation & search',
      'in-order as sorted stream',
      'insert & delete',
      'build from sorted / preorder',
      'ordered-set tricks',
    ],
  },
  {
    slug: 'heaps',
    title: 'Heaps / Top-K',
    summary:
      'Bounded heaps for top-K, k-way merge, two heaps for a running median, and heap-driven scheduling.',
    subPatterns: [
      'top-K with a bounded heap',
      'k-way merge',
      'two heaps',
      'scheduling with a heap',
      'heap + greedy',
      'lazy deletion',
    ],
  },
  {
    slug: 'intervals',
    title: 'Intervals',
    summary:
      'Merge and insert, sweep-line event counting, minimum-resource scheduling, interval intersection.',
    subPatterns: [
      'merge & insert',
      'sweep line',
      'minimum resources',
      'scheduling greedy',
      'intersection',
    ],
  },
  {
    slug: 'greedy',
    title: 'Greedy',
    summary:
      'Exchange arguments, sort-then-pick, reachability, and lexicographic construction.',
    subPatterns: [
      'sort then pick',
      'exchange argument',
      'reachability & jumps',
      'lexicographic construction',
      'greedy with a heap',
      'local swap arguments',
    ],
  },
  {
    slug: 'backtracking',
    title: 'Backtracking',
    summary:
      'Subsets, permutations, grid search, constraint puzzles — and the pruning that makes them pass.',
    subPatterns: [
      'subsets & combinations',
      'permutations',
      'grid & word search',
      'constraint puzzles',
      'partition & split',
      'pruning & memoisation',
    ],
  },
  {
    slug: 'graphs',
    title: 'Graphs',
    summary:
      'Traversal, ordering, connectivity, shortest paths and spanning trees.',
    children: [
      {
        slug: 'graph-traversal',
        title: 'BFS & DFS',
        summary:
          'Grid flood fill, multi-source BFS, components, cycle detection, bipartite checks, implicit state graphs.',
        subPatterns: [
          'grid flood fill',
          'multi-source BFS',
          'connected components',
          'cycle detection',
          'bipartite / 2-colouring',
          'implicit state graph',
        ],
      },
      {
        slug: 'topological-sort',
        title: 'Topological Sort',
        summary:
          "Kahn's indegree BFS, DFS postorder, DAG longest paths and topo-order DP.",
        subPatterns: [
          "Kahn's indegree BFS",
          'DFS postorder ordering',
          'prerequisite feasibility',
          'lexicographic ordering',
          'DP over topological order',
        ],
      },
      {
        slug: 'union-find',
        title: 'Union-Find',
        summary:
          'Union by size with path compression, component counting, DSU carrying extra state, offline tricks.',
        subPatterns: [
          'component counting',
          'cycle detection (undirected)',
          'DSU with extra state',
          'offline / reverse-time DSU',
          'grid DSU',
        ],
      },
      {
        slug: 'shortest-paths',
        title: 'Dijkstra, 0-1 BFS & Bellman-Ford',
        summary:
          'Non-negative weights with a heap, 0/1 weights with a deque, k-edge limits with Bellman-Ford, all-pairs with Floyd-Warshall.',
        subPatterns: [
          'Dijkstra',
          'Dijkstra over augmented state',
          '0-1 BFS',
          'Bellman-Ford & edge limits',
          'Floyd-Warshall',
          'shortest path + binary search',
        ],
      },
      {
        slug: 'mst',
        title: 'Minimum Spanning Tree',
        summary:
          'Kruskal with DSU, Prim with a heap, implicit complete graphs, critical edges. LeetCode has few MST problems, so this list is short by design.',
        subPatterns: [
          'Kruskal with DSU',
          'implicit complete graph',
          'critical & pseudo-critical edges',
        ],
      },
    ],
  },
  {
    slug: 'tries',
    title: 'Tries',
    summary:
      'Prefix trees for word sets, trie-guided grid search, and bitwise tries for XOR extremes.',
    subPatterns: [
      'prefix insert & search',
      'trie-guided DFS',
      'bitwise trie (XOR)',
      'counting & scoring on a trie',
      'design & autocomplete',
    ],
  },
  {
    slug: 'dp',
    title: 'Dynamic Programming',
    summary:
      'State, transition, order — split by the shape of the state space.',
    children: [
      {
        slug: 'dp-1d',
        title: '1D DP',
        summary:
          'Linear recurrences, state-machine DP, decode counting, and max-subarray style DP.',
        subPatterns: [
          'linear recurrence',
          'state machine',
          'counting decompositions',
          'max subarray / Kadane DP',
          'reachability & jumps',
        ],
      },
      {
        slug: 'dp-grid',
        title: 'Grid & 2D DP',
        summary:
          'Path counting and path costs on a grid, plus multi-agent and diagonal variants.',
        subPatterns: [
          'path counting',
          'minimum path cost',
          'grid DP with extra state',
          'two agents on one grid',
          'rectangles & submatrices',
        ],
      },
      {
        slug: 'dp-knapsack',
        title: 'Knapsack DP',
        summary:
          'Subset sums, bounded and unbounded choices, counting targets, and two-constraint knapsacks.',
        subPatterns: [
          '0/1 subset sum',
          'counting to a target',
          'unbounded (coin change)',
          'partition into k groups',
          'two constraints',
        ],
      },
      {
        slug: 'dp-lis',
        title: 'LIS & Patience DP',
        summary:
          'O(n log n) longest increasing subsequence and the chain/dominance problems that reduce to it.',
        subPatterns: [
          'LIS in O(n log n)',
          'chains & dominance',
          'LIS variants',
        ],
      },
      {
        slug: 'dp-string',
        title: 'String DP',
        summary:
          'Edit distance, LCS, palindromic subsequences, wildcard and regex matching.',
        subPatterns: [
          'edit distance family',
          'LCS family',
          'palindromic subsequence',
          'pattern matching DP',
          'interleaving & decoding',
        ],
      },
      {
        slug: 'dp-interval',
        title: 'Interval DP',
        summary:
          'DP over ranges: burst-balloons style, matrix chain, range games, partition DP.',
        subPatterns: [
          'burst balloons style',
          'merge cost / matrix chain',
          'range games',
          'palindrome partitioning',
        ],
      },
      {
        slug: 'dp-bitmask',
        title: 'Bitmask DP',
        summary:
          'Subsets as integers: assignment problems, TSP, and submask enumeration.',
        subPatterns: [
          'subset as state',
          'assignment & matching',
          'TSP / Hamiltonian paths',
          'submask enumeration',
        ],
      },
      {
        slug: 'dp-trees',
        title: 'DP on Trees',
        summary:
          'Child aggregation, include/exclude on nodes, tree knapsack and rerooting.',
        subPatterns: [
          'child aggregation',
          'include / exclude',
          'tree knapsack',
          'rerooting',
        ],
      },
      {
        slug: 'dp-digit',
        title: 'Digit DP',
        summary:
          'Counting numbers in a range under digit constraints, with tight and leading-zero state.',
        subPatterns: [
          'count under a bound',
          'tight & leading-zero state',
          'digit DP + combinatorics',
        ],
      },
    ],
  },
  {
    slug: 'bit-manipulation',
    title: 'Bit Manipulation',
    summary:
      'Mask tricks, XOR invariants, per-bit decomposition, and building answers bit by bit.',
    subPatterns: [
      'mask tricks',
      'XOR invariants',
      'per-bit decomposition',
      'subset enumeration',
      'build the answer bit by bit',
    ],
  },
  {
    slug: 'math',
    title: 'Math & Number Theory',
    summary:
      'GCD structure, sieves, modular arithmetic, combinatorics and the counting arguments interviews reuse.',
    subPatterns: [
      'gcd & divisibility',
      'primes & sieve',
      'modular arithmetic',
      'combinatorics & counting',
      'digits & bases',
      'geometry & probability',
    ],
  },
  {
    slug: 'strings',
    title: 'String Algorithms',
    summary:
      'KMP prefix function, Z-function, rolling hash — and the problems that need them.',
    subPatterns: [
      'prefix function (KMP)',
      'Z-function',
      'rolling hash',
      'palindromic structure',
      'periodicity & borders',
    ],
  },
  {
    slug: 'segment-tree',
    title: 'Segment Tree & Fenwick Tree',
    summary:
      'Point update with range query, lazy propagation, inversion counting, coordinate compression.',
    subPatterns: [
      'Fenwick prefix sums',
      'inversion & order statistics',
      'segment tree range query',
      'lazy propagation',
      'coordinate compression',
    ],
  },
];
