import { listDevotionals } from '@/app/_server/controllers/devotionals/listDevotionals';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listDevotionals);
