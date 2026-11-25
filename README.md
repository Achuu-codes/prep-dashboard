# prep-dashboard

A self-hosted dashboard for preparing for software engineering interviews: a
curated, rating-tagged DSA problem list with pattern-first revision notes, a
spaced-revision queue, and automatic progress tracking pulled from your
LeetCode and GitHub accounts.

Single user, single password, runs on a local SQLite file by default — one
`npm run dev` away from working, and one env var away from running on Turso +
Vercel.

Status: the **DSA** section is complete and populated (699 problems across 33
topics, 17 revision notes written so far). **Low-Level Design**, **CS
Fundamentals**, **Code Comprehension** and **Applications** already have their
place in the data model and render as coming-soon placeholders.

---

## Contents

- [Features](#features)
- [Stack](#stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project layout](#project-layout)
- [How revision scheduling works](#how-revision-scheduling-works)
- [Syncing LeetCode and GitHub](#syncing-leetcode-and-github)
- [Adding content](#adding-content)
- [Deploying](#deploying)
- [Swapping the database](#swapping-the-database)
- [Troubleshooting](#troubleshooting)

---

## Features

**Curated problem lists.** 778 placements over 699 distinct LeetCode problems,
grouped by topic and then by sub-pattern (e.g. "binary search on the answer").
Every problem carries its difficulty and its
[zerotrac contest rating](https://github.com/zerotrac/leetcode_problem_rating),
so a list can be worked in genuine difficulty order rather than
Easy/Medium/Hard order.

**Pattern-first notes.** Each topic has an MDX revision note rendered with
syntax highlighting (Shiki, themed for both light and dark) and GitHub-flavoured
Markdown.

**Spaced revision.** Solving a problem schedules it to resurface at 3, 7, 21 and
60 days. `/revise` shows what is due today and what is overdue, and each review
is logged so the history is chartable.

**Progress that survives re-seeding.** Progress lives in its own table keyed by
item, so content can be regenerated freely without touching anything you typed.
A problem that appears in two topics (Number of Islands under both BFS/DFS and
Union-Find) is one row with one status, one notes field and one revision
schedule.

**Automatic status updates.** A sync reads your accepted LeetCode submissions
and flips tracked problems to solved, flagging them as auto-marked so you can
tell them apart from the ones you marked yourself.

**Stats.** Solved-by-difficulty bars, a contribution heatmap, contest rating
over time, and per-topic completion — all served from stored snapshots, so a
failing upstream API degrades to "stale since …" instead of an empty page.

**Search and filters.** `/problems` searches every tracked problem with filters
for topic, difficulty, status and a rating range.

**Auth that gets out of the way.** With no password configured the site runs
open, which is fine on localhost. Set `APP_PASSWORD` and `AUTH_SECRET` and the
whole site — pages and API routes — sits behind one signed, HMAC'd cookie.

Dark theme by default, with a light theme toggle.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Styling | Tailwind CSS 4 |
| Database | SQLite via libSQL — a local file, or Turso when deployed |
| ORM / migrations | Drizzle ORM + drizzle-kit |
| Notes | MDX (`@next/mdx`) + Shiki + remark-gfm |
| Validation | Zod |
| Scheduled sync | Vercel Cron |

Requires **Node 20.9+** (Next.js 16's minimum).

## Getting started

```bash
# 1. Clone and install
git clone https://github.com/Achuu-codes/prep-dashboard.git
cd prep-dashboard
npm install

# 2. Create your env file
cp .env.example .env.local
#    Then open .env.local and set, at minimum:
#      OWNER_NAME         your name, shown on the dashboard
#      LEETCODE_USERNAME  your public LeetCode handle
#    Everything else is optional for local use. See the table below.

# 3. Build the database and seed the content
npm run setup

# 4. Start the dev server
npm run dev
```

Then open **http://localhost:3000**.

### What each step does

`npm run setup` runs four things in order, and is safe to re-run:

1. **`db:ensure`** — creates `./data/` and applies every pending migration from
   `./drizzle` to `data/app.db`.
2. **`ratings`** — builds `content/.problem-index.json`, the offline problem
   index, from two public sources: the full LeetCode catalogue (titles,
   difficulty, paid-only flags) and the zerotrac contest ratings. This is what
   makes the curated lists safe — a slug that isn't in the index is a typo.
3. **`seed`** — validates the curated lists, then writes sections, topics,
   problems and placements into the database. It refuses to write anything
   unless every check passes: every leaf topic has a list, every problem's
   sub-pattern is one its topic declares, no problem is listed twice in the
   same topic, every slug exists in the index, and every slug actually resolves
   on LeetCode. Live results are cached in `content/.validated.json`, so
   re-seeding is fast. Use `npm run seed:offline` to skip the network check.
4. **`notes`** — regenerates `src/content/notes.generated.ts`, the static map
   from note slug to MDX import.

`npm run dev` re-runs `notes` and `db:ensure` first, so migrations and the note
map are never stale in development.

### Offline / no-network setup

```bash
npm run db:ensure
npm run seed:offline   # needs content/.problem-index.json, which is committed
npm run notes
npm run dev
```

### Adding a password

Local-only use needs no password. To lock the site:

```bash
# in .env.local
APP_PASSWORD=whatever-you-will-remember
AUTH_SECRET=$(openssl rand -base64 32)
```

Both must be set — with either one missing, the site runs open and `/login`
redirects to the dashboard rather than showing a dead form.

**Set both before deploying anywhere public.**

## Environment variables

Copy `.env.example` to `.env.local`. Every value is read only in server code
(`src/lib/env.ts` is marked `server-only`, so the build fails if a client
component ever imports it) and nothing here reaches the browser except
`publicProfile()`, which contains public handles and no credentials.

| Variable | Required | What it does |
| --- | --- | --- |
| `DATABASE_URL` | no | Defaults to `file:./data/app.db`. Set to `libsql://<db>-<org>.turso.io` for Turso. |
| `DATABASE_AUTH_TOKEN` | with Turso | Turso auth token. |
| `APP_PASSWORD` | to deploy | The single login password. Blank = no login. |
| `AUTH_SECRET` | to deploy | Long random string used to sign the session cookie. Blank = no login. |
| `OWNER_NAME` | no | Name shown on the dashboard. Defaults to "Me". |
| `OWNER_TAGLINE` | no | Subtitle under your name. |
| `OWNER_EMAIL` | no | Rendered as a link. |
| `OWNER_WEBSITE` | no | Rendered as a link. |
| `LEETCODE_USERNAME` | for LeetCode | Public handle. Enables profile, contest history and recent submissions. |
| `LEETCODE_SESSION` | no | Cookie from a logged-in leetcode.com session. Unlocks your complete solved list instead of only the last ~20 accepted submissions. |
| `LEETCODE_CSRF` | no | The matching CSRF cookie. |
| `GITHUB_USERNAME` | for GitHub | Your handle. |
| `GITHUB_TOKEN` | for GitHub | Read-only PAT. `read:user` is enough; add `public_repo` to include private contribution counts. |
| `CRON_SECRET` | to deploy | Vercel Cron sends `Authorization: Bearer $CRON_SECRET` to `/api/cron/sync`. Unset, that route answers only on localhost. |

The dashboard degrades cleanly: each integration simply doesn't render if its
variables are missing.

**About the LeetCode cookies.** They're optional and they expire every few
weeks. Get them from DevTools → Application → Cookies on leetcode.com. The
dashboard tracks cookie health and shows a warning when they stop working, and
everything else keeps working without them.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Regenerate notes, migrate, then start the dev server |
| `npm run build` | Regenerate notes, then production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run setup` | `db:ensure` + `ratings` + `seed` + `notes` |
| `npm run db:ensure` | Create `./data` and apply pending migrations |
| `npm run db:generate` | Generate a migration from `src/db/schema.ts` |
| `npm run db:push` | Push the schema straight to the database (dev only) |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run ratings` | Rebuild the offline problem index + contest ratings |
| `npm run seed` | Validate and seed content (hits LeetCode) |
| `npm run seed:offline` | Same, skipping the live slug check |
| `npm run notes` | Regenerate `src/content/notes.generated.ts` |

## Project layout

```
src/
  app/
    (app)/            Dashboard, DSA topics, problems, revise, stats, placeholders
    actions/          Server actions: progress mutations, manual sync
    api/sync/         POST: manual sync (behind the session cookie)
    api/cron/sync/    Scheduled sync (authenticates with CRON_SECRET)
    login/            Password form + server action
  components/         UI primitives, nav, problem rows, charts (hand-rolled SVG)
  content/
    dsa/topics.ts     The topic tree
    dsa/problems/     One curated list per topic
    sections.ts       The five sections and their status
    notes.generated.ts  AUTO-GENERATED — do not edit
  db/
    schema.ts         Section -> Topic -> Subtopic -> Item, plus progress
    queries/          Dashboard, content and search queries
  lib/
    env.ts            Zod-validated, server-only env access
    auth.ts           HMAC session cookie (Web Crypto, runs in middleware)
    srs.ts            Spaced revision — pure, no DB
    sync.ts           Orchestrates LeetCode + GitHub syncs
    leetcode/         GraphQL client, queries, server wrappers
    github/           REST + GraphQL client, queries, server wrappers
  middleware.ts       Gates the whole site behind the session cookie
content/dsa/          MDX revision notes, one per topic
drizzle/              Generated SQL migrations
scripts/              setup / seed / ratings / notes
data/app.db           Local SQLite file (gitignored)
```

### The data model in one paragraph

`Section -> Topic -> Subtopic -> Item`. An item exists once globally, keyed by
`(kind, slug)`, so one LeetCode problem is one row no matter how many topics
teach it — and therefore has exactly one progress row. Where an item appears in
the curriculum is a separate `placements` table. Adding LLD, CS Fundamentals,
Code Comprehension or Applications means inserting rows with a different
`items.kind` and a different `items.meta` payload; **no schema migration is
needed.**

## How revision scheduling works

A solved problem resurfaces **3, 7, 21 and 60 days after the solve date**. The
offsets are absolute rather than chained, so reviewing late doesn't push the
rest of the ladder back. After the last stage a problem leaves the queue, unless
you explicitly mark it "needs revision", which puts it back immediately.

`src/lib/srs.ts` is a pure module — no database, no env — so it's safe to import
from client components, and the ladder for a given solve date can be rendered
inline on a problem row.

## Syncing LeetCode and GitHub

Every successful fetch is stored whole in `snapshots`, which does two jobs:
charting values over time, and serving the last good payload with a
"stale since …" note when an upstream API fails or changes shape.

- **Manual:** the sync button on the dashboard and stats pages, or
  `POST /api/sync` (optionally `?provider=leetcode` / `?provider=github`).
- **Scheduled:** `/api/cron/sync` every 6 hours, configured in `vercel.json`.

A sync records accepted LeetCode submissions and auto-marks any tracked problem
it recognises, writing the revision ladder as it goes. Auto-marked rows are
flagged, so a status you set by hand is never silently overwritten by a sync.

## Adding content

**A problem** — add it to the relevant file in `src/content/dsa/problems/`, then
run `npm run seed`. Its `sub` must be one of the `subPatterns` declared by its
topic in `src/content/dsa/topics.ts`, and its slug must exist in the problem
index. If the slug is new, run `npm run ratings` first. The seed aborts loudly
rather than writing a dead link.

**A revision note** — create `content/dsa/<topic-slug>.mdx`, set the topic's
`noteSlug` in `src/content/dsa/topics.ts`, then run `npm run notes`. (`npm run
dev` does this for you.) A topic with no note file just renders without one.

**A new topic** — add it to the topic tree, create a curated list for it (every
leaf topic needs one or the seed refuses), write its note, then
`npm run seed && npm run notes`.

**A new section** — write a topic tree and a seed file, and flip its `status`
from `soon` to `active` in `src/content/sections.ts`. Nothing else changes.

## Deploying

The app is built for Vercel + Turso, and the cron schedule in `vercel.json`
assumes it.

1. **Create a Turso database** and push the schema to it:
   ```bash
   turso db create prep-dashboard
   turso db show prep-dashboard --url      # -> libsql://...
   turso db tokens create prep-dashboard   # -> auth token
   DATABASE_URL=libsql://... DATABASE_AUTH_TOKEN=... npm run db:push
   ```
2. **Seed it** the same way — set both variables and run `npm run seed`.
3. **Set the environment variables** in your Vercel project: `DATABASE_URL`,
   `DATABASE_AUTH_TOKEN`, `APP_PASSWORD`, `AUTH_SECRET`, `CRON_SECRET`, plus
   whichever `OWNER_*`, `LEETCODE_*` and `GITHUB_*` values you use.
4. **Deploy.** Vercel Cron will start calling `/api/cron/sync` every 6 hours.

Do not deploy without `APP_PASSWORD` and `AUTH_SECRET` — without them the whole
site is public.

## Swapping the database

The schema is written in Drizzle's `sqlite-core`, which covers both a local file
and Turso, and `drizzle.config.ts` uses the `turso` dialect for both.

To move to Postgres instead:

1. Rewrite `src/db/schema.ts` against `drizzle-orm/pg-core`. The table shapes
   carry over; the types that need attention are the `integer(..., { mode:
   'timestamp_ms' })` columns (become `timestamp`), the `integer(..., { mode:
   'boolean' })` columns (become `boolean`), and `text(..., { mode: 'json' })`
   (becomes `jsonb`).
2. Change `dialect` to `postgresql` in `drizzle.config.ts`.
3. Swap the client in `src/db/connect.ts` for a `node-postgres` or Neon driver,
   and drop `@libsql/client` from `serverExternalPackages` in `next.config.mjs`.
4. Delete `drizzle/` and run `npm run db:generate` to regenerate migrations.

Query code in `src/db/queries/` is written against the Drizzle query builder and
should need few changes.

## Troubleshooting

**`content/.problem-index.json is missing. Run npm run ratings first.`** — the
seed needs the offline index. Run `npm run ratings`, or use the committed copy.

**The seed aborts on a dead slug.** — a problem in a curated list no longer
resolves on LeetCode (renamed or removed). Fix or remove the slug. Delete
`content/.validated.json` to force a full re-check.

**A topic note doesn't render.** — run `npm run notes`. The MDX map is generated,
not dynamic: Turbopack resolves dynamic imports at build time and can't follow a
variable path.

**LeetCode shows only ~20 solved problems.** — that's the public API's limit.
Set `LEETCODE_SESSION` and `LEETCODE_CSRF` for the full list.

**Locked out after setting a password.** — clear `APP_PASSWORD` and
`AUTH_SECRET` in `.env.local` and restart; the site runs open again.

**Stats say "stale since …".** — the last sync failed and the page is serving the
previous good snapshot. `/stats` shows the per-provider outcome of the last run.

## License

Personal project, no license specified. Problem statements and ratings belong to
LeetCode and the [zerotrac ratings project](https://github.com/zerotrac/leetcode_problem_rating)
respectively; only the curated lists and notes here are mine.
