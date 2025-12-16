import mongoose, { Schema, model } from 'mongoose';
import { ModelVendor } from '../lib/types/constants';
import { createSlugMiddleware } from '../lib/utils/slugify';

const VendorSchema = new Schema<ModelVendor>(
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
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
    },
    storeDescription: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    whatsapp: {
      type: String,
      default: '',
    },
    bankAccount: {
      accountName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      bankName: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'inactive'],
      default: 'pending',
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'vendors',
  }
);

const slugMiddleware = createSlugMiddleware<ModelVendor>('storeName');
VendorSchema.pre('save', slugMiddleware.preSave);
VendorSchema.pre(/update/i, slugMiddleware.preUpdate);

VendorSchema.index({ status: 1, isVerified: 1 });

export const Vendor = mongoose.models.Vendor || model<ModelVendor>('Vendor', VendorSchema);
