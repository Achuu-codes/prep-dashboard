import { notFound } from 'next/navigation';
import { ComingSoon } from '@/components/ui';
import { findSection } from '@/content/sections';

export const metadata = { title: 'Code Comprehension' };

export default function ComprehensionPage() {
  const section = findSection('comprehension');
  if (!section) notFound();
  return <ComingSoon title={section.title} description={section.description} />;
}
