import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Music } from '../../models/music';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

export const listMusic = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req } = context as RequestContext;
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const artist = url.searchParams.get('artist');
    const isFeatured = url.searchParams.get('isFeatured');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (artist) query.artist = artist;
    if (isFeatured !== null) query.isFeatured = isFeatured === 'true';

    const music = await Music.find(query)
      .populate('artist', 'name slug image')
      .sort({ chartPosition: -1, displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Music.countDocuments(query);

    return sendResponse(
      200,
      {
        music,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Music fetched successfully'
    );
  })
);
