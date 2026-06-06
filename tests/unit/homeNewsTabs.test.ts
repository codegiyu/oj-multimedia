import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('HomeNewsTabsClient', () => {
  it('points Latest tab View All to /news/latest', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'components/section/home/HomeNewsTabsClient.tsx'),
      'utf8'
    );

    expect(source).toContain("viewAllLink: '/news/latest'");
  });
});
