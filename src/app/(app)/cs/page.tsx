import { notFound } from 'next/navigation';
import { ComingSoon } from '@/components/ui';
import { findSection } from '@/content/sections';

export const metadata = { title: 'CS Fundamentals' };

export default function CsPage() {
  const section = findSection('cs');
  if (!section) notFound();
  return <ComingSoon title={section.title} description={section.description} />;
}
