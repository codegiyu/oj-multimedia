import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Sermon } from '../../models/sermon';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

export const getSermon = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req } = context as RequestContext;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Sermon identifier is required', 400);
    }

    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { _id: identifier }
      : { slug: identifier };

    const sermon = await Sermon.findOneAndUpdate(query, { $inc: { views: 1 } }, { new: true })
      .populate('pastor', 'name slug bio image church socials')
      .lean();

    if (!sermon) {
      throw new AppError('Sermon not found', 404);
    }

    return sendResponse(200, { sermon }, 'Sermon fetched successfully');
  })
);
