import { cache } from 'react';
import { callServerApi } from '@/lib/services/serverApi';

export const getPastorDashboardStats = cache(async () =>
  callServerApi('PASTOR_GET_DASHBOARD_STATS', {})
);

export const getPastorQuestions = cache(async (query: `?${string}`) =>
  callServerApi('PASTOR_GET_QUESTIONS', { query })
);

export const getPastorMe = cache(async () => callServerApi('PASTOR_GET_ME', {}));
