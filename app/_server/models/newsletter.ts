import mongoose, { Schema, model } from 'mongoose';
import { ModelNewsletter } from '../lib/types/constants';

const NewsletterSchema = new Schema<ModelNewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active',
      index: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'newsletters',
  }
);

NewsletterSchema.index({ status: 1, subscribedAt: -1 });

export const Newsletter =
  mongoose.models.Newsletter || model<ModelNewsletter>('Newsletter', NewsletterSchema);
