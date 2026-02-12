import mongoose, { Schema, model } from 'mongoose';
import { ModelVideo } from '../lib/types/constants';
import { createSlugMiddleware } from '../lib/utils/slugify';

const VideoSchema = new Schema<ModelVideo>(
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
    thumbnail: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: '',
      index: true,
    },
    description: {
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
    duration: {
      type: String,
      default: '',
    },
    views: {
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
    isMonetizable: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'videos',
  }
);

const slugMiddleware = createSlugMiddleware<ModelVideo>('title');
VideoSchema.pre('save', slugMiddleware.preSave);
VideoSchema.pre(/update/i, slugMiddleware.preUpdate);

VideoSchema.index({ status: 1, isFeatured: 1, displayOrder: 1 });
VideoSchema.index({ artist: 1, status: 1 });

export const Video = mongoose.models.Video || model<ModelVideo>('Video', VideoSchema);
