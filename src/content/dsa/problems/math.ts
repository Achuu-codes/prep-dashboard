import type { ProblemSeed } from '../../types';

export const math: ProblemSeed[] = [
  // --- gcd & divisibility ---------------------------------------------------
  { slug: 'water-and-jug-problem', sub: 'gcd & divisibility', why: 'Bezout: reachable iff target is a multiple of gcd(x, y).' },
  { slug: 'ugly-number-iii', sub: 'gcd & divisibility', why: 'Inclusion-exclusion with lcm, inside a binary search.' },
  { slug: 'minimize-the-maximum-value-of-gcd-connected-array', sub: 'gcd & divisibility' },
  { slug: 'replace-non-coprime-numbers-in-array', sub: 'gcd & divisibility', why: 'Stack plus gcd; merging cascades backwards.' },
  { slug: 'check-if-point-is-reachable', sub: 'gcd & divisibility', why: 'Reduces to "is gcd a power of two". Proving it is the work.' },
  { slug: 'number-of-different-subsequences-gcds', sub: 'gcd & divisibility', why: 'Test each candidate divisor against its multiples — harmonic complexity.' },

  // --- primes & sieve -------------------------------------------------------
  { slug: 'count-primes', sub: 'primes & sieve', why: 'Sieve of Eratosthenes; start the inner loop at i*i.' },
  { slug: 'four-divisors', sub: 'primes & sieve' },
  { slug: 'closest-prime-numbers-in-range', sub: 'primes & sieve' },
  { slug: 'prime-subtraction-operation', sub: 'primes & sieve' },
  { slug: 'distinct-prime-factors-of-product-of-array', sub: 'primes & sieve', why: 'Smallest-prime-factor sieve for O(log n) factorisation.' },
  { slug: 'smallest-value-after-replacing-with-sum-of-prime-factors', sub: 'primes & sieve' },
  { slug: 'largest-component-size-by-common-factor', sub: 'primes & sieve', why: 'Factorise, then union each number with its primes.' },

  // --- modular arithmetic ---------------------------------------------------
  { slug: 'powx-n', sub: 'modular arithmetic', why: 'Fast exponentiation; handle a negative n without overflowing.' },
  { slug: 'count-good-numbers', sub: 'modular arithmetic' },
  { slug: 'super-pow', sub: 'modular arithmetic', why: 'Exponent given as a digit array — Euler/CRT not needed, just recursion.' },
  { slug: 'the-number-of-good-subsets', sub: 'modular arithmetic', why: 'Squarefree masks over the first 10 primes plus modular counting.' },
  { slug: 'fancy-sequence', sub: 'modular arithmetic', why: 'Lazy affine transform with a modular inverse. The mastery problem here.' },

  // --- combinatorics & counting ---------------------------------------------
  { slug: 'count-sorted-vowel-strings', sub: 'combinatorics & counting' },
  { slug: 'number-of-sets-of-k-non-overlapping-line-segments', sub: 'combinatorics & counting', why: 'Stars and bars after the right reframing.' },
  { slug: 'count-all-valid-pickup-and-delivery-options', sub: 'combinatorics & counting' },
  { slug: 'count-anagrams', sub: 'combinatorics & counting', why: 'Multinomial coefficients with modular inverse factorials.' },
  { slug: 'number-of-music-playlists', sub: 'combinatorics & counting', why: 'Two-dimensional counting DP; the k-constraint sets the transition.' },

  // --- digits & bases -------------------------------------------------------
  { slug: 'integer-to-roman', sub: 'digits & bases' },
  { slug: 'multiply-strings', sub: 'digits & bases', why: 'Schoolbook multiplication into an (n+m) digit buffer.' },
  { slug: 'maximum-swap', sub: 'digits & bases' },
  { slug: 'next-greater-element-iii', sub: 'digits & bases', why: 'next_permutation on digits, plus an overflow check.' },

  // --- geometry & probability -----------------------------------------------
  { slug: 'valid-square', sub: 'geometry & probability', why: 'Compare the six squared distances; avoid floating point entirely.' },
  { slug: 'implement-rand10-using-rand7', sub: 'geometry & probability', why: 'Rejection sampling; be ready to state the expected number of calls.' },
  { slug: 'random-point-in-non-overlapping-rectangles', sub: 'geometry & probability', why: 'Weighted prefix sums plus binary search.' },
  { slug: 'new-21-game', sub: 'geometry & probability', why: 'Probability DP with a sliding-window sum.' },
  { slug: 'soup-servings', sub: 'geometry & probability', why: 'Memoised probability with the "large n converges to 1" shortcut.' },
  { slug: 'max-points-on-a-line', sub: 'geometry & probability', why: 'Normalised slope as a map key — use a reduced fraction, not a double.' },
  { slug: 'erect-the-fence', sub: 'geometry & probability', why: 'Convex hull (Andrew monotone chain). Worth writing once.' },
];
