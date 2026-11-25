import type { SectionDef } from './types';
import { dsaTopics } from './dsa/topics';

/**
 * The five sections. Only DSA is active in this phase; the rest render as
 * coming-soon placeholders but already own their place in the data model, so
 * filling one in later means writing a topic tree and a seed file — nothing
 * else changes.
 */
export const sections: SectionDef[] = [
  {
    id: 'dsa',
    slug: 'dsa',
    title: 'DSA',
    kind: 'dsa',
    description:
      'Pattern-first revision notes and a curated, rating-tagged problem list per topic.',
    status: 'active',
    itemKind: 'problem',
    topics: dsaTopics,
  },
  {
    id: 'lld',
    slug: 'lld',
    title: 'Low-Level Design',
    kind: 'lld',
    description:
      'Class-level design problems: requirements, entities, interfaces, trade-offs.',
    status: 'soon',
    itemKind: 'design',
    topics: [],
  },
  {
    id: 'cs-fundamentals',
    slug: 'cs',
    title: 'CS Fundamentals',
    kind: 'cs-fundamentals',
    description:
      'Operating systems, networks, databases and concurrency, as interview-ready answers.',
    status: 'soon',
    itemKind: 'question',
    topics: [],
  },
  {
    id: 'code-comprehension',
    slug: 'comprehension',
    title: 'Code Comprehension',
    kind: 'code-comprehension',
    description:
      'Google-style code reading: predict the output, find the bug, explain the invariant.',
    status: 'soon',
    itemKind: 'snippet',
    topics: [],
  },
  {
    id: 'applications',
    slug: 'applications',
    title: 'Applications',
    kind: 'applications',
    description:
      'Where every application stands, from referral to offer, with next actions.',
    status: 'soon',
    itemKind: 'application',
    topics: [],
  },
];

export const activeSections = sections.filter((s) => s.status === 'active');
export const comingSoonSections = sections.filter((s) => s.status === 'soon');

export function findSection(slug: string): SectionDef | undefined {
  return sections.find((s) => s.slug === slug);
}

export const dsaSection = sections[0];
