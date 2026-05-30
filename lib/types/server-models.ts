/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SiteSettings } from '@/lib/types/site-settings';

// Minimal JOB_TYPE placeholder for email log typing; frontend does not depend on concrete values.
type JOB_TYPE = string;

export interface IUser {
  _id: string;
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
  /** Link to Artist profile for artist dashboard. */
  artistId?: string;
  /** Link to Vendor for vendor dashboard. */
  vendorId?: string;
  isDeleted?: boolean;
  deleteRequestedAt?: string;
  deletionApprovedAt?: string;
  deletionApprovedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAuth {
  password?: {
    value: string;
    passwordChangedAt?: string;
  };
  roles: AuthUserRole[];
  lastLogin?: string;
  refreshTokenJTI?: string;
  /** FCM push token for admin notifications */
  pushToken?: string;
}

export interface AuthUserRole {
  roleId: string;
  slug: string;
}

export interface IAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  accountStatus: AccountStatus;
  auth: UserAuth;
  createdAt: string;
  updatedAt: string;
}

export interface IRole {
  _id: string;
  name: string;
  slug: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
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

export type ISiteSettings = SiteSettings;

export interface IDocument {
  _id: string;
  entityType: EntityType;
  entityId: string;
  intent: UploadIntent;
  filename: string;
  key: string;
  publicUrl: string;
  uploadUrl: string;
  fileExtension: string;
  contentType: string;
  status: DocumentStatus;
  uploadedAt?: string;
  verifiedAt?: string;
  expiresAt: string;
  size?: number;
  metadata?: Record<string, unknown>;
  uploadedBy?: string;
  uploadedByModel?: 'Customer' | 'Admin';
  errorMessage?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEmailLog {
  _id: string;
  jobId: string;
  company: CompanyKey;
  type: JOB_TYPE;
  to: string;
  from: string;
  subject: string;
  status: EmailStatus;
  messageId?: string;
  provider: string;
  error?: string;
  retryCount?: number;
  htmlContent?: string;
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  metadata?: Record<string, any>;
  isDeleted?: boolean;
  deleteRequestedAt?: string;
  deletionApprovedAt?: string;
  deletionApprovedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuditLog {
  _id: string;
  actor: string;
  actorEmail?: string;
  action: AuditAction;
  resource: AuditLogResource;
  resourceId?: string | string;
  description?: string;
  metadata?: Record<string, unknown>;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  performedAt: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserActivityLog {
  _id: string;
  user: string;
  action: UserActivityAction;
  resource: UserActivityResource;
  resourceId?: string | string;
  performedBy: ActivitySource;
  description?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  performedAt: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NotificationEmailDelivery = {
  status: EmailStatus;
  jobId?: string;
  lastAttemptAt?: string;
  lastSentAt?: string;
  lastError?: string;
  statusReason?: string;
};

export type NotificationStatus = 'active' | 'expired';

export type INotification = {
  _id: string;
  user: string;
  userModel: 'User' | 'Admin';
  eventType?: string;
  title?: string;
  message?: string;
  isRead: boolean;
  readAt: Date | null;
  status: NotificationStatus;
  expiredAt: Date | null;
  createdAt: string;
  triggerDate: string;
  expiresAt: string;
  context?: Record<string, unknown>;
  emailDelivery: NotificationEmailDelivery;
};

export const COMPANY_KEYS = ['crelyst'] as const;
export type CompanyKey = (typeof COMPANY_KEYS)[number];

export type TOKEN_SCOPE = 'verify-email' | 'reset-password';
export type ACCESS_TYPES = 'client' | 'console';

export const USER_ROLES = ['customer', 'admin', 'super-admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const GENDERS = ['male', 'female', 'others'] as const;
export type Gender = (typeof GENDERS)[number];

export const ACCOUNT_STATUSES = [
  'unverified',
  'invited',
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
  'album',
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

export const CONTENT_CATEGORY_SCOPES = [
  'music',
  'video',
  'news',
  'devotional',
  'resource',
  'testimony',
  'prayer-request',
  'poll',
  'question',
] as const;
export type ContentCategoryScope = (typeof CONTENT_CATEGORY_SCOPES)[number];

export interface IGospelVerse {
  _id: string;
  verse: string;
  reference: string;
  date: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IArtistProfile {
  _id: string;
  user: string;
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
  createdAt: string;
  updatedAt: string;
}

/** Populated album ref on music list/detail responses (admin and public). */
export interface MusicAlbumSummary {
  _id: string;
  title: string;
  slug?: string;
}

export interface IMusic {
  _id: string;
  title: string;
  slug: string;
  artist?: string;
  /** Album link id; use `album` when the API populates summary fields. */
  albumId?: string;
  description?: string;
  lyrics?: string;
  meaning?: string;
  coverImage?: string;
  audioUrl?: string;
  videoUrl?: string;
  instrumentalUrl?: string;
  downloadUrl?: string;
  excerpt?: string;
  category?: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isMonetizable: boolean;
  price: number;
  submissionFee: number;
  views: number;
  downloads: number;
  /** Stream / play starts (distinct from page views when API provides it). */
  plays?: number;
  chartPosition: number;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface IAlbum {
  _id: string;
  title: string;
  slug: string;
  artist?: string | { _id: string; name?: string; slug?: string; image?: string };
  description?: string;
  excerpt?: string;
  coverImage?: string;
  releaseDate?: string | null;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  displayOrder: number;
  views?: number;
  plays?: number;
  trackCount?: number;
  tracks?: Array<{
    _id: string;
    title: string;
    slug: string;
    coverImage?: string;
    displayOrder?: number;
    plays?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface IVideo {
  _id: string;
  title: string;
  slug: string;
  artist?: string;
  thumbnail?: string;
  category?: string;
  description?: string;
  videoUrl?: string;
  videoFileUrl?: string;
  embedUrl?: string;
  downloadUrl?: string;
  duration?: string;
  views: number;
  plays?: number;
  downloads?: number;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isMonetizable: boolean;
  price: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPastor {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ISermon {
  _id: string;
  title: string;
  slug: string;
  pastor?: string;
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
  price: number;
  submissionFee: number;
  views: number;
  downloads: number;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface IDevotional {
  _id: string;
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
  date: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  views: number;
  /** Linked artist profile id for attribution and dashboards. */
  artist?: string;
  plays?: number;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface INewsArticle {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  coverImage?: string;
  images: string[];
  audioUrl?: string;
  videoFileUrl?: string;
  embedUrl?: string;
  downloadUrl?: string;
  hasVideo?: boolean;
  author?: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isTrending: boolean;
  tags?: string[];
  priority?: number;
  views: number;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface IResource {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface IPrayerRequest {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  request: string;
  status: 'pending' | 'prayed' | 'answered' | 'archived';
  isPublic: boolean;
  isAnonymous: boolean;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITestimony {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface IPoll {
  _id: string;
  question: string;
  slug: string;
  description?: string;
  options: Array<{
    _id?: string;
    text: string;
    votes: number;
  }>;
  status: 'draft' | 'active' | 'closed';
  startDate: string;
  endDate?: string;
  totalVotes: number;
  allowMultipleVotes: boolean;
  createdAt: string;
  updatedAt: string;
}
