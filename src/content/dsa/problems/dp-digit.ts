import type { ProblemSeed } from '../../types';

/**
 * Digit DP has a small but very consistent problem set on LeetCode. Almost
 * every one is the same memoised walk over (position, tight, started, extra);
 * the differences are only in `extra`.
 */
export const dpDigit: ProblemSeed[] = [
  // --- count under a bound --------------------------------------------------
  { slug: 'count-numbers-with-unique-digits', sub: 'count under a bound', why: 'Combinatorics by length first; then redo it as digit DP to learn the frame.' },
  { slug: 'rotated-digits', sub: 'count under a bound', why: 'Per-digit classification with a "has at least one rotating digit" flag.' },
  { slug: 'numbers-with-same-consecutive-differences', sub: 'count under a bound' },
  { slug: 'numbers-at-most-n-given-digit-set', sub: 'count under a bound', why: 'The clearest tight/loose split in the whole family.' },

  // --- tight & leading-zero state -------------------------------------------
  { slug: 'count-special-integers', sub: 'tight & leading-zero state', why: 'Mask of used digits plus tight plus started — the canonical four-piece state.' },
  { slug: 'numbers-with-repeated-digits', sub: 'tight & leading-zero state', why: 'Count the complement; counting "has a repeat" directly is much harder.' },
  { slug: 'number-of-digit-one', sub: 'tight & leading-zero state', why: 'Classic positional counting; also doable in closed form per power of ten.' },

  // --- digit DP + combinatorics ---------------------------------------------
  { slug: 'non-negative-integers-without-consecutive-ones', sub: 'digit DP + combinatorics', why: 'Digit DP in base 2, with Fibonacci counts for the loose suffixes.' },
  { slug: 'count-of-integers', sub: 'digit DP + combinatorics', why: 'Digit-sum bounds, answered as f(high) - f(low - 1).' },
  { slug: 'count-the-number-of-powerful-integers', sub: 'digit DP + combinatorics', why: 'A forced suffix plus a digit cap. The mastery problem for this page.' },
];
