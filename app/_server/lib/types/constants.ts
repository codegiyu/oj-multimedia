/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose, { Document } from 'mongoose';
import { JOB_TYPE } from './queues';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  googleId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  avatar?: string;
  title?: string;
  accountStatus: AccountStatus;
  email: string;
  phoneNumber: string;
  gender?: Gender;
  auth: UserAuth;
  kyc: KYC;
  isDeleted?: boolean;
  deleteRequestedAt?: Date;
  deletionApprovedAt?: Date;
  deletionApprovedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAuth {
  password?: {
    value: string;
    passwordChangedAt?: Date;
  };
  roles: AuthUserRole[];
  lastLogin?: string;
  refreshTokenJTI?: string;
}

export interface AuthUserRole {
  roleId: string;
  slug: string;
}

export interface IAdmin {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  accountStatus: AccountStatus;
  auth: UserAuth;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRole {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  slug: string;
  name: string;
  description: string;
  isRestricted?: boolean;
}

export interface KYC {
  email: {
    isVerified: boolean;
    data: any;
  };
  phoneNumber: {
    isVerified: boolean;
    data: any;
  };
}

export interface DayHours {
  start: string | null;
  end: string | null;
}

export interface OfficeHours {
  monday: DayHours | null;
  tuesday: DayHours | null;
  wednesday: DayHours | null;
  thursday: DayHours | null;
  friday: DayHours | null;
  saturday: DayHours | null;
  sunday: DayHours | null;
}

export interface ContactInfo {
  address: string[];
  tel: string[];
  email: string[];
  whatsapp: string;
  locationUrl: string;
  officeHours: OfficeHours;
}

export interface Social {
  platform: SocialPlatform;
  href: string;
}

export interface AppDetails {
  logo: string;
  appName: string;
  description: string;
}

export interface SEODetails {
  metaTitleTemplate: string;
  metaDescription: string;
  keywords: string[];
  ogImageUrl: string;
  faviconUrl: string;
  canonicalUrlBase: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export interface LegalCompliance {
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
  cookiePolicyUrl: string;
  disclaimerText: string;
}

export interface EmailConfig {
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
}

export interface FeatureFlags {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  loginEnabled: boolean;
}

export interface Analytics {
  googleAnalyticsId: string;
  facebookPixelId: string;
  otherTrackingIds: string[];
}

export interface Localization {
  defaultLanguage: string;
  supportedLanguages: string[];
  defaultTimezone: string;
  defaultCurrency: string;
}

export interface Branding {
  faviconUrl: string;
  primaryBrandColor: string;
  secondaryBrandColor: string;
}

export interface ISiteSettings {
  _id: mongoose.Types.ObjectId;
  name: string;
  appDetails: AppDetails;
  seo: SEODetails;
  legal: LegalCompliance;
  email: EmailConfig;
  features: FeatureFlags;
  analytics: Analytics;
  localization: Localization;
  branding: Branding;
  contactInfo: ContactInfo;
  socials: Social[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument {
  _id: mongoose.Types.ObjectId;
  entityType: EntityType;
  entityId: mongoose.Types.ObjectId;
  intent: UploadIntent;
  filename: string;
  key: string;
  publicUrl: string;
  uploadUrl: string;
  fileExtension: string;
  contentType: string;
  status: DocumentStatus;
  uploadedAt?: Date;
  verifiedAt?: Date;
  expiresAt: Date;
  size?: number;
  metadata?: Record<string, unknown>;
  uploadedBy?: mongoose.Types.ObjectId;
  uploadedByModel?: 'Customer' | 'Admin';
  errorMessage?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmailLog {
  _id: mongoose.Types.ObjectId;
  jobId: string; // BullMQ job ID
  company: CompanyKey;
  type: JOB_TYPE;
  to: string; // Recipient email
  from: string; // Sender email
  subject: string;
  status: EmailStatus;
  messageId?: string; // Provider message ID (for webhook tracking)
  provider: string; // 'smtp', 'resend', etc.
  error?: string; // Error message if failed
  retryCount?: number; // Number of retry attempts
  htmlContent?: string; // HTML content of the email
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  metadata?: Record<string, any>;
  isDeleted?: boolean;
  deleteRequestedAt?: Date;
  deletionApprovedAt?: Date;
  deletionApprovedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog {
  _id: mongoose.Types.ObjectId;
  actor: mongoose.Types.ObjectId;
  actorEmail?: string;
  action: AuditAction;
  resource: AuditLogResource;
  resourceId?: mongoose.Types.ObjectId | string;
  description?: string;
  metadata?: Record<string, unknown>;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  performedAt: Date;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserActivityLog {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  action: UserActivityAction;
  resource: UserActivityResource;
  resourceId?: mongoose.Types.ObjectId | string;
  performedBy: ActivitySource;
  description?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  performedAt: Date;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationEmailDelivery = {
  status: EmailStatus;
  jobId?: string;
  lastAttemptAt?: Date;
  lastSentAt?: Date;
  lastError?: string;
  statusReason?: string;
};

export type NotificationStatus = 'active' | 'expired';

export type INotification = {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userModel: 'User' | 'Admin';
  eventType?: string;
  title?: string;
  message?: string;
  isRead: boolean;
  readAt: Date | null;
  status: NotificationStatus;
  expiredAt: Date | null;
  createdAt: Date;
  triggerDate: Date;
  expiresAt: Date;
  context?: Record<string, unknown>;
  emailDelivery: NotificationEmailDelivery;
};

export const COMPANY_KEYS = ['crelyst'] as const;
export type CompanyKey = (typeof COMPANY_KEYS)[number];

export const SOCIAL_PLATFORMS = [
  'facebook',
  'instagram',
  'linkedin',
  'twitter',
  'tiktok',
  'whatsapp',
  'youtube',
  'x',
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export type TOKEN_SCOPE = 'verify-email' | 'reset-password';
export type ACCESS_TYPES = 'client' | 'console';

export const USER_ROLES = ['customer', 'admin', 'super-admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const GENDERS = ['male', 'female', 'others'] as const;
export type Gender = (typeof GENDERS)[number];

export const ACCOUNT_STATUSES = [
  'unverified',
  'active',
  'suspended',
  'deleted',
  'blacklisted',
] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export const DOCUMENT_STATUSES = ['pending', 'uploaded', 'verified', 'failed', 'expired'] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const EMAIL_STATUSES = [
  'pending',
  'sent',
  'delivered',
  'bounced',
  'failed',
  'opened',
  'clicked',
] as const;
export type EmailStatus = (typeof EMAIL_STATUSES)[number];

export const UPLOAD_INTENTS = [
  'avatar',
  'logo',
  'card-image',
  'banner-image',
  'image',
  'other',
] as const;
export type UploadIntent = (typeof UPLOAD_INTENTS)[number];

export const ENTITY_TYPES = [
  'user',
  'admin',
  'gospel-verse',
  'artist',
  'music',
  'pastor',
  'devotional',
  'news-article',
  'resource',
  'prayer-request',
  'testimony',
  'poll',
  'vendor',
  'product',
  'order',
  'newsletter',
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const AUDIT_LOG_RESOURCES = [
  'admin',
  'user',
  'email-log',
  'document',
  'audit-log',
  'site-settings',
] as const;
export type AuditLogResource = (typeof AUDIT_LOG_RESOURCES)[number];

export const AUDIT_ACTIONS = {
  ADMIN_INVITE: 'admin.invite',
  USER_CREATE: 'user.create',
  USER_PROFILE_UPDATE: 'user.profile.update',
  USER_PREFERENCES_UPDATE: 'user.preferences.update',
  USER_PASSWORD_UPDATE: 'user.password.update',
  USER_EMAIL_UPDATE: 'user.email.update',
  USER_PHONE_NUMBER_UPDATE: 'user.phone-number.update',
  USER_GENDER_UPDATE: 'user.gender.update',
  USER_ACCOUNT_STATUS_UPDATE: 'user.account-status.update',
  USER_KYC_UPDATE: 'user.kyc.update',
  USER_DELETE: 'user.delete',
  USER_RESTORE: 'user.restore',
} as const;
export const AUDIT_ACTION_VALUES = Object.values(AUDIT_ACTIONS);
export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export const USER_ACTIVITY_RESOURCES = [
  'customer',
  'business',
  'businessMembership',
  'wallet',
  'booking',
  'billboard',
] as const;
export type UserActivityResource = (typeof USER_ACTIVITY_RESOURCES)[number];

export const USER_ACTIVITY_ACTIONS = {
  USER_PROFILE_UPDATE: 'user.profile.update',
  USER_PREFERENCES_UPDATE: 'user.preferences.update',
  USER_PASSWORD_UPDATE: 'user.password.update',
  USER_EMAIL_UPDATE: 'user.email.update',
  USER_PHONE_NUMBER_UPDATE: 'user.phone-number.update',
  USER_GENDER_UPDATE: 'user.gender.update',
  USER_ACCOUNT_STATUS_UPDATE: 'user.account-status.update',
  USER_KYC_UPDATE: 'user.kyc.update',
  USER_DELETE: 'user.delete',
  USER_RESTORE: 'user.restore',
} as const;
export const USER_ACTIVITY_ACTION_VALUES = Object.values(USER_ACTIVITY_ACTIONS);
export type UserActivityAction = (typeof USER_ACTIVITY_ACTIONS)[keyof typeof USER_ACTIVITY_ACTIONS];

export type ActivitySource = 'self' | 'admin' | 'system';

// Gospel Verse Types
export interface IGospelVerse {
  _id: mongoose.Types.ObjectId;
  verse: string;
  reference: string;
  date: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ArtistProfile Types (user-linked profile; replaces former IArtist)
export interface IArtistProfile {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  bio?: string;
  image?: string;
  coverImage?: string;
  genre?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Music Types
export interface IMusic {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  artist: mongoose.Types.ObjectId;
  description?: string;
  lyrics?: string;
  meaning?: string;
  coverImage?: string;
  audioUrl?: string;
  videoUrl?: string;
  instrumentalUrl?: string;
  downloadUrl?: string;
  category?: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isMonetizable: boolean;
  submissionFee: number;
  views: number;
  downloads: number;
  chartPosition: number;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Video Types
export interface IVideo {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  artist: mongoose.Types.ObjectId;
  thumbnail?: string;
  category?: string;
  description?: string;
  videoUrl?: string;
  downloadUrl?: string;
  duration?: string;
  views: number;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isMonetizable: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Pastor Types
export interface IPastor {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  bio?: string;
  image?: string;
  church?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Sermon Types
export interface ISermon {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  pastor?: mongoose.Types.ObjectId;
  description?: string;
  content?: string;
  topic?: string;
  topics: string[];
  coverImage?: string;
  audioUrl?: string;
  videoUrl?: string;
  downloadUrl?: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isMonetizable: boolean;
  submissionFee: number;
  views: number;
  downloads: number;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Devotional Types
export interface IDevotional {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  bibleVerse?: string;
  bibleReference?: string;
  prayerPoints: string[];
  category:
    | 'daily'
    | 'bible-study'
    | 'prayer-points'
    | 'christian-living'
    | 'marriage-family'
    | 'testimony';
  series?: string;
  coverImage?: string;
  date: Date;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  views: number;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// News Article Types
export interface INewsArticle {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category:
    | 'celebrity-news'
    | 'church-announcements'
    | 'inspirational-stories'
    | 'scholarship-alerts'
    | 'jobs'
    | 'movie-reviews';
  coverImage?: string;
  images: string[];
  author?: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isTrending: boolean;
  views: number;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Resource Types
export interface IResource {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  category: 'ebook' | 'template' | 'beat' | 'wallpaper' | 'affiliate-product' | 'other';
  fileUrl?: string;
  coverImage?: string;
  affiliateUrl?: string;
  price: number;
  isFree: boolean;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  downloads: number;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Prayer Request Types
export interface IPrayerRequest {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  request: string;
  status: 'pending' | 'prayed' | 'answered' | 'archived';
  isPublic: boolean;
  isAnonymous: boolean;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Testimony Types (Community)
export interface ITestimony {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  authorName: string;
  authorEmail?: string;
  authorImage?: string;
  isAnonymous: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  isFeatured: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Poll Types
export interface IPoll {
  _id: mongoose.Types.ObjectId;
  question: string;
  slug: string;
  description?: string;
  options: Array<{
    _id?: mongoose.Types.ObjectId;
    text: string;
    votes: number;
  }>;
  status: 'draft' | 'active' | 'closed';
  startDate: Date;
  endDate?: Date;
  totalVotes: number;
  allowMultipleVotes: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Vendor Types
export interface IVendor {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  email: string;
  phone: string;
  storeName: string;
  storeDescription?: string;
  logo?: string;
  coverImage?: string;
  address?: string;
  whatsapp?: string;
  bankAccount: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
  };
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  vendor: mongoose.Types.ObjectId;
  description?: string;
  category:
    | 'fashion'
    | 'food'
    | 'health-beauty'
    | 'accessories'
    | 'electronics'
    | 'books'
    | 'other';
  price: number;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export interface IOrder {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  vendor: mongoose.Types.ObjectId;
  items: Array<{
    _id?: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'bank-transfer' | 'whatsapp-payment' | 'other';
  paymentProof?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Newsletter Types
export interface INewsletter {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IModelIndex {
  find: any;
}

export type ModelUser = IUser & IModelIndex & Document;
export type ModelAdmin = IAdmin & IModelIndex & Document;
export type ModelRole = IRole & IModelIndex & Document;
export type ModelSiteSettings = ISiteSettings & IModelIndex & Document;
export type ModelDocument = IDocument & IModelIndex & Document;
export type ModelEmailLog = IEmailLog & IModelIndex & Document;
export type ModelAuditLog = IAuditLog & IModelIndex & Document;
export type ModelUserActivityLog = IUserActivityLog & IModelIndex & Document;
export type ModelNotification = INotification & IModelIndex & Document;
export type ModelGospelVerse = IGospelVerse & IModelIndex & Document;
export type ModelArtistProfile = IArtistProfile & IModelIndex & Document;
export type ModelMusic = IMusic & IModelIndex & Document;
export type ModelVideo = IVideo & IModelIndex & Document;
export type ModelPastor = IPastor & IModelIndex & Document;
export type ModelDevotional = IDevotional & IModelIndex & Document;
export type ModelNewsArticle = INewsArticle & IModelIndex & Document;
export type ModelResource = IResource & IModelIndex & Document;
export type ModelPrayerRequest = IPrayerRequest & IModelIndex & Document;
export type ModelTestimony = ITestimony & IModelIndex & Document;
export type ModelPoll = IPoll & IModelIndex & Document;
export type ModelVendor = IVendor & IModelIndex & Document;
export type ModelProduct = IProduct & IModelIndex & Document;
export type ModelOrder = IOrder & IModelIndex & Document;
export type ModelNewsletter = INewsletter & IModelIndex & Document;
