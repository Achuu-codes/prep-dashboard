'use server';

import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { items, progress, reviews, type ProgressStatus } from '@/db/schema';
import { clearReviewLadder, writeReviewLadder } from '@/lib/reviews';
import {
  advanceReview,
  scheduleFromSolve,
  scheduleImmediate,
  startOfDay,
} from '@/lib/srs';

/**
 * All progress mutations. Each one upserts the single progress row for an item,
 * so a problem placed in two topics always shows the same state.
 */

async function current(itemId: string) {
  const [row] = await db
    .select()
    .from(progress)
    .where(eq(progress.itemId, itemId))
    .limit(1);
  return row ?? null;
}

async function assertItemExists(itemId: string) {
  const [row] = await db
    .select({ id: items.id })
    .from(items)
    .where(eq(items.id, itemId))
    .limit(1);
  if (!row) throw new Error(`Unknown item: ${itemId}`);
}

function revalidate() {
  revalidatePath('/', 'layout');
}

export async function setStatus(itemId: string, status: ProgressStatus) {
  await assertItemExists(itemId);
  const existing = await current(itemId);
  const now = new Date();

  let solvedAt = existing?.solvedAt ?? null;
  let schedule: { reviewStage: number; nextReviewAt: Date | null } = {
    reviewStage: existing?.reviewStage ?? 0,
    nextReviewAt: existing?.nextReviewAt ?? null,
  };

  if (status === 'solved') {
    // Keep an existing solve date so re-marking does not reset the ladder.
    solvedAt = solvedAt ?? now;
    schedule = scheduleFromSolve(solvedAt, now);
  } else if (status === 'needs_revision') {
    schedule = scheduleImmediate(now);
  } else if (status === 'todo') {
    solvedAt = null;
    schedule = { reviewStage: 0, nextReviewAt: null };
  }

  const attempts =
    status === 'attempted'
      ? (existing?.attempts ?? 0) + 1
      : (existing?.attempts ?? 0);

  await db
    .insert(progress)
    .values({
      itemId,
      status,
      solvedAt,
      attempts,
      reviewStage: schedule.reviewStage,
      nextReviewAt: schedule.nextReviewAt,
      autoMarked: false,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: progress.itemId,
      set: {
        status,
        solvedAt,
        attempts,
        reviewStage: schedule.reviewStage,
        nextReviewAt: schedule.nextReviewAt,
        // A manual change takes ownership of the row.
        autoMarked: false,
        updatedAt: now,
      },
    });

  if (status === 'solved' && solvedAt) await writeReviewLadder(itemId, solvedAt);
  if (status === 'todo') await clearReviewLadder(itemId);

  revalidate();
}

export interface DetailsInput {
  timeTakenMin?: number | null;
  withoutHints?: boolean | null;
  notes?: string | null;
  /** ISO date (YYYY-MM-DD) from the date input. */
  solvedOn?: string | null;
}

export async function saveDetails(itemId: string, input: DetailsInput) {
  await assertItemExists(itemId);
  const existing = await current(itemId);
  const now = new Date();

  let solvedAt = existing?.solvedAt ?? null;
  if (input.solvedOn !== undefined) {
    solvedAt = input.solvedOn ? new Date(`${input.solvedOn}T12:00:00`) : null;
  }

  const status = existing?.status ?? ('attempted' as ProgressStatus);

  // Changing the solve date re-derives the ladder from the new date.
  const schedule =
    solvedAt && status === 'solved'
      ? scheduleFromSolve(solvedAt, now)
      : {
          reviewStage: existing?.reviewStage ?? 0,
          nextReviewAt: existing?.nextReviewAt ?? null,
        };

  const values = {
    itemId,
    status,
    solvedAt,
    timeTakenMin: input.timeTakenMin ?? existing?.timeTakenMin ?? null,
    withoutHints: input.withoutHints ?? existing?.withoutHints ?? null,
    notes: input.notes ?? existing?.notes ?? null,
    reviewStage: schedule.reviewStage,
    nextReviewAt: schedule.nextReviewAt,
    updatedAt: now,
  };

  await db
    .insert(progress)
    .values(values)
    .onConflictDoUpdate({ target: progress.itemId, set: values });

  if (solvedAt && status === 'solved') await writeReviewLadder(itemId, solvedAt);
  revalidate();
}

/** Marks today's revision done and moves the problem to the next rung. */
export async function completeReview(
  itemId: string,
  outcome: 'good' | 'shaky' | 'forgot',
) {
  const existing = await current(itemId);
  if (!existing) throw new Error(`No progress for item: ${itemId}`);
  const now = new Date();

  await db
    .update(reviews)
    .set({ completedAt: now, outcome })
    .where(
      and(eq(reviews.itemId, itemId), eq(reviews.stage, existing.reviewStage)),
    );

  // "Forgot" sends it back to the start of the ladder and flags it for revision.
  const next =
    outcome === 'forgot'
      ? { ...scheduleImmediate(now), status: 'needs_revision' as ProgressStatus }
      : {
          ...advanceReview(existing.solvedAt, existing.reviewStage),
          status: (outcome === 'shaky'
            ? 'needs_revision'
            : 'solved') as ProgressStatus,
        };

  await db
    .update(progress)
    .set({
      status: next.status,
      reviewStage: next.reviewStage,
      nextReviewAt: next.nextReviewAt,
      lastReviewedAt: now,
      updatedAt: now,
    })
    .where(eq(progress.itemId, itemId));

  revalidate();
}

/** Pushes a due revision out by n days without completing it. */
export async function snoozeReview(itemId: string, days = 1) {
  const existing = await current(itemId);
  if (!existing?.nextReviewAt) return;
  const from = startOfDay(new Date());
  await db
    .update(progress)
    .set({
      nextReviewAt: new Date(from.getTime() + days * 86_400_000),
      updatedAt: new Date(),
    })
    .where(eq(progress.itemId, itemId));
  revalidate();
}

export async function resetProgress(itemId: string) {
  await clearReviewLadder(itemId);
  await db.delete(progress).where(eq(progress.itemId, itemId));
  revalidate();
}
