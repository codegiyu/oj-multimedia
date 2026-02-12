import mongoose, { Schema, model } from 'mongoose';
import { ModelArtistProfile } from '../lib/types/constants';
import { createSlugMiddleware } from '../lib/utils/slugify';

const ArtistProfileSchema = new Schema<ModelArtistProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
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
    coverImage: {
      type: String,
      default: '',
    },
    genre: {
      type: String,
      default: '',
      index: true,
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
    collection: 'artist_profiles',
  }
);

const slugMiddleware = createSlugMiddleware<ModelArtistProfile>('name');
ArtistProfileSchema.pre('save', slugMiddleware.preSave);
ArtistProfileSchema.pre(/update/i, slugMiddleware.preUpdate);

ArtistProfileSchema.index({ isActive: 1, isFeatured: 1, displayOrder: 1 });

export const ArtistProfile =
  mongoose.models.ArtistProfile || model<ModelArtistProfile>('ArtistProfile', ArtistProfileSchema);
