'use client';

import { useState, useTransition } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  resetProgress,
  saveDetails,
  setStatus,
} from '@/app/actions/progress';
import { duration, isoDate, shortDate } from '@/lib/format';
import { PROGRESS_STATUSES, type ProgressStatus } from '@/db/schema';
import { REVIEW_OFFSETS_DAYS, daysUntil, reviewLadder } from '@/lib/srs';
import {
  DifficultyBadge,
  Pill,
  RatingBadge,
  STATUS_LABEL,
  cx,
} from './ui';
import type { ProblemRow as Row } from '@/db/queries/content';

const STATUS_DOT: Record<ProgressStatus, string> = {
  todo: 'bg-todo/40 border-todo',
  attempted: 'bg-attempted/30 border-attempted',
  solved: 'bg-solved border-solved',
  needs_revision: 'bg-revision/30 border-revision',
};

/** Cycles todo -> attempted -> solved -> needs revision -> todo. */
function nextStatus(status: ProgressStatus): ProgressStatus {
  const i = PROGRESS_STATUSES.indexOf(status);
  return PROGRESS_STATUSES[(i + 1) % PROGRESS_STATUSES.length];
}

function ReviewLadder({ row }: { row: Row }) {
  if (!row.solvedAt) return null;
  const ladder = reviewLadder(new Date(row.solvedAt));
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {ladder.map((date, i) => {
        const done = i < row.reviewStage;
        const current = i === row.reviewStage;
        const days = daysUntil(date);
        return (
          <span
            key={i}
            title={`+${REVIEW_OFFSETS_DAYS[i]} days · ${shortDate(date)}`}
            className={cx(
              'inline-flex items-center gap-1 rounded border px-1.5 py-px text-[11px] leading-4',
              done && 'border-solved/30 bg-solved/10 text-solved',
              current &&
                (days !== null && days <= 0
                  ? 'border-revision/40 bg-revision/10 text-revision'
                  : 'border-accent/30 bg-accent/10 text-accent'),
              !done && !current && 'border-border bg-bg-subtle text-faint',
            )}
          >
            +{REVIEW_OFFSETS_DAYS[i]}d
            {current && days !== null ? (
              <span className="opacity-70">
                {days === 0 ? 'today' : days < 0 ? `${-days}d late` : `in ${days}d`}
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

export function ProblemRow({
  row,
  showTopic,
  topicHref,
  topicTitle,
}: {
  row: Row;
  showTopic?: boolean;
  topicHref?: string;
  topicTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState({
    notes: row.notes ?? '',
    timeTakenMin: row.timeTakenMin?.toString() ?? '',
    withoutHints: row.withoutHints ?? false,
    solvedOn: row.solvedAt ? isoDate(new Date(row.solvedAt)) : '',
  });
  const [saved, setSaved] = useState(false);

  const due = daysUntil(row.nextReviewAt);

  function cycle() {
    startTransition(() => setStatus(row.itemId, nextStatus(row.status)));
  }

  function pick(status: ProgressStatus) {
    startTransition(() => setStatus(row.itemId, status));
  }

  function persist() {
    setSaved(false);
    startTransition(async () => {
      await saveDetails(row.itemId, {
        notes: draft.notes.trim() || null,
        timeTakenMin: draft.timeTakenMin ? Number(draft.timeTakenMin) : null,
        withoutHints: draft.withoutHints,
        solvedOn: draft.solvedOn || null,
      });
      setSaved(true);
    });
  }

  return (
    <li
      className={cx(
        'border-b border-border last:border-0',
        pending && 'opacity-60',
      )}
    >
      <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-surface-hover/60 sm:gap-3 sm:px-3">
        <button
          type="button"
          onClick={cycle}
          title={`${STATUS_LABEL[row.status]} — click for ${STATUS_LABEL[nextStatus(row.status)]}`}
          aria-label={`Status: ${STATUS_LABEL[row.status]}`}
          className={cx(
            'size-3.5 shrink-0 rounded-full border transition-colors',
            STATUS_DOT[row.status],
          )}
        />

        <span className="hidden w-9 shrink-0 text-right text-[11px] tabular-nums text-faint sm:inline">
          {row.externalId}
        </span>

        <a
          href={row.url ?? `https://leetcode.com/problems/${row.slug}/`}
          target="_blank"
          rel="noreferrer noopener"
          className="min-w-0 flex-1 truncate text-[13px] text-fg hover:text-accent hover:underline"
          title={row.title}
        >
          {row.title}
          {row.isPaidOnly ? (
            <span className="ml-1.5 text-[10px] text-medium" title="LeetCode Premium">
              ★
            </span>
          ) : null}
        </a>

        {showTopic && topicTitle ? (
          <a
            href={topicHref}
            className="hidden max-w-[9rem] truncate text-[11px] text-faint hover:text-muted lg:inline"
          >
            {topicTitle}
          </a>
        ) : null}

        {row.subPattern && !showTopic ? (
          <span className="hidden max-w-[11rem] truncate text-[11px] text-faint lg:inline">
            {row.subPattern}
          </span>
        ) : null}

        <span className="w-8 shrink-0 text-right">
          <RatingBadge rating={row.rating} />
        </span>

        <DifficultyBadge difficulty={row.difficulty} short />

        {due !== null ? (
          <span
            className={cx(
              'hidden w-16 shrink-0 text-right text-[11px] tabular-nums sm:inline',
              due <= 0 ? 'text-revision' : 'text-faint',
            )}
            title={`Next revision ${shortDate(row.nextReviewAt)}`}
          >
            {due === 0 ? 'due today' : due < 0 ? `${-due}d late` : `in ${due}d`}
          </span>
        ) : (
          <span className="hidden w-16 shrink-0 sm:inline" />
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Hide details' : 'Show details'}
          className="flex size-5 shrink-0 items-center justify-center rounded text-faint hover:bg-surface-hover hover:text-fg"
        >
          <svg
            viewBox="0 0 16 16"
            className={cx('size-3 transition-transform', open && 'rotate-180')}
            fill="currentColor"
          >
            <path d="M8 11L3 6h10l-5 5z" />
          </svg>
        </button>
      </div>

      {open ? (
        <div className="space-y-3 border-t border-border bg-bg-subtle/60 px-3 py-3 sm:px-4">
          {row.note ? (
            <p className="text-xs italic text-muted">{row.note}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-1.5">
            {PROGRESS_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => pick(s)}
                aria-pressed={row.status === s}
                className={cx(
                  'rounded border px-2 py-0.5 text-[11px]',
                  row.status === s
                    ? 'border-accent bg-accent/10 font-medium text-accent'
                    : 'border-border text-muted hover:bg-surface-hover hover:text-fg',
                )}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
            {row.autoMarked ? (
              <Pill title="Marked by a LeetCode sync, not by hand">
                auto-marked
              </Pill>
            ) : null}
            {row.attempts > 0 ? (
              <Pill>{row.attempts} attempt{row.attempts === 1 ? '' : 's'}</Pill>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-muted">
                Date solved
              </span>
              <input
                type="date"
                value={draft.solvedOn}
                max={isoDate()}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, solvedOn: e.target.value }))
                }
                className="w-full rounded-md border border-border bg-surface px-2 py-1 text-xs text-fg"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-muted">
                Time taken (min)
              </span>
              <input
                type="number"
                min={0}
                max={600}
                inputMode="numeric"
                value={draft.timeTakenMin}
                placeholder="—"
                onChange={(e) =>
                  setDraft((d) => ({ ...d, timeTakenMin: e.target.value }))
                }
                className="w-full rounded-md border border-border bg-surface px-2 py-1 text-xs text-fg placeholder:text-faint"
              />
            </label>
            <label className="flex items-end gap-2 pb-1">
              <input
                type="checkbox"
                checked={draft.withoutHints}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, withoutHints: e.target.checked }))
                }
                className="size-3.5 accent-[var(--accent)]"
              />
              <span className="text-xs text-muted">Solved without hints</span>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted">
              Notes (markdown)
            </span>
            <textarea
              value={draft.notes}
              rows={4}
              placeholder="The insight, the mistake, the edge case you missed…"
              onChange={(e) =>
                setDraft((d) => ({ ...d, notes: e.target.value }))
              }
              className="w-full resize-y rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-xs text-fg placeholder:text-faint"
            />
          </label>

          {draft.notes.trim() ? (
            <details className="text-xs">
              <summary className="cursor-pointer text-[11px] text-faint hover:text-muted">
                Preview
              </summary>
              <div className="note mt-2 rounded-md border border-border bg-surface px-3 py-2 text-xs">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {draft.notes}
                </ReactMarkdown>
              </div>
            </details>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={persist}
              disabled={pending}
              className="rounded-md bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-contrast hover:opacity-90 disabled:opacity-60"
            >
              {pending ? 'Saving…' : 'Save'}
            </button>
            {saved && !pending ? (
              <span className="text-[11px] text-solved">Saved</span>
            ) : null}
            <div className="flex-1" />
            {row.timeTakenMin ? (
              <Pill>{duration(row.timeTakenMin)}</Pill>
            ) : null}
            {row.withoutHints ? (
              <Pill className="border-solved/30 text-solved">no hints</Pill>
            ) : null}
            <button
              type="button"
              onClick={() =>
                startTransition(() => resetProgress(row.itemId))
              }
              className="text-[11px] text-faint hover:text-hard"
            >
              Reset
            </button>
          </div>

          {row.solvedAt ? (
            <div className="space-y-1.5 border-t border-border pt-2.5">
              <div className="text-[11px] font-medium text-muted">
                Revision schedule
                <span className="ml-1.5 font-normal text-faint">
                  from {shortDate(row.solvedAt)}
                </span>
              </div>
              <ReviewLadder row={row} />
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
