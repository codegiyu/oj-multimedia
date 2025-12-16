import mongoose, { Schema, model } from 'mongoose';
import { ModelMusic } from '../lib/types/constants';
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

const MusicSchema = new Schema<ModelMusic>(
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
    artist: {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    lyrics: {
      type: String,
      default: '',
    },
    meaning: {
      type: String,
      default: '',
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
    instrumentalUrl: {
      type: String,
      default: '',
    },
    downloadUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: '',
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
    chartPosition: {
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
    collection: 'music',
  }
);

const slugMiddleware = createSlugMiddleware<ModelMusic>('title');
MusicSchema.pre('save', slugMiddleware.preSave);
MusicSchema.pre(/update/i, slugMiddleware.preUpdate);

MusicSchema.index({ status: 1, isFeatured: 1, displayOrder: 1 });
MusicSchema.index({ artist: 1, status: 1 });
MusicSchema.index({ chartPosition: -1 });

export const Music = mongoose.models.Music || model<ModelMusic>('Music', MusicSchema);
