import type { ProblemSeed } from '../../types';

export const dpKnapsack: ProblemSeed[] = [
  // --- 0/1 subset sum -------------------------------------------------------
  { slug: 'partition-equal-subset-sum', sub: '0/1 subset sum', why: 'The reference 0/1 knapsack. Iterate the capacity downward for the 1D version.' },
  { slug: 'target-sum', sub: '0/1 subset sum', why: 'Reduce to "count subsets summing to (total+target)/2"; check parity first.' },
  { slug: 'last-stone-weight-ii', sub: '0/1 subset sum', why: 'Minimise |S1 - S2| — the same reachable-sums set, read differently.' },
  { slug: 'tallest-billboard', sub: '0/1 subset sum', why: 'DP keyed on the difference between the two sides.' },

  // --- counting to a target -------------------------------------------------
  { slug: 'coin-change-ii', sub: 'counting to a target', why: 'Combinations, so the coin loop goes outside. Compare with combination-sum-iv.' },
  { slug: 'number-of-dice-rolls-with-target-sum', sub: 'counting to a target' },
  { slug: 'number-of-ways-to-earn-points', sub: 'counting to a target', why: 'Bounded knapsack counting: a third loop over the count per type.' },
  { slug: 'form-largest-integer-with-digits-that-add-up-to-target', sub: 'counting to a target', why: 'Knapsack on cost, then reconstruct the lexicographically largest string.' },
  { slug: 'count-of-sub-multisets-with-bounded-sum', sub: 'counting to a target', why: 'Bounded multiset counting with a sliding-window optimisation. Mastery problem.' },

  // --- unbounded (coin change) ----------------------------------------------
  { slug: 'coin-change', sub: 'unbounded (coin change)', why: 'Minimise count; forward capacity loop because reuse is allowed.' },
  { slug: 'perfect-squares', sub: 'unbounded (coin change)' },
  { slug: 'integer-break', sub: 'unbounded (coin change)' },
  { slug: 'minimum-cost-for-tickets', sub: 'unbounded (coin change)' },

  // --- partition into k groups ----------------------------------------------
  { slug: 'fair-distribution-of-cookies', sub: 'partition into k groups', why: 'Backtracking with a per-bag array; k is tiny.' },
  { slug: 'partition-to-k-equal-sum-subsets', sub: 'partition into k groups', why: 'Memoise on the used-element mask to turn exponential search into 2^n DP.' },
  { slug: 'distribute-repeating-integers', sub: 'partition into k groups', why: 'Submask enumeration over the 2^m demand masks.' },
  { slug: 'maximum-value-of-k-coins-from-piles', sub: 'partition into k groups', why: 'Group knapsack: prefix sums per pile, then one knapsack pass.' },

  // --- two constraints ------------------------------------------------------
  { slug: 'ones-and-zeroes', sub: 'two constraints', why: 'Two capacities, so the DP table is 2D and both loops go downward.' },
  { slug: 'profitable-schemes', sub: 'two constraints', why: 'Capacity on people, floor on profit — clamp the profit index instead of extending it.' },
];
