import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Newsletter } from '../../models/newsletter';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

export const subscribeNewsletter = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { body } = context as RequestContext;

    const { email, name } = body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (existing.status === 'active') {
        throw new AppError('Email is already subscribed', 409);
      }
      // Reactivate subscription
      existing.status = 'active';
      existing.name = name || existing.name;
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = undefined;
      await existing.save();
      return sendResponse(200, { newsletter: existing }, 'Newsletter subscription reactivated');
    }

    const newsletter = await Newsletter.create({
      email: email.toLowerCase(),
      name: name || '',
      status: 'active',
    });

    if (!newsletter) {
      throw new AppError('Failed to subscribe to newsletter', 500);
    }

    return sendResponse(201, { newsletter }, 'Successfully subscribed to newsletter');
  })
);
