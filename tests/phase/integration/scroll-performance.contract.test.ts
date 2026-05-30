import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Scroll performance contract', () => {
  it('documents investigation steps for scroll jank attribution', () => {
    const doc = readFileSync(join(process.cwd(), 'docs/SCROLL-PERFORMANCE.md'), 'utf8');

    expect(doc).toContain('Quick A/B');
    expect(doc).toContain('Web Vitals');
    expect(doc).toContain('AppLink');
  });
});
