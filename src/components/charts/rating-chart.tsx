'use client';

import { useMemo, useRef, useState } from 'react';

export interface RatingPoint {
  /** ISO timestamp. */
  at: string;
  rating: number;
  title?: string;
  ranking?: number | null;
}

const PAD = { top: 10, right: 10, bottom: 18, left: 32 };

/**
 * Contest rating over time.
 *
 * One series, so no legend — the card title names it. 2px line, 8px hover
 * marker, recessive gridlines, crosshair + tooltip on hover. Single y-axis
 * only; a second measure would be a second chart.
 */
export function RatingChart({
  points,
  height = 132,
}: {
  points: RatingPoint[];
  height?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const width = 560;

  const model = useMemo(() => {
    if (points.length === 0) return null;
    const values = points.map((p) => p.rating);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // Pad the domain so the line never sits on the frame.
    const span = Math.max(40, max - min);
    const lo = Math.floor((min - span * 0.15) / 10) * 10;
    const hi = Math.ceil((max + span * 0.15) / 10) * 10;

    const innerW = width - PAD.left - PAD.right;
    const innerH = height - PAD.top - PAD.bottom;
    const x = (i: number) =>
      PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = (v: number) => PAD.top + innerH - ((v - lo) / (hi - lo)) * innerH;

    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.rating).toFixed(1)}`).join(' ');
    const area = `${line} L${x(points.length - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;

    // Three ticks is enough context without becoming a grid of numbers.
    const ticks = [lo, Math.round((lo + hi) / 2 / 10) * 10, hi];

    return { x, y, line, area, ticks, lo, hi, innerH };
  }, [points, height]);

  if (!model) {
    return (
      <div className="px-4 py-8 text-center text-xs text-faint">
        No contest history yet.
      </div>
    );
  }

  function onMove(event: React.MouseEvent<SVGSVGElement>) {
    const svg = ref.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * width;
    const innerW = width - PAD.left - PAD.right;
    const t = (px - PAD.left) / innerW;
    const i = Math.round(t * (points.length - 1));
    setActive(Math.max(0, Math.min(points.length - 1, i)));
  }

  const point = active !== null ? points[active] : null;
  const last = points[points.length - 1];
  const first = points[0];
  const delta = last.rating - first.rating;

  return (
    <div className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full"
        style={{ height }}
        onMouseMove={onMove}
        onMouseLeave={() => setActive(null)}
        role="img"
        aria-label={`Contest rating over ${points.length} contests, currently ${Math.round(last.rating)}`}
      >
        {model.ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={model.y(t)}
              y2={model.y(t)}
              stroke="var(--grid)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 5}
              y={model.y(t) + 3}
              textAnchor="end"
              className="fill-faint tabular-nums"
              style={{ fontSize: 9 }}
            >
              {t}
            </text>
          </g>
        ))}

        <defs>
          <linearGradient id="rating-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={model.area} fill="url(#rating-fill)" />
        <path
          d={model.line}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Current value always labelled; never a number on every point. */}
        <circle
          cx={model.x(points.length - 1)}
          cy={model.y(last.rating)}
          r={3.5}
          fill="var(--accent)"
          stroke="var(--surface)"
          strokeWidth={2}
        />

        {point && active !== null ? (
          <>
            <line
              x1={model.x(active)}
              x2={model.x(active)}
              y1={PAD.top}
              y2={PAD.top + model.innerH}
              stroke="var(--border-strong)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={model.x(active)}
              cy={model.y(point.rating)}
              r={4.5}
              fill="var(--accent)"
              stroke="var(--surface)"
              strokeWidth={2}
            />
          </>
        ) : null}
      </svg>

      {point ? (
        <div
          className="pointer-events-none absolute z-10 max-w-[13rem] -translate-x-1/2 rounded-md border border-border bg-surface px-2 py-1 text-[11px] shadow-lg"
          style={{
            left: `${(model.x(active!) / width) * 100}%`,
            top: 0,
          }}
        >
          <div className="font-medium tabular-nums text-fg">
            {Math.round(point.rating)}
          </div>
          {point.title ? (
            <div className="truncate text-faint">{point.title}</div>
          ) : null}
          <div className="text-faint">
            {new Date(point.at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            {point.ranking ? ` · rank ${point.ranking.toLocaleString()}` : ''}
          </div>
        </div>
      ) : null}

      <div className="mt-1 flex items-baseline gap-2 px-1 text-[10px] text-faint">
        <span>{points.length} contests</span>
        <div className="flex-1" />
        <span
          className={
            delta >= 0 ? 'text-solved tabular-nums' : 'text-hard tabular-nums'
          }
        >
          {delta >= 0 ? '+' : ''}
          {Math.round(delta)} all-time
        </span>
      </div>
    </div>
  );
}
