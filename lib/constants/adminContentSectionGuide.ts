/** Mirrors oj-backend videoSections.ts duration thresholds for admin guidance. */
export const VIDEO_DURATION_BUCKET_UNDER_5_MAX_SECONDS = 300;
export const VIDEO_DURATION_BUCKET_LONG_FORM_MIN_SECONDS = 1200;

/** @deprecated Use VIDEO_DURATION_BUCKET_UNDER_5_MAX_SECONDS - 1 for display copy. */
export const SHORT_FORM_MAX_DURATION_SECONDS = VIDEO_DURATION_BUCKET_UNDER_5_MAX_SECONDS - 1;

/** @deprecated Use VIDEO_DURATION_BUCKET_LONG_FORM_MIN_SECONDS. */
export const LONG_FORM_MIN_DURATION_SECONDS = VIDEO_DURATION_BUCKET_LONG_FORM_MIN_SECONDS;

/** Mirrors oj-backend newsSections.ts breaking-news rules. */
export const BREAKING_NEWS_MIN_PRIORITY = 4;
export const BREAKING_NEWS_MAX_AGE_DAYS = 7;

export type AdminContentScope = 'music' | 'video' | 'news';

export type AdminContentSectionGuideEntry = {
  name: string;
  surfaces: string;
  qualification: string;
  sorting: string;
  adminControls: string[];
};

export type AdminContentSectionGuide = {
  title: string;
  description: string;
  prerequisites: string[];
  sections: AdminContentSectionGuideEntry[];
  notes: string[];
};

export const ADMIN_CONTENT_SECTION_GUIDES: Record<AdminContentScope, AdminContentSectionGuide> = {
  music: {
    title: 'How music appears on the public site',
    description:
      'Published tracks with required media fields can surface in music sections and category filters. Sections are driven by API type filters, not genre alone.',
    prerequisites: [
      'Status must be published (approve submissions from this list).',
      'Audio or video URL must be present and complete enough for the public catalog.',
      'Category (genre) is required when publishing and powers category browse pages.',
    ],
    sections: [
      {
        name: 'Trending',
        surfaces: 'Home music rails, /music trending views',
        qualification: 'Any published track.',
        sorting: 'Highest play count first, then newest.',
        adminControls: ['Publish the track', 'Plays accumulate after listeners play it'],
      },
      {
        name: 'Top charts',
        surfaces: 'Charts pages (/music with chart period filters)',
        qualification: 'Any published track within the selected chart window.',
        sorting:
          'Highest play count first. Weekly = last 7 days, monthly = last 30 days, all-time = no date limit.',
        adminControls: ['Publish the track', 'Plays within the chart period determine rank'],
      },
      {
        name: 'Recent uploads',
        surfaces: 'Recent / newest music sections',
        qualification: 'Any published track.',
        sorting: 'Newest publish date first.',
        adminControls: ['Publish the track'],
      },
      {
        name: 'Featured',
        surfaces: 'Featured music sections (when enabled on the site)',
        qualification: 'Published track marked as featured.',
        sorting: 'Display order (lowest first), then newest.',
        adminControls: [
          'Featured flag and display order (backend-supported; not yet in this admin form)',
        ],
      },
    ],
    notes: [
      'Genre/category controls which category pages include the track, separate from trending/charts/recent sections.',
      'Tags help discovery but do not by themselves place a track in a section.',
    ],
  },
  video: {
    title: 'How videos appear on the public site',
    description:
      'Published videos with required media fields appear in video sections, category browse, and detail pages.',
    prerequisites: [
      'Status must be published (approve submissions from this list).',
      'A video file URL or embed URL must be present for the public catalog.',
      'Category is required when publishing.',
    ],
    sections: [
      {
        name: 'Trending',
        surfaces: 'Home video rails, trending video listings',
        qualification: 'Any published video.',
        sorting: 'Highest view count first, then newest.',
        adminControls: ['Publish the video', 'Views accumulate after visitors watch it'],
      },
      {
        name: 'Featured',
        surfaces: 'Featured video sections',
        qualification: 'Published video marked as featured.',
        sorting: 'Display order (lowest first), then newest.',
        adminControls: [
          'Featured flag and display order (backend-supported; not yet in this admin form)',
        ],
      },
      {
        name: 'Recent uploads',
        surfaces: 'Recent / newest video sections',
        qualification: 'Any published video.',
        sorting: 'Newest publish date first.',
        adminControls: ['Publish the video'],
      },
      {
        name: 'Short-form',
        surfaces: 'Short-form hub and short clips sections',
        qualification: `Category is Short Clips (or legacy short slug), or detected duration is under ${VIDEO_DURATION_BUCKET_UNDER_5_MAX_SECONDS} seconds (5 minutes).`,
        sorting: 'Newest first.',
        adminControls: [
          'Set category to Short Clips for clip-style content',
          'Enter duration manually (hours, minutes, seconds) or rely on backend probing after save',
        ],
      },
      {
        name: 'Long-form',
        surfaces: 'Long-form / movies hub (/videos/long-form)',
        qualification: `Category is Movie / long-form, or detected duration is ${VIDEO_DURATION_BUCKET_LONG_FORM_MIN_SECONDS} seconds (${VIDEO_DURATION_BUCKET_LONG_FORM_MIN_SECONDS / 60} minutes) or more.`,
        sorting: 'Newest first.',
        adminControls: [
          'Use a movie or long-form category for films and extended content',
          'Enter duration manually or rely on backend probing (including YouTube embed URLs when configured)',
        ],
      },
    ],
    notes: [
      'Short-form and long-form use category when duration is missing; otherwise duration buckets apply.',
      'Manual duration is stored as seconds and may be overwritten when a probe succeeds.',
    ],
  },
  news: {
    title: 'How news appears on the public site',
    description:
      'Published articles with required fields appear in news sections, category browse, and the breaking news surfaces.',
    prerequisites: [
      'Status must be published.',
      'Title, content, and category are required for publishing.',
    ],
    sections: [
      {
        name: 'Featured',
        surfaces: 'Featured news rails and listings',
        qualification: 'Published article marked as featured.',
        sorting: 'Display order (lowest first), then newest.',
        adminControls: ['Enable Featured in the create/edit form'],
      },
      {
        name: 'Latest',
        surfaces: 'Latest news sections and /news listings',
        qualification: 'Any published article.',
        sorting: 'Newest publish date first.',
        adminControls: ['Publish the article'],
      },
      {
        name: 'Trending',
        surfaces: 'Trending news sections',
        qualification: 'Any published article.',
        sorting: 'Highest view count first, then newest.',
        adminControls: ['Publish the article', 'Views accumulate as readers open the story'],
      },
      {
        name: 'Video stories',
        surfaces: 'News with video sections',
        qualification: 'Published article with an attached video file or embed URL.',
        sorting: 'Newest first.',
        adminControls: ['Add a video file URL or embed URL in the create/edit form'],
      },
      {
        name: 'Breaking news',
        surfaces: 'Breaking News rail, /news/breaking',
        qualification: `Priority ${BREAKING_NEWS_MIN_PRIORITY} or ${BREAKING_NEWS_MIN_PRIORITY + 1} and published within the last ${BREAKING_NEWS_MAX_AGE_DAYS} days.`,
        sorting: 'Highest priority first, then newest.',
        adminControls: [
          'Set priority to 4 or 5 in the create/edit form',
          'Use priority 5 for urgent ministry or community announcements',
          'Stories drop from breaking automatically after about one week',
        ],
      },
    ],
    notes: [
      'Priority 1–3 affects emphasis in regular feeds; only 4–5 qualify for breaking news surfaces.',
      'Categories are editorial groupings — they filter browse pages but do not replace section type rules.',
    ],
  },
};
