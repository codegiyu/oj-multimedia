/** Smoke routes for /all browse pages (Phase 4). */

export type BrowseAllSmokeRoute = {
  path: string;
  titlePattern: RegExp;
  toolbarSelector?: string;
};

export const BROWSE_ALL_ROUTES: BrowseAllSmokeRoute[] = [
  { path: '/music/all', titlePattern: /All Music|Music/i, toolbarSelector: 'input[type="search"]' },
  {
    path: '/videos/all',
    titlePattern: /All Videos|Videos/i,
    toolbarSelector: 'input[type="search"]',
  },
  { path: '/news/all', titlePattern: /All Stories|News/i, toolbarSelector: 'input[type="search"]' },
  {
    path: '/community/devotionals/all',
    titlePattern: /All Devotionals|Devotionals/i,
    toolbarSelector: 'input[type="search"]',
  },
  {
    path: '/community/artists/all',
    titlePattern: /All Artists|Artists/i,
    toolbarSelector: 'input[type="search"]',
  },
];
