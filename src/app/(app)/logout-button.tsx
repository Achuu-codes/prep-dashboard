import { features } from '@/lib/env';
import { logout } from '@/app/login/actions';

export function LogoutButton() {
  if (!features.auth) {
    return (
      <span
        className="text-[11px] text-faint"
        title="Set APP_PASSWORD and AUTH_SECRET to put the site behind a password"
      >
        unlocked
      </span>
    );
  }
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-md border border-border px-2 py-1 text-[11px] text-muted hover:bg-surface-hover hover:text-fg"
      >
        Sign out
      </button>
    </form>
  );
}
