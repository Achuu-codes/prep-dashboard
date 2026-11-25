import { notFound } from 'next/navigation';
import { ComingSoon } from '@/components/ui';
import { findSection } from '@/content/sections';

export const metadata = { title: 'Applications' };

export default function ApplicationsPage() {
  const section = findSection('applications');
  if (!section) notFound();
  return <ComingSoon title={section.title} description={section.description} />;
}
