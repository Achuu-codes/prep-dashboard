import type { ProblemSeed } from '../../types';
import { arraysHashing } from './arrays-hashing';
import { backtracking } from './backtracking';
import { binarySearch } from './binary-search';
import { bitManipulation } from './bit-manipulation';
import { bst } from './bst';
import { dp1d } from './dp-1d';
import { dpBitmask } from './dp-bitmask';
import { dpDigit } from './dp-digit';
import { dpGrid } from './dp-grid';
import { dpInterval } from './dp-interval';
import { dpKnapsack } from './dp-knapsack';
import { dpLis } from './dp-lis';
import { dpString } from './dp-string';
import { dpTrees } from './dp-trees';
import { graphTraversal } from './graph-traversal';
import { greedy } from './greedy';
import { heaps } from './heaps';
import { intervals } from './intervals';
import { linkedLists } from './linked-lists';
import { math } from './math';
import { monotonicDeque } from './monotonic-deque';
import { mst } from './mst';
import { prefixSum } from './prefix-sum';
import { segmentTree } from './segment-tree';
import { shortestPaths } from './shortest-paths';
import { slidingWindow } from './sliding-window';
import { stacks } from './stacks';
import { strings } from './strings';
import { topologicalSort } from './topological-sort';
import { tries } from './tries';
import { trees } from './trees';
import { twoPointers } from './two-pointers';
import { unionFind } from './union-find';

/**
 * topic slug -> curated problem list.
 *
 * Only leaf topics appear here; grouping nodes (graphs, dp) aggregate their
 * children's progress instead of owning problems.
 */
export const dsaProblems: Record<string, ProblemSeed[]> = {
  'arrays-hashing': arraysHashing,
  'two-pointers': twoPointers,
  'sliding-window': slidingWindow,
  'prefix-sum': prefixSum,
  'binary-search': binarySearch,
  stacks,
  'monotonic-deque': monotonicDeque,
  'linked-lists': linkedLists,
  trees,
  bst,
  heaps,
  intervals,
  greedy,
  backtracking,
  'graph-traversal': graphTraversal,
  'topological-sort': topologicalSort,
  'union-find': unionFind,
  'shortest-paths': shortestPaths,
  mst,
  tries,
  'dp-1d': dp1d,
  'dp-grid': dpGrid,
  'dp-knapsack': dpKnapsack,
  'dp-lis': dpLis,
  'dp-string': dpString,
  'dp-interval': dpInterval,
  'dp-bitmask': dpBitmask,
  'dp-trees': dpTrees,
  'dp-digit': dpDigit,
  'bit-manipulation': bitManipulation,
  math,
  strings,
  'segment-tree': segmentTree,
};

/** Every distinct problem slug across all DSA topics. */
export function allDsaSlugs(): string[] {
  return [
    ...new Set(
      Object.values(dsaProblems).flatMap((list) => list.map((p) => p.slug)),
    ),
  ].sort();
}

export function totalPlacements(): number {
  return Object.values(dsaProblems).reduce((n, list) => n + list.length, 0);
}
