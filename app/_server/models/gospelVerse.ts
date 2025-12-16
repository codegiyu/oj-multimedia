import mongoose, { Schema, model } from 'mongoose';
import { ModelGospelVerse } from '../lib/types/constants';

const GospelVerseSchema = new Schema<ModelGospelVerse>(
  {
    verse: {
      type: String,
      required: true,
      trim: true,
    },
    reference: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'gospel_verses',
  }
);

GospelVerseSchema.index({ date: -1, isActive: 1 });

export const GospelVerse =
  mongoose.models.GospelVerse || model<ModelGospelVerse>('GospelVerse', GospelVerseSchema);
