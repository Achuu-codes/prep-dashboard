import type { ProblemSeed } from '../../types';

export const tries: ProblemSeed[] = [
  // --- prefix insert & search ------------------------------------------------
  { slug: 'implement-trie-prefix-tree', sub: 'prefix insert & search', why: 'Write it with a fixed 26-child array once; that is the version you reuse under time pressure.' },
  { slug: 'replace-words', sub: 'prefix insert & search', why: 'Walk the word and stop at the first terminal node.' },
  { slug: 'longest-word-in-dictionary', sub: 'prefix insert & search' },
  { slug: 'short-encoding-of-words', sub: 'prefix insert & search', why: 'Insert reversed words; only leaf nodes contribute length.' },

  // --- trie-guided DFS -------------------------------------------------------
  { slug: 'word-search-ii', sub: 'trie-guided DFS', why: 'The reason tries exist: prune a grid DFS the moment the prefix dies.' },
  { slug: 'concatenated-words', sub: 'trie-guided DFS' },
  { slug: 'stream-of-characters', sub: 'trie-guided DFS', why: 'Reversed trie against a reversed stream suffix.' },
  { slug: 'palindrome-pairs', sub: 'trie-guided DFS', why: 'Trie of reversed words plus palindromic-remainder bookkeeping. Hard.' },

  // --- bitwise trie (XOR) ----------------------------------------------------
  { slug: 'maximum-xor-of-two-numbers-in-an-array', sub: 'bitwise trie (XOR)', why: 'Insert 32-bit paths, then greedily walk the opposite bit. The template for this group.' },
  { slug: 'maximum-strong-pair-xor-ii', sub: 'bitwise trie (XOR)', why: 'Sliding window over a sorted array plus a trie with counts for deletion.' },
  { slug: 'maximum-xor-with-an-element-from-array', sub: 'bitwise trie (XOR)', why: 'Sort queries offline so the trie only ever grows.' },
  { slug: 'count-pairs-with-xor-in-a-range', sub: 'bitwise trie (XOR)', why: 'countLessThan(high+1) - countLessThan(low); counting on a bitwise trie.' },
  { slug: 'maximum-genetic-difference-query', sub: 'bitwise trie (XOR)', why: 'Trie built and unwound during a tree DFS. The mastery problem here.' },

  // --- counting & scoring on a trie ------------------------------------------
  { slug: 'camelcase-matching', sub: 'counting & scoring on a trie' },
  { slug: 'number-of-matching-subsequences', sub: 'counting & scoring on a trie' },
  { slug: 'sum-of-prefix-scores-of-strings', sub: 'counting & scoring on a trie', why: 'Store a visit count per node; the answer is the sum along each insert path.' },
  { slug: 'count-prefix-and-suffix-pairs-ii', sub: 'counting & scoring on a trie', why: 'Trie keyed on (prefix char, suffix char) pairs.' },

  // --- design & autocomplete -------------------------------------------------
  { slug: 'search-suggestions-system', sub: 'design & autocomplete' },
  { slug: 'implement-magic-dictionary', sub: 'design & autocomplete' },
  { slug: 'design-add-and-search-words-data-structure', sub: 'design & autocomplete', why: 'The dot wildcard turns lookup into a branching DFS.' },
  { slug: 'prefix-and-suffix-search', sub: 'design & autocomplete', why: 'Index every suffix#word combination — the trick is the key construction.' },
  { slug: 'map-sum-pairs', sub: 'design & autocomplete' },
];
