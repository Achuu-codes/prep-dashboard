/**
 * Content registry types.
 *
 * The registry is plain data: TypeScript files in src/content that the seed
 * script turns into `sections` / `topics` / `items` rows. Adding LLD, CS
 * Fundamentals, Code Comprehension or Applications later means adding another
 * SectionDef here — no schema change, no new tables.
 */
import type { ItemKind, SectionKind } from '@/db/schema';

export interface TopicDef {
  slug: string;
  title: string;
  /** One line, shown on cards and in nav tooltips. */
  summary: string;
  /** MDX basename under content/<section>/. Defaults to the topic slug. */
  noteSlug?: string;
  /** Ordered sub-pattern labels; drives the grouping and the progress bars. */
  subPatterns?: string[];
  /** Nested subtopics, e.g. the DP and Graphs subpages. */
  children?: TopicDef[];
}

export interface SectionDef {
  id: string;
  slug: string;
  title: string;
  kind: SectionKind;
  description: string;
  /** 'soon' renders a coming-soon placeholder instead of a topic index. */
  status: 'active' | 'soon';
  /** Default item kind for this section; used by the seeder. */
  itemKind: ItemKind;
  topics: TopicDef[];
}

/** One curated problem. Array order is the study order: solid -> mastery. */
export interface ProblemSeed {
  /** LeetCode titleSlug. Validated against the problem index and the API. */
  slug: string;
  /** Sub-pattern label; must appear in the topic's `subPatterns`. */
  sub: string;
  /** Optional one-line reason this problem is on the list. */
  why?: string;
}

/** Flattens a topic tree into leaf-first order with parent ids attached. */
export function flattenTopics(
  topics: TopicDef[],
  parentSlug: string | null = null,
): Array<{ topic: TopicDef; parentSlug: string | null; depth: number }> {
  const out: Array<{
    topic: TopicDef;
    parentSlug: string | null;
    depth: number;
  }> = [];
  const walk = (list: TopicDef[], parent: string | null, depth: number) => {
    for (const topic of list) {
      out.push({ topic, parentSlug: parent, depth });
      if (topic.children?.length) walk(topic.children, topic.slug, depth + 1);
    }
  };
  walk(topics, parentSlug, 0);
  return out;
}

/** True when a topic is a grouping node (DP, Graphs) rather than a leaf page. */
export function isGroup(topic: TopicDef): boolean {
  return Boolean(topic.children?.length);
}
