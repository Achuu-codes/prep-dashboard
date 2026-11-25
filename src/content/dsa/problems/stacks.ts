import type { ProblemSeed } from '../../types';

export const stacks: ProblemSeed[] = [
  // --- stack simulation ----------------------------------------------------
  { slug: 'evaluate-reverse-polish-notation', sub: 'stack simulation' },
  { slug: 'simplify-path', sub: 'stack simulation' },
  { slug: 'asteroid-collision', sub: 'stack simulation', why: 'The "keep popping while it still collides" loop is the shape to recognise.' },
  { slug: 'remove-all-adjacent-duplicates-in-string-ii', sub: 'stack simulation', why: 'Stack of (char, count) pairs.' },
  { slug: 'decode-string', sub: 'stack simulation', why: 'Two stacks, or one stack of frames. Nesting is the point.' },
  { slug: 'validate-stack-sequences', sub: 'stack simulation' },
  { slug: 'exclusive-time-of-functions', sub: 'stack simulation' },

  // --- next greater / smaller ----------------------------------------------
  { slug: 'daily-temperatures', sub: 'next greater / smaller', why: 'The monotonic-stack template, in its clearest form.' },
  { slug: 'next-greater-element-ii', sub: 'next greater / smaller', why: 'Circular: run two passes over the doubled index space.' },
  { slug: 'next-greater-node-in-linked-list', sub: 'next greater / smaller' },
  { slug: 'online-stock-span', sub: 'next greater / smaller', why: 'Previous-greater, maintained incrementally.' },
  { slug: 'number-of-visible-people-in-a-queue', sub: 'next greater / smaller' },

  // --- histogram & rectangles ----------------------------------------------
  { slug: 'largest-rectangle-in-histogram', sub: 'histogram & rectangles', why: 'The one to be fluent in. Sentinel bars remove all the edge cases.' },
  { slug: 'maximal-rectangle', sub: 'histogram & rectangles', why: 'Row-by-row heights, then the histogram routine per row.' },
  { slug: 'maximum-subarray-min-product', sub: 'histogram & rectangles', why: 'Span from the monotonic stack times a prefix sum.' },

  // --- expression parsing ---------------------------------------------------
  { slug: 'basic-calculator-ii', sub: 'expression parsing', why: 'Precedence without parentheses: keep a last-term register.' },
  { slug: 'basic-calculator', sub: 'expression parsing', why: 'Parentheses with sign stack. Nail the sign handling.' },
  { slug: 'parsing-a-boolean-expression', sub: 'expression parsing' },
  { slug: 'number-of-atoms', sub: 'expression parsing' },

  // --- stack with extra state ----------------------------------------------
  { slug: 'min-stack', sub: 'stack with extra state', why: 'Pair each element with the running minimum.' },
  { slug: '132-pattern', sub: 'stack with extra state', why: 'Scan right to left keeping a candidate "2"; subtle but short.' },
  { slug: 'remove-k-digits', sub: 'stack with extra state', why: 'Greedy monotonic build — pop while the top is larger and budget remains.' },
  { slug: 'remove-duplicate-letters', sub: 'stack with extra state', why: 'Same greedy plus a "can I see this letter again" guard.' },
  { slug: 'find-the-most-competitive-subsequence', sub: 'stack with extra state' },
  { slug: 'car-fleet', sub: 'stack with extra state', why: 'Sort by position descending; a car joins the fleet ahead or starts its own.' },
  { slug: 'minimum-cost-tree-from-leaf-values', sub: 'stack with extra state' },
  { slug: 'maximum-frequency-stack', sub: 'stack with extra state', why: 'Stack per frequency level.' },
  { slug: 'dinner-plate-stacks', sub: 'stack with extra state' },

  // --- contribution counting ------------------------------------------------
  { slug: 'sum-of-subarray-ranges', sub: 'contribution counting', why: 'Sum of maxima minus sum of minima — two passes of the same routine.' },
  { slug: 'sum-of-subarray-minimums', sub: 'contribution counting', why: 'Count the subarrays each element dominates. Strict/non-strict on one side only, or you double count.' },
  { slug: 'subarray-with-elements-greater-than-varying-threshold', sub: 'contribution counting' },
  { slug: 'sum-of-total-strength-of-wizards', sub: 'contribution counting', why: 'Monotonic stack span combined with prefix-of-prefix sums.' },
];
