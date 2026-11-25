'use client';

import { useMemo, useState } from 'react';
import { cx } from '../ui';

export interface HeatmapDay {
  /** YYYY-MM-DD */
  date: string;
  count: number;
}

/**
 * Activity calendar.
 *
 * Sequential encoding: one hue, low -> high magnitude, four steps plus an
 * "empty" step that recedes to the surface. Two heatmaps on one page use
 * different hues (`scale`) so the two scales can never be confused.
 * Every cell has a hover tooltip; the legend states the scale.
 */
const SCALES = {
  blue: ['var(--seq-1)', 'var(--seq-2)', 'var(--seq-3)', 'var(--seq-4)'],
  orange: ['var(--seq2-1)', 'var(--seq2-2)', 'var(--seq2-3)', 'var(--seq2-4)'],
} as const;

const CELL = 11;
const GAP = 2.5;
const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function parse(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function fmt(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function Heatmap({
  days,
  weeks = 53,
  scale = 'blue',
  unit = 'submissions',
}: {
  days: HeatmapDay[];
  weeks?: number;
  scale?: keyof typeof SCALES;
  unit?: string;
}) {
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    label: string;
  } | null>(null);

  const { grid, thresholds, months, total } = useMemo(() => {
    const counts = new Map(days.map((d) => [d.date, d.count]));

    // End on the most recent Saturday so every column is a full week.
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + (6 - end.getDay()));
    const start = new Date(end);
    start.setDate(start.getDate() - (weeks * 7 - 1));

    const cells: Array<Array<{ date: Date; key: string; count: number } | null>> = [];
    const monthMarks: Array<{ col: number; label: string }> = [];
    let total = 0;

    for (let w = 0; w < weeks; w++) {
      const column: Array<{ date: Date; key: string; count: number } | null> = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        if (date > new Date()) {
          column.push(null);
          continue;
        }
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const count = counts.get(key) ?? 0;
        total += count;
        column.push({ date, key, count });
        if (d === 0 && date.getDate() <= 7) {
          monthMarks.push({ col: w, label: MONTHS[date.getMonth()] });
        }
      }
      cells.push(column);
    }

    // Quartile-ish breaks over non-zero days, so a quiet year still shows shape.
    const nonZero = days.map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
    const at = (q: number) =>
      nonZero.length ? nonZero[Math.min(nonZero.length - 1, Math.floor(nonZero.length * q))] : 1;
    const raw = [1, at(0.5), at(0.8), at(0.95)];
    // Strictly increasing, so two steps never mean the same thing.
    const thresholds = raw.map((v, i) => Math.max(v, i === 0 ? 1 : raw[i - 1] + 1));

    return { grid: cells, thresholds, months: monthMarks, total };
  }, [days, weeks]);

  const colours = SCALES[scale];
  const level = (count: number) => {
    if (count <= 0) return -1;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (count >= thresholds[i]) return i;
    }
    return 0;
  };

  const width = weeks * (CELL + GAP) + 26;
  const height = 7 * (CELL + GAP) + 16;

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-1">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${total} ${unit} over the last ${weeks} weeks`}
          className="block"
        >
          {months.map((m, i) => (
            <text
              key={`${m.label}-${i}`}
              x={26 + m.col * (CELL + GAP)}
              y={8}
              className="fill-faint"
              style={{ fontSize: 9 }}
            >
              {m.label}
            </text>
          ))}
          {WEEKDAY_LABELS.map((label, d) =>
            label ? (
              <text
                key={d}
                x={0}
                y={16 + d * (CELL + GAP) + CELL - 2}
                className="fill-faint"
                style={{ fontSize: 9 }}
              >
                {label}
              </text>
            ) : null,
          )}
          {grid.map((column, w) =>
            column.map((cell, d) => {
              if (!cell) return null;
              const lv = level(cell.count);
              return (
                <rect
                  key={cell.key}
                  x={26 + w * (CELL + GAP)}
                  y={16 + d * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2.5}
                  fill={lv < 0 ? 'var(--bg-subtle)' : colours[lv]}
                  stroke={lv < 0 ? 'var(--border)' : 'none'}
                  strokeWidth={lv < 0 ? 1 : 0}
                  onMouseEnter={() =>
                    setHover({
                      x: 26 + w * (CELL + GAP) + CELL / 2,
                      y: 16 + d * (CELL + GAP),
                      label: `${cell.count} ${cell.count === 1 ? unit.replace(/s$/, '') : unit} · ${fmt(cell.date)}`,
                    })
                  }
                  onMouseLeave={() => setHover(null)}
                  className="cursor-default"
                >
                  <title>{`${cell.count} ${unit} on ${fmt(cell.date)}`}</title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>

      {hover ? (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-fg shadow-lg"
          style={{ left: hover.x, top: hover.y - 4 }}
        >
          {hover.label}
        </div>
      ) : null}

      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-faint">
        <span className="tabular-nums">{total.toLocaleString()} {unit}</span>
        <div className="flex-1" />
        <span>less</span>
        <span
          className="size-2.5 rounded-[2px] border border-border"
          style={{ background: 'var(--bg-subtle)' }}
        />
        {colours.map((c, i) => (
          <span
            key={i}
            className="size-2.5 rounded-[2px]"
            style={{ background: c }}
            title={`${thresholds[i]}+ ${unit}`}
          />
        ))}
        <span>more</span>
      </div>
    </div>
  );
}

export function HeatmapSkeleton({ note }: { note: string }) {
  return (
    <div className={cx('rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-faint')}>
      {note}
    </div>
  );
}
