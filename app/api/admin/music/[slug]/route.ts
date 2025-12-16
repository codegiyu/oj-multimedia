import { updateMusic } from '@/app/_server/controllers/music/updateMusic';
import { deleteMusic } from '@/app/_server/controllers/music/deleteMusic';
import { getMusic } from '@/app/_server/controllers/music/getMusic';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getMusic);
export const PATCH = applyMiddlewares(updateMusic);
export const DELETE = applyMiddlewares(deleteMusic);
