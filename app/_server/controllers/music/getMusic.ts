import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Music } from '../../models/music';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

export const getMusic = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req } = context as RequestContext;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Music identifier is required', 400);
    }

    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { _id: identifier }
      : { slug: identifier };

    const music = await Music.findOneAndUpdate(query, { $inc: { views: 1 } }, { new: true })
      .populate('artist', 'name slug bio image socials')
      .lean();

    if (!music) {
      throw new AppError('Music not found', 404);
    }

    return sendResponse(200, { music }, 'Music fetched successfully');
  })
);
