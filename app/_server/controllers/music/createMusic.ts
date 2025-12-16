import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Music } from '../../models/music';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

export const createMusic = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const {
      title,
      slug,
      artist,
      description,
      lyrics,
      meaning,
      coverImage,
      audioUrl,
      videoUrl,
      instrumentalUrl,
      downloadUrl,
      category,
      status,
      isFeatured,
      isMonetizable,
      submissionFee,
      chartPosition,
      displayOrder,
      seo,
    } = body;

    if (!title || !artist) {
      throw new AppError('Title and artist are required', 400);
    }

    if (slug) {
      const existing = await Music.findOne({ slug });
      if (existing) {
        throw new AppError('Music with this slug already exists', 409);
      }
    }

    const music = await Music.create({
      title,
      ...(slug && { slug }),
      artist,
      description: description || '',
      lyrics: lyrics || '',
      meaning: meaning || '',
      coverImage: coverImage || '',
      audioUrl: audioUrl || '',
      videoUrl: videoUrl || '',
      instrumentalUrl: instrumentalUrl || '',
      downloadUrl: downloadUrl || '',
      category: category || '',
      status: status || 'draft',
      isFeatured: isFeatured || false,
      isMonetizable: isMonetizable || false,
      submissionFee: submissionFee || 0,
      chartPosition: chartPosition || 0,
      displayOrder: displayOrder || 0,
      seo: seo || {},
    });

    if (!music) {
      throw new AppError('Failed to create music', 500);
    }

    return sendResponse(201, { music }, 'Music created successfully');
  })
);
