import Link from 'next/link';
import { Nav, type NavSection, type NavTopic } from '@/components/nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { getNav, getTopicStats, rollUp, countDue } from '@/db/queries/content';
import { publicProfile } from '@/lib/env';
import { endOfDay } from '@/lib/srs';
import { LogoutButton } from './logout-button';

export const dynamic = 'force-dynamic';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const endToday = endOfDay();
  const [tree, stats, dueCount] = await Promise.all([
    getNav(),
    getTopicStats(endToday),
    countDue(endToday),
  ]);
  const profile = publicProfile();

  const sections: NavSection[] = tree.map((section) => ({
    slug: section.slug,
    title: section.title,
    status: section.status,
    topics: section.topics.map(function toNavTopic(topic): NavTopic {
      const s = rollUp(topic, stats);
      return {
        slug: topic.slug,
        title: topic.title,
        solved: s.solved,
        total: s.total,
        children: topic.children.map(toNavTopic),
      };
    }),
  }));

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <Nav
        sections={sections}
        dueCount={dueCount}
        ownerName={profile.name}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="hidden items-center gap-3 border-b border-border px-6 py-2.5 md:flex">
          <Link href="/" className="text-[13px] font-semibold tracking-tight">
            {profile.name}
          </Link>
          {profile.tagline ? (
            <span className="truncate text-xs text-faint">
              {profile.tagline}
            </span>
          ) : null}
          <div className="flex-1" />
          <ThemeToggle />
          <LogoutButton />
        </header>
        <main id="main" className="min-w-0 flex-1 px-4 py-5 md:px-6 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
