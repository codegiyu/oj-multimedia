import mongoose, { Schema, model } from 'mongoose';
import { ModelPoll } from '../lib/types/constants';
import { createSlugMiddleware } from '../lib/utils/slugify';

const PollOptionSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const PollSchema = new Schema<ModelPoll>(
  {
    question: {
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
    options: {
      type: [PollOptionSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed'],
      default: 'draft',
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    allowMultipleVotes: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'polls',
  }
);

const slugMiddleware = createSlugMiddleware<ModelPoll>('question');
PollSchema.pre('save', slugMiddleware.preSave);
PollSchema.pre(/update/i, slugMiddleware.preUpdate);

PollSchema.index({ status: 1, startDate: -1 });
PollSchema.index({ endDate: 1, status: 1 });

export const Poll = mongoose.models.Poll || model<ModelPoll>('Poll', PollSchema);
