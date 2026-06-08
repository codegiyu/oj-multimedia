import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('media card link structure', () => {
  it('keeps artist links outside track/album title links', () => {
    const musicCard = readFileSync(join(process.cwd(), 'components/cards/MusicCard.tsx'), 'utf8');
    const albumCard = readFileSync(join(process.cwd(), 'components/cards/AlbumCard.tsx'), 'utf8');
    const chartCard = readFileSync(join(process.cwd(), 'components/cards/ChartCard.tsx'), 'utf8');

    expect(musicCard).toMatch(/<\/AppLink>[\s\S]*<ArtistNameLine artist=\{artist\} \/>/);
    expect(albumCard).toMatch(/<\/AppLink>[\s\S]*<ArtistNameLine artist=\{artist\} \/>/);
    expect(chartCard).toContain('{titleBlock}');
    expect(chartCard).toContain('<ArtistNameLine artist={artist} />');
    expect(chartCard).not.toContain('aria-label={`View ${title} by');
  });
});
