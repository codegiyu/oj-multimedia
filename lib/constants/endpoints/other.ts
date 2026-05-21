import type { EndpointDetails } from './types';

export const OTHER_ENDPOINTS: Record<string, EndpointDetails> = {
  // Artist dashboard
  ARTIST_GET_ME: {
    path: '/api/v1/artist/me',
    method: 'GET',
  },
  ARTIST_CREATE_ME: {
    path: '/api/v1/artist/me',
    method: 'POST',
  },
  ARTIST_UPDATE_ME: {
    path: '/api/v1/artist/me',
    method: 'PATCH',
  },
  ARTIST_GET_DASHBOARD_STATS: {
    path: '/api/v1/artist/dashboard-stats',
    method: 'GET',
  },
  ARTIST_GET_MUSIC: {
    path: '/api/v1/artist/music',
    method: 'GET',
  },
  ARTIST_GET_MUSIC_ITEM: {
    path: '/api/v1/artist/music', // /:id - musicId
    method: 'GET',
  },
  ARTIST_CREATE_MUSIC: {
    path: '/api/v1/artist/music',
    method: 'POST',
  },
  ARTIST_UPDATE_MUSIC: {
    path: '/api/v1/artist/music', // /:id - musicId
    method: 'PATCH',
  },
  ARTIST_DELETE_MUSIC: {
    path: '/api/v1/artist/music', // /:id - musicId
    method: 'DELETE',
  },
  ARTIST_GET_VIDEOS: {
    path: '/api/v1/artist/videos',
    method: 'GET',
  },
  ARTIST_GET_VIDEO_ITEM: {
    path: '/api/v1/artist/videos', // /:id - videoId
    method: 'GET',
  },
  ARTIST_CREATE_VIDEO: {
    path: '/api/v1/artist/videos',
    method: 'POST',
  },
  ARTIST_UPDATE_VIDEO: {
    path: '/api/v1/artist/videos', // /:id - videoId
    method: 'PATCH',
  },
  ARTIST_DELETE_VIDEO: {
    path: '/api/v1/artist/videos', // /:id - videoId
    method: 'DELETE',
  },

  // Vendor dashboard
  VENDOR_GET_ME: { path: '/api/v1/vendor/me', method: 'GET' },
  VENDOR_GET_PRODUCTS: { path: '/api/v1/vendor/products', method: 'GET' },
  VENDOR_CREATE_PRODUCT: { path: '/api/v1/vendor/products', method: 'POST' },
  VENDOR_UPDATE_PRODUCT: {
    path: '/api/v1/vendor/products', // /:id - productId
    method: 'PATCH',
  },
  VENDOR_GET_ORDERS: { path: '/api/v1/vendor/orders', method: 'GET' },
  VENDOR_UPDATE_SETTINGS: { path: '/api/v1/vendor/settings', method: 'PATCH' },
  VENDOR_GET_DASHBOARD_STATS: { path: '/api/v1/vendor/dashboard-stats', method: 'GET' },
};
