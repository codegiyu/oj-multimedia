import mongoose, { Schema, model } from 'mongoose';
import { ModelPrayerRequest } from '../lib/types/constants';

const PrayerRequestSchema = new Schema<ModelPrayerRequest>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      default: '',
    },
    request: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'prayed', 'answered', 'archived'],
      default: 'pending',
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'prayer_requests',
  }
);

PrayerRequestSchema.index({ status: 1, createdAt: -1 });
PrayerRequestSchema.index({ isPublic: 1, status: 1 });

export const PrayerRequest =
  mongoose.models.PrayerRequest || model<ModelPrayerRequest>('PrayerRequest', PrayerRequestSchema);
