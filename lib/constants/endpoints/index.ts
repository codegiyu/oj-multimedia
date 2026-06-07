export * from './types';
export * from './post';
export { AUTH_USER_ENDPOINTS } from './auth';
export { USER_ENDPOINTS } from './user';
export { ADMIN_ENDPOINTS } from './admin';
export { PUBLIC_ENDPOINTS } from './public';
export { OTHER_ENDPOINTS } from './other';

import type { AllEndpoints } from './types';
import type { EndpointDetails } from './types';
import { AUTH_USER_ENDPOINTS } from './auth';
import { USER_ENDPOINTS } from './user';
import { ADMIN_ENDPOINTS } from './admin';
import { PUBLIC_ENDPOINTS } from './public';
import { OTHER_ENDPOINTS } from './other';

/** Backend REST prefix; every catalog path includes this segment. */
export { API_V1_PREFIX } from './types';

export const ENDPOINTS = {
  ...AUTH_USER_ENDPOINTS,
  ...USER_ENDPOINTS,
  ...ADMIN_ENDPOINTS,
  ...OTHER_ENDPOINTS,
  ...PUBLIC_ENDPOINTS,
} as Record<keyof AllEndpoints, EndpointDetails>;
