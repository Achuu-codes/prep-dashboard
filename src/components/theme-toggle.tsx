'use client';

import { useEffect, useState } from 'react';

/**
 * Dark is the default, so this only ever stores an explicit 'light' or 'dark'.
 * The value is applied before paint by the inline script in the root layout.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = document.documentElement.getAttribute('data-theme');
    setTheme(stored === 'light' ? 'light' : 'dark');
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('prep-theme', next);
    } catch {
      /* private mode: the toggle still works for this session */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="flex size-7 items-center justify-center rounded-md border border-border text-muted hover:bg-surface-hover hover:text-fg"
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
          <path d="M8 11a3 3 0 100-6 3 3 0 000 6zM8 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V.75A.75.75 0 018 0zm0 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 018 13zM0 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H.75A.75.75 0 010 8zm13 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0113 8zM2.34 2.34a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06L2.34 3.4a.75.75 0 010-1.06zm8.2 8.2a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zm3.12-8.2a.75.75 0 010 1.06L12.6 4.46a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm-8.2 8.2a.75.75 0 010 1.06L3.4 12.66a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0z" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
          <path d="M9.598 1.591a.75.75 0 01.785-.175 7 7 0 11-8.967 8.967.75.75 0 01.961-.96 5.5 5.5 0 007.046-7.046.75.75 0 01.175-.786z" />
        </svg>
      )}
    </button>
  );
}
