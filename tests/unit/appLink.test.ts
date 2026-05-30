import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('AppLink prefetch policy', () => {
  it('defaults viewport prefetch to false with optional hover warmup', () => {
    const source = readFileSync(join(process.cwd(), 'components/atoms/AppLink.tsx'), 'utf8');

    expect(source).toContain('prefetch = false');
    expect(source).toContain('router.prefetch');
    expect(source).toContain('prefetchOnHover');
  });

  it('is used by high-density card components', () => {
    const newsCard = readFileSync(join(process.cwd(), 'components/cards/NewsCard.tsx'), 'utf8');
    const musicCard = readFileSync(join(process.cwd(), 'components/cards/MusicCard.tsx'), 'utf8');

    expect(newsCard).toContain('AppLink');
    expect(newsCard).not.toMatch(/from ['"]next\/link['"]/);
    expect(musicCard).toContain('AppLink');
  });
});
