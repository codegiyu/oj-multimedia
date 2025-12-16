import mongoose, { Schema, model } from 'mongoose';
import { ModelTestimony } from '../lib/types/constants';
import { createSlugMiddleware } from '../lib/utils/slugify';

const TestimonySchema = new Schema<ModelTestimony>(
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
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorEmail: {
      type: String,
      default: '',
    },
    authorImage: {
      type: String,
      default: '',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'archived'],
      default: 'pending',
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
  },
  {
    timestamps: true,
    collection: 'testimonies',
  }
);

const slugMiddleware = createSlugMiddleware<ModelTestimony>('title');
TestimonySchema.pre('save', slugMiddleware.preSave);
TestimonySchema.pre(/update/i, slugMiddleware.preUpdate);

TestimonySchema.index({ status: 1, isFeatured: 1, createdAt: -1 });

export const Testimony =
  mongoose.models.Testimony || model<ModelTestimony>('Testimony', TestimonySchema);
