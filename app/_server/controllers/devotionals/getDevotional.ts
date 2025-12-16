import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Devotional } from '../../models/devotional';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

export const getDevotional = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req } = context as RequestContext;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Devotional identifier is required', 400);
    }

    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { _id: identifier }
      : { slug: identifier };

    const devotional = await Devotional.findOneAndUpdate(
      query,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!devotional) {
      throw new AppError('Devotional not found', 404);
    }

    return sendResponse(200, { devotional }, 'Devotional fetched successfully');
  })
);
