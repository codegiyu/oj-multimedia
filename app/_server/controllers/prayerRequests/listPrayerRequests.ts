import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { PrayerRequest } from '../../models/prayerRequest';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

export const listPrayerRequests = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req } = context as RequestContext;
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const isPublic = url.searchParams.get('isPublic');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { isPublic: true }; // Only show public requests
    if (status) query.status = status;
    if (isPublic !== null) query.isPublic = isPublic === 'true';

    const prayerRequests = await PrayerRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await PrayerRequest.countDocuments(query);

    return sendResponse(
      200,
      {
        prayerRequests,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Prayer requests fetched successfully'
    );
  })
);
