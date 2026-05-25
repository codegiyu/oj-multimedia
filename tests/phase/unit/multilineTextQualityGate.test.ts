import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { splitIntoParagraphs, splitParagraphLines } from '@/lib/utils/multilineText';
import { mapPublicNewsToDetailItem } from '@/lib/utils/publicApiMappers';
import type { PublicNewsListItem } from '@/lib/constants/endpoints';

/** Phase 5 acceptance: hybrid newline behavior for textarea-backed news content. */
const SPOT_CHECK_TEXT = 'Line1\nLine2\n\nLine3';

const editorialDetailPages = [
  'components/section/news/NewsDetailPageClient.tsx',
  'components/section/community/devotionals/DevotionalDetailPageClient.tsx',
  'components/section/community/testimonies/TestimonyDetailPageClient.tsx',
] as const;

const adminDrawerParagraphSurfaces = [
  'components/section/admin/news/NewsDetailsDrawer.tsx',
  'components/section/admin/music/MusicDetailsDrawer.tsx',
  'components/section/admin/testimonies/TestimoniesDetailsDrawer.tsx',
  'components/section/admin/ask-a-pastor/AskAPastorDetailsDrawer.tsx',
] as const;

describe('multiline text phase 5 quality gate', () => {
  describe('spot-check newline semantics', () => {
    it('splits spot-check sample into two paragraphs', () => {
      expect(splitIntoParagraphs(SPOT_CHECK_TEXT)).toEqual(['Line1\nLine2', 'Line3']);
    });

    it('keeps single newline as line break within first paragraph', () => {
      expect(splitParagraphLines('Line1\nLine2')).toEqual(['Line1', 'Line2']);
    });

    it('preserves raw content on public news mapper for drawer/detail display', () => {
      const mapped = mapPublicNewsToDetailItem({
        _id: '1',
        title: 'T',
        category: 'c',
        content: SPOT_CHECK_TEXT,
      } as PublicNewsListItem);
      expect(mapped.fullStory?.introduction).toBe(SPOT_CHECK_TEXT);
    });
  });

  describe('editorial detail pages use staggered paragraph motion', () => {
    it.each(editorialDetailPages)(
      '%s enables MultilineText or StructuredProseContent animate',
      file => {
        const source = readFileSync(join(process.cwd(), file), 'utf8');
        expect(source).toMatch(/\banimate\b/);
        expect(source).toMatch(/MultilineText|StructuredProseContent/);
      }
    );
  });

  describe('admin drawers preserve paragraph layout', () => {
    it.each(adminDrawerParagraphSurfaces)(
      '%s uses preserveParagraphs or MultilineText for long text',
      file => {
        const source = readFileSync(join(process.cwd(), file), 'utf8');
        expect(source).toMatch(/preserveParagraphs|MultilineText/);
      }
    );
  });

  describe('forms unchanged (storage remains raw string)', () => {
    it('CreateNewsModal still binds textarea values without transforming newlines', () => {
      const source = readFileSync(
        join(process.cwd(), 'components/section/admin/news/CreateNewsModal.tsx'),
        'utf8'
      );
      expect(source).toMatch(/RegularTextarea/);
      expect(source).toMatch(/form\.content/);
      expect(source).not.toMatch(/splitIntoParagraphs|normalizeMultilineInput/);
    });
  });
});
