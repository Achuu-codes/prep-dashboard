import type { ProblemSeed } from '../../types';

export const dpBitmask: ProblemSeed[] = [
  // --- subset as state ------------------------------------------------------
  { slug: 'can-i-win', sub: 'subset as state', why: 'Memoise on the used-number mask; the entry point to this whole topic.' },
  { slug: 'partition-to-k-equal-sum-subsets', sub: 'subset as state', why: 'Mask plus derived current-bucket sum — one dimension, not two.' },
  { slug: 'maximum-rows-covered-by-columns', sub: 'subset as state' },
  { slug: 'minimum-number-of-work-sessions-to-finish-the-tasks', sub: 'subset as state' },
  { slug: 'maximum-students-taking-exam', sub: 'subset as state', why: 'DP over row masks with validity checks against the previous row.' },

  // --- assignment & matching ------------------------------------------------
  { slug: 'minimum-xor-sum-of-two-arrays', sub: 'assignment & matching', why: 'Assignment DP: popcount(mask) tells you which index you are placing.' },
  { slug: 'number-of-ways-to-wear-different-hats-to-each-other', sub: 'assignment & matching', why: 'Iterate over hats, not people — 40 hats, 10 people.' },
  { slug: 'smallest-sufficient-team', sub: 'assignment & matching', why: 'Set cover over a 60-bit skill mask with reconstruction.' },
  { slug: 'maximum-and-sum-of-array', sub: 'assignment & matching', why: 'Base-3 mask for two slots per basket.' },
  { slug: 'minimum-cost-to-connect-two-groups-of-points', sub: 'assignment & matching', why: 'DP over one side with a mask for the other, plus a min-cost fallback.' },

  // --- TSP / Hamiltonian paths ----------------------------------------------
  { slug: 'shortest-path-visiting-all-nodes', sub: 'TSP / Hamiltonian paths', why: 'BFS over (node, mask) — the unweighted TSP.' },
  { slug: 'find-the-shortest-superstring', sub: 'TSP / Hamiltonian paths', why: 'Pairwise overlap costs, then a path-TSP with reconstruction.' },
  { slug: 'parallel-courses-ii', sub: 'TSP / Hamiltonian paths', why: 'Mask DP with submask enumeration over the courses available this semester.' },

  // --- submask enumeration --------------------------------------------------
  { slug: 'distribute-repeating-integers', sub: 'submask enumeration', why: 'The for (s = m; s; s = (s-1) & m) loop, in its natural habitat.' },
  { slug: 'partition-array-into-two-arrays-to-minimize-sum-difference', sub: 'submask enumeration', why: 'Meet in the middle: enumerate halves by popcount, then binary search.' },
  { slug: 'fair-distribution-of-cookies', sub: 'submask enumeration' },
];
