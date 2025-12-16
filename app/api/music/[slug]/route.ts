import { getMusic } from '@/app/_server/controllers/music/getMusic';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getMusic);
