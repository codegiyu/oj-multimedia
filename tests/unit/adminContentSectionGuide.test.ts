import { describe, expect, it } from 'vitest';
import {
  ADMIN_CONTENT_SECTION_GUIDES,
  BREAKING_NEWS_MAX_AGE_DAYS,
  BREAKING_NEWS_MIN_PRIORITY,
  LONG_FORM_MIN_DURATION_SECONDS,
  SHORT_FORM_MAX_DURATION_SECONDS,
} from '@/lib/constants/adminContentSectionGuide';

describe('adminContentSectionGuide', () => {
  it('defines guides for music, video, and news', () => {
    expect(Object.keys(ADMIN_CONTENT_SECTION_GUIDES).sort()).toEqual(['music', 'news', 'video']);

    for (const scope of ['music', 'video', 'news'] as const) {
      const guide = ADMIN_CONTENT_SECTION_GUIDES[scope];
      expect(guide.title.length).toBeGreaterThan(0);
      expect(guide.sections.length).toBeGreaterThan(0);
      expect(guide.prerequisites.length).toBeGreaterThan(0);
    }
  });

  it('documents breaking news priority and age window aligned with backend', () => {
    const breaking = ADMIN_CONTENT_SECTION_GUIDES.news.sections.find(
      s => s.name === 'Breaking news'
    );

    expect(breaking).toBeDefined();
    expect(breaking?.qualification).toContain(String(BREAKING_NEWS_MIN_PRIORITY));
    expect(breaking?.qualification).toContain(String(BREAKING_NEWS_MAX_AGE_DAYS));
  });

  it('documents short-form and long-form duration thresholds aligned with backend', () => {
    const shortForm = ADMIN_CONTENT_SECTION_GUIDES.video.sections.find(
      s => s.name === 'Short-form'
    );
    const longForm = ADMIN_CONTENT_SECTION_GUIDES.video.sections.find(s => s.name === 'Long-form');

    expect(shortForm?.qualification).toContain(String(SHORT_FORM_MAX_DURATION_SECONDS));
    expect(longForm?.qualification).toContain(String(LONG_FORM_MIN_DURATION_SECONDS));
  });
});
