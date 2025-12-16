import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Sermon } from '../../models/sermon';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

export const createSermon = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const {
      title,
      slug,
      pastor,
      description,
      content,
      topic,
      topics,
      coverImage,
      audioUrl,
      videoUrl,
      downloadUrl,
      status,
      isFeatured,
      isMonetizable,
      submissionFee,
      displayOrder,
      seo,
    } = body;

    if (!title) {
      throw new AppError('Title is required', 400);
    }

    if (slug) {
      const existing = await Sermon.findOne({ slug });
      if (existing) {
        throw new AppError('Sermon with this slug already exists', 409);
      }
    }

    const sermon = await Sermon.create({
      title,
      ...(slug && { slug }),
      pastor: pastor || undefined,
      description: description || '',
      content: content || '',
      topic: topic || '',
      topics: topics || [],
      coverImage: coverImage || '',
      audioUrl: audioUrl || '',
      videoUrl: videoUrl || '',
      downloadUrl: downloadUrl || '',
      status: status || 'draft',
      isFeatured: isFeatured || false,
      isMonetizable: isMonetizable || false,
      submissionFee: submissionFee || 0,
      displayOrder: displayOrder || 0,
      seo: seo || {},
    });

    if (!sermon) {
      throw new AppError('Failed to create sermon', 500);
    }

    return sendResponse(201, { sermon }, 'Sermon created successfully');
  })
);
