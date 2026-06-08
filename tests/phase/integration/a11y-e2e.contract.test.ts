import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('A11y E2E contract', () => {
  it('ships axe Playwright helper and critical journey spec', () => {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));

    expect(pkg.devDependencies['@axe-core/playwright']).toBeTruthy();
    expect(pkg.scripts['test:e2e:a11y']).toContain('a11y-critical-journeys.spec.ts');

    const helper = readFileSync(join(process.cwd(), 'tests/e2e/fixtures/a11y.ts'), 'utf8');
    const spec = readFileSync(
      join(process.cwd(), 'tests/e2e/a11y-critical-journeys.spec.ts'),
      'utf8'
    );

    expect(helper).toContain('@axe-core/playwright');
    expect(helper).toContain('serious');
    expect(spec).toContain("page.goto('/',");
    expect(spec).toContain("page.goto('/music/all'");
    expect(spec).toContain("page.goto('/auth/login'");
    expect(spec).toContain("page.goto('/admin/auth/login'");
  });
});
