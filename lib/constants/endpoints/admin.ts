import type { EndpointDetails } from './types';

export const ADMIN_ENDPOINTS: Record<string, EndpointDetails> = {
  ADMIN_GENERATE_PRESIGNED_URL: {
    path: '/api/v1/admin/upload/presigned-url',
    method: 'POST',
  },

  // Site Settings (Public)
  GET_SITE_SETTINGS: {
    path: '/api/v1/site-settings', // /:slice
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Site Settings (Admin)
  ADMIN_UPDATE_SITE_SETTINGS: {
    path: '/api/v1/admin/site-settings',
    method: 'PATCH',
  },

  ADMIN_GET_ME: { path: '/api/v1/admin/me', method: 'GET' },
  ADMIN_UPDATE_ME: { path: '/api/v1/admin/me', method: 'PATCH' },

  // Notifications
  NOTIFICATIONS_LIST: { path: '/api/v1/notifications', method: 'GET' },
  NOTIFICATIONS_CREATE: { path: '/api/v1/notifications/create', method: 'POST' },
  NOTIFICATIONS_READ_ONE: {
    path: '/api/v1/notifications/read', // /:notificationId
    method: 'PATCH',
  },
  NOTIFICATIONS_READ_ALL: { path: '/api/v1/notifications/read-all', method: 'PATCH' },
  NOTIFICATIONS_GET_PREFERENCES: { path: '/api/v1/notifications/preferences', method: 'GET' },
  NOTIFICATIONS_UPDATE_PREFERENCES: { path: '/api/v1/notifications/preferences', method: 'PATCH' },
  NOTIFICATIONS_UPDATE_PUSH_TOKEN: { path: '/api/v1/notifications/push-token', method: 'PATCH' },

  // Document verify
  DOCUMENTS_VERIFY: { path: '/api/v1/documents/verify', method: 'POST' },

  // Documents (Admin)
  ADMIN_DOCUMENTS_LIST: { path: '/api/v1/admin/documents', method: 'GET' },
  ADMIN_DOCUMENT_DETAILS: {
    path: '/api/v1/admin/documents', // /:documentId
    method: 'GET',
  },
  ADMIN_DOCUMENTS_VERIFY: {
    path: '/api/v1/admin/documents/verify', // /:documentId
    method: 'POST',
  },

  // Email logs (Admin)
  ADMIN_EMAIL_LOGS_LIST: { path: '/api/v1/admin/email-logs', method: 'GET' },
  ADMIN_EMAIL_LOG_DETAILS: {
    path: '/api/v1/admin/email-logs', // /:emailLogId
    method: 'GET',
  },
  ADMIN_EMAIL_LOGS_RESEND: {
    path: '/api/v1/admin/email-logs/resend', // /:emailLogId
    method: 'POST',
  },

  ADMIN_CONTACT_SUBMISSIONS_LIST: { path: '/api/v1/admin/contact-submissions', method: 'GET' },

  ADMIN_STAFF_LIST: { path: '/api/v1/admin/staff', method: 'GET' },
  ADMIN_STAFF_ITEM: { path: '/api/v1/admin/staff', method: 'GET' },
  ADMIN_STAFF_INVITE: { path: '/api/v1/admin/staff/invite', method: 'POST' },
  ADMIN_STAFF_REINVITE: { path: '/api/v1/admin/staff', method: 'POST' },

  ADMIN_USERS_SEARCH: { path: '/api/v1/admin/users', method: 'GET' },
  ADMIN_USERS_LIST: { path: '/api/v1/admin/users', method: 'GET' },
  ADMIN_USER_ITEM: { path: '/api/v1/admin/users', method: 'GET' },
  ADMIN_USER_UPDATE: { path: '/api/v1/admin/users', method: 'PATCH' },
  ADMIN_USER_APPROVE_DELETION: { path: '/api/v1/admin/users', method: 'POST' },
  ADMIN_USER_REJECT_DELETION: { path: '/api/v1/admin/users', method: 'POST' },

  ADMIN_MUSIC_LIST: { path: '/api/v1/admin/music', method: 'GET' },
  ADMIN_MUSIC_ITEM: { path: '/api/v1/admin/music', method: 'GET' },
  ADMIN_MUSIC_CREATE: { path: '/api/v1/admin/music', method: 'POST' },
  ADMIN_MUSIC_UPDATE: { path: '/api/v1/admin/music', method: 'PATCH' },
  ADMIN_MUSIC_DELETE: { path: '/api/v1/admin/music', method: 'DELETE' },
  ADMIN_MUSIC_APPROVE: { path: '/api/v1/admin/music', method: 'POST' },
  ADMIN_MUSIC_REJECT: { path: '/api/v1/admin/music', method: 'POST' },

  ADMIN_ALBUMS_LIST: { path: '/api/v1/admin/albums', method: 'GET' },
  ADMIN_ALBUM_ITEM: { path: '/api/v1/admin/albums', method: 'GET' },
  ADMIN_ALBUM_CREATE: { path: '/api/v1/admin/albums', method: 'POST' },
  ADMIN_ALBUM_UPDATE: { path: '/api/v1/admin/albums', method: 'PATCH' },
  ADMIN_ALBUM_DELETE: { path: '/api/v1/admin/albums', method: 'DELETE' },

  ADMIN_VIDEOS_LIST: { path: '/api/v1/admin/videos', method: 'GET' },
  ADMIN_VIDEO_ITEM: { path: '/api/v1/admin/videos', method: 'GET' },
  ADMIN_VIDEO_CREATE: { path: '/api/v1/admin/videos', method: 'POST' },
  ADMIN_VIDEO_UPDATE: { path: '/api/v1/admin/videos', method: 'PATCH' },
  ADMIN_VIDEO_DELETE: { path: '/api/v1/admin/videos', method: 'DELETE' },
  ADMIN_VIDEO_APPROVE: { path: '/api/v1/admin/videos', method: 'POST' },
  ADMIN_VIDEO_REJECT: { path: '/api/v1/admin/videos', method: 'POST' },

  ADMIN_NEWS_LIST: { path: '/api/v1/admin/news', method: 'GET' },
  ADMIN_NEWS_ITEM: { path: '/api/v1/admin/news', method: 'GET' },
  ADMIN_NEWS_CREATE: { path: '/api/v1/admin/news', method: 'POST' },
  ADMIN_NEWS_UPDATE: { path: '/api/v1/admin/news', method: 'PATCH' },
  ADMIN_NEWS_DELETE: { path: '/api/v1/admin/news', method: 'DELETE' },

  ADMIN_ARTISTS_LIST: { path: '/api/v1/admin/artists', method: 'GET' },
  ADMIN_ARTIST_ITEM: { path: '/api/v1/admin/artists', method: 'GET' },
  ADMIN_ARTIST_CREATE: { path: '/api/v1/admin/artists', method: 'POST' },
  ADMIN_ARTIST_UPDATE: { path: '/api/v1/admin/artists', method: 'PATCH' },
  ADMIN_ARTIST_DELETE: { path: '/api/v1/admin/artists', method: 'DELETE' },
  ADMIN_ARTIST_DASHBOARD_STATS: { path: '/api/v1/admin/artists', method: 'GET' },

  ADMIN_PASTORS_LIST: { path: '/api/v1/admin/pastors', method: 'GET' },
  ADMIN_PASTOR_ITEM: { path: '/api/v1/admin/pastors', method: 'GET' },
  ADMIN_PASTOR_CREATE: { path: '/api/v1/admin/pastors', method: 'POST' },
  ADMIN_PASTOR_UPDATE: { path: '/api/v1/admin/pastors', method: 'PATCH' },
  ADMIN_PASTOR_DELETE: { path: '/api/v1/admin/pastors', method: 'DELETE' },

  ADMIN_PASTOR_APPLICATIONS_LIST: {
    path: '/api/v1/admin/pastor-applications',
    method: 'GET',
  },
  ADMIN_PASTOR_APPLICATION_ITEM: {
    path: '/api/v1/admin/pastor-applications',
    method: 'GET',
  },
  ADMIN_PASTOR_APPLICATION_APPROVE: {
    path: '/api/v1/admin/pastor-applications',
    method: 'POST',
  },
  ADMIN_PASTOR_APPLICATION_REJECT: {
    path: '/api/v1/admin/pastor-applications',
    method: 'POST',
  },

  ADMIN_DEVOTIONALS_LIST: { path: '/api/v1/admin/devotionals', method: 'GET' },
  ADMIN_DEVOTIONAL_ITEM: { path: '/api/v1/admin/devotionals', method: 'GET' },
  ADMIN_DEVOTIONAL_CREATE: { path: '/api/v1/admin/devotionals', method: 'POST' },
  ADMIN_DEVOTIONAL_UPDATE: { path: '/api/v1/admin/devotionals', method: 'PATCH' },
  ADMIN_DEVOTIONAL_DELETE: { path: '/api/v1/admin/devotionals', method: 'DELETE' },
  ADMIN_DEVOTIONAL_APPROVE: { path: '/api/v1/admin/devotionals', method: 'POST' },
  ADMIN_DEVOTIONAL_REJECT: { path: '/api/v1/admin/devotionals', method: 'POST' },

  ADMIN_GOSPEL_VERSES_LIST: { path: '/api/v1/admin/gospel-verses', method: 'GET' },

  ADMIN_TESTIMONIES_LIST: { path: '/api/v1/admin/testimonies', method: 'GET' },
  ADMIN_TESTIMONY_ITEM: { path: '/api/v1/admin/testimonies', method: 'GET' },
  ADMIN_TESTIMONY_CREATE: { path: '/api/v1/admin/testimonies', method: 'POST' },
  ADMIN_TESTIMONY_UPDATE: { path: '/api/v1/admin/testimonies', method: 'PATCH' },
  ADMIN_TESTIMONY_DELETE: { path: '/api/v1/admin/testimonies', method: 'DELETE' },
  ADMIN_TESTIMONY_APPROVE: { path: '/api/v1/admin/testimonies', method: 'POST' },
  ADMIN_TESTIMONY_REJECT: { path: '/api/v1/admin/testimonies', method: 'POST' },

  ADMIN_PRAYER_REQUESTS_LIST: { path: '/api/v1/admin/prayer-requests', method: 'GET' },
  ADMIN_PRAYER_REQUEST_ITEM: { path: '/api/v1/admin/prayer-requests', method: 'GET' },
  ADMIN_PRAYER_REQUEST_CREATE: { path: '/api/v1/admin/prayer-requests', method: 'POST' },
  ADMIN_PRAYER_REQUEST_UPDATE: { path: '/api/v1/admin/prayer-requests', method: 'PATCH' },
  ADMIN_PRAYER_REQUEST_DELETE: { path: '/api/v1/admin/prayer-requests', method: 'DELETE' },
  ADMIN_PRAYER_REQUEST_ANSWER: { path: '/api/v1/admin/prayer-requests', method: 'POST' },

  ADMIN_ASK_PASTOR_LIST: { path: '/api/v1/admin/ask-a-pastor/questions', method: 'GET' },
  ADMIN_ASK_PASTOR_ITEM: { path: '/api/v1/admin/ask-a-pastor/questions', method: 'GET' },
  ADMIN_ASK_PASTOR_UPDATE: { path: '/api/v1/admin/ask-a-pastor/questions', method: 'PATCH' },
  ADMIN_ASK_PASTOR_DELETE: { path: '/api/v1/admin/ask-a-pastor/questions', method: 'DELETE' },
  ADMIN_ASK_PASTOR_ASSIGN_PASTOR: { path: '/api/v1/admin/ask-a-pastor/questions', method: 'POST' },
  ADMIN_ASK_PASTOR_REJECT: { path: '/api/v1/admin/ask-a-pastor/questions', method: 'POST' },

  ADMIN_POLLS_LIST: { path: '/api/v1/admin/polls', method: 'GET' },
  ADMIN_POLL_ITEM: { path: '/api/v1/admin/polls', method: 'GET' },
  ADMIN_POLL_CREATE: { path: '/api/v1/admin/polls', method: 'POST' },
  ADMIN_POLL_UPDATE: { path: '/api/v1/admin/polls', method: 'PATCH' },
  ADMIN_POLL_DELETE: { path: '/api/v1/admin/polls', method: 'DELETE' },
  ADMIN_POLL_OPEN: { path: '/api/v1/admin/polls', method: 'POST' },
  ADMIN_POLL_CLOSE: { path: '/api/v1/admin/polls', method: 'POST' },
  ADMIN_POLL_APPROVE: { path: '/api/v1/admin/polls', method: 'POST' },
  ADMIN_POLL_REJECT: { path: '/api/v1/admin/polls', method: 'POST' },

  ADMIN_RESOURCES_LIST: { path: '/api/v1/admin/resources', method: 'GET' },
  ADMIN_RESOURCE_ITEM: { path: '/api/v1/admin/resources', method: 'GET' },
  ADMIN_RESOURCE_CREATE: { path: '/api/v1/admin/resources', method: 'POST' },
  ADMIN_RESOURCE_UPDATE: { path: '/api/v1/admin/resources', method: 'PATCH' },
  ADMIN_RESOURCE_DELETE: { path: '/api/v1/admin/resources', method: 'DELETE' },
  ADMIN_RESOURCE_APPROVE: { path: '/api/v1/admin/resources', method: 'POST' },
  ADMIN_RESOURCE_REJECT: { path: '/api/v1/admin/resources', method: 'POST' },

  ADMIN_VENDORS_LIST: { path: '/api/v1/admin/vendors', method: 'GET' },
  ADMIN_VENDOR_ITEM: { path: '/api/v1/admin/vendors', method: 'GET' },
  ADMIN_VENDOR_CREATE: { path: '/api/v1/admin/vendors', method: 'POST' },
  ADMIN_VENDOR_UPDATE: { path: '/api/v1/admin/vendors', method: 'PATCH' },
  ADMIN_VENDOR_APPROVE: { path: '/api/v1/admin/vendors', method: 'POST' },
  ADMIN_VENDOR_REJECT: { path: '/api/v1/admin/vendors', method: 'POST' },
  ADMIN_VENDOR_SUSPEND: { path: '/api/v1/admin/vendors', method: 'POST' },
  ADMIN_VENDOR_UNSUSPEND: { path: '/api/v1/admin/vendors', method: 'POST' },

  ADMIN_ARTIST_SUSPEND: { path: '/api/v1/admin/artists', method: 'POST' },
  ADMIN_ARTIST_UNSUSPEND: { path: '/api/v1/admin/artists', method: 'POST' },
  ADMIN_PASTOR_SUSPEND: { path: '/api/v1/admin/pastors', method: 'POST' },
  ADMIN_PASTOR_UNSUSPEND: { path: '/api/v1/admin/pastors', method: 'POST' },

  ADMIN_ROLE_PROFILE_APPEALS_LIST: { path: '/api/v1/admin/role-profile-appeals', method: 'GET' },
  ADMIN_ROLE_PROFILE_APPEAL_ACCEPT: { path: '/api/v1/admin/role-profile-appeals', method: 'POST' },
  ADMIN_ROLE_PROFILE_APPEAL_REJECT: { path: '/api/v1/admin/role-profile-appeals', method: 'POST' },

  ADMIN_PRODUCTS_LIST: { path: '/api/v1/admin/products', method: 'GET' },
  ADMIN_PRODUCT_ITEM: { path: '/api/v1/admin/products', method: 'GET' },
  ADMIN_PRODUCT_CREATE: { path: '/api/v1/admin/products', method: 'POST' },
  ADMIN_PRODUCT_UPDATE: { path: '/api/v1/admin/products', method: 'PATCH' },
  ADMIN_PRODUCT_DELETE: { path: '/api/v1/admin/products', method: 'DELETE' },
  ADMIN_PRODUCT_APPROVE: { path: '/api/v1/admin/products', method: 'POST' },
  ADMIN_PRODUCT_REJECT: { path: '/api/v1/admin/products', method: 'POST' },

  ADMIN_CONTENT_CATEGORIES_LIST: { path: '/api/v1/admin/content-categories', method: 'GET' },
  ADMIN_CONTENT_CATEGORIES_CREATE: { path: '/api/v1/admin/content-categories', method: 'POST' },
  ADMIN_CONTENT_CATEGORIES_UPDATE: { path: '/api/v1/admin/content-categories', method: 'PATCH' },
  ADMIN_CONTENT_CATEGORIES_DELETE: { path: '/api/v1/admin/content-categories', method: 'DELETE' },

  ADMIN_HOME_ADVERTS_LIST: { path: '/api/v1/admin/home-adverts', method: 'GET' },
  ADMIN_HOME_ADVERTS_CREATE: { path: '/api/v1/admin/home-adverts', method: 'POST' },
  ADMIN_HOME_ADVERTS_UPDATE: { path: '/api/v1/admin/home-adverts', method: 'PATCH' },
  ADMIN_HOME_ADVERTS_DELETE: { path: '/api/v1/admin/home-adverts', method: 'DELETE' },

  ADMIN_ORDERS_LIST: { path: '/api/v1/admin/orders', method: 'GET' },
  ADMIN_ORDER_ITEM: { path: '/api/v1/admin/orders', method: 'GET' },
  ADMIN_ORDER_UPDATE: { path: '/api/v1/admin/orders', method: 'PATCH' },

  // Marketplace
  MARKETPLACE_GET_CATEGORIES: {
    path: '/api/v1/marketplace/categories',
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_SUBCATEGORIES: {
    path: '/api/v1/marketplace/subcategories',
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_VENDORS: {
    path: '/api/v1/marketplace/vendors',
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_VENDOR_BY_SLUG: {
    path: '/api/v1/marketplace/vendors', // /:slug
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_PRODUCTS: {
    path: '/api/v1/marketplace/products',
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_PRODUCT_BY_SLUG: {
    path: '/api/v1/marketplace/products', // /:slug
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_BECOME_VENDOR: {
    path: '/api/v1/marketplace/become-vendor',
    method: 'POST',
  },
  MARKETPLACE_PLACE_ORDER: {
    path: '/api/v1/marketplace/orders',
    method: 'POST',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_MY_ORDERS: { path: '/api/v1/marketplace/orders', method: 'GET' },
  MARKETPLACE_ORDER_WHATSAPP_LINK: {
    path: '/api/v1/marketplace/orders',
    method: 'GET',
  }, // /:orderId/whatsapp-link
};
