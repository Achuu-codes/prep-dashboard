import { notFound } from 'next/navigation';
import { ComingSoon } from '@/components/ui';
import { findSection } from '@/content/sections';

export const metadata = { title: 'Low-Level Design' };

export default function LldPage() {
  const section = findSection('lld');
  if (!section) notFound();
  return <ComingSoon title={section.title} description={section.description} />;
}
