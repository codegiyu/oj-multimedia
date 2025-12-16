import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Music } from '../../models/music';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

export const updateMusic = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, req, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Music identifier is required', 400);
    }

    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { _id: identifier }
      : { slug: identifier };

    const music = await Music.findOneAndUpdate(query, body, { new: true, runValidators: true });

    if (!music) {
      throw new AppError('Music not found', 404);
    }

    return sendResponse(200, { music }, 'Music updated successfully');
  })
);
