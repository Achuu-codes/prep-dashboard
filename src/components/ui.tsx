import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Difficulty, ProgressStatus } from '@/db/schema';

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* --------------------------------------------------------------- surfaces */

export function Card({
  children,
  className,
  as: As = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}) {
  return (
    <As
      className={cx(
        'rounded-xl border border-border bg-surface',
        className,
      )}
    >
      {children}
    </As>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
      <div className="min-w-0">
        <h2 className="truncate text-[13px] font-semibold tracking-tight text-fg">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function SectionTitle({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
        {children}
      </h2>
      {hint ? <span className="text-xs text-faint">{hint}</span> : null}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- badges */

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  Easy: 'text-easy border-easy/35 bg-easy/10',
  Medium: 'text-medium border-medium/35 bg-medium/10',
  Hard: 'text-hard border-hard/35 bg-hard/10',
};

export function DifficultyBadge({
  difficulty,
  short = false,
}: {
  difficulty: Difficulty | null;
  short?: boolean;
}) {
  if (!difficulty) return null;
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center rounded border px-1.5 py-px text-[11px] font-medium leading-4',
        DIFFICULTY_STYLE[difficulty],
      )}
      title={difficulty}
    >
      {short ? difficulty[0] : difficulty}
    </span>
  );
}

export const STATUS_LABEL: Record<ProgressStatus, string> = {
  todo: 'Todo',
  attempted: 'Attempted',
  solved: 'Solved',
  needs_revision: 'Needs revision',
};

const STATUS_STYLE: Record<ProgressStatus, string> = {
  todo: 'text-faint border-border bg-bg-subtle',
  attempted: 'text-attempted border-attempted/35 bg-attempted/10',
  solved: 'text-solved border-solved/35 bg-solved/10',
  needs_revision: 'text-revision border-revision/35 bg-revision/10',
};

export function StatusBadge({ status }: { status: ProgressStatus }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center rounded border px-1.5 py-px text-[11px] font-medium leading-4',
        STATUS_STYLE[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Pill({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cx(
        'inline-flex shrink-0 items-center rounded border border-border bg-bg-subtle px-1.5 py-px text-[11px] leading-4 text-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Contest rating, coloured by band so you can scan a list for "harder than
 * I can currently do". Bands follow the usual LeetCode rating intuition.
 */
export function RatingBadge({ rating }: { rating: number | null }) {
  if (rating === null) {
    return (
      <span className="text-[11px] text-faint tabular-nums" title="Not a contest problem">
        —
      </span>
    );
  }
  const colour =
    rating >= 2400
      ? 'text-hard'
      : rating >= 2000
        ? 'text-medium'
        : rating >= 1600
          ? 'text-accent'
          : 'text-muted';
  return (
    <span
      className={cx('text-[11px] font-medium tabular-nums', colour)}
      title={`zerotrac contest rating ${Math.round(rating)}`}
    >
      {Math.round(rating)}
    </span>
  );
}

/* ---------------------------------------------------------------- progress */

export function ProgressBar({
  solved,
  total,
  className,
  showLabel = true,
}: {
  solved: number;
  total: number;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
  return (
    <div className={cx('flex items-center gap-2', className)}>
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-subtle"
        role="progressbar"
        aria-valuenow={solved}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${solved} of ${total} solved`}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel ? (
        <span className="shrink-0 text-[11px] tabular-nums text-muted">
          {solved}/{total}
        </span>
      ) : null}
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  accent,
  href,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="text-[11px] font-medium uppercase tracking-[0.07em] text-faint">
        {label}
      </div>
      <div
        className="mt-1 text-2xl font-semibold tabular-nums leading-none tracking-tight"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      {sub ? <div className="mt-1.5 text-xs text-muted">{sub}</div> : null}
    </>
  );
  const className =
    'block rounded-xl border border-border bg-surface px-4 py-3.5';
  if (href) {
    return (
      <Link href={href} className={cx(className, 'hover:bg-surface-hover')}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}

/* ------------------------------------------------------------------ notice */

/**
 * The "stale since ..." banner. Shown above data that came from the snapshot
 * store rather than a fresh fetch.
 */
export function StaleNotice({
  provider,
  age,
  error,
}: {
  provider: string;
  age: string;
  error?: string | null;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-medium/30 bg-medium/5 px-3 py-2 text-xs text-medium">
      <span className="font-medium">{provider} data is stale</span>
      <span className="text-medium/70">last good sync {age}</span>
      {error ? (
        <span className="text-medium/70" title={error}>
          · {error.length > 90 ? `${error.slice(0, 90)}…` : error}
        </span>
      ) : null}
    </div>
  );
}

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <Pill className="mb-4">Coming soon</Pill>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <p className="mt-6 text-xs text-faint">
        The data model already covers this section — it needs a topic tree and a
        seed file, not a migration.
      </p>
    </div>
  );
}
