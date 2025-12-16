import { getDevotional } from '@/app/_server/controllers/devotionals/getDevotional';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getDevotional);
