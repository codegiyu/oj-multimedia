/** Static routes for Playwright smoke coverage (Phase 5). */

export type SmokeRoute = {
  path: string;
  titlePattern?: RegExp;
  /** HTTP status when backend/API is unavailable but the route still renders. */
  expectStatus?: number;
};

export const PUBLIC_CONTENT_ROUTES: SmokeRoute[] = [
  { path: '/', titlePattern: /Home/i },
  { path: '/music', titlePattern: /Music/i },
  { path: '/music/trending', titlePattern: /Trending/i },
  { path: '/music/top-charts', titlePattern: /Charts|Top/i },
  { path: '/videos', titlePattern: /Videos/i },
  { path: '/videos/trending', titlePattern: /Trending/i },
  { path: '/news', titlePattern: /News/i },
  { path: '/news/trending', titlePattern: /Trending|News/i },
  { path: '/marketplace', titlePattern: /Marketplace/i },
  { path: '/marketplace/products', titlePattern: /Products|Marketplace/i },
  { path: '/contact', titlePattern: /Contact/i },
  { path: '/privacy-policy', titlePattern: /Privacy/i },
];

/** Community sub-routes wired in Phase 2. */
export const COMMUNITY_API_ROUTES: SmokeRoute[] = [
  { path: '/community', titlePattern: /Community/i },
  { path: '/community/devotionals/popular', titlePattern: /Popular Devotionals/i },
  { path: '/community/devotionals/bible-study', titlePattern: /Bible Study/i },
  { path: '/community/testimonies/latest', titlePattern: /Latest Testimonies/i },
  { path: '/community/testimonies/featured', titlePattern: /Featured Testimonies/i },
  { path: '/community/prayer-requests/active', titlePattern: /Active Prayer/i },
  { path: '/community/prayer-requests/answered', titlePattern: /Answered Prayers/i },
  { path: '/community/ask-a-pastor/active', titlePattern: /Active Questions/i },
  { path: '/community/ask-a-pastor/answered', titlePattern: /Answered Questions/i },
];

export const COMMUNITY_DETAIL_NOT_FOUND_ROUTES: SmokeRoute[] = [
  {
    path: '/community/testimonies/e2e-smoke-missing-id',
    titlePattern: /Testimony Not Found/i,
  },
  {
    path: '/community/prayer-requests/e2e-smoke-missing-id',
    titlePattern: /Prayer Request Not Found/i,
  },
  {
    path: '/community/ask-a-pastor/e2e-smoke-missing-id',
    titlePattern: /Question Not Found/i,
  },
];

export const MARKETPLACE_ROUTES: SmokeRoute[] = [
  { path: '/marketplace/vendors', titlePattern: /Vendors|Marketplace/i },
  {
    path: '/marketplace/products/e2e-smoke-missing-slug',
    titlePattern: /Product not found|Marketplace/i,
  },
];

export const CLIENT_AUTH_ROUTES: SmokeRoute[] = [{ path: '/auth/login', titlePattern: /Sign In/i }];

export const ADMIN_UNPROTECTED_ROUTES: SmokeRoute[] = [
  { path: '/admin/auth/login', titlePattern: /Sign In|Admin/i },
  {
    path: '/admin/auth/accept-invite/create-password',
    titlePattern: /Create Your Admin Password|Create Your Password/i,
  },
];

/** Dashboard lists — unauthenticated users should land on admin login. */
export const ADMIN_PROTECTED_ROUTES: string[] = [
  '/admin/dashboard/home',
  '/admin/dashboard/music',
  '/admin/dashboard/albums',
  '/admin/dashboard/videos',
  '/admin/dashboard/devotionals',
  '/admin/dashboard/news',
  '/admin/dashboard/prayer-requests',
  '/admin/dashboard/ask-a-pastor',
  '/admin/dashboard/testimonies',
  '/admin/dashboard/gospel-verses',
  '/admin/dashboard/marketplace',
  '/admin/dashboard/artists-pastors',
];

export const ACCOUNT_PROTECTED_ROUTES: string[] = [
  '/account',
  '/account/artist-portal',
  '/account/artist-portal/music',
  '/account/vendor',
];
