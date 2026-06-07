#!/usr/bin/env node
/**
 * Generates admin dashboard route loading.tsx files.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'app', 'admin', 'dashboard');

const shell = (body) => `export default function Loading() {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
${body}
      </section>
    </section>
  );
}
`;

writeLoading('loading.tsx', shell('        <AdminListPageSkeleton label="Loading dashboard..." />'), true);

const listPages = [
  ['users', 'users'],
  ['music', 'music'],
  ['videos', 'videos'],
  ['news', 'news'],
  ['albums', 'albums'],
  ['devotionals', 'devotionals'],
  ['testimonies', 'testimonies'],
  ['prayer-requests', 'prayer requests'],
  ['ask-a-pastor', 'ask a pastor'],
  ['polls', 'polls'],
  ['resources', 'resources'],
  ['artists', 'artists'],
  ['pastors', 'pastors'],
  ['pastor-applications', 'pastor applications'],
  ['role-profile-appeals', 'role profile appeals'],
  ['staff', 'staff'],
  ['documents', 'documents'],
  ['email-logs', 'email logs'],
  ['contact-submissions', 'contact submissions'],
  ['gospel-verses', 'gospel verses'],
];

for (const [segment, label] of listPages) {
  writeLoading(
    `${segment}/loading.tsx`,
    shell(`        <AdminListPageSkeleton label="Loading ${label}..." />`),
    true
  );
}

writeLoading(
  'marketplace/loading.tsx',
  shell('        <AdminMarketplacePageSkeleton />'),
  false
);
writeLoading(
  'home-adverts/loading.tsx',
  shell('        <AdminHomeAdvertsPageSkeleton />'),
  false
);
writeLoading(
  'content-categories/loading.tsx',
  shell('        <AdminContentCategoriesPageSkeleton />'),
  false
);
writeLoading('settings/loading.tsx', shell('        <AdminSettingsPageSkeleton />'), false);
writeLoading('profile/loading.tsx', shell('        <AdminProfilePageSkeleton />'), false);
writeLoading('home/loading.tsx', shell('        <AdminDashboardHomeSkeleton />'), false);

function writeLoading(relativePath, content, listOnly) {
  const imports = listOnly
    ? "import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';\n\n"
    : `import {
  AdminListPageSkeleton,
  AdminMarketplacePageSkeleton,
  AdminHomeAdvertsPageSkeleton,
  AdminContentCategoriesPageSkeleton,
  AdminSettingsPageSkeleton,
  AdminProfilePageSkeleton,
  AdminDashboardHomeSkeleton,
} from '@/components/section/admin/skeletons';\n\n`;

  const usedImports = listOnly
    ? imports
    : content.includes('AdminListPageSkeleton')
      ? "import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';\n\n"
      : content.includes('AdminMarketplacePageSkeleton')
        ? "import { AdminMarketplacePageSkeleton } from '@/components/section/admin/skeletons';\n\n"
        : content.includes('AdminHomeAdvertsPageSkeleton')
          ? "import { AdminHomeAdvertsPageSkeleton } from '@/components/section/admin/skeletons';\n\n"
          : content.includes('AdminContentCategoriesPageSkeleton')
            ? "import { AdminContentCategoriesPageSkeleton } from '@/components/section/admin/skeletons';\n\n"
            : content.includes('AdminSettingsPageSkeleton')
              ? "import { AdminSettingsPageSkeleton } from '@/components/section/admin/skeletons';\n\n"
              : content.includes('AdminProfilePageSkeleton')
                ? "import { AdminProfilePageSkeleton } from '@/components/section/admin/skeletons';\n\n"
                : "import { AdminDashboardHomeSkeleton } from '@/components/section/admin/skeletons';\n\n";

  const fullPath = join(root, relativePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, usedImports + content);
  console.log('wrote', relativePath);
}

console.log('Done.');
