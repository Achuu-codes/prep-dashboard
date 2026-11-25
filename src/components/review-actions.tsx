'use client';

import { useTransition } from 'react';
import { completeReview, snoozeReview } from '@/app/actions/progress';
import { cx } from './ui';

/**
 * The three outcomes map onto the ladder:
 *   good   -> next rung
 *   shaky  -> next rung, but flagged "needs revision"
 *   forgot -> back to rung 0, due again today
 */
const OUTCOMES = [
  { key: 'good', label: 'Got it', style: 'border-solved/40 text-solved hover:bg-solved/10' },
  { key: 'shaky', label: 'Shaky', style: 'border-medium/40 text-medium hover:bg-medium/10' },
  { key: 'forgot', label: 'Forgot', style: 'border-hard/40 text-hard hover:bg-hard/10' },
] as const;

export function ReviewActions({ itemId }: { itemId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className={cx('flex shrink-0 items-center gap-1', pending && 'opacity-50')}>
      {OUTCOMES.map((o) => (
        <button
          key={o.key}
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(() => completeReview(itemId, o.key))
          }
          className={cx(
            'rounded border px-1.5 py-0.5 text-[11px] font-medium',
            o.style,
          )}
        >
          {o.label}
        </button>
      ))}
      <button
        type="button"
        disabled={pending}
        title="Push to tomorrow"
        onClick={() => startTransition(() => snoozeReview(itemId, 1))}
        className="rounded border border-border px-1.5 py-0.5 text-[11px] text-faint hover:bg-surface-hover hover:text-muted"
      >
        +1d
      </button>
    </div>
  );
}
