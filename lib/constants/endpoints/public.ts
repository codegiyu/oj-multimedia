import type { EndpointDetails } from './types';

export const PUBLIC_ENDPOINTS: Record<string, EndpointDetails> = {
  // Public (music, videos, news)
  PUBLIC_GET_MUSIC: { path: '/api/v1/public/music', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_MUSIC_ITEM: { path: '/api/v1/public/music', method: 'GET', isNotAuthenticated: true }, // /:idOrSlug
  PUBLIC_GET_ALBUMS: { path: '/api/v1/public/albums', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_ALBUM_ITEM: {
    path: '/api/v1/public/albums',
    method: 'GET',
    isNotAuthenticated: true,
  }, // /:idOrSlug
  PUBLIC_GET_VIDEOS: { path: '/api/v1/public/videos', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_VIDEO_ITEM: { path: '/api/v1/public/videos', method: 'GET', isNotAuthenticated: true }, // /:idOrSlug
  PUBLIC_GET_NEWS: { path: '/api/v1/public/news', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_NEWS_ITEM: { path: '/api/v1/public/news', method: 'GET', isNotAuthenticated: true }, // /:idOrSlug
  PUBLIC_GET_CONTENT_CATEGORIES: {
    path: '/api/v1/public/content-categories',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_HOME_ADVERTS: {
    path: '/api/v1/public/home-adverts',
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Public community (read)
  PUBLIC_GET_COMMUNITY: {
    path: '/api/v1/public/community',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_COMMUNITY_HIGHLIGHTS: {
    path: '/api/v1/public/community/highlights',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_ASK_A_PASTOR_HUB: {
    path: '/api/v1/public/ask-a-pastor/hub',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_PRAYER_REQUESTS_HUB: {
    path: '/api/v1/public/prayer-requests/hub',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_DEVOTIONALS: {
    path: '/api/v1/public/devotionals',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_DEVOTIONAL_ITEM: {
    path: '/api/v1/public/devotionals',
    method: 'GET',
    isNotAuthenticated: true,
  }, // /:idOrSlug
  PUBLIC_GET_TESTIMONIES: {
    path: '/api/v1/public/testimonies',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_TESTIMONY_ITEM: {
    path: '/api/v1/public/testimonies',
    method: 'GET',
    isNotAuthenticated: true,
  }, // /:idOrSlug
  PUBLIC_GET_PRAYER_REQUESTS: {
    path: '/api/v1/public/prayer-requests',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_PRAYER_REQUEST_ITEM: {
    path: '/api/v1/public/prayer-requests',
    method: 'GET',
    isNotAuthenticated: true,
  }, // /:idOrSlug
  PUBLIC_PRAYER_REQUEST_PRAY: {
    path: '/api/v1/public/prayer-requests',
    method: 'POST',
    isNotAuthenticated: true,
  }, // /:idOrSlug/pray
  PUBLIC_GET_ASK_A_PASTOR_QUESTIONS: {
    path: '/api/v1/public/ask-a-pastor/questions',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_ASK_A_PASTOR_QUESTION_ITEM: {
    path: '/api/v1/public/ask-a-pastor/questions',
    method: 'GET',
    isNotAuthenticated: true,
  }, // /:idOrSlug
  PUBLIC_GET_ASK_A_PASTOR_PASTORS: {
    path: '/api/v1/public/ask-a-pastor/pastors',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_ASK_A_PASTOR_PASTOR_ITEM: {
    path: '/api/v1/public/ask-a-pastor/pastors',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_QUESTION_VOTE: {
    path: '/api/v1/public/ask-a-pastor/questions',
    method: 'POST',
  },
  PUBLIC_ANSWER_LIKE: {
    path: '/api/v1/public/ask-a-pastor/questions',
    method: 'POST',
  },
  PUBLIC_GET_POLLS: { path: '/api/v1/public/polls', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_POLL_ITEM: { path: '/api/v1/public/polls', method: 'GET', isNotAuthenticated: true }, // /:idOrSlug
  PUBLIC_GET_ARTISTS: { path: '/api/v1/public/artists', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_ARTIST_ITEM: {
    path: '/api/v1/public/artists',
    method: 'GET',
    isNotAuthenticated: true,
  }, // /:idOrSlug
  PUBLIC_GET_RESOURCES: {
    path: '/api/v1/public/resources',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_RESOURCE_ITEM: {
    path: '/api/v1/public/resources',
    method: 'GET',
    isNotAuthenticated: true,
  }, // /:idOrSlug
  PUBLIC_GET_RESOURCE_COUNTS: {
    path: '/api/v1/public/resources/counts',
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Promotion content (public)
  PUBLIC_GET_FEATURED_OPTIONS: {
    path: '/api/v1/public/featured-options',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_PROMOTION_PRICING_OPTIONS: {
    path: '/api/v1/public/promotion-pricing-options',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_RESOURCE_DOWNLOAD_CATEGORIES: {
    path: '/api/v1/public/resource-download-categories',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_PROMOTION_CONTACT: {
    path: '/api/v1/public/promotion-contact',
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Public community (write)
  PUBLIC_SUBMIT_PRAYER_REQUEST: {
    path: '/api/v1/public/prayer-requests',
    method: 'POST',
    isNotAuthenticated: true,
  },
  PUBLIC_SUBMIT_QUESTION: {
    path: '/api/v1/public/ask-a-pastor/questions',
    method: 'POST',
    isNotAuthenticated: true,
  },
  PUBLIC_SUBMIT_TESTIMONY: {
    path: '/api/v1/public/testimonies',
    method: 'POST',
    isNotAuthenticated: true,
  },
  PUBLIC_POLL_VOTE: { path: '/api/v1/public/polls', method: 'POST' }, // /:idOrSlug/vote — auth required
  PUBLIC_CREATE_POLL: { path: '/api/v1/public/polls', method: 'POST' },

  // Contact & Search (public)
  PUBLIC_SUBMIT_CONTACT: {
    path: '/api/v1/public/contact',
    method: 'POST',
    isNotAuthenticated: true,
  },
  PUBLIC_SEARCH: { path: '/api/v1/public/search', method: 'GET', isNotAuthenticated: true },
  PUBLIC_CONTENT_ANALYTICS_EVENT: {
    path: '/api/v1/public/analytics/content-event',
    method: 'POST',
    isNotAuthenticated: true,
  },
};
