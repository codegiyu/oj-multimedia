import { updateSermon } from '@/app/_server/controllers/sermons/updateSermon';
import { deleteSermon } from '@/app/_server/controllers/sermons/deleteSermon';
import { getSermon } from '@/app/_server/controllers/sermons/getSermon';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getSermon);
export const PATCH = applyMiddlewares(updateSermon);
export const DELETE = applyMiddlewares(deleteSermon);
