import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Devotional } from '../../models/devotional';
import { withRequestContext } from '../../lib/context/withRequestContext';

export const getDailyDevotional = withRequestContext({ protect: false })(
  catchAsync(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const devotional = await Devotional.findOne({
      status: 'published',
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    })
      .sort({ date: -1 })
      .lean();

    if (!devotional) {
      // Get the most recent devotional if no daily one exists
      const recent = await Devotional.findOne({ status: 'published' }).sort({ date: -1 }).lean();
      return sendResponse(200, { devotional: recent || null }, 'Devotional fetched successfully');
    }

    return sendResponse(200, { devotional }, 'Daily devotional fetched successfully');
  })
);
