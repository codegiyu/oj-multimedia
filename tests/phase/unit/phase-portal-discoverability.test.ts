import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('phase portal discoverability', () => {
  it('footer creators links point at account portals, not public directories', () => {
    const footer = readFileSync(
      join(process.cwd(), 'components/layout/Footer.tsx'),
      'utf8'
    );

    expect(footer).toContain("label: 'Artist Portal', href: '/account/artist-portal'");
    expect(footer).toContain("label: 'Pastor Portal', href: '/account/pastor-portal'");
    expect(footer).not.toContain("label: 'Artist Portal', href: '/community/artists'");
  });

  it('account hub portals stat includes pastor', () => {
    const hub = readFileSync(join(process.cwd(), 'app/account/(hub)/page.tsx'), 'utf8');

    expect(hub).toContain('value="3"');
    expect(hub).toContain('Artist, vendor & pastor');
  });
});
