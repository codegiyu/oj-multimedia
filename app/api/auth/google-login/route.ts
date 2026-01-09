import { googleLogin } from '@/app/_server/controllers/auth/googleLogin';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const POST = applyMiddlewares(googleLogin);
