import type { ProblemSeed } from '../../types';

export const bitManipulation: ProblemSeed[] = [
  // --- mask tricks ----------------------------------------------------------
  { slug: 'sum-of-two-integers', sub: 'mask tricks', why: 'Add without +: carry = (a & b) << 1. Know the sign-handling caveat in C++.' },
  { slug: 'minimum-flips-to-make-a-or-b-equal-to-c', sub: 'mask tricks' },
  { slug: 'bitwise-and-of-numbers-range', sub: 'mask tricks', why: 'The answer is the common prefix of left and right.' },
  { slug: 'divide-two-integers', sub: 'mask tricks', why: 'Shift-and-subtract long division; INT_MIN is the whole test suite.' },
  { slug: 'concatenation-of-consecutive-binary-numbers', sub: 'mask tricks' },
  { slug: 'minimum-array-end', sub: 'mask tricks', why: 'Distribute the free bits around the fixed ones.' },

  // --- XOR invariants -------------------------------------------------------
  { slug: 'single-number-iii', sub: 'XOR invariants', why: 'XOR everything, then split on the lowest set bit.' },
  { slug: 'single-number-ii', sub: 'XOR invariants', why: 'Count bits mod 3, or the two-register ones/twos automaton.' },
  { slug: 'find-the-original-array-of-prefix-xor', sub: 'XOR invariants' },
  { slug: 'maximum-xor-for-each-query', sub: 'XOR invariants' },
  { slug: 'minimize-xor', sub: 'XOR invariants', why: 'Match popcount greedily from the high bits down.' },
  { slug: 'maximum-xor-after-operations', sub: 'XOR invariants', why: 'The AND-NOT operation can clear any bit, so the answer is the OR.' },
  { slug: 'decode-xored-permutation', sub: 'XOR invariants', why: 'Recover the first element from the total XOR of 1..n. Elegant.' },
  { slug: 'count-triplets-that-can-form-two-arrays-of-equal-xor', sub: 'XOR invariants' },

  // --- per-bit decomposition ------------------------------------------------
  { slug: 'count-the-number-of-beautiful-subarrays', sub: 'per-bit decomposition', why: 'Prefix XOR plus a hash map — per-bit parity, counted once.' },
  { slug: 'shortest-subarray-with-or-at-least-k-ii', sub: 'per-bit decomposition', why: 'Maintain per-bit counts so OR can be decremented on window shrink.' },
  { slug: 'bitwise-ors-of-subarrays', sub: 'per-bit decomposition', why: 'The set of ORs ending at i has at most 32 distinct values.' },
  { slug: 'triples-with-bitwise-and-equal-to-zero', sub: 'per-bit decomposition' },
  { slug: 'find-subarray-with-bitwise-or-closest-to-k', sub: 'per-bit decomposition' },

  // --- subset enumeration ---------------------------------------------------
  { slug: 'subsets', sub: 'subset enumeration', why: 'Iterate masks 0..2^n-1 instead of recursing.' },
  { slug: 'maximum-product-of-word-lengths', sub: 'subset enumeration', why: 'A 26-bit mask per word turns the pairwise check into one AND.' },
  { slug: 'the-number-of-beautiful-subsets', sub: 'subset enumeration' },

  // --- build the answer bit by bit ------------------------------------------
  { slug: 'maximum-or', sub: 'build the answer bit by bit' },
  { slug: 'maximum-xor-of-two-numbers-in-an-array', sub: 'build the answer bit by bit', why: 'Greedy from the top bit with a prefix set, or a bitwise trie.' },
  { slug: 'minimum-one-bit-operations-to-make-integers-zero', sub: 'build the answer bit by bit', why: 'Gray code. Short, and nearly impossible to derive under pressure — just know it.' },
];
