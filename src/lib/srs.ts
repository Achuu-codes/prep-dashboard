/**
 * Spaced revision.
 *
 * A solved problem resurfaces 3, 7, 21 and 60 days *after the solve date*
 * (offsets are absolute, not chained, so a late review does not push the whole
 * ladder back). After the last stage the problem leaves the queue unless it is
 * explicitly marked "needs revision", which puts it back immediately.
 *
 * Pure module: no DB, no env, safe to import from client components.
 */
export const REVIEW_OFFSETS_DAYS = [3, 7, 21, 60] as const;
export const FINAL_STAGE = REVIEW_OFFSETS_DAYS.length;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Start of day, so "due today" means the whole day, not a precise instant. */
export function startOfDay(d: Date = new Date()): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

export function endOfDay(d: Date = new Date()): Date {
  const out = new Date(d);
  out.setHours(23, 59, 59, 999);
  return out;
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * DAY_MS);
}

/** All four revision dates for a solve, for display on the problem row. */
export function reviewLadder(solvedAt: Date): Date[] {
  return REVIEW_OFFSETS_DAYS.map((days) => addDays(startOfDay(solvedAt), days));
}

export interface ReviewState {
  reviewStage: number;
  nextReviewAt: Date | null;
}

/**
 * Schedule after a fresh solve. Skips any offset already in the past, so
 * back-dating a solve from three weeks ago lands on the right rung instead of
 * queueing three overdue reviews.
 */
export function scheduleFromSolve(
  solvedAt: Date,
  now: Date = new Date(),
): ReviewState {
  const ladder = reviewLadder(solvedAt);
  const today = startOfDay(now);
  const stage = ladder.findIndex((due) => due.getTime() >= today.getTime());
  if (stage === -1) {
    // Every window has elapsed: nothing left to schedule.
    return { reviewStage: FINAL_STAGE, nextReviewAt: null };
  }
  return { reviewStage: stage, nextReviewAt: ladder[stage] };
}

/** Advance one rung after a completed review. */
export function advanceReview(
  solvedAt: Date | null,
  currentStage: number,
): ReviewState {
  const next = currentStage + 1;
  if (!solvedAt || next >= FINAL_STAGE) {
    return { reviewStage: FINAL_STAGE, nextReviewAt: null };
  }
  return {
    reviewStage: next,
    nextReviewAt: addDays(startOfDay(solvedAt), REVIEW_OFFSETS_DAYS[next]),
  };
}

/** "Needs revision" pulls a problem back into today's queue. */
export function scheduleImmediate(now: Date = new Date()): ReviewState {
  return { reviewStage: 0, nextReviewAt: startOfDay(now) };
}

export function isDue(
  nextReviewAt: Date | null,
  now: Date = new Date(),
): boolean {
  if (!nextReviewAt) return false;
  return nextReviewAt.getTime() <= endOfDay(now).getTime();
}

/** Negative = overdue by N days, 0 = today, positive = upcoming. */
export function daysUntil(
  nextReviewAt: Date | null,
  now: Date = new Date(),
): number | null {
  if (!nextReviewAt) return null;
  return Math.round(
    (startOfDay(nextReviewAt).getTime() - startOfDay(now).getTime()) / DAY_MS,
  );
}
