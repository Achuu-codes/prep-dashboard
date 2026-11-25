/**
 * Small formatters shared by server and client components.
 * Deliberately free of `server-only` and of any DB or env import.
 */

/** "just now" / "3 hours ago" / "2 days ago". Used by the stale-since notes. */
export function describeAge(at: Date | string | number | null): string {
  if (at === null) return 'never';
  const then = at instanceof Date ? at.getTime() : new Date(at).getTime();
  if (!Number.isFinite(then)) return 'never';

  const seconds = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (seconds < 45) return 'just now';

  const plural = (n: number, unit: string) =>
    `${n} ${unit}${n === 1 ? '' : 's'} ago`;

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return plural(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (hours < 24) return plural(hours, 'hour');
  const days = Math.round(hours / 24);
  if (days < 30) return plural(days, 'day');
  const months = Math.round(days / 30);
  if (months < 12) return plural(months, 'month');
  return plural(Math.round(months / 12), 'year');
}

/** YYYY-MM-DD in local time (the heatmaps and the review queue agree on this). */
export function isoDate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** "12 Mar 2026" */
export function shortDate(at: Date | string | null): string {
  if (!at) return '—';
  const d = at instanceof Date ? at : new Date(at);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** 1234 -> "1.2k" */
export function compactNumber(n: number): string {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

/** 46 min -> "46m"; 95 min -> "1h 35m" */
export function duration(minutes: number | null): string {
  if (minutes === null || minutes <= 0) return '—';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** Bytes -> "1.4 MB", for the GitHub language breakdown. */
export function bytes(n: number): string {
  const units = ['B', 'kB', 'MB', 'GB'];
  let value = n;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
