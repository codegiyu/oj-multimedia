import mongoose, { Schema, model } from 'mongoose';
import { ModelDevotional } from '../lib/types/constants';
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

const DevotionalSchema = new Schema<ModelDevotional>(
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
    bibleVerse: {
      type: String,
      default: '',
    },
    bibleReference: {
      type: String,
      default: '',
    },
    prayerPoints: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: [
        'daily',
        'bible-study',
        'prayer-points',
        'christian-living',
        'marriage-family',
        'testimony',
      ],
      default: 'daily',
      index: true,
    },
    series: {
      type: String,
      default: '',
      index: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      required: true,
      index: true,
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
    collection: 'devotionals',
  }
);

const slugMiddleware = createSlugMiddleware<ModelDevotional>('title');
DevotionalSchema.pre('save', slugMiddleware.preSave);
DevotionalSchema.pre(/update/i, slugMiddleware.preUpdate);

DevotionalSchema.index({ status: 1, date: -1, isFeatured: 1 });
DevotionalSchema.index({ category: 1, status: 1, date: -1 });
DevotionalSchema.index({ series: 1, status: 1 });

export const Devotional =
  mongoose.models.Devotional || model<ModelDevotional>('Devotional', DevotionalSchema);
