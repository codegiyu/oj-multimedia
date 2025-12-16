import mongoose, { Schema, model } from 'mongoose';
import { ModelPastor } from '../lib/types/constants';
import { createSlugMiddleware } from '../lib/utils/slugify';

const PastorSchema = new Schema<ModelPastor>(
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
    bio: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    church: {
      type: String,
      default: '',
    },
    socials: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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
    collection: 'pastors',
  }
);

const slugMiddleware = createSlugMiddleware<ModelPastor>('name');
PastorSchema.pre('save', slugMiddleware.preSave);
PastorSchema.pre(/update/i, slugMiddleware.preUpdate);

PastorSchema.index({ isActive: 1, isFeatured: 1, displayOrder: 1 });

export const Pastor = mongoose.models.Pastor || model<ModelPastor>('Pastor', PastorSchema);
