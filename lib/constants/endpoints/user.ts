import type { EndpointDetails } from './types';

export const USER_ENDPOINTS: Record<string, EndpointDetails> = {
  USER_LIST_ARTIST_FOLLOWS: {
    path: '/api/v1/user/artist-follows',
    method: 'GET',
  },
  USER_FOLLOW_ARTIST: {
    path: '/api/v1/user/artist-follows',
    method: 'POST',
  },
  USER_UNFOLLOW_ARTIST: {
    path: '/api/v1/user/artist-follows',
    method: 'DELETE',
  },
};
