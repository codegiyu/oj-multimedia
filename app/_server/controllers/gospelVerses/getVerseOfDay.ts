import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { GospelVerse } from '../../models/gospelVerse';
import { withRequestContext } from '../../lib/context/withRequestContext';

export const getVerseOfDay = withRequestContext({ protect: false })(
  catchAsync(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const verse = await GospelVerse.findOne({
      date: { $gte: today, $lt: tomorrow },
      isActive: true,
    }).lean();

    if (!verse) {
      // Get the most recent active verse if no verse for today
      const recent = await GospelVerse.findOne({ isActive: true }).sort({ date: -1 }).lean();
      return sendResponse(200, { verse: recent || null }, 'Verse fetched successfully');
    }

    return sendResponse(200, { verse }, 'Verse of the day fetched successfully');
  })
);
