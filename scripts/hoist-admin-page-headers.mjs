#!/usr/bin/env node
/**
 * Hoists static PageHeader outside Suspense on admin list pages and route loaders.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dashboardRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'app', 'admin', 'dashboard');

const listPages = [
  'users',
  'music',
  'videos',
  'news',
  'albums',
  'devotionals',
  'testimonies',
  'prayer-requests',
  'ask-a-pastor',
  'polls',
  'resources',
  'artists',
  'pastors',
  'pastor-applications',
  'role-profile-appeals',
  'staff',
  'documents',
  'email-logs',
  'contact-submissions',
  'gospel-verses',
];

function extractMeta(source) {
  const titleMatch = source.match(/pageTitle="([^"]+)"/);
  const descMatch = source.match(/pageDescription="([^"]+)"/);
  if (!titleMatch || !descMatch) return null;
  return { title: titleMatch[1], description: descMatch[1] };
}

function ensurePageHeaderImport(source) {
  if (source.includes("from '@/components/general/PageHeader'")) return source;
  return source.replace(
    /^(import .+\n)(?=import|export)/m,
    "$1import { PageHeader } from '@/components/general/PageHeader';\n"
  );
}

function hoistPageHeader(source, meta) {
  if (source.includes('<PageHeader title=')) return source;

  let next = ensurePageHeaderImport(source);
  next = next.replace(
    /(<section className="h-full space-y-6 overflow-auto sleek-scrollbar">\r?\n)(\s*<Suspense fallback=\{<AdminListPageSkeleton)/m,
    `$1        <PageHeader title="${meta.title}" description="${meta.description}" />\r\n$2 showPageHeader={false} `
  );

  return next;
}

function hoistLoadingHeader(source, meta) {
  if (source.includes('<PageHeader title=')) return source;

  let next = source;
  if (!next.includes("from '@/components/general/PageHeader'")) {
    next = next.replace(
      /^import /m,
      "import { PageHeader } from '@/components/general/PageHeader';\nimport "
    );
  }

  next = next.replace(
    /(<section className="h-full space-y-6 overflow-auto sleek-scrollbar">\r?\n)(\s*<AdminListPageSkeleton)/m,
    `$1        <PageHeader title="${meta.title}" description="${meta.description}" />\r\n$2 showPageHeader={false} `
  );

  return next;
}

let pageCount = 0;
let loadingCount = 0;

for (const segment of listPages) {
  const pagePath = join(dashboardRoot, segment, 'page.tsx');
  const loadingPath = join(dashboardRoot, segment, 'loading.tsx');
  if (!existsSync(pagePath)) continue;

  const pageSource = readFileSync(pagePath, 'utf8');
  const meta = extractMeta(pageSource);
  if (!meta) {
    console.warn('skip (no meta):', pagePath);
    continue;
  }

  const updatedPage = hoistPageHeader(pageSource, meta);
  if (updatedPage !== pageSource) {
    writeFileSync(pagePath, updatedPage);
    pageCount += 1;
  }

  if (existsSync(loadingPath)) {
    const loadingSource = readFileSync(loadingPath, 'utf8');
    const updatedLoading = hoistLoadingHeader(loadingSource, meta);
    if (updatedLoading !== loadingSource) {
      writeFileSync(loadingPath, updatedLoading);
      loadingCount += 1;
    }
  }
}

console.log(`Updated ${pageCount} page.tsx and ${loadingCount} loading.tsx files.`);
