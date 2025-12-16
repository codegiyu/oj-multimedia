import mongoose, { Schema, model } from 'mongoose';
import { ModelSermon } from '../lib/types/constants';
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

const SermonSchema = new Schema<ModelSermon>(
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
    pastor: {
      type: Schema.Types.ObjectId,
      ref: 'Pastor',
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    topic: {
      type: String,
      default: '',
      index: true,
    },
    topics: {
      type: [String],
      default: [],
      index: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    audioUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    downloadUrl: {
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
    isMonetizable: {
      type: Boolean,
      default: false,
    },
    submissionFee: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
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
    collection: 'sermons',
  }
);

const slugMiddleware = createSlugMiddleware<ModelSermon>('title');
SermonSchema.pre('save', slugMiddleware.preSave);
SermonSchema.pre(/update/i, slugMiddleware.preUpdate);

SermonSchema.index({ status: 1, isFeatured: 1, displayOrder: 1 });
SermonSchema.index({ pastor: 1, status: 1 });
SermonSchema.index({ topics: 1, status: 1 });

export const Sermon = mongoose.models.Sermon || model<ModelSermon>('Sermon', SermonSchema);
