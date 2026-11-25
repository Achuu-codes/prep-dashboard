import 'server-only';
import { and, asc, desc, eq, gte, inArray, isNull, like, lte, or, sql, type SQL } from 'drizzle-orm';
import { db } from '@/db';
import {
  items,
  placements,
  progress,
  sections,
  topics,
  type Difficulty,
  type ProgressStatus,
} from '@/db/schema';

export interface SearchFilters {
  q?: string;
  /** Topic slugs. A parent slug matches its children too. */
  topics?: string[];
  difficulty?: Difficulty[];
  status?: ProgressStatus[];
  minRating?: number;
  maxRating?: number;
  /** Include problems with no contest rating when a rating range is set. */
  includeUnrated?: boolean;
  sort?: 'curated' | 'rating' | 'rating-desc' | 'title' | 'recent';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  itemId: string;
  slug: string;
  title: string;
  url: string | null;
  difficulty: Difficulty | null;
  rating: number | null;
  isPaidOnly: boolean;
  status: ProgressStatus;
  solvedAt: Date | null;
  nextReviewAt: Date | null;
  topicTitle: string;
  topicSlug: string;
  sectionSlug: string;
  subPattern: string | null;
}

/**
 * Global problem search.
 *
 * One problem can be placed in several topics, so results are grouped by item
 * and the first (lowest curated order) placement is the one reported.
 */
export async function searchProblems(
  filters: SearchFilters,
): Promise<{ rows: SearchResult[]; total: number }> {
  const where: SQL[] = [eq(items.kind, 'problem')];

  if (filters.q?.trim()) {
    const needle = `%${filters.q.trim().toLowerCase()}%`;
    where.push(
      or(
        like(sql`lower(${items.title})`, needle),
        like(items.slug, needle),
      )!,
    );
  }
  if (filters.difficulty?.length) {
    where.push(inArray(items.difficulty, filters.difficulty));
  }
  if (filters.topics?.length) {
    // Match the topic itself or any topic whose parent is in the list.
    const slugs = filters.topics;
    where.push(
      or(
        inArray(topics.slug, slugs),
        sql`${topics.parentTopicId} in (select id from topics where slug in ${slugs})`,
      )!,
    );
  }
  if (filters.status?.length) {
    const wantsTodo = filters.status.includes('todo');
    const explicit = filters.status.filter((s) => s !== 'todo');
    const clauses: SQL[] = [];
    if (explicit.length) clauses.push(inArray(progress.status, explicit));
    // "todo" covers both an explicit todo row and no row at all.
    if (wantsTodo) {
      clauses.push(isNull(progress.status));
      clauses.push(eq(progress.status, 'todo'));
    }
    if (clauses.length) where.push(or(...clauses)!);
  }
  if (typeof filters.minRating === 'number' || typeof filters.maxRating === 'number') {
    const range: SQL[] = [];
    if (typeof filters.minRating === 'number') {
      range.push(gte(items.rating, filters.minRating));
    }
    if (typeof filters.maxRating === 'number') {
      range.push(lte(items.rating, filters.maxRating));
    }
    const inRange = and(...range)!;
    where.push(filters.includeUnrated ? or(inRange, isNull(items.rating))! : inRange);
  }

  const orderBy = {
    curated: [asc(topics.orderIndex), asc(placements.orderIndex)],
    rating: [asc(sql`coalesce(${items.rating}, 99999)`), asc(items.title)],
    'rating-desc': [desc(sql`coalesce(${items.rating}, -1)`), asc(items.title)],
    title: [asc(items.title)],
    recent: [desc(sql`coalesce(${progress.solvedAt}, 0)`), asc(items.title)],
  }[filters.sort ?? 'curated'];

  const base = db
    .select({
      itemId: items.id,
      slug: items.slug,
      title: items.title,
      url: items.url,
      difficulty: items.difficulty,
      rating: items.rating,
      isPaidOnly: items.isPaidOnly,
      status: progress.status,
      solvedAt: progress.solvedAt,
      nextReviewAt: progress.nextReviewAt,
      topicTitle: topics.title,
      topicSlug: topics.slug,
      sectionSlug: sections.slug,
      subPattern: placements.subPattern,
      placementOrder: placements.orderIndex,
    })
    .from(items)
    .innerJoin(placements, eq(placements.itemId, items.id))
    .innerJoin(topics, eq(topics.id, placements.topicId))
    .innerJoin(sections, eq(sections.id, topics.sectionId))
    .leftJoin(progress, eq(progress.itemId, items.id))
    .where(and(...where))
    .orderBy(...orderBy);

  const all = await base;

  // Collapse duplicate placements of the same problem.
  const seen = new Set<string>();
  const unique: SearchResult[] = [];
  for (const r of all) {
    if (seen.has(r.itemId)) continue;
    seen.add(r.itemId);
    unique.push({
      ...r,
      status: (r.status as ProgressStatus | null) ?? 'todo',
    });
  }

  const offset = filters.offset ?? 0;
  const limit = filters.limit ?? 100;
  return {
    rows: unique.slice(offset, offset + limit),
    total: unique.length,
  };
}

/** Flat topic list for the filter dropdown. */
export async function getTopicOptions() {
  const rows = await db
    .select({
      slug: topics.slug,
      title: topics.title,
      parentTopicId: topics.parentTopicId,
      sectionSlug: sections.slug,
      orderIndex: topics.orderIndex,
    })
    .from(topics)
    .innerJoin(sections, eq(sections.id, topics.sectionId))
    .where(eq(sections.status, 'active'))
    .orderBy(asc(topics.orderIndex));
  return rows.map((r) => ({ ...r, isChild: Boolean(r.parentTopicId) }));
}
