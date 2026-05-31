import { cache } from 'react';
import { callServerApi } from '@/lib/services/serverApi';

export const getAccountHubOrders = cache(async () =>
  callServerApi('MARKETPLACE_GET_MY_ORDERS', { query: '?page=1&limit=5' })
);

export const getAccountHubWishlist = cache(async () => callServerApi('USER_WISHLIST_LIST', {}));

export const getAccountHubProfile = cache(async () => callServerApi('USER_GET_ME', {}));
