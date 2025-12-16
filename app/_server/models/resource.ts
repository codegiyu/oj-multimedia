import mongoose, { Schema, model } from 'mongoose';
import { ModelResource } from '../lib/types/constants';
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

const ResourceSchema = new Schema<ModelResource>(
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
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['ebook', 'template', 'beat', 'wallpaper', 'affiliate-product', 'other'],
      default: 'other',
      index: true,
    },
    fileUrl: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    affiliateUrl: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: true,
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
    collection: 'resources',
  }
);

const slugMiddleware = createSlugMiddleware<ModelResource>('title');
ResourceSchema.pre('save', slugMiddleware.preSave);
ResourceSchema.pre(/update/i, slugMiddleware.preUpdate);

ResourceSchema.index({ status: 1, category: 1, isFeatured: 1 });
ResourceSchema.index({ isFree: 1, status: 1 });

export const Resource =
  mongoose.models.Resource || model<ModelResource>('Resource', ResourceSchema);
