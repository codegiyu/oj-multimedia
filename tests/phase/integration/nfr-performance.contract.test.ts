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

  it('ships server category nav fallbacks for music, video, and news', () => {
    expect(musicCategoryNavFallback[0].id).toBe('all');
    expect(videoCategoryNavFallback[0].id).toBe('all');
    expect(newsCategoryNavFallback[0].id).toBe('all');
    expect(readFileSync(join(process.cwd(), 'scripts/verify-bundle-budget.mjs'), 'utf8')).toContain(
      'maxTotalStaticJsBytes'
    );
  });
});
