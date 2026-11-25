import type { ProblemSeed } from '../../types';

export const intervals: ProblemSeed[] = [
  // --- merge & insert -------------------------------------------------------
  { slug: 'merge-intervals', sub: 'merge & insert', why: 'Sort by start, extend while overlapping. The base of the whole topic.' },
  { slug: 'insert-interval', sub: 'merge & insert', why: 'Three phases: before, merging, after. No sort needed.' },
  { slug: 'remove-covered-intervals', sub: 'merge & insert', why: 'Sort by start ascending, end descending — then one pass.' },
  { slug: 'find-right-interval', sub: 'merge & insert' },
  { slug: 'data-stream-as-disjoint-intervals', sub: 'merge & insert', why: 'Ordered map keyed by start, merge with both neighbours on insert.' },

  // --- sweep line -----------------------------------------------------------
  { slug: 'car-pooling', sub: 'sweep line', why: 'Events on a small coordinate range collapse to a difference array.' },
  { slug: 'count-days-without-meetings', sub: 'sweep line' },
  { slug: 'describe-the-painting', sub: 'sweep line' },
  { slug: 'divide-intervals-into-minimum-number-of-groups', sub: 'sweep line', why: 'The answer is the maximum overlap depth — a sweep, not a graph colouring.' },
  { slug: 'my-calendar-iii', sub: 'sweep line' },
  { slug: 'number-of-flowers-in-full-bloom', sub: 'sweep line', why: 'Sort starts and ends separately, then binary search each query.' },
  { slug: 'the-skyline-problem', sub: 'sweep line', why: 'Events plus a multiset of active heights. The reference sweep-line problem.' },
  { slug: 'range-module', sub: 'sweep line' },

  // --- minimum resources ----------------------------------------------------
  { slug: 'meeting-rooms-iii', sub: 'minimum resources' },
  { slug: 'minimum-number-of-arrows-to-burst-balloons', sub: 'minimum resources', why: 'Sort by end, shoot at the earliest end. Interval-point cover.' },

  // --- scheduling greedy ----------------------------------------------------
  { slug: 'non-overlapping-intervals', sub: 'scheduling greedy', why: 'Keep the interval that ends earliest — the exchange argument to be able to state.' },
  { slug: 'partition-labels', sub: 'scheduling greedy', why: 'Last-occurrence index turns characters into intervals.' },
  { slug: 'video-stitching', sub: 'scheduling greedy', why: 'Jump-game greedy in interval clothing.' },
  { slug: 'two-best-non-overlapping-events', sub: 'scheduling greedy' },
  { slug: 'maximum-number-of-events-that-can-be-attended', sub: 'scheduling greedy' },
  { slug: 'minimum-number-of-taps-to-open-to-water-a-garden', sub: 'scheduling greedy', why: 'Minimum interval cover; reduce to jump-game-ii.' },
  { slug: 'maximum-profit-in-job-scheduling', sub: 'scheduling greedy', why: 'Weighted interval scheduling: sort by end, DP with binary search.' },
  { slug: 'set-intersection-size-at-least-two', sub: 'scheduling greedy', why: 'Greedy on sorted ends, keeping the two largest chosen points. Mastery problem.' },

  // --- intersection ---------------------------------------------------------
  { slug: 'interval-list-intersections', sub: 'intersection', why: 'Overlap is [max(start), min(end)]; advance the one that ends first.' },
  { slug: 'my-calendar-i', sub: 'intersection' },
  { slug: 'my-calendar-ii', sub: 'intersection', why: 'Track the single-booked and double-booked sets separately.' },
];
