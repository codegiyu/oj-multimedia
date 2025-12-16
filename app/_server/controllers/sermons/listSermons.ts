import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Sermon } from '../../models/sermon';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

export const listSermons = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req } = context as RequestContext;
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const topic = url.searchParams.get('topic');
    const pastor = url.searchParams.get('pastor');
    const isFeatured = url.searchParams.get('isFeatured');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status) query.status = status;
    if (topic) query.topics = topic;
    if (pastor) query.pastor = pastor;
    if (isFeatured !== null) query.isFeatured = isFeatured === 'true';

    const sermons = await Sermon.find(query)
      .populate('pastor', 'name slug image church')
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Sermon.countDocuments(query);

    return sendResponse(
      200,
      {
        sermons,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Sermons fetched successfully'
    );
  })
);
