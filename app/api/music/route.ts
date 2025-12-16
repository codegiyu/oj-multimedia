import { listMusic } from '@/app/_server/controllers/music/listMusic';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listMusic);
