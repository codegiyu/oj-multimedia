import { getSermon } from '@/app/_server/controllers/sermons/getSermon';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getSermon);
