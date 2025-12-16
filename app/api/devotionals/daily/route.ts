import { getDailyDevotional } from '@/app/_server/controllers/devotionals/getDailyDevotional';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getDailyDevotional);
