import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Devotional } from '../../models/devotional';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

export const listDevotionals = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req } = context as RequestContext;
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const series = url.searchParams.get('series');
    const isFeatured = url.searchParams.get('isFeatured');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (series) query.series = series;
    if (isFeatured !== null) query.isFeatured = isFeatured === 'true';

    const devotionals = await Devotional.find(query)
      .sort({ date: -1, displayOrder: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Devotional.countDocuments(query);

    return sendResponse(
      200,
      {
        devotionals,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Devotionals fetched successfully'
    );
  })
);
