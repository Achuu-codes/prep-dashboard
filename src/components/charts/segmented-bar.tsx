'use client';

import { useState } from 'react';
import { cx } from '../ui';

export interface Segment {
  label: string;
  value: number;
  colour: string;
  /** Optional secondary text for the tooltip. */
  detail?: string;
}

/**
 * Horizontal segmented bar.
 *
 * A 2px surface gap separates segments so adjacent fills never touch, the
 * data-ends are rounded, and the top segments carry direct labels — so
 * identity never rests on colour alone. Hover gives a per-segment tooltip.
 */
export function SegmentedBar({
  segments,
  height = 10,
  labelCount = 4,
  unit,
}: {
  segments: Segment[];
  height?: number;
  /** How many of the largest segments get a direct label. */
  labelCount?: number;
  unit?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const total = segments.reduce((n, s) => n + s.value, 0);
  if (total === 0) {
    return (
      <p className="py-3 text-center text-xs text-faint">Nothing to show yet.</p>
    );
  }

  const labelled = new Set(
    [...segments]
      .map((s, i) => ({ i, value: s.value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, labelCount)
      .map((s) => s.i),
  );

  return (
    <div>
      <div
        className="flex w-full overflow-hidden rounded-full"
        style={{ height, gap: 2 }}
        role="img"
        aria-label={segments
          .map((s) => `${s.label}: ${s.value}${unit ? ` ${unit}` : ''}`)
          .join(', ')}
      >
        {segments.map((s, i) =>
          s.value === 0 ? null : (
            <div
              key={s.label}
              title={`${s.label} · ${s.value.toLocaleString()}${unit ? ` ${unit}` : ''} (${Math.round((s.value / total) * 100)}%)`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={cx(
                'h-full shrink-0 rounded-[3px] transition-opacity first:rounded-l-full last:rounded-r-full',
                hover !== null && hover !== i && 'opacity-45',
              )}
              style={{
                width: `${(s.value / total) * 100}%`,
                background: s.colour,
              }}
            />
          ),
        )}
      </div>

      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {segments.map((s, i) =>
          s.value === 0 ? null : (
            <li
              key={s.label}
              className={cx(
                'flex items-center gap-1.5 text-[11px]',
                hover !== null && hover !== i ? 'opacity-50' : '',
              )}
            >
              <span
                className="size-2 shrink-0 rounded-[2px]"
                style={{ background: s.colour }}
              />
              <span className="text-muted">{s.label}</span>
              {labelled.has(i) ? (
                <span className="tabular-nums text-fg">
                  {s.value.toLocaleString()}
                </span>
              ) : null}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
