/**
 * Seeds content into the database, and refuses to do so if anything is wrong.
 *
 * Validation runs in two stages:
 *
 *   Static (always):
 *     - every leaf topic has a curated list
 *     - every problem's `sub` is one of its topic's declared subPatterns
 *     - no problem is placed twice in the same topic
 *     - every slug exists in content/.problem-index.json
 *
 *   Live (default; skip with --offline):
 *     - every distinct slug is fetched from LeetCode with question(titleSlug)
 *     - a slug that resolves to null is a dead link and the seed ABORTS
 *
 * Results of the live check are cached in content/.validated.json so re-seeding
 * is fast. Nothing is written to the database unless every check passes.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sql } from 'drizzle-orm';
import { fetchQuestionBySlug } from '../src/lib/leetcode/api';
import { sections } from '../src/content/sections';
import { flattenTopics, isGroup, type ProblemSeed } from '../src/content/types';
import { dsaProblems } from '../src/content/dsa/problems';
import {
  items,
  placements,
  sections as sectionsTable,
  topics as topicsTable,
} from '../src/db/schema';
import { log, openDb } from './_bootstrap';
import type { ProblemIndex } from './fetch-ratings';

const INDEX_PATH = resolve(process.cwd(), 'content/.problem-index.json');
const CACHE_PATH = resolve(process.cwd(), 'content/.validated.json');
const OFFLINE = process.argv.includes('--offline');
const CONCURRENCY = 6;

interface ValidationCache {
  checkedAt: string;
  /** slug -> questionFrontendId, for slugs confirmed to resolve. */
  ok: Record<string, string>;
}

function loadIndex(): ProblemIndex {
  if (!existsSync(INDEX_PATH)) {
    throw new Error(
      'content/.problem-index.json is missing. Run `npm run ratings` first.',
    );
  }
  return JSON.parse(readFileSync(INDEX_PATH, 'utf8')) as ProblemIndex;
}

function loadCache(): ValidationCache {
  if (!existsSync(CACHE_PATH)) return { checkedAt: '', ok: {} };
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8')) as ValidationCache;
  } catch {
    return { checkedAt: '', ok: {} };
  }
}

/* ------------------------------------------------------------ static checks */

interface Problem extends ProblemSeed {
  topicSlug: string;
  topicId: string;
  orderIndex: number;
}

function collect(index: ProblemIndex) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const problems: Problem[] = [];

  for (const section of sections) {
    const flat = flattenTopics(section.topics);
    for (const { topic } of flat) {
      const list = dsaProblems[topic.slug];

      if (isGroup(topic)) {
        if (list) {
          errors.push(
            `topic "${topic.slug}" is a grouping node but has a problem list`,
          );
        }
        continue;
      }
      if (section.status !== 'active') continue;
      if (!list) {
        errors.push(`leaf topic "${topic.slug}" has no problem list`);
        continue;
      }

      const declared = new Set(topic.subPatterns ?? []);
      const seen = new Set<string>();

      list.forEach((problem, i) => {
        if (seen.has(problem.slug)) {
          errors.push(
            `"${problem.slug}" is placed twice in topic "${topic.slug}"`,
          );
          return;
        }
        seen.add(problem.slug);

        if (!declared.has(problem.sub)) {
          errors.push(
            `"${problem.slug}" in "${topic.slug}" has sub-pattern "${problem.sub}", which is not declared in that topic`,
          );
        }

        const meta = index.problems[problem.slug];
        if (!meta) {
          errors.push(
            `"${problem.slug}" (topic "${topic.slug}") is not in the problem index — check the slug`,
          );
          return;
        }
        if (meta.paidOnly) {
          warnings.push(
            `"${problem.slug}" is LeetCode Premium only (topic "${topic.slug}")`,
          );
        }
        if (meta.difficulty === 'Easy') {
          warnings.push(
            `"${problem.slug}" is Easy (topic "${topic.slug}")`,
          );
        }

        problems.push({
          ...problem,
          topicSlug: topic.slug,
          topicId: `${section.id}:${topic.slug}`,
          orderIndex: i,
        });
      });

      // Flag sub-patterns that ended up with no problems at all.
      for (const sub of declared) {
        if (!list.some((p) => p.sub === sub)) {
          warnings.push(
            `sub-pattern "${sub}" in "${topic.slug}" has no problems`,
          );
        }
      }
    }
  }

  return { problems, errors, warnings };
}

/* -------------------------------------------------------------- live check */

async function validateLive(slugs: string[], cache: ValidationCache) {
  const pending = slugs.filter((s) => !cache.ok[s]);
  if (pending.length === 0) {
    log.ok(`all ${slugs.length} slugs already validated (cached)`);
    return { dead: [] as string[], errored: [] as string[] };
  }
  log.info(
    `${slugs.length - pending.length} cached, fetching ${pending.length} from LeetCode`,
  );

  const dead: string[] = [];
  const errored: string[] = [];
  let done = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < pending.length) {
      const slug = pending[cursor++];
      try {
        const q = await fetchQuestionBySlug(slug);
        if (!q) {
          dead.push(slug);
        } else {
          cache.ok[slug] = q.questionFrontendId;
        }
      } catch (err) {
        errored.push(`${slug}: ${(err as Error).message}`);
      }
      done++;
      if (done % 50 === 0 || done === pending.length) {
        log.info(`validated ${done}/${pending.length}`);
      }
      await new Promise((r) => setTimeout(r, 120));
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, pending.length) }, worker),
  );

  cache.checkedAt = new Date().toISOString();
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0));
  return { dead, errored };
}

/* -------------------------------------------------------------------- seed */

async function main() {
  const index = loadIndex();
  log.step('Loaded problem index');
  log.ok(
    `${index.counts.catalogue} problems, ${index.counts.rated} rated, built ${index.builtAt.slice(0, 10)}`,
  );

  log.step('Static validation');
  const { problems, errors, warnings } = collect(index);
  for (const w of warnings) log.warn(w);
  if (errors.length) {
    for (const e of errors) log.fail(e);
    throw new Error(
      `${errors.length} content error(s). Nothing was written to the database.`,
    );
  }
  const distinct = [...new Set(problems.map((p) => p.slug))];
  log.ok(
    `${problems.length} placements, ${distinct.length} distinct problems, 0 errors`,
  );

  if (OFFLINE) {
    log.step('Live validation SKIPPED (--offline)');
    log.warn('slugs were only checked against the cached problem index');
  } else {
    log.step('Live validation against leetcode.com/graphql');
    const cache = loadCache();
    const { dead, errored } = await validateLive(distinct, cache);

    if (errored.length) {
      for (const e of errored.slice(0, 10)) log.fail(e);
      throw new Error(
        `${errored.length} slug(s) could not be checked (network or schema problem). Nothing was written. Re-run, or use --offline to seed from the cached index.`,
      );
    }
    if (dead.length) {
      log.fail('DEAD LINKS — these slugs do not resolve on LeetCode:');
      for (const slug of dead) log.fail(`  ${slug}`);
      throw new Error(
        `${dead.length} dead link(s). Fix the slugs in src/content/dsa/problems/. Nothing was written to the database.`,
      );
    }
    log.ok(`all ${distinct.length} slugs resolve on LeetCode`);
  }

  log.step('Writing content');
  const { db, client } = openDb();

  // Sections
  for (const [i, section] of sections.entries()) {
    await db
      .insert(sectionsTable)
      .values({
        id: section.id,
        slug: section.slug,
        title: section.title,
        kind: section.kind,
        description: section.description,
        status: section.status,
        orderIndex: i,
      })
      .onConflictDoUpdate({
        target: sectionsTable.id,
        set: {
          slug: section.slug,
          title: section.title,
          kind: section.kind,
          description: section.description,
          status: section.status,
          orderIndex: i,
        },
      });
  }
  log.ok(`${sections.length} sections`);

  // Topics (parents before children, which flattenTopics guarantees)
  let topicCount = 0;
  for (const section of sections) {
    const flat = flattenTopics(section.topics);
    for (const [i, { topic, parentSlug }] of flat.entries()) {
      const id = `${section.id}:${topic.slug}`;
      const values = {
        id,
        sectionId: section.id,
        parentTopicId: parentSlug ? `${section.id}:${parentSlug}` : null,
        slug: topic.slug,
        title: topic.title,
        summary: topic.summary,
        noteSlug: isGroup(topic) ? null : (topic.noteSlug ?? topic.slug),
        orderIndex: i,
        meta: topic.subPatterns ? { subPatterns: topic.subPatterns } : null,
      };
      await db
        .insert(topicsTable)
        .values(values)
        .onConflictDoUpdate({ target: topicsTable.id, set: values });
      topicCount++;
    }
  }
  log.ok(`${topicCount} topics`);

  // Items: one row per distinct problem, enriched from the index.
  for (const slug of distinct) {
    const meta = index.problems[slug];
    const values = {
      id: `problem:${slug}`,
      kind: 'problem' as const,
      slug,
      title: meta.title,
      url: `https://leetcode.com/problems/${slug}/`,
      externalId: meta.id,
      difficulty: meta.difficulty,
      rating: meta.rating,
      isPaidOnly: meta.paidOnly,
      validatedAt: OFFLINE ? null : new Date(),
      meta: { acRate: meta.acRate, contest: meta.contest },
    };
    await db
      .insert(items)
      .values(values)
      .onConflictDoUpdate({ target: items.id, set: values });
  }
  log.ok(`${distinct.length} items`);

  // Placements: re-derived from scratch each run, since they are pure content.
  await db.delete(placements);
  for (const p of problems) {
    await db.insert(placements).values({
      topicId: p.topicId,
      itemId: `problem:${p.slug}`,
      subPattern: p.sub,
      orderIndex: p.orderIndex,
      note: p.why ?? null,
    });
  }
  log.ok(`${problems.length} placements`);

  const [{ kept }] = await db.all<{ kept: number }>(
    sql`select count(*) as kept from progress`,
  );
  log.step('Done');
  log.ok(`progress rows preserved: ${kept}`);
  client.close();
}

main().catch((err) => {
  console.log();
  log.fail(String(err?.message ?? err));
  process.exit(1);
});
