import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  musicCategoryNavFallback,
  newsCategoryNavFallback,
  videoCategoryNavFallback,
} from '../../../lib/constants/categoryNavFallbacks';
import { ADMIN_LIST_API_P95_TARGET_MS } from '../../../lib/constants/adminListPerformance';

describe('NFR performance contract', () => {
  it('defines tiered bundle and Lighthouse budget files without contradiction', () => {
    const bundleBudgets = JSON.parse(readFileSync('performance-budgets.json', 'utf8'));
    const lighthouseBudgets = JSON.parse(readFileSync('lighthouse-budget.json', 'utf8'));

    expect(bundleBudgets.smoke.maxTotalStaticJsBytes).toBe(bundleBudgets.maxTotalStaticJsBytes);
    expect(bundleBudgets.smoke.maxSingleChunkBytes).toBe(bundleBudgets.maxSingleChunkBytes);
    expect(bundleBudgets.lighthouse.maxScriptTransferKb).toBe(500);
    expect(
      lighthouseBudgets[0].resourceSizes.find(
        (row: { resourceType: string }) => row.resourceType === 'script'
      )?.budget
    ).toBe(500);
    expect(
      lighthouseBudgets[0].timings.some(
        (row: { metric: string }) => row.metric === 'largest-contentful-paint'
      )
    ).toBe(true);
  });

  it('defines admin list API P95 budget for filtered lists', () => {
    expect(ADMIN_LIST_API_P95_TARGET_MS).toBe(300);
  });

  it('lazy-loads the root splash screen and gates it in production', () => {
    const layout = readFileSync(join(process.cwd(), 'app/layout.tsx'), 'utf8');
    const splashDynamic = readFileSync(
      join(process.cwd(), 'components/general/LoadAnimationScreenDynamic.tsx'),
      'utf8'
    );

    expect(layout).toContain('LoadAnimationScreenDynamic');
    expect(layout).not.toMatch(/from ['"]@\/components\/general\/LoadAnimationScreen['"]/);
    expect(splashDynamic).toContain("from 'next/dynamic'");
    expect(splashDynamic).toContain('ssr: false');
    expect(splashDynamic).toContain('NEXT_PUBLIC_ENABLE_SPLASH');
    expect(splashDynamic).toContain("process.env.NODE_ENV !== 'production'");
  });

  it('uses low fetch priority on non-LCP FillImage instances', () => {
    const fillImage = readFileSync(join(process.cwd(), 'components/general/FillImage.tsx'), 'utf8');

    expect(fillImage).toContain("fetchPriority={priority ? 'high' : 'low'}");
  });

  it('ships AppLink with deferred viewport prefetch for list cards', () => {
    const appLink = readFileSync(join(process.cwd(), 'components/atoms/AppLink.tsx'), 'utf8');
    const newsCard = readFileSync(join(process.cwd(), 'components/cards/NewsCard.tsx'), 'utf8');

    expect(appLink).toContain('prefetch = false');
    expect(newsCard).toContain('AppLink');
  });

  it('enables optimizePackageImports for heavy UI dependencies', () => {
    const nextConfig = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf8');

    expect(nextConfig).toContain('optimizePackageImports');
    expect(nextConfig).toContain('lucide-react');
    expect(nextConfig).toContain('motion');
    expect(nextConfig).toContain('date-fns');
  });

  it('does not depend on lodash or unused icon/dnd packages', () => {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    const deps = Object.keys(pkg.dependencies ?? {});

    expect(deps).not.toContain('lodash');
    expect(deps).not.toContain('react-icons');
    expect(deps).not.toContain('@dnd-kit/core');
    expect(deps).not.toContain('radix-ui');
    expect(deps).toContain('@radix-ui/react-progress');
  });

  it('uses @radix-ui/react-progress instead of the radix-ui meta package', () => {
    const progress = readFileSync(join(process.cwd(), 'components/ui/progress.tsx'), 'utf8');

    expect(progress).toContain('@radix-ui/react-progress');
    expect(progress).not.toContain("from 'radix-ui'");
  });

  it('ships server category nav fallbacks for music, video, and news', () => {
    expect(musicCategoryNavFallback[0].id).toBe('all');
    expect(videoCategoryNavFallback[0].id).toBe('all');
    expect(newsCategoryNavFallback[0].id).toBe('all');
    const verifyScript = readFileSync(
      join(process.cwd(), 'scripts/verify-bundle-budget.mjs'),
      'utf8'
    );

    expect(verifyScript).toContain('smoke');
    expect(verifyScript).toContain('maxTotalStaticJsBytes');
  });
});
