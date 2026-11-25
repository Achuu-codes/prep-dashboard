import 'server-only';
import { and, asc, eq, inArray, isNotNull, sql } from 'drizzle-orm';
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

export interface TopicNode {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  noteSlug: string | null;
  parentTopicId: string | null;
  subPatterns: string[];
  children: TopicNode[];
}

export interface SectionNode {
  id: string;
  slug: string;
  title: string;
  kind: string;
  description: string | null;
  status: 'active' | 'soon';
  topics: TopicNode[];
}

function subPatternsOf(meta: unknown): string[] {
  if (meta && typeof meta === 'object' && 'subPatterns' in meta) {
    const value = (meta as { subPatterns?: unknown }).subPatterns;
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  }
  return [];
}

/** The whole nav tree, in one pass. Cheap enough to call per request. */
export async function getNav(): Promise<SectionNode[]> {
  const [sectionRows, topicRows] = await Promise.all([
    db.select().from(sections).orderBy(asc(sections.orderIndex)),
    db.select().from(topics).orderBy(asc(topics.orderIndex)),
  ]);

  const byId = new Map<string, TopicNode>();
  for (const t of topicRows) {
    byId.set(t.id, {
      id: t.id,
      slug: t.slug,
      title: t.title,
      summary: t.summary,
      noteSlug: t.noteSlug,
      parentTopicId: t.parentTopicId,
      subPatterns: subPatternsOf(t.meta),
      children: [],
    });
  }

  const roots = new Map<string, TopicNode[]>();
  for (const t of topicRows) {
    const node = byId.get(t.id)!;
    if (t.parentTopicId) {
      byId.get(t.parentTopicId)?.children.push(node);
    } else {
      const list = roots.get(t.sectionId) ?? [];
      list.push(node);
      roots.set(t.sectionId, list);
    }
  }

  return sectionRows.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    kind: s.kind,
    description: s.description,
    status: s.status,
    topics: roots.get(s.id) ?? [],
  }));
}

/* --------------------------------------------------------------- progress */

export interface TopicStats {
  topicId: string;
  total: number;
  solved: number;
  attempted: number;
  needsRevision: number;
  due: number;
}

const EMPTY_STATS = (topicId: string): TopicStats => ({
  topicId,
  total: 0,
  solved: 0,
  attempted: 0,
  needsRevision: 0,
  due: 0,
});

/**
 * Per-topic counts, computed in one grouped query.
 *
 * Only leaf topics own placements; parents are rolled up by the caller via
 * `rollUp`, so a grouping node like "dp" shows the sum of its subpages.
 */
export async function getTopicStats(
  endOfToday: Date = new Date(),
): Promise<Map<string, TopicStats>> {
  const rows = await db
    .select({
      topicId: placements.topicId,
      total: sql<number>`count(*)`,
      solved: sql<number>`sum(case when ${progress.status} = 'solved' then 1 else 0 end)`,
      attempted: sql<number>`sum(case when ${progress.status} = 'attempted' then 1 else 0 end)`,
      needsRevision: sql<number>`sum(case when ${progress.status} = 'needs_revision' then 1 else 0 end)`,
      due: sql<number>`sum(case when ${progress.nextReviewAt} is not null and ${progress.nextReviewAt} <= ${endOfToday.getTime()} then 1 else 0 end)`,
    })
    .from(placements)
    .leftJoin(progress, eq(progress.itemId, placements.itemId))
    .groupBy(placements.topicId);

  const map = new Map<string, TopicStats>();
  for (const r of rows) {
    map.set(r.topicId, {
      topicId: r.topicId,
      total: Number(r.total) || 0,
      solved: Number(r.solved) || 0,
      attempted: Number(r.attempted) || 0,
      needsRevision: Number(r.needsRevision) || 0,
      due: Number(r.due) || 0,
    });
  }
  return map;
}

/** Sums a topic's own stats with every descendant's. */
export function rollUp(
  topic: TopicNode,
  stats: Map<string, TopicStats>,
): TopicStats {
  const own = stats.get(topic.id) ?? EMPTY_STATS(topic.id);
  if (topic.children.length === 0) return own;
  return topic.children.reduce<TopicStats>(
    (acc, child) => {
      const c = rollUp(child, stats);
      return {
        topicId: topic.id,
        total: acc.total + c.total,
        solved: acc.solved + c.solved,
        attempted: acc.attempted + c.attempted,
        needsRevision: acc.needsRevision + c.needsRevision,
        due: acc.due + c.due,
      };
    },
    { ...own, topicId: topic.id },
  );
}

/* ------------------------------------------------------------ topic detail */

export interface ProblemRow {
  itemId: string;
  slug: string;
  title: string;
  url: string | null;
  externalId: string | null;
  difficulty: Difficulty | null;
  rating: number | null;
  isPaidOnly: boolean;
  subPattern: string | null;
  orderIndex: number;
  note: string | null;
  status: ProgressStatus;
  solvedAt: Date | null;
  timeTakenMin: number | null;
  withoutHints: boolean | null;
  notes: string | null;
  attempts: number;
  reviewStage: number;
  nextReviewAt: Date | null;
  autoMarked: boolean;
}

const problemSelection = {
  itemId: items.id,
  slug: items.slug,
  title: items.title,
  url: items.url,
  externalId: items.externalId,
  difficulty: items.difficulty,
  rating: items.rating,
  isPaidOnly: items.isPaidOnly,
  subPattern: placements.subPattern,
  orderIndex: placements.orderIndex,
  note: placements.note,
  status: progress.status,
  solvedAt: progress.solvedAt,
  timeTakenMin: progress.timeTakenMin,
  withoutHints: progress.withoutHints,
  notes: progress.notes,
  attempts: progress.attempts,
  reviewStage: progress.reviewStage,
  nextReviewAt: progress.nextReviewAt,
  autoMarked: progress.autoMarked,
} as const;

/**
 * Left joins make every progress column nullable. This fills in the defaults
 * a problem with no progress row should show.
 */
function normaliseRow(r: Record<string, unknown>): ProblemRow {
  return {
    ...(r as unknown as ProblemRow),
    status: (r.status as ProgressStatus | null) ?? 'todo',
    attempts: Number(r.attempts ?? 0),
    reviewStage: Number(r.reviewStage ?? 0),
    autoMarked: Boolean(r.autoMarked),
  };
}

export async function getTopicBySlug(sectionSlug: string, topicSlug: string) {
  const [row] = await db
    .select({
      id: topics.id,
      slug: topics.slug,
      title: topics.title,
      summary: topics.summary,
      noteSlug: topics.noteSlug,
      parentTopicId: topics.parentTopicId,
      meta: topics.meta,
      sectionSlug: sections.slug,
      sectionTitle: sections.title,
      sectionId: sections.id,
    })
    .from(topics)
    .innerJoin(sections, eq(sections.id, topics.sectionId))
    .where(and(eq(sections.slug, sectionSlug), eq(topics.slug, topicSlug)))
    .limit(1);
  if (!row) return null;
  return { ...row, subPatterns: subPatternsOf(row.meta) };
}

/** Every problem placed in a topic, with its progress, in curated order. */
export async function getTopicProblems(topicId: string): Promise<ProblemRow[]> {
  const rows = await db
    .select(problemSelection)
    .from(placements)
    .innerJoin(items, eq(items.id, placements.itemId))
    .leftJoin(progress, eq(progress.itemId, placements.itemId))
    .where(eq(placements.topicId, topicId))
    .orderBy(asc(placements.orderIndex));
  return rows.map(normaliseRow);
}

/** Groups a topic's problems by sub-pattern, in the topic's declared order. */
export function groupBySubPattern(
  rows: ProblemRow[],
  declared: string[],
): Array<{ sub: string; problems: ProblemRow[] }> {
  const groups = new Map<string, ProblemRow[]>();
  for (const row of rows) {
    const key = row.subPattern ?? 'Other';
    const list = groups.get(key) ?? [];
    list.push(row);
    groups.set(key, list);
  }
  const ordered: Array<{ sub: string; problems: ProblemRow[] }> = [];
  for (const sub of declared) {
    const problems = groups.get(sub);
    if (problems?.length) {
      ordered.push({ sub, problems });
      groups.delete(sub);
    }
  }
  for (const [sub, problems] of groups) ordered.push({ sub, problems });
  return ordered;
}

/* ------------------------------------------------------------- revise today */

export interface DueProblem extends ProblemRow {
  topicTitle: string;
  topicSlug: string;
  sectionSlug: string;
  daysOverdue: number;
}

/** Problems whose next revision date has arrived, across every topic. */
export async function getDueProblems(
  endOfToday: Date,
  startOfToday: Date,
): Promise<DueProblem[]> {
  const rows = await db
    .select({
      ...problemSelection,
      topicTitle: topics.title,
      topicSlug: topics.slug,
      sectionSlug: sections.slug,
    })
    .from(progress)
    .innerJoin(items, eq(items.id, progress.itemId))
    .innerJoin(placements, eq(placements.itemId, items.id))
    .innerJoin(topics, eq(topics.id, placements.topicId))
    .innerJoin(sections, eq(sections.id, topics.sectionId))
    .where(
      and(
        isNotNull(progress.nextReviewAt),
        sql`${progress.nextReviewAt} <= ${endOfToday.getTime()}`,
      ),
    )
    .orderBy(asc(progress.nextReviewAt), asc(items.rating));

  // A problem placed in two topics would appear twice; keep the first.
  const seen = new Set<string>();
  const out: DueProblem[] = [];
  for (const r of rows) {
    if (seen.has(r.itemId)) continue;
    seen.add(r.itemId);
    const row = normaliseRow(r) as DueProblem;
    row.topicTitle = r.topicTitle;
    row.topicSlug = r.topicSlug;
    row.sectionSlug = r.sectionSlug;
    row.daysOverdue = r.nextReviewAt
      ? Math.max(
          0,
          Math.round(
            (startOfToday.getTime() - new Date(r.nextReviewAt).setHours(0, 0, 0, 0)) /
              86_400_000,
          ),
        )
      : 0;
    out.push(row);
  }
  return out;
}

/** Count only — for the dashboard tile and the nav badge. */
export async function countDue(endOfToday: Date): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(distinct ${progress.itemId})` })
    .from(progress)
    .where(
      and(
        isNotNull(progress.nextReviewAt),
        sql`${progress.nextReviewAt} <= ${endOfToday.getTime()}`,
      ),
    );
  return Number(row?.n ?? 0);
}

/* ------------------------------------------------------------------ lookups */

/** Maps LeetCode titleSlugs to tracked item ids, for the auto-marker. */
export async function findTrackedItemsBySlugs(
  slugs: string[],
): Promise<Map<string, string>> {
  if (slugs.length === 0) return new Map();
  const out = new Map<string, string>();
  // Chunked to stay well under SQLite's variable limit.
  for (let i = 0; i < slugs.length; i += 400) {
    const rows = await db
      .select({ id: items.id, slug: items.slug })
      .from(items)
      .where(and(eq(items.kind, 'problem'), inArray(items.slug, slugs.slice(i, i + 400))));
    for (const r of rows) out.set(r.slug, r.id);
  }
  return out;
}
