import { getVerseOfDay } from '@/app/_server/controllers/gospelVerses/getVerseOfDay';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getVerseOfDay);
