/** Matches Tailwind `md` — persistent dashboard sidebar is visible from this width. */
export const DASHBOARD_SIDEBAR_TABLET_MIN_PX = 768;

/** Matches Tailwind `lg` — treat as desktop for default expanded sidebar. */
export const DASHBOARD_SIDEBAR_DESKTOP_MIN_PX = 1024;

export function isDashboardTabletViewport(width: number): boolean {
  return width >= DASHBOARD_SIDEBAR_TABLET_MIN_PX && width < DASHBOARD_SIDEBAR_DESKTOP_MIN_PX;
}

export function readDashboardSidebarOpenCookie(cookieName: string): boolean | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  const match = cookies.find(cookie => cookie.trim().startsWith(`${cookieName}=`));

  if (!match) {
    return null;
  }

  const value = match.split('=')[1]?.trim();
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }

  return null;
}

export function writeDashboardSidebarOpenCookie(cookieName: string, open: boolean): void {
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${cookieName}=${open}; path=/; max-age=${maxAge}`;
}

/** Default expanded on desktop; collapsed on tablet (md–lg). */
export function getDefaultDashboardSidebarOpenWithoutCookie(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return !isDashboardTabletViewport(window.innerWidth);
}
