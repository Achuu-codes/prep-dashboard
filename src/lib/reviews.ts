import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { REVIEW_OFFSETS_DAYS, startOfDay } from './srs';

/**
 * Writes the four scheduled revision dates for a solve.
 *
 * Shared by the manual status change and the LeetCode auto-marker, so both
 * paths produce the same revision history and `completeReview` always has a
 * row to stamp.
 */
export async function writeReviewLadder(itemId: string, solvedAt: Date) {
  await db.delete(reviews).where(eq(reviews.itemId, itemId));
  const base = startOfDay(solvedAt);
  for (const [stage, days] of REVIEW_OFFSETS_DAYS.entries()) {
    await db.insert(reviews).values({
      itemId,
      stage,
      dueAt: new Date(base.getTime() + days * 86_400_000),
    });
  }
}

export async function clearReviewLadder(itemId: string) {
  await db.delete(reviews).where(eq(reviews.itemId, itemId));
}
