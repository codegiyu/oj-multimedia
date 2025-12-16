import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Sermon } from '../../models/sermon';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

export const updateSermon = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, req, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Sermon identifier is required', 400);
    }

    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { _id: identifier }
      : { slug: identifier };

    const sermon = await Sermon.findOneAndUpdate(query, body, { new: true, runValidators: true });

    if (!sermon) {
      throw new AppError('Sermon not found', 404);
    }

    return sendResponse(200, { sermon }, 'Sermon updated successfully');
  })
);
