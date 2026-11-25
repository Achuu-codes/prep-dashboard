'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cx } from './ui';

export interface NavTopic {
  slug: string;
  title: string;
  solved: number;
  total: number;
  children: NavTopic[];
}

export interface NavSection {
  slug: string;
  title: string;
  status: 'active' | 'soon';
  topics: NavTopic[];
}

export interface NavProps {
  sections: NavSection[];
  dueCount: number;
  ownerName: string;
}

function TopicLink({
  sectionSlug,
  topic,
  depth = 0,
}: {
  sectionSlug: string;
  topic: NavTopic;
  depth?: number;
}) {
  const pathname = usePathname();
  const href = `/${sectionSlug}/${topic.slug}`;
  const isGroup = topic.children.length > 0;
  const childActive = topic.children.some(
    (c) => pathname === `/${sectionSlug}/${c.slug}`,
  );
  const [open, setOpen] = useState(childActive);
  const active = pathname === href;
  const pct = topic.total ? Math.round((topic.solved / topic.total) * 100) : 0;

  if (isGroup) {
    return (
      <li>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-[13px] text-muted hover:bg-surface-hover hover:text-fg"
        >
          <svg
            viewBox="0 0 16 16"
            className={cx(
              'size-3 shrink-0 transition-transform',
              open && 'rotate-90',
            )}
            fill="currentColor"
          >
            <path d="M6 4l4 4-4 4V4z" />
          </svg>
          <span className="flex-1 truncate">{topic.title}</span>
          <span className="shrink-0 text-[10px] tabular-nums text-faint">
            {topic.solved}/{topic.total}
          </span>
        </button>
        {open ? (
          <ul className="ml-3 border-l border-border pl-1.5">
            {topic.children.map((child) => (
              <TopicLink
                key={child.slug}
                sectionSlug={sectionSlug}
                topic={child}
                depth={depth + 1}
              />
            ))}
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className={cx(
          'group flex items-center gap-2 rounded-md px-2 py-1 text-[13px]',
          active
            ? 'bg-surface-hover font-medium text-fg'
            : 'text-muted hover:bg-surface-hover hover:text-fg',
        )}
      >
        <span
          aria-hidden
          className="relative h-3 w-0.5 shrink-0 overflow-hidden rounded-full bg-border"
          title={`${pct}%`}
        >
          <span
            className="absolute bottom-0 left-0 w-full bg-accent"
            style={{ height: `${pct}%` }}
          />
        </span>
        <span className="flex-1 truncate">{topic.title}</span>
        <span className="shrink-0 text-[10px] tabular-nums text-faint">
          {topic.solved}/{topic.total}
        </span>
      </Link>
    </li>
  );
}

const MAIN_LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/revise', label: 'Revise today', badge: true },
  { href: '/problems', label: 'All problems' },
  { href: '/stats', label: 'Stats' },
];

export function Nav({ sections, dueCount, ownerName }: NavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = sections.filter((s) => s.status === 'active');
  const soon = sections.filter((s) => s.status === 'soon');

  const body = (
    <nav className="flex h-full flex-col gap-5 overflow-y-auto px-3 pb-6 pt-4">
      <ul className="space-y-0.5">
        {MAIN_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cx(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]',
                pathname === link.href
                  ? 'bg-surface-hover font-medium text-fg'
                  : 'text-muted hover:bg-surface-hover hover:text-fg',
              )}
            >
              <span className="flex-1">{link.label}</span>
              {link.badge && dueCount > 0 ? (
                <span className="rounded-full bg-accent px-1.5 text-[10px] font-semibold tabular-nums text-accent-contrast">
                  {dueCount}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      {active.map((section) => (
        <div key={section.slug}>
          <div className="mb-1 flex items-baseline justify-between px-2">
            <Link
              href={`/${section.slug}`}
              onClick={() => setMobileOpen(false)}
              className="text-[10px] font-semibold uppercase tracking-[0.09em] text-faint hover:text-muted"
            >
              {section.title}
            </Link>
          </div>
          <ul className="space-y-0.5">
            {section.topics.map((topic) => (
              <TopicLink
                key={topic.slug}
                sectionSlug={section.slug}
                topic={topic}
              />
            ))}
          </ul>
        </div>
      ))}

      {soon.length ? (
        <div>
          <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.09em] text-faint">
            Coming soon
          </div>
          <ul className="space-y-0.5">
            {soon.map((section) => (
              <li key={section.slug}>
                <Link
                  href={`/${section.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'flex items-center gap-2 rounded-md px-2 py-1 text-[13px]',
                    pathname === `/${section.slug}`
                      ? 'bg-surface-hover text-fg'
                      : 'text-faint hover:bg-surface-hover hover:text-muted',
                  )}
                >
                  <span className="flex-1 truncate">{section.title}</span>
                  <span className="size-1 shrink-0 rounded-full bg-border-strong" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-bg/90 px-3 py-2 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
          className="flex size-8 items-center justify-center rounded-md border border-border text-muted"
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="currentColor">
            <path d="M1.5 3.5h13v1.5h-13zM1.5 7.25h13v1.5h-13zM1.5 11h13v1.5h-13z" />
          </svg>
        </button>
        <span className="flex-1 truncate text-[13px] font-medium">
          {ownerName}
        </span>
        {dueCount > 0 ? (
          <Link
            href="/revise"
            className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-contrast"
          >
            {dueCount} due
          </Link>
        ) : null}
      </div>

      {mobileOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-[49px] z-20 overflow-y-auto border-b border-border bg-bg md:hidden">
          {body}
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 border-r border-border bg-bg-subtle md:block">
        {body}
      </aside>
    </>
  );
}
