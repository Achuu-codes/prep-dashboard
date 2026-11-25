import { redirect } from 'next/navigation';
import { features, publicProfile } from '@/lib/env';
import { LoginForm } from './form';

export const metadata = { title: 'Sign in' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // With no password configured the site is open; don't show a dead form.
  if (!features.auth) redirect('/');

  const { next } = await searchParams;
  const profile = publicProfile();

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-xs">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex size-9 items-center justify-center rounded-lg border border-border bg-surface font-mono text-sm text-accent">
            &gt;_
          </div>
          <h1 className="text-base font-semibold tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-1 text-xs text-muted">Interview prep dashboard</p>
        </div>
        <LoginForm next={next ?? '/'} />
      </div>
    </main>
  );
}
