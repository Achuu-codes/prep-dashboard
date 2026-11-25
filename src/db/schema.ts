/**
 * Generic content model: Section -> Topic -> Subtopic -> Item.
 *
 * Only DSA is populated in this phase, but LLD, CS Fundamentals, Code
 * Comprehension and Applications plug in by inserting rows into `sections` /
 * `topics` and using a different `items.kind` + `items.meta` payload. No
 * schema migration is required to add them.
 *
 * Progress lives in its own table (`progress`), keyed by item, so content can
 * be re-seeded freely without touching anything the user typed.
 *
 * Dialect note: written in sqlite-core, which serves both a local file and
 * Turso. See README "Swapping the database".
 */
import { relations, sql } from 'drizzle-orm';
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const SECTION_KINDS = [
  'dsa',
  'lld',
  'cs-fundamentals',
  'code-comprehension',
  'applications',
] as const;
export type SectionKind = (typeof SECTION_KINDS)[number];

export const ITEM_KINDS = [
  'problem', // DSA: a LeetCode problem
  'note', // any section: a prose item
  'question', // CS fundamentals / comprehension: a Q&A item
  'design', // LLD: a design prompt
  'snippet', // code comprehension: a code-reading exercise
  'application', // applications tracker: one job application
] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];

export const PROGRESS_STATUSES = [
  'todo',
  'attempted',
  'solved',
  'needs_revision',
] as const;
export type ProgressStatus = (typeof PROGRESS_STATUSES)[number];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/* ------------------------------------------------------------------ content */

export const sections = sqliteTable(
  'sections',
  {
    id: text('id').primaryKey(), // stable slug-ish id, e.g. "dsa"
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    kind: text('kind', { enum: SECTION_KINDS }).notNull(),
    description: text('description'),
    /** 'active' renders; 'soon' renders a coming-soon placeholder. */
    status: text('status', { enum: ['active', 'soon'] })
      .notNull()
      .default('soon'),
    orderIndex: integer('order_index').notNull().default(0),
  },
  (t) => [uniqueIndex('sections_slug_idx').on(t.slug)],
);

export const topics = sqliteTable(
  'topics',
  {
    id: text('id').primaryKey(), // e.g. "dsa:binary-search"
    sectionId: text('section_id')
      .notNull()
      .references(() => sections.id, { onDelete: 'cascade' }),
    /** Self-reference: a non-null parent makes this row a subtopic. */
    parentTopicId: text('parent_topic_id'),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary'),
    /** Basename of the MDX revision note in /content/<section>/. */
    noteSlug: text('note_slug'),
    orderIndex: integer('order_index').notNull().default(0),
    meta: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
  },
  (t) => [
    uniqueIndex('topics_section_slug_idx').on(t.sectionId, t.slug),
    index('topics_parent_idx').on(t.parentTopicId),
  ],
);

/**
 * The content catalogue. An item exists once, globally, identified by
 * (kind, slug) — so one LeetCode problem is one row no matter how many topics
 * teach it, and therefore has exactly one progress row.
 *
 * Where an item appears in the curriculum is `placements`, below.
 */
export const items = sqliteTable(
  'items',
  {
    id: text('id').primaryKey(), // e.g. "problem:trapping-rain-water"
    kind: text('kind', { enum: ITEM_KINDS }).notNull().default('problem'),
    /** For problems: the LeetCode titleSlug. */
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    url: text('url'),
    /** Problem-specific columns, nullable so other kinds can ignore them. */
    externalId: text('external_id'), // questionFrontendId
    difficulty: text('difficulty', { enum: DIFFICULTIES }),
    rating: real('rating'), // zerotrac contest rating
    isPaidOnly: integer('is_paid_only', { mode: 'boolean' })
      .notNull()
      .default(false),
    /** Set when the slug was confirmed to resolve against LeetCode. */
    validatedAt: integer('validated_at', { mode: 'timestamp_ms' }),
    /** Section-specific extras; keeps LLD/CS/etc. from needing new columns. */
    meta: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
  },
  (t) => [
    uniqueIndex('items_kind_slug_idx').on(t.kind, t.slug),
    index('items_difficulty_idx').on(t.difficulty),
    index('items_rating_idx').on(t.rating),
  ],
);

/**
 * Curriculum placement: this item appears in this topic, under this
 * sub-pattern, at this position.
 *
 * Separating this from `items` is what lets one problem be taught in two
 * topics (Number of Islands under both BFS/DFS and Union-Find) while still
 * having a single status, a single notes field and a single revision schedule.
 */
export const placements = sqliteTable(
  'placements',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    topicId: text('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    itemId: text('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    /** Sub-pattern grouping inside the topic, e.g. "binary search on answer". */
    subPattern: text('sub_pattern'),
    /** Ordering within the topic: "solid" first, "mastery" last. */
    orderIndex: integer('order_index').notNull().default(0),
    /** Optional one-line reason this problem is on this topic's list. */
    note: text('note'),
  },
  (t) => [
    uniqueIndex('placements_topic_item_idx').on(t.topicId, t.itemId),
    index('placements_topic_idx').on(t.topicId, t.orderIndex),
    index('placements_item_idx').on(t.itemId),
  ],
);

/* ----------------------------------------------------------------- progress */

export const progress = sqliteTable(
  'progress',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    itemId: text('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    status: text('status', { enum: PROGRESS_STATUSES })
      .notNull()
      .default('todo'),
    solvedAt: integer('solved_at', { mode: 'timestamp_ms' }),
    timeTakenMin: integer('time_taken_min'),
    withoutHints: integer('without_hints', { mode: 'boolean' }),
    /** Personal notes, markdown. */
    notes: text('notes'),
    attempts: integer('attempts').notNull().default(0),
    /** Spaced revision: stage index into REVIEW_OFFSETS_DAYS (3/7/21/60). */
    reviewStage: integer('review_stage').notNull().default(0),
    lastReviewedAt: integer('last_reviewed_at', { mode: 'timestamp_ms' }),
    nextReviewAt: integer('next_review_at', { mode: 'timestamp_ms' }),
    /** True when a LeetCode sync flipped this to solved, not the user. */
    autoMarked: integer('auto_marked', { mode: 'boolean' })
      .notNull()
      .default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => [
    uniqueIndex('progress_item_idx').on(t.itemId),
    index('progress_status_idx').on(t.status),
    index('progress_next_review_idx').on(t.nextReviewAt),
  ],
);

/** Append-only log of the spaced-revision schedule, for history and charts. */
export const reviews = sqliteTable(
  'reviews',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    itemId: text('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    stage: integer('stage').notNull(),
    dueAt: integer('due_at', { mode: 'timestamp_ms' }).notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
    outcome: text('outcome', { enum: ['good', 'shaky', 'forgot'] }),
  },
  (t) => [
    index('reviews_due_idx').on(t.dueAt),
    uniqueIndex('reviews_item_stage_idx').on(t.itemId, t.stage),
  ],
);

/* -------------------------------------------------------- integrations ---- */

/**
 * Every successful fetch is stored whole. Two jobs:
 *  - charting rating / solved counts over time
 *  - serving the last good payload with a "stale since ..." note when the
 *    upstream API fails or changes shape.
 */
export const snapshots = sqliteTable(
  'snapshots',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    provider: text('provider', { enum: ['leetcode', 'github'] }).notNull(),
    /** e.g. "profile", "contest", "calendar", "solved", "repos". */
    kind: text('kind').notNull(),
    fetchedAt: integer('fetched_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    ok: integer('ok', { mode: 'boolean' }).notNull().default(true),
    payload: text('payload', { mode: 'json' }).$type<unknown>(),
    error: text('error'),
  },
  (t) => [
    index('snapshots_lookup_idx').on(t.provider, t.kind, t.fetchedAt),
    index('snapshots_ok_idx').on(t.provider, t.kind, t.ok, t.fetchedAt),
  ],
);

/** Accepted submissions seen on LeetCode, used to auto-mark tracked items. */
export const lcSubmissions = sqliteTable(
  'lc_submissions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    titleSlug: text('title_slug').notNull(),
    title: text('title'),
    submittedAt: integer('submitted_at', { mode: 'timestamp_ms' }),
    /** 'recent' = public recentAcSubmissionList, 'authed' = cookie-backed list. */
    source: text('source', { enum: ['recent', 'authed'] }).notNull(),
    seenAt: integer('seen_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => [
    uniqueIndex('lc_sub_unique_idx').on(t.titleSlug, t.submittedAt, t.source),
    index('lc_sub_slug_idx').on(t.titleSlug),
  ],
);

export const syncRuns = sqliteTable(
  'sync_runs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    provider: text('provider', { enum: ['leetcode', 'github'] }).notNull(),
    trigger: text('trigger', { enum: ['cron', 'manual', 'seed'] }).notNull(),
    startedAt: integer('started_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    finishedAt: integer('finished_at', { mode: 'timestamp_ms' }),
    status: text('status', { enum: ['ok', 'partial', 'error'] }).notNull(),
    message: text('message'),
    itemsAutoMarked: integer('items_auto_marked').notNull().default(0),
  },
  (t) => [index('sync_runs_provider_idx').on(t.provider, t.startedAt)],
);

/** Small key/value store: sync cursors, cookie health, misc flags. */
export const kv = sqliteTable('kv', {
  key: text('key').primaryKey(),
  value: text('value', { mode: 'json' }).$type<unknown>(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

/* ---------------------------------------------------------------- relations */

export const sectionsRelations = relations(sections, ({ many }) => ({
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  section: one(sections, {
    fields: [topics.sectionId],
    references: [sections.id],
  }),
  parent: one(topics, {
    fields: [topics.parentTopicId],
    references: [topics.id],
    relationName: 'topicHierarchy',
  }),
  children: many(topics, { relationName: 'topicHierarchy' }),
  placements: many(placements),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  progress: one(progress, {
    fields: [items.id],
    references: [progress.itemId],
  }),
  placements: many(placements),
  reviews: many(reviews),
}));

export const placementsRelations = relations(placements, ({ one }) => ({
  topic: one(topics, { fields: [placements.topicId], references: [topics.id] }),
  item: one(items, { fields: [placements.itemId], references: [items.id] }),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  item: one(items, { fields: [progress.itemId], references: [items.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  item: one(items, { fields: [reviews.itemId], references: [items.id] }),
}));

export type Section = typeof sections.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type Item = typeof items.$inferSelect;
export type Placement = typeof placements.$inferSelect;
export type Progress = typeof progress.$inferSelect;
export type Snapshot = typeof snapshots.$inferSelect;
export type SyncRun = typeof syncRuns.$inferSelect;
