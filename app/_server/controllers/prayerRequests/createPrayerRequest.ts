import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { PrayerRequest } from '../../models/prayerRequest';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

export const createPrayerRequest = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { body, req } = context as RequestContext;

    const { name, email, phone, request, isPublic, isAnonymous } = body;

    if (!name || !email || !request) {
      throw new AppError('Name, email, and request are required', 400);
    }

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';

    const prayerRequest = await PrayerRequest.create({
      name,
      email,
      phone: phone || '',
      request,
      isPublic: isPublic || false,
      isAnonymous: isAnonymous || false,
      ipAddress: ipAddress || '',
    });

    if (!prayerRequest) {
      throw new AppError('Failed to create prayer request', 500);
    }

    return sendResponse(201, { prayerRequest }, 'Prayer request submitted successfully');
  })
);
