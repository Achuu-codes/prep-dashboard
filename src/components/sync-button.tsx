'use client';

import { useState, useTransition } from 'react';
import { syncNow } from '@/app/actions/sync';
import { cx } from './ui';

/** "Sync now" — runs exactly the same code path as the 6-hourly cron job. */
export function SyncButton({ compact = false }: { compact?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; lines: string[]; autoMarked: number } | null>(
    null,
  );

  function run() {
    setResult(null);
    startTransition(async () => {
      try {
        setResult(await syncNow());
      } catch (err) {
        setResult({
          ok: false,
          lines: [(err as Error)?.message ?? 'Sync failed'],
          autoMarked: 0,
        });
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className={cx(
          'rounded-md border border-border px-2 py-1 text-[11px] font-medium text-muted hover:bg-surface-hover hover:text-fg disabled:opacity-60',
          !compact && 'px-2.5 py-1.5 text-xs',
        )}
      >
        {pending ? 'Syncing…' : 'Sync now'}
      </button>
      {result ? (
        <div
          className={cx(
            'max-w-xs text-right text-[10px] leading-relaxed',
            result.ok ? 'text-muted' : 'text-medium',
          )}
        >
          {result.autoMarked > 0 ? (
            <div className="font-medium text-solved">
              {result.autoMarked} auto-marked solved
            </div>
          ) : null}
          {result.lines.map((line) => (
            <div key={line} className="truncate" title={line}>
              {line}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
