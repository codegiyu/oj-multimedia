import type { EndpointDetails } from './types';

export const AUTH_USER_ENDPOINTS: Record<string, EndpointDetails> = {
  // Authentication
  AUTH_LOGIN: {
    path: '/api/v1/auth/login',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_GOOGLE_LOGIN: {
    path: '/api/v1/auth/google',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_LOGOUT: {
    path: '/api/v1/auth/logout',
    method: 'POST',
  },
  AUTH_SESSION: {
    path: '/api/v1/auth/session',
    method: 'GET',
  },
  AUTH_REQUEST_OTP: {
    path: '/api/v1/auth/request-otp',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_VERIFY_OTP: {
    path: '/api/v1/auth/verify-otp',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_REQUEST_PASSWORD_RESET: {
    path: '/api/v1/auth/request-password-reset',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_RESET_PASSWORD: {
    path: '/api/v1/auth/reset-password',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_CHANGE_PASSWORD: {
    path: '/api/v1/auth/change-password',
    method: 'PATCH',
  },

  // User account (profile & wishlist)
  USER_GET_ME: {
    path: '/api/v1/user/me',
    method: 'GET',
  },
  USER_GET_DASHBOARD: {
    path: '/api/v1/user/dashboard',
    method: 'GET',
  },
  USER_UPDATE_ME: {
    path: '/api/v1/user/me',
    method: 'PATCH',
  },
  USER_WISHLIST_LIST: {
    path: '/api/v1/user/wishlist',
    method: 'GET',
  },
  USER_WISHLIST_ADD: {
    path: '/api/v1/user/wishlist',
    method: 'POST',
  },
  USER_WISHLIST_REMOVE: {
    path: '/api/v1/user/wishlist', // /:productId
    method: 'DELETE',
  },
  USER_FAVORITES_LIST: {
    path: '/api/v1/user/favorites',
    method: 'GET',
  },
  USER_FAVORITES_ADD: {
    path: '/api/v1/user/favorites',
    method: 'POST',
  },
  USER_FAVORITES_REMOVE: {
    path: '/api/v1/user/favorites', // /:entityType/:entityId
    method: 'DELETE',
  },

  // User cart (marketplace)
  USER_CART_GET: { path: '/api/v1/user/cart', method: 'GET' },
  USER_CART_ADD: { path: '/api/v1/user/cart', method: 'POST' },
  USER_CART_UPDATE: { path: '/api/v1/user/cart', method: 'PATCH' },
  USER_CART_REMOVE: { path: '/api/v1/user/cart', method: 'DELETE' }, // /:productId
  USER_CART_CLEAR: { path: '/api/v1/user/cart', method: 'DELETE' },

  // User community dashboard
  USER_ME_COMMUNITY_QUESTIONS: { path: '/api/v1/user/me/community/questions', method: 'GET' },
  USER_ME_COMMUNITY_QUESTION_ITEM: { path: '/api/v1/user/me/community/questions', method: 'GET' },
  USER_ME_COMMUNITY_QUESTION_CLOSE: {
    path: '/api/v1/user/me/community/questions',
    method: 'PATCH',
  },
  USER_ME_COMMUNITY_TESTIMONIES: {
    path: '/api/v1/user/me/community/testimonies',
    method: 'GET',
  },
  USER_ME_COMMUNITY_PRAYER_REQUESTS: {
    path: '/api/v1/user/me/community/prayer-requests',
    method: 'GET',
  },
  USER_ME_COMMUNITY_POLLS: { path: '/api/v1/user/me/community/polls', method: 'GET' },
  USER_ME_COMMUNITY_POLL_CLOSE: {
    path: '/api/v1/user/me/community/polls',
    method: 'PATCH',
  },

  // File Upload (Public)
  GENERATE_PRESIGNED_URL: {
    path: '/api/v1/upload/presigned-url',
    method: 'POST',
    isNotAuthenticated: true,
  },

  // File Upload (Admin)
};
