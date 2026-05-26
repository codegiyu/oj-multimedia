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
  it('defines bundle and Lighthouse budget files', () => {
    const bundleBudgets = JSON.parse(readFileSync('performance-budgets.json', 'utf8'));
    const lighthouseBudgets = JSON.parse(readFileSync('lighthouse-budget.json', 'utf8'));

    expect(bundleBudgets.maxTotalStaticJsBytes).toBeGreaterThan(0);
    expect(
      lighthouseBudgets[0].timings.some(
        (row: { metric: string }) => row.metric === 'largest-contentful-paint'
      )
    ).toBe(true);
  });

  it('defines admin list API P95 budget for filtered lists', () => {
    expect(ADMIN_LIST_API_P95_TARGET_MS).toBe(300);
  });

  it('lazy-loads the root splash screen from the app layout', () => {
    const layout = readFileSync(join(process.cwd(), 'app/layout.tsx'), 'utf8');
    const splashDynamic = readFileSync(
      join(process.cwd(), 'components/general/LoadAnimationScreenDynamic.tsx'),
      'utf8'
    );

    expect(layout).toContain('LoadAnimationScreenDynamic');
    expect(layout).not.toMatch(/from ['"]@\/components\/general\/LoadAnimationScreen['"]/);
    expect(splashDynamic).toContain("from 'next/dynamic'");
    expect(splashDynamic).toContain('ssr: false');
  });

  it('enables optimizePackageImports for heavy UI dependencies', () => {
    const nextConfig = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf8');

    expect(nextConfig).toContain('optimizePackageImports');
    expect(nextConfig).toContain('lucide-react');
    expect(nextConfig).toContain('motion');
    expect(nextConfig).toContain('date-fns');
    expect(nextConfig).toContain('lodash');
  });

  it('ships server category nav fallbacks for music, video, and news', () => {
    expect(musicCategoryNavFallback[0].id).toBe('all');
    expect(videoCategoryNavFallback[0].id).toBe('all');
    expect(newsCategoryNavFallback[0].id).toBe('all');
    expect(readFileSync(join(process.cwd(), 'scripts/verify-bundle-budget.mjs'), 'utf8')).toContain(
      'maxTotalStaticJsBytes'
    );
  });
});
