import { describe, expect, it } from 'vitest';
import {
  pathsForRevalidationContent,
  resolveRevalidationPaths,
} from '@/lib/services/onDemandRevalidation';

describe('onDemandRevalidation paths', () => {
  it('maps music_item to home, list, and detail paths', () => {
    expect(pathsForRevalidationContent({ type: 'music_item', id: 'abc123' })).toEqual([
      '/',
      '/music',
      '/music/abc123',
    ]);
  });

  it('maps news_item to home, list, and story paths', () => {
    expect(pathsForRevalidationContent({ type: 'news_item', id: 'news-1' })).toEqual([
      '/',
      '/news',
      '/news/story/news-1',
    ]);
  });

  it('maps marketplace_product to list and slug detail paths', () => {
    expect(pathsForRevalidationContent({ type: 'marketplace_product', slug: 'cool-beat' })).toEqual(
      ['/marketplace', '/marketplace/products', '/marketplace/products/cool-beat']
    );
  });

  it('deduplicates explicit paths from webhook payload', () => {
    expect(resolveRevalidationPaths({ paths: ['/music', '/music', '/news'] })).toEqual([
      '/music',
      '/news',
    ]);
  });

  it('requires id for music_item typed payloads', () => {
    expect(() => pathsForRevalidationContent({ type: 'music_item' })).toThrow(/id is required/);
  });
});
