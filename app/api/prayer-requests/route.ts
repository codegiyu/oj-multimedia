import { createPrayerRequest } from '@/app/_server/controllers/prayerRequests/createPrayerRequest';
import { listPrayerRequests } from '@/app/_server/controllers/prayerRequests/listPrayerRequests';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listPrayerRequests);
export const POST = applyMiddlewares(createPrayerRequest);
