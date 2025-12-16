import { listSermons } from '@/app/_server/controllers/sermons/listSermons';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listSermons);
