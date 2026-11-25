'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { DIFFICULTIES, PROGRESS_STATUSES } from '@/db/schema';
import { STATUS_LABEL, cx } from '@/components/ui';

export interface TopicOption {
  slug: string;
  title: string;
  isChild: boolean;
}

/**
 * Filter state lives in the URL, so a filtered view is bookmarkable and the
 * results stay server-rendered.
 */
export function Filters({
  topics,
  total,
  shown,
}: {
  topics: TopicOption[];
  total: number;
  shown: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get('q') ?? '');

  const list = (key: string) => params.getAll(key);

  function push(next: URLSearchParams) {
    next.delete('page');
    startTransition(() => {
      router.replace(next.toString() ? `/problems?${next}` : '/problems', {
        scroll: false,
      });
    });
  }

  function toggle(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    const current = next.getAll(key);
    next.delete(key);
    for (const v of current) if (v !== value) next.append(key, v);
    if (!current.includes(value)) next.append(key, value);
    push(next);
  }

  function setSingle(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  }

  // Debounce the text box so typing does not fire a request per keystroke.
  useEffect(() => {
    const current = params.get('q') ?? '';
    if (q === current) return;
    const timer = setTimeout(() => setSingle('q', q), 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const chip = (active: boolean) =>
    cx(
      'rounded border px-2 py-0.5 text-[11px] transition-colors',
      active
        ? 'border-accent bg-accent/10 font-medium text-accent'
        : 'border-border text-muted hover:bg-surface-hover hover:text-fg',
    );

  const activeCount =
    list('difficulty').length +
    list('status').length +
    list('topic').length +
    (params.get('q') ? 1 : 0) +
    (params.get('min') || params.get('max') ? 1 : 0);

  return (
    <div
      className={cx(
        'space-y-3 rounded-xl border border-border bg-surface p-3.5',
        pending && 'opacity-70',
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search problems…"
          aria-label="Search problems by title"
          className="min-w-0 flex-1 basis-56 rounded-md border border-border bg-bg px-2.5 py-1.5 text-[13px] text-fg placeholder:text-faint"
        />
        <select
          value={params.get('sort') ?? 'curated'}
          onChange={(e) => setSingle('sort', e.target.value)}
          aria-label="Sort order"
          className="rounded-md border border-border bg-bg px-2 py-1.5 text-xs text-fg"
        >
          <option value="curated">Curated order</option>
          <option value="rating">Rating ↑</option>
          <option value="rating-desc">Rating ↓</option>
          <option value="title">Title</option>
          <option value="recent">Recently solved</option>
        </select>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={() => startTransition(() => router.replace('/problems'))}
            className="rounded-md border border-border px-2 py-1.5 text-xs text-muted hover:bg-surface-hover hover:text-fg"
          >
            Clear ({activeCount})
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">
            Difficulty
          </span>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggle('difficulty', d)}
              className={chip(list('difficulty').includes(d))}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">
            Status
          </span>
          {PROGRESS_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle('status', s)}
              className={chip(list('status').includes(s))}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">
            Rating
          </span>
          <input
            type="number"
            defaultValue={params.get('min') ?? ''}
            placeholder="min"
            step={50}
            onBlur={(e) => setSingle('min', e.target.value)}
            className="w-16 rounded-md border border-border bg-bg px-1.5 py-0.5 text-[11px] tabular-nums text-fg placeholder:text-faint"
          />
          <span className="text-faint">–</span>
          <input
            type="number"
            defaultValue={params.get('max') ?? ''}
            placeholder="max"
            step={50}
            onBlur={(e) => setSingle('max', e.target.value)}
            className="w-16 rounded-md border border-border bg-bg px-1.5 py-0.5 text-[11px] tabular-nums text-fg placeholder:text-faint"
          />
          <label className="ml-1 flex items-center gap-1 text-[11px] text-muted">
            <input
              type="checkbox"
              checked={params.get('unrated') === '1'}
              onChange={(e) => setSingle('unrated', e.target.checked ? '1' : '')}
              className="size-3 accent-[var(--accent)]"
            />
            include unrated
          </label>
        </div>
      </div>

      <details>
        <summary className="cursor-pointer text-[11px] text-faint hover:text-muted">
          Filter by topic{' '}
          {list('topic').length ? `(${list('topic').length})` : ''}
        </summary>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => toggle('topic', t.slug)}
              className={cx(chip(list('topic').includes(t.slug)), t.isChild && 'opacity-80')}
            >
              {t.isChild ? '· ' : ''}
              {t.title}
            </button>
          ))}
        </div>
      </details>

      <p className="text-[11px] text-faint">
        Showing {shown} of {total} matching problems
      </p>
    </div>
  );
}
