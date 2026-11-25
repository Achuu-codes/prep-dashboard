import type { ProblemSeed } from '../../types';

export const backtracking: ProblemSeed[] = [
  // --- subsets & combinations -----------------------------------------------
  { slug: 'subsets-ii', sub: 'subsets & combinations', why: 'Sort, then skip duplicates at the same depth. The dedup rule to memorise.' },
  { slug: 'combinations', sub: 'subsets & combinations' },
  { slug: 'combination-sum', sub: 'subsets & combinations', why: 'Reuse allowed: recurse with the same index.' },
  { slug: 'combination-sum-ii', sub: 'subsets & combinations', why: 'Reuse not allowed, duplicates present — both rules at once.' },
  { slug: 'combination-sum-iii', sub: 'subsets & combinations' },
  { slug: 'letter-combinations-of-a-phone-number', sub: 'subsets & combinations' },
  { slug: 'generate-parentheses', sub: 'subsets & combinations', why: 'Prune by the open/close counts instead of validating at the leaves.' },
  { slug: 'the-number-of-beautiful-subsets', sub: 'subsets & combinations' },

  // --- permutations ---------------------------------------------------------
  { slug: 'permutations', sub: 'permutations', why: 'Swap-in-place or used-array; know the trade-off.' },
  { slug: 'permutations-ii', sub: 'permutations', why: 'Count map, or sort plus skip-equal-at-same-depth.' },
  { slug: 'letter-case-permutation', sub: 'permutations' },
  { slug: 'beautiful-arrangement', sub: 'permutations', why: 'Pruning on divisibility is what makes it pass.' },
  { slug: 'permutation-sequence', sub: 'permutations', why: 'Not search at all: factorial-base digit selection.' },

  // --- grid & word search ---------------------------------------------------
  { slug: 'word-search', sub: 'grid & word search', why: 'Mark-visit, recurse, unmark. In-place marking avoids the visited set.' },
  { slug: 'path-with-maximum-gold', sub: 'grid & word search' },
  { slug: 'unique-paths-iii', sub: 'grid & word search', why: 'Exhaustive path count with a remaining-cells counter for pruning.' },
  { slug: 'word-search-ii', sub: 'grid & word search', why: 'Trie + DFS, pruning dead prefixes. The reason tries exist.' },

  // --- constraint puzzles ---------------------------------------------------
  { slug: 'matchsticks-to-square', sub: 'constraint puzzles', why: 'Sort descending, fill one side at a time, skip equal failed buckets.' },
  { slug: 'partition-to-k-equal-sum-subsets', sub: 'constraint puzzles', why: 'Same shape generalised; memoise on the used-mask for the fast version.' },
  { slug: 'n-queens', sub: 'constraint puzzles', why: 'Column plus two diagonal sets, indexed r+c and r-c+n.' },
  { slug: 'n-queens-ii', sub: 'constraint puzzles', why: 'Bitmask version: cols, diag1, diag2 as three integers.' },
  { slug: 'sudoku-solver', sub: 'constraint puzzles', why: 'Row/col/box masks; pick the most constrained cell first.' },
  { slug: '24-game', sub: 'constraint puzzles' },

  // --- partition & split ----------------------------------------------------
  { slug: 'restore-ip-addresses', sub: 'partition & split' },
  { slug: 'palindrome-partitioning', sub: 'partition & split', why: 'Precompute an isPalindrome table so each cut test is O(1).' },
  { slug: 'additive-number', sub: 'partition & split' },
  { slug: 'split-array-into-fibonacci-sequence', sub: 'partition & split' },
  { slug: 'split-a-string-into-the-max-number-of-unique-substrings', sub: 'partition & split' },
  { slug: 'expression-add-operators', sub: 'partition & split', why: 'Carry the last operand so you can undo a multiplication.' },

  // --- pruning & memoisation ------------------------------------------------
  { slug: 'word-break-ii', sub: 'pruning & memoisation', why: 'Memoise suffix -> list of sentences, or you blow up on adversarial input.' },
  { slug: 'maximum-score-words-formed-by-letters', sub: 'pruning & memoisation' },
  { slug: 'remove-invalid-parentheses', sub: 'pruning & memoisation', why: 'BFS by removal count, with a visited set — beats blind DFS.' },
  { slug: 'stickers-to-spell-word', sub: 'pruning & memoisation', why: 'Memoised search over the remaining-letters multiset. The mastery problem here.' },
];
