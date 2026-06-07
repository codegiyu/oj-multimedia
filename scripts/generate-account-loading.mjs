#!/usr/bin/env node
/**
 * One-off generator for account dashboard route loading.tsx files.
 * Run from oj-multimedia: node scripts/generate-account-loading.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'app', 'account');

const navImports = {
  hub: "USER_ACCOUNT_NAV",
  community: "USER_ACCOUNT_NAV",
  artist: "USER_ARTIST_NAV",
  vendor: "USER_VENDOR_NAV",
  pastor: "USER_PASTOR_NAV",
};

const portalConfigs = [
  {
    path: '(hub)/loading.tsx',
    nav: 'hub',
    brandTitle: 'My Account',
    brandSubtitle: 'Loading…',
    skeleton: 'DashboardMainSkeleton',
    skeletonImport: '@/components/section/account/skeletons',
  },
  {
    path: 'community/loading.tsx',
    nav: 'community',
    brandTitle: 'My Community',
    brandSubtitle: 'Loading…',
    skeleton: 'DashboardMainSkeleton',
    skeletonImport: '@/components/section/account/skeletons',
  },
  {
    path: 'artist-portal/loading.tsx',
    nav: 'artist',
    brandTitle: 'Artist Portal',
    skeleton: 'DashboardMainSkeleton',
    skeletonImport: '@/components/section/account/skeletons',
  },
  {
    path: 'vendor/loading.tsx',
    nav: 'vendor',
    brandTitle: 'Vendor Dashboard',
    skeleton: 'DashboardMainSkeleton',
    skeletonImport: '@/components/section/account/skeletons',
  },
  {
    path: 'pastor-portal/loading.tsx',
    nav: 'pastor',
    brandTitle: 'Pastor Portal',
    skeleton: 'DashboardMainSkeleton',
    skeletonImport: '@/components/section/account/skeletons',
  },
];

const leafConfigs = [
  { path: '(hub)/orders/loading.tsx', nav: 'hub', brandTitle: 'My Account', skeleton: 'AccountOrdersPageSkeleton' },
  { path: '(hub)/wishlist/loading.tsx', nav: 'hub', brandTitle: 'My Account', skeleton: 'AccountWishlistPageSkeleton' },
  { path: '(hub)/favorites/loading.tsx', nav: 'hub', brandTitle: 'My Account', skeleton: 'AccountFavoritesPageSkeleton' },
  { path: '(hub)/settings/loading.tsx', nav: 'hub', brandTitle: 'My Account', skeleton: 'AccountSettingsPageSkeleton' },
  { path: 'artist-portal/music/loading.tsx', nav: 'artist', brandTitle: 'Artist Portal', skeleton: 'ArtistPortalContentListPageSkeleton' },
  { path: 'artist-portal/videos/loading.tsx', nav: 'artist', brandTitle: 'Artist Portal', skeleton: 'ArtistPortalContentListPageSkeleton' },
  { path: 'artist-portal/albums/loading.tsx', nav: 'artist', brandTitle: 'Artist Portal', skeleton: 'ArtistPortalAlbumsPageSkeleton' },
  { path: 'artist-portal/upload/loading.tsx', nav: 'artist', brandTitle: 'Artist Portal', skeleton: 'ArtistPortalUploadPageSkeleton' },
  { path: 'artist-portal/settings/loading.tsx', nav: 'artist', brandTitle: 'Artist Portal', skeleton: 'ArtistPortalSettingsPageSkeleton' },
  { path: 'vendor/products/loading.tsx', nav: 'vendor', brandTitle: 'Vendor Dashboard', skeleton: 'VendorProductsPageSkeleton' },
  { path: 'vendor/orders/loading.tsx', nav: 'vendor', brandTitle: 'Vendor Dashboard', skeleton: 'VendorOrdersPageSkeleton' },
  { path: 'vendor/settings/loading.tsx', nav: 'vendor', brandTitle: 'Vendor Dashboard', skeleton: 'VendorSettingsPageSkeleton' },
  { path: 'vendor/products/new/loading.tsx', nav: 'vendor', brandTitle: 'Vendor Dashboard', skeleton: 'VendorProductFormPageSkeleton' },
  { path: 'vendor/products/[id]/edit/loading.tsx', nav: 'vendor', brandTitle: 'Vendor Dashboard', skeleton: 'VendorProductFormPageSkeleton' },
  { path: 'pastor-portal/questions/loading.tsx', nav: 'pastor', brandTitle: 'Pastor Portal', skeleton: 'PastorPortalQuestionsRouteSkeleton', customBody: true },
  { path: 'pastor-portal/settings/loading.tsx', nav: 'pastor', brandTitle: 'Pastor Portal', skeleton: 'PastorPortalSettingsPageSkeleton' },
  { path: 'community/questions/[id]/loading.tsx', nav: 'community', brandTitle: 'My Community', skeleton: 'AccountCommunityQuestionDetailSkeleton' },
];

function writePortalLoader({ path, nav, brandTitle, brandSubtitle, skeleton, skeletonImport }) {
  const content = `import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { ${skeleton} } from '${skeletonImport}';
import { ${navImports[nav]} } from '@/lib/constants/user-dashboard-nav';

export default function Loading() {
  return (
    <DashboardRouteLoading
      brandTitle="${brandTitle}"
      brandSubtitle="${brandSubtitle ?? 'Loading…'}"
      items={${navImports[nav]}}>
      <${skeleton} />
    </DashboardRouteLoading>
  );
}
`;
  writeLoading(path, content);
}

function writeLeafLoader({ path, nav, brandTitle, skeleton, customBody }) {
  if (customBody && skeleton === 'PastorPortalQuestionsRouteSkeleton') {
    const content = `import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { ${navImports[nav]} } from '@/lib/constants/user-dashboard-nav';
import {
  PastorMeSectionSkeleton,
  PastorQuestionsListSectionSkeleton,
} from '@/app/account/pastor-portal/_sections/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="${brandTitle}" items={${navImports[nav]}}>
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <PastorMeSectionSkeleton />
        <PastorQuestionsListSectionSkeleton />
      </div>
    </DashboardRouteLoading>
  );
}
`;
    writeLoading(path, content);
    return;
  }

  const content = `import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { ${skeleton} } from '@/components/section/account/skeletons';
import { ${navImports[nav]} } from '@/lib/constants/user-dashboard-nav';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="${brandTitle}" items={${navImports[nav]}}>
      <${skeleton} />
    </DashboardRouteLoading>
  );
}
`;
  writeLoading(path, content);
}

function writeLoading(relativePath, content) {
  const fullPath = join(root, relativePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
  console.log('wrote', relativePath);
}

for (const config of portalConfigs) writePortalLoader(config);
for (const config of leafConfigs) writeLeafLoader(config);

console.log('Done.');
