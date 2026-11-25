import type { Metadata, Viewport } from 'next';
import { publicProfile } from '@/lib/env';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Prep', template: '%s · Prep' },
  description: 'Interview preparation tracker and dashboard.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#0b0d10',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Applies the stored theme before first paint so there is no light flash on a
 * dark-first site. Dark is the default when nothing is stored.
 */
const themeScript = `
try {
  var t = localStorage.getItem('prep-theme');
  if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = publicProfile();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2 focus:text-fg"
        >
          Skip to content
        </a>
        {children}
        <span className="hidden" data-owner={profile.name} />
      </body>
    </html>
  );
}
