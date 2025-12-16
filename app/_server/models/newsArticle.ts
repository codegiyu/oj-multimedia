import mongoose, { Schema, model } from 'mongoose';
import { ModelNewsArticle } from '../lib/types/constants';
import { createSlugMiddleware } from '../lib/utils/slugify';

const SEOSchema = new Schema(
  {
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const NewsArticleSchema = new Schema<ModelNewsArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'celebrity-news',
        'church-announcements',
        'inspirational-stories',
        'scholarship-alerts',
        'jobs',
        'movie-reviews',
      ],
      default: 'celebrity-news',
      index: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isTrending: {
      type: Boolean,
      default: false,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    seo: {
      type: SEOSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    collection: 'news_articles',
  }
);

const slugMiddleware = createSlugMiddleware<ModelNewsArticle>('title');
NewsArticleSchema.pre('save', slugMiddleware.preSave);
NewsArticleSchema.pre(/update/i, slugMiddleware.preUpdate);

NewsArticleSchema.index({ status: 1, isFeatured: 1, isTrending: 1, createdAt: -1 });
NewsArticleSchema.index({ category: 1, status: 1, createdAt: -1 });

export const NewsArticle =
  mongoose.models.NewsArticle || model<ModelNewsArticle>('NewsArticle', NewsArticleSchema);
