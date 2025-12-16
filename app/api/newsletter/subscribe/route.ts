import { subscribeNewsletter } from '@/app/_server/controllers/newsletter/subscribeNewsletter';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const POST = applyMiddlewares(subscribeNewsletter);
