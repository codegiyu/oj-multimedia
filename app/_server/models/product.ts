import mongoose, { Schema, model } from 'mongoose';
import { ModelProduct } from '../lib/types/constants';
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

const ProductSchema = new Schema<ModelProduct>(
  {
    name: {
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
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['fashion', 'food', 'health-beauty', 'accessories', 'electronics', 'books', 'other'],
      default: 'other',
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
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
    collection: 'products',
  }
);

const slugMiddleware = createSlugMiddleware<ModelProduct>('name');
ProductSchema.pre('save', slugMiddleware.preSave);
ProductSchema.pre(/update/i, slugMiddleware.preUpdate);

ProductSchema.index({ vendor: 1, status: 1 });
ProductSchema.index({ category: 1, status: 1, inStock: 1 });
ProductSchema.index({ status: 1, isFeatured: 1 });

export const Product = mongoose.models.Product || model<ModelProduct>('Product', ProductSchema);
