import type { ProblemSeed } from '../../types';

/**
 * The templates (prefix function, Z-function, rolling hash) live in the
 * revision note; these problems are all Medium or Hard, which is where these
 * algorithms actually earn their keep.
 */
export const strings: ProblemSeed[] = [
  // --- prefix function (KMP) ------------------------------------------------
  { slug: 'longest-happy-prefix', sub: 'prefix function (KMP)', why: 'Literally "return pi[n-1]". The purest prefix-function problem on the site.' },
  { slug: 'shortest-palindrome', sub: 'prefix function (KMP)', why: 'Run the prefix function on s + "#" + reverse(s).' },
  { slug: 'count-prefix-and-suffix-pairs-ii', sub: 'prefix function (KMP)' },
  { slug: 'find-the-occurrence-of-first-almost-equal-substring', sub: 'prefix function (KMP)', why: 'Z-function or prefix function from both ends, then combine at each offset.' },

  // --- Z-function -----------------------------------------------------------
  { slug: 'sum-of-scores-of-built-strings', sub: 'Z-function', why: 'The answer is the sum of the Z array. Learn Z here.' },
  { slug: 'minimum-time-to-revert-word-to-initial-state-ii', sub: 'Z-function', why: 'Find every k-multiple offset where a prefix matches a suffix.' },
  { slug: 'longest-chunked-palindrome-decomposition', sub: 'Z-function', why: 'Greedy matching from both ends; hashing or Z both work.' },

  // --- rolling hash ---------------------------------------------------------
  { slug: 'repeated-dna-sequences', sub: 'rolling hash', why: 'Fixed-width rolling hash, or just a set of 10-char substrings.' },
  { slug: 'find-substring-with-given-hash-value', sub: 'rolling hash', why: 'Roll backwards to avoid a modular inverse.' },
  { slug: 'distinct-echo-substrings', sub: 'rolling hash' },
  { slug: 'longest-duplicate-substring', sub: 'rolling hash', why: 'Binary search the length, Rabin-Karp to check. The reference problem.' },
  { slug: 'longest-common-subpath', sub: 'rolling hash', why: 'Binary search plus hashing across many arrays. Collision handling matters.' },

  // --- palindromic structure ------------------------------------------------
  { slug: 'longest-palindromic-substring', sub: 'palindromic structure', why: 'Centre expansion in O(n^2); Manacher if you want O(n).' },
  { slug: 'palindrome-partitioning-iv', sub: 'palindromic structure' },
  { slug: 'palindrome-pairs', sub: 'palindromic structure' },
  { slug: 'maximum-product-of-the-length-of-two-palindromic-substrings', sub: 'palindromic structure', why: 'Needs Manacher plus prefix maxima. The hardest string problem here.' },

  // --- periodicity & borders ------------------------------------------------
  { slug: 'smallest-rotation-with-highest-score', sub: 'periodicity & borders', why: 'Difference array over rotation offsets.' },
  { slug: 'minimum-time-to-revert-word-to-initial-state-i', sub: 'periodicity & borders', why: 'n % (n - pi[n-1]) == 0 is the border-period identity; this is its Medium form.' },
];
