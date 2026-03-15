/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ISiteSettings,
  IAdmin,
  IUser,
  UploadIntent,
  EntityType,
  IArtistProfile,
  IMusic,
  IVideo,
  INewsArticle,
} from '@/app/_server/lib/types/constants';
import mongoose from 'mongoose';

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Utility type that converts backend-oriented types to client-friendly types.
 * Converts:
 * - mongoose.Types.ObjectId -> string
 * - Date -> string
 * Recursively applies to nested objects and arrays.
 * Preserves optional (undefined) and null types appropriately.
 */
export type ClientFriendly<T> = T extends Date
  ? string
  : T extends mongoose.Types.ObjectId
    ? string // MongoDB ObjectId
    : T extends { toDate(): Date }
      ? string // Firestore Timestamp
      : T extends (infer U)[]
        ? ClientFriendly<U>[]
        : T extends readonly (infer U)[]
          ? readonly ClientFriendly<U>[]
          : T extends Record<string, any>
            ? { [K in keyof T]: ClientFriendly<T[K]> }
            : T;

// Client-friendly type aliases for backend types
export type ClientSiteSettings = ClientFriendly<ISiteSettings>;
export type ClientAdmin = ClientFriendly<IAdmin>;
export type ClientUser = ClientFriendly<IUser>;
export type ClientArtistProfile = ClientFriendly<IArtistProfile>;
export type ClientMusic = ClientFriendly<IMusic>;
export type ClientVideo = ClientFriendly<IVideo>;
export type ClientNewsArticle = ClientFriendly<INewsArticle>;

// Populated variants for responses where related entities are populated
export type PopulatedArtistSummary = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

export type PopulatedVendorSummary = {
  _id: string;
  name?: string;
  slug: string;
  storeName: string;
};

export type PopulatedUser = ClientUser & {
  artist?: PopulatedArtistSummary;
  vendor?: PopulatedVendorSummary;
};

// User account & wishlist types
export interface IUserMeRes {
  user: PopulatedUser;
}

export interface IUserUpdateMePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface IUserWishlistProductSummary {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  vendor?: {
    name: string;
    slug: string;
  };
}

export interface IUserWishlistItem {
  _id: string;
  createdAt: string;
  product: IUserWishlistProductSummary;
}

export type IUserWishlistListRes = GetListRes<IUserWishlistItem, 'items'>;

export interface IUserWishlistAddPayload {
  productId: string;
}

export interface IUserWishlistAddRes {
  item: IUserWishlistItem;
}

// Artist dashboard types
export interface IArtistMeRes {
  artist: ClientArtistProfile;
}

export interface IArtistDashboardStatsRes {
  tracksCount: number;
  videosCount: number;
  totalPlays: number;
  totalViews?: number;
}

export interface IArtistUpdateMePayload {
  name?: string;
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
}

export type ArtistMusicListItem = Omit<ClientMusic, 'artist'> & {
  artist?: string | PopulatedArtistSummary;
};

export type IArtistMusicListRes = GetListRes<ArtistMusicListItem, 'music'>;

export interface IArtistMusicItemRes {
  music: ArtistMusicListItem;
}

export interface IArtistCreateMusicPayload {
  title: string;
  description?: string;
  lyrics?: string;
  coverImage?: string;
  audioUrl?: string;
  videoUrl?: string;
  category?: string;
  isMonetizable?: boolean;
}

export interface IArtistUpdateMusicPayload extends Partial<IArtistCreateMusicPayload> {
  status?: 'draft' | 'published' | 'archived';
}

export type ArtistVideoListItem = Omit<ClientVideo, 'artist'> & {
  artist?: string | PopulatedArtistSummary;
};

export type IArtistVideosListRes = GetListRes<ArtistVideoListItem, 'videos'>;

export interface IArtistVideoItemRes {
  video: ArtistVideoListItem;
}

export interface IArtistCreateVideoPayload {
  title: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  category?: string;
  isMonetizable?: boolean;
}

export interface IArtistUpdateVideoPayload extends Partial<IArtistCreateVideoPayload> {
  status?: 'draft' | 'published' | 'archived';
}

// Public (music, videos, news) – list and detail types
export type PublicMusicListItem = ArtistMusicListItem;
export type IPublicMusicListRes = GetListRes<PublicMusicListItem, 'music'>;
export interface IPublicMusicItemRes {
  music: PublicMusicListItem;
}

export type PublicVideoListItem = ArtistVideoListItem;
export type IPublicVideosListRes = GetListRes<PublicVideoListItem, 'videos'>;
export interface IPublicVideoItemRes {
  video: PublicVideoListItem;
}

export type PublicNewsListItem = ClientNewsArticle & {
  readTime?: string;
  comments?: number;
};
export type IPublicNewsListRes = GetListRes<PublicNewsListItem, 'articles'>;
export interface IPublicNewsItemRes {
  article: PublicNewsListItem;
}

export type EndpointDefinition<
  Payload extends Record<string, any> | undefined = undefined,
  Response = unknown,
  Query extends string | undefined = undefined,
> = Query extends undefined
  ? Payload extends undefined
    ? { payload?: never; query?: never; response: Response }
    : { payload: Payload; query?: never; response: Response }
  : Query extends `${string}` | undefined
    ? Payload extends undefined
      ? { payload?: never; query?: Query; response: Response }
      : { payload: Payload; query?: Query; response: Response }
    : Payload extends undefined
      ? { payload?: never; query: Query; response: Response }
      : { payload: Payload; query: Query; response: Response };

export type EndpointDetails = {
  path: `/${string}`;
  method: HttpMethods;
  isNotAuthenticated?: boolean;
};

export interface AllEndpoints {
  // Authentication
  AUTH_LOGIN: EndpointDefinition<IAuthLoginPayload, IAuthLoginRes, undefined>;
  /** Google OAuth for users only. Admins use AUTH_LOGIN (email/password). */
  AUTH_GOOGLE_LOGIN: EndpointDefinition<IAuthGoogleLoginPayload, IAuthGoogleLoginRes, undefined>;
  AUTH_LOGOUT: EndpointDefinition<undefined, { success: boolean }, undefined>;
  AUTH_SESSION: EndpointDefinition<undefined, IAuthSessionRes, undefined>;
  AUTH_REQUEST_OTP: EndpointDefinition<IAuthRequestOtpPayload, IAuthRequestOtpRes, undefined>;
  AUTH_VERIFY_OTP: EndpointDefinition<IAuthVerifyOtpPayload, IAuthVerifyOtpRes, undefined>;
  AUTH_REQUEST_PASSWORD_RESET: EndpointDefinition<
    IAuthRequestPasswordResetPayload,
    IAuthRequestPasswordResetRes,
    undefined
  >;
  AUTH_RESET_PASSWORD: EndpointDefinition<
    IAuthResetPasswordPayload,
    IAuthResetPasswordRes,
    undefined
  >;
  AUTH_CHANGE_PASSWORD: EndpointDefinition<
    IAuthChangePasswordPayload,
    IAuthChangePasswordRes,
    undefined
  >;

  // User account (profile & wishlist)
  USER_GET_ME: EndpointDefinition<undefined, IUserMeRes, undefined>;
  USER_UPDATE_ME: EndpointDefinition<IUserUpdateMePayload, IUserMeRes, undefined>;
  USER_WISHLIST_LIST: EndpointDefinition<undefined, IUserWishlistListRes, `?${string}`>;
  USER_WISHLIST_ADD: EndpointDefinition<IUserWishlistAddPayload, IUserWishlistAddRes, undefined>;
  USER_WISHLIST_REMOVE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;

  // File Upload (Public)
  GENERATE_PRESIGNED_URL: EndpointDefinition<
    IUploadPresignedUrlPayload,
    IUploadPresignedUrlRes,
    undefined
  >;

  // File Upload (Admin)
  ADMIN_GENERATE_PRESIGNED_URL: EndpointDefinition<
    IUploadPresignedUrlPayload,
    IUploadPresignedUrlRes,
    undefined
  >;

  // Site Settings (Public)
  GET_SITE_SETTINGS: EndpointDefinition<
    undefined,
    ClientSiteSettings | Partial<ClientSiteSettings>,
    `/${string}`
  >;

  // Site Settings (Admin)
  ADMIN_UPDATE_SITE_SETTINGS: EndpointDefinition<
    ISiteSettingsUpdatePayload,
    Partial<ClientSiteSettings>,
    undefined
  >;

  // Notifications
  NOTIFICATIONS_LIST: EndpointDefinition<undefined, INotificationsListRes, `?${string}`>;
  NOTIFICATIONS_CREATE: EndpointDefinition<
    INotificationCreatePayload,
    INotificationCreateRes,
    undefined
  >;
  NOTIFICATIONS_READ_ONE: EndpointDefinition<undefined, INotificationReadRes, `/${string}`>;
  NOTIFICATIONS_READ_ALL: EndpointDefinition<
    INotificationsReadAllPayload,
    { count?: number },
    undefined
  >;
  NOTIFICATIONS_GET_PREFERENCES: EndpointDefinition<
    undefined,
    INotificationPreferencesRes,
    undefined
  >;
  NOTIFICATIONS_UPDATE_PREFERENCES: EndpointDefinition<
    INotificationUpdatePreferencesPayload,
    INotificationPreferencesRes,
    undefined
  >;
  NOTIFICATIONS_UPDATE_PUSH_TOKEN: EndpointDefinition<
    INotificationUpdatePushTokenPayload,
    INotificationUpdatePushTokenRes,
    undefined
  >;

  // Document verify
  DOCUMENTS_VERIFY: EndpointDefinition<IDocumentVerifyPayload, IDocumentVerifyRes, undefined>;

  // Documents (Admin)
  ADMIN_DOCUMENTS_LIST: EndpointDefinition<undefined, IDocumentsListRes, `?${string}`>;
  ADMIN_DOCUMENT_DETAILS: EndpointDefinition<undefined, IDocumentDetailsRes, `/${string}`>;
  ADMIN_DOCUMENTS_VERIFY: EndpointDefinition<undefined, IDocumentVerifyRes, `/${string}`>;

  // Email logs (Admin)
  ADMIN_EMAIL_LOGS_LIST: EndpointDefinition<undefined, IEmailLogsListRes, `?${string}`>;
  ADMIN_EMAIL_LOG_DETAILS: EndpointDefinition<undefined, IEmailLogDetailsRes, `/${string}`>;
  ADMIN_EMAIL_LOGS_RESEND: EndpointDefinition<undefined, IEmailLogResendRes, `/${string}`>;

  // Marketplace (public)
  MARKETPLACE_GET_CATEGORIES: EndpointDefinition<
    undefined,
    IMarketplaceCategoriesRes,
    `?${string}` | undefined
  >;
  MARKETPLACE_GET_SUBCATEGORIES: EndpointDefinition<
    undefined,
    IMarketplaceSubCategoriesRes,
    `?${string}` | undefined
  >;
  MARKETPLACE_GET_VENDORS: EndpointDefinition<undefined, IMarketplaceVendorsRes, undefined>;
  MARKETPLACE_GET_VENDOR_BY_SLUG: EndpointDefinition<
    undefined,
    IMarketplaceVendorRes,
    `/${string}`
  >;
  MARKETPLACE_GET_PRODUCTS: EndpointDefinition<
    undefined,
    IMarketplaceProductsListRes,
    `?${string}`
  >;
  MARKETPLACE_GET_PRODUCT_BY_SLUG: EndpointDefinition<
    undefined,
    IMarketplaceProductRes,
    `/${string}`
  >;
  MARKETPLACE_BECOME_VENDOR: EndpointDefinition<
    IMarketplaceBecomeVendorPayload,
    IMarketplaceBecomeVendorRes,
    undefined
  >;
  MARKETPLACE_PLACE_ORDER: EndpointDefinition<
    IMarketplacePlaceOrderPayload,
    IMarketplacePlaceOrderRes,
    undefined
  >;
  MARKETPLACE_GET_MY_ORDERS: EndpointDefinition<undefined, IMarketplaceMyOrdersRes, `?${string}`>;

  // Artist dashboard
  ARTIST_GET_ME: EndpointDefinition<undefined, IArtistMeRes, undefined>;
  ARTIST_UPDATE_ME: EndpointDefinition<IArtistUpdateMePayload, IArtistMeRes, undefined>;
  ARTIST_GET_DASHBOARD_STATS: EndpointDefinition<undefined, IArtistDashboardStatsRes, undefined>;
  ARTIST_GET_MUSIC: EndpointDefinition<undefined, IArtistMusicListRes, `?${string}`>;
  ARTIST_GET_MUSIC_ITEM: EndpointDefinition<undefined, IArtistMusicItemRes, `/${string}`>;
  ARTIST_CREATE_MUSIC: EndpointDefinition<
    IArtistCreateMusicPayload,
    IArtistMusicItemRes,
    undefined
  >;
  ARTIST_UPDATE_MUSIC: EndpointDefinition<
    IArtistUpdateMusicPayload,
    IArtistMusicItemRes,
    `/${string}`
  >;
  ARTIST_DELETE_MUSIC: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ARTIST_GET_VIDEOS: EndpointDefinition<undefined, IArtistVideosListRes, `?${string}`>;
  ARTIST_GET_VIDEO_ITEM: EndpointDefinition<undefined, IArtistVideoItemRes, `/${string}`>;
  ARTIST_CREATE_VIDEO: EndpointDefinition<
    IArtistCreateVideoPayload,
    IArtistVideoItemRes,
    undefined
  >;
  ARTIST_UPDATE_VIDEO: EndpointDefinition<
    IArtistUpdateVideoPayload,
    IArtistVideoItemRes,
    `/${string}`
  >;
  ARTIST_DELETE_VIDEO: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;

  // Vendor dashboard (authenticated client with vendorId)
  VENDOR_GET_ME: EndpointDefinition<undefined, IVendorMeRes, undefined>;
  VENDOR_GET_PRODUCTS: EndpointDefinition<undefined, IVendorProductsRes, PageAndSizeQuery>;
  VENDOR_CREATE_PRODUCT: EndpointDefinition<
    IVendorCreateProductPayload,
    IMarketplaceProduct,
    undefined
  >;
  VENDOR_UPDATE_PRODUCT: EndpointDefinition<
    IVendorUpdateProductPayload,
    IMarketplaceProduct,
    `/${string}`
  >;
  VENDOR_GET_ORDERS: EndpointDefinition<undefined, IVendorOrdersRes, `?${string}`>;
  VENDOR_UPDATE_SETTINGS: EndpointDefinition<
    IVendorUpdateSettingsPayload,
    IMarketplaceVendor,
    undefined
  >;
  VENDOR_GET_DASHBOARD_STATS: EndpointDefinition<undefined, IVendorDashboardStatsRes, undefined>;

  // Public (music, videos, news)
  PUBLIC_GET_MUSIC: EndpointDefinition<undefined, IPublicMusicListRes, `?${string}`>;
  PUBLIC_GET_MUSIC_ITEM: EndpointDefinition<undefined, IPublicMusicItemRes, `/${string}`>;
  PUBLIC_GET_VIDEOS: EndpointDefinition<undefined, IPublicVideosListRes, `?${string}`>;
  PUBLIC_GET_VIDEO_ITEM: EndpointDefinition<undefined, IPublicVideoItemRes, `/${string}`>;
  PUBLIC_GET_NEWS: EndpointDefinition<undefined, IPublicNewsListRes, `?${string}`>;
  PUBLIC_GET_NEWS_ITEM: EndpointDefinition<undefined, IPublicNewsItemRes, `/${string}`>;
}

export const ENDPOINTS: Record<keyof AllEndpoints, EndpointDetails> = {
  // Authentication
  AUTH_LOGIN: {
    path: '/auth/login',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_GOOGLE_LOGIN: {
    path: '/auth/google',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_LOGOUT: {
    path: '/auth/logout',
    method: 'POST',
  },
  AUTH_SESSION: {
    path: '/auth/session',
    method: 'GET',
  },
  AUTH_REQUEST_OTP: {
    path: '/auth/request-otp',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_VERIFY_OTP: {
    path: '/auth/verify-otp',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_REQUEST_PASSWORD_RESET: {
    path: '/auth/request-password-reset',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_RESET_PASSWORD: {
    path: '/auth/reset-password',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_CHANGE_PASSWORD: {
    path: '/auth/change-password',
    method: 'PATCH',
  },

  // User account (profile & wishlist)
  USER_GET_ME: {
    path: '/user/me',
    method: 'GET',
  },
  USER_UPDATE_ME: {
    path: '/user/me',
    method: 'PATCH',
  },
  USER_WISHLIST_LIST: {
    path: '/user/wishlist',
    method: 'GET',
  },
  USER_WISHLIST_ADD: {
    path: '/user/wishlist',
    method: 'POST',
  },
  USER_WISHLIST_REMOVE: {
    path: '/user/wishlist', // /:productId
    method: 'DELETE',
  },

  // File Upload (Public)
  GENERATE_PRESIGNED_URL: {
    path: '/upload/presigned-url',
    method: 'POST',
    isNotAuthenticated: true,
  },

  // File Upload (Admin)
  ADMIN_GENERATE_PRESIGNED_URL: {
    path: '/admin/upload/presigned-url',
    method: 'POST',
  },

  // Site Settings (Public)
  GET_SITE_SETTINGS: {
    path: '/site-settings', // /:slice
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Site Settings (Admin)
  ADMIN_UPDATE_SITE_SETTINGS: {
    path: '/admin/site-settings',
    method: 'PATCH',
  },

  // Notifications
  NOTIFICATIONS_LIST: { path: '/notifications', method: 'GET' },
  NOTIFICATIONS_CREATE: { path: '/notifications/create', method: 'POST' },
  NOTIFICATIONS_READ_ONE: {
    path: '/notifications/read', // /:notificationId
    method: 'PATCH',
  },
  NOTIFICATIONS_READ_ALL: { path: '/notifications/read-all', method: 'PATCH' },
  NOTIFICATIONS_GET_PREFERENCES: { path: '/notifications/preferences', method: 'GET' },
  NOTIFICATIONS_UPDATE_PREFERENCES: { path: '/notifications/preferences', method: 'PATCH' },
  NOTIFICATIONS_UPDATE_PUSH_TOKEN: { path: '/notifications/push-token', method: 'PATCH' },

  // Document verify
  DOCUMENTS_VERIFY: { path: '/documents/verify', method: 'POST' },

  // Documents (Admin)
  ADMIN_DOCUMENTS_LIST: { path: '/admin/documents', method: 'GET' },
  ADMIN_DOCUMENT_DETAILS: {
    path: '/admin/documents', // /:documentId
    method: 'GET',
  },
  ADMIN_DOCUMENTS_VERIFY: {
    path: '/admin/documents/verify', // /:documentId
    method: 'POST',
  },

  // Email logs (Admin)
  ADMIN_EMAIL_LOGS_LIST: { path: '/admin/email-logs', method: 'GET' },
  ADMIN_EMAIL_LOG_DETAILS: {
    path: '/admin/email-logs', // /:emailLogId
    method: 'GET',
  },
  ADMIN_EMAIL_LOGS_RESEND: {
    path: '/admin/email-logs/resend', // /:emailLogId
    method: 'POST',
  },

  // Marketplace
  MARKETPLACE_GET_CATEGORIES: {
    path: '/marketplace/categories',
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_SUBCATEGORIES: {
    path: '/marketplace/subcategories',
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_VENDORS: {
    path: '/marketplace/vendors',
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_VENDOR_BY_SLUG: {
    path: '/marketplace/vendors', // /:slug
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_PRODUCTS: {
    path: '/marketplace/products',
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_PRODUCT_BY_SLUG: {
    path: '/marketplace/products', // /:slug
    method: 'GET',
    isNotAuthenticated: true,
  },
  MARKETPLACE_BECOME_VENDOR: {
    path: '/marketplace/become-vendor',
    method: 'POST',
    isNotAuthenticated: true,
  },
  MARKETPLACE_PLACE_ORDER: {
    path: '/marketplace/orders',
    method: 'POST',
    isNotAuthenticated: true,
  },
  MARKETPLACE_GET_MY_ORDERS: { path: '/marketplace/orders', method: 'GET' },

  // Artist dashboard
  ARTIST_GET_ME: {
    path: '/artist/me',
    method: 'GET',
  },
  ARTIST_UPDATE_ME: {
    path: '/artist/me',
    method: 'PATCH',
  },
  ARTIST_GET_DASHBOARD_STATS: {
    path: '/artist/dashboard-stats',
    method: 'GET',
  },
  ARTIST_GET_MUSIC: {
    path: '/artist/music',
    method: 'GET',
  },
  ARTIST_GET_MUSIC_ITEM: {
    path: '/artist/music', // /:id - musicId
    method: 'GET',
  },
  ARTIST_CREATE_MUSIC: {
    path: '/artist/music',
    method: 'POST',
  },
  ARTIST_UPDATE_MUSIC: {
    path: '/artist/music', // /:id - musicId
    method: 'PATCH',
  },
  ARTIST_DELETE_MUSIC: {
    path: '/artist/music', // /:id - musicId
    method: 'DELETE',
  },
  ARTIST_GET_VIDEOS: {
    path: '/artist/videos',
    method: 'GET',
  },
  ARTIST_GET_VIDEO_ITEM: {
    path: '/artist/videos', // /:id - videoId
    method: 'GET',
  },
  ARTIST_CREATE_VIDEO: {
    path: '/artist/videos',
    method: 'POST',
  },
  ARTIST_UPDATE_VIDEO: {
    path: '/artist/videos', // /:id - videoId
    method: 'PATCH',
  },
  ARTIST_DELETE_VIDEO: {
    path: '/artist/videos', // /:id - videoId
    method: 'DELETE',
  },

  // Vendor dashboard
  VENDOR_GET_ME: { path: '/vendor/me', method: 'GET' },
  VENDOR_GET_PRODUCTS: { path: '/vendor/products', method: 'GET' },
  VENDOR_CREATE_PRODUCT: { path: '/vendor/products', method: 'POST' },
  VENDOR_UPDATE_PRODUCT: {
    path: '/vendor/products', // /:id - productId
    method: 'PATCH',
  },
  VENDOR_GET_ORDERS: { path: '/vendor/orders', method: 'GET' },
  VENDOR_UPDATE_SETTINGS: { path: '/vendor/settings', method: 'PATCH' },
  VENDOR_GET_DASHBOARD_STATS: { path: '/vendor/dashboard-stats', method: 'GET' },

  // Public (music, videos, news)
  PUBLIC_GET_MUSIC: { path: '/public/music', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_MUSIC_ITEM: { path: '/public/music', method: 'GET', isNotAuthenticated: true }, // /:idOrSlug
  PUBLIC_GET_VIDEOS: { path: '/public/videos', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_VIDEO_ITEM: { path: '/public/videos', method: 'GET', isNotAuthenticated: true }, // /:idOrSlug
  PUBLIC_GET_NEWS: { path: '/public/news', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_NEWS_ITEM: { path: '/public/news', method: 'GET', isNotAuthenticated: true }, // /:idOrSlug
};

// Pagination Query Type
export type PageAndSizeQuery =
  | `?page=${number}&limit=${number}`
  | `?page=${number}`
  | `?limit=${number}`
  | `?${string}`;

// List Response Types
export type GetListRes<T, Name extends string> = {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} & Record<Name, T[]>;

// Reorder Payloads (generic for any entity with displayOrder)
export interface IReorderPayload {
  reorderItems: Array<{
    id: string;
    displayOrder: number;
  }>;
}

export interface IReorderRes {
  modifiedCount: number;
  matchedCount: number;
}

// File Upload Payloads
export interface IUploadPresignedUrlPayloadBase {
  entityType?: EntityType;
  entityId?: string;
  intent?: UploadIntent;
  fileExtension?: string;
  contentType?: string;
  files?: Array<{
    fileExtension: string;
    contentType: string;
  }>;
}

export type IUploadPresignedUrlPayload =
  | (IUploadPresignedUrlPayloadBase & {
      // if single file, this is returned
      entityType: EntityType;
      entityId: string;
      intent: UploadIntent;
      fileExtension: string;
      contentType: string;
      files?: never;
    })
  | (IUploadPresignedUrlPayloadBase & {
      // if multiple files, this is returned
      entityType: EntityType;
      entityId: string;
      intent: UploadIntent;
      files: Array<{
        fileExtension: string;
        contentType: string;
      }>;
      fileExtension?: never;
      contentType?: never;
    });

export interface IUploadPresignedUrlResBase {
  uploadUrl?: string;
  key?: string;
  intent?: string;
  publicUrl?: string;
  documentId?: string;
  filename?: string;
  expiresIn?: number;
  expiresAt?: string;
  uploads?: Array<{
    intent: string;
    uploadUrl: string;
    key: string;
    publicUrl: string;
    documentId?: string;
    filename?: string;
    expiresAt?: string;
    expiresIn: number;
  }>;
  count?: number;
}

export type IUploadPresignedUrlRes =
  | (IUploadPresignedUrlResBase & {
      // if single file, this is returned
      uploadUrl: string;
      key: string;
      filename?: string;
      expiresAt?: string;
      intent: string;
      publicUrl: string;
      documentId?: string;
      expiresIn: number;
      uploads?: never;
      count?: never;
    })
  | (IUploadPresignedUrlResBase & {
      // if multiple files, this is returned
      uploads: Array<{
        intent: string;
        uploadUrl: string;
        key: string;
        filename?: string;
        expiresAt?: string;
        publicUrl: string;
        documentId?: string;
        expiresIn: number;
      }>;
      count: number;
      uploadUrl?: never;
      key?: never;
      intent?: never;
      filename?: never;
      expiresAt?: never;
      publicUrl?: never;
      documentId?: never;
      expiresIn?: never;
    });

// Site Settings Payloads
export interface ISiteSettingsUpdatePayload {
  settingsPayload: Array<{
    name:
      | 'appDetails'
      | 'seo'
      | 'legal'
      | 'email'
      | 'features'
      | 'analytics'
      | 'localization'
      | 'branding'
      | 'contactInfo'
      | 'socials';
    value: any; // The value structure depends on the slice name
  }>;
}

// Authentication Payloads
export interface IAuthLoginPayload {
  email: string;
  password: string;
}

export interface IAuthLoginRes {
  user: ClientAdmin;
}

/** Payload for Google OAuth (users only). Admins use email/password login. */
export interface IAuthGoogleLoginPayload {
  googleCode: string;
}

export interface IAuthGoogleLoginRes {
  user: ClientUser;
}

export interface IAuthSessionRes {
  user: ClientAdmin | PopulatedUser | null;
}

export interface IAuthRequestOtpPayload {
  email: string;
  scope: 'verify-email';
}

export interface IAuthRequestOtpRes {
  message: string;
}

export interface IAuthVerifyOtpPayload {
  code: string;
  email: string;
  scope: string;
}

export interface IAuthVerifyOtpRes {
  message: string;
  user?: Record<string, unknown>;
}

export interface IAuthRequestPasswordResetPayload {
  email: string;
  scope: 'reset-password';
  accessType?: 'client' | 'console';
}

export interface IAuthRequestPasswordResetRes {
  success: boolean;
  message: string;
}

export interface IAuthResetPasswordPayload {
  scopeToken: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IAuthResetPasswordRes {
  message: string;
  user: ClientAdmin | PopulatedUser;
}

export interface IAuthChangePasswordPayload {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface IAuthChangePasswordRes {
  message: string;
  user: ClientAdmin | PopulatedUser;
}

// Notifications
export type INotificationsListRes = GetListRes<Record<string, unknown>, 'notifications'>;
export interface INotificationCreatePayload {
  userId: string;
  userModel: 'User' | 'Admin';
  title: string;
  message: string;
  eventType?: string;
  triggerDate?: string;
  expiresAt?: string;
  sendRealTime?: boolean;
  sendEmail?: boolean;
  subject?: string;
  context?: Record<string, unknown>;
}
export interface INotificationCreateRes {
  notification: Record<string, unknown>;
}
export interface INotificationReadRes {
  notification: Record<string, unknown>;
}
export interface INotificationsReadAllPayload {
  isRead?: boolean;
}
export interface INotificationPreferencesRes {
  realtime?: boolean;
  email?: boolean;
  sms?: boolean;
  marketingEmails?: boolean;
}
export interface INotificationUpdatePreferencesPayload {
  realtime?: boolean;
  email?: boolean;
  sms?: boolean;
  marketingEmails?: boolean;
}

export interface INotificationUpdatePushTokenPayload {
  pushTokenUpdate: { pushToken: string | null };
}

export interface INotificationUpdatePushTokenRes {
  registered: boolean;
}

// Document verify
export interface IDocumentVerifyPayload {
  documentId?: string;
  key?: string;
}
export interface IDocumentVerifyRes {
  document: { id: string; status: string; key?: string; publicUrl?: string; verifiedAt?: string };
}

// Documents (Admin)
export type IDocumentsListRes = GetListRes<Record<string, unknown>, 'documents'>;

export interface IDocumentDetailsRes {
  document: Record<string, unknown>;
}

// Email logs (Admin)
export interface IEmailLog {
  _id: string;
  to?: string;
  from?: string;
  subject?: string;
  type?: string;
  status: string;
  jobId?: string;
  messageId?: string;
  provider?: string;
  metadata?: Record<string, unknown> & { company?: string };
  createdAt?: string;
  updatedAt?: string;
}

export type IEmailLogsListRes = GetListRes<IEmailLog, 'emailLogs'>;

export interface IEmailLogDetailsRes {
  emailLog: Record<string, unknown>;
}

export interface IEmailLogResendRes {
  emailLog: {
    _id: string;
    status: string;
    jobId: string | null;
    to: string;
    type: string;
    retryCount: number;
  };
}

// Marketplace types (aligned with backend and MARKETPLACE-CATEGORIES-PRODUCTS.md)
export interface IMarketplaceCategory {
  _id: string;
  name: string;
  slug: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface IMarketplaceSubCategory {
  _id: string;
  category: string;
  name: string;
  slug: string;
  displayOrder?: number;
  isActive?: boolean;
}

/** Populated category/subcategory in product responses (at least name + slug) */
export type ProductCategoryRef = { _id: string; name: string; slug: string };
export type ProductSubCategoryRef = {
  _id: string;
  name: string;
  slug: string;
  category?: string;
};

/** @deprecated Use IMarketplaceCategory from API; kept for backward compatibility where slug union is used */
export type ProductCategory =
  | 'fashion'
  | 'food'
  | 'health-beauty'
  | 'accessories'
  | 'electronics'
  | 'books'
  | 'other';

/** Variation option (e.g. Colour with values [Red, Blue]) */
export interface IMarketplaceVariationOption {
  name: string;
  values: string[];
}

/** Product variant: one combination with price, inStock, isDefault; only one variant per product has isDefault true */
export interface IMarketplaceProductVariant {
  options: Record<string, string>;
  price: number;
  inStock: boolean;
  isDefault: boolean;
  sku?: string;
  image?: string;
}

export interface IMarketplaceProduct {
  _id: string;
  name: string;
  slug: string;
  vendor: string;
  vendorName?: string;
  vendorSlug?: string;
  description?: string;
  /** Populated in API responses with at least { _id, name, slug } */
  category?: ProductCategoryRef;
  /** Populated in API responses with at least { _id, name, slug } */
  subCategory?: ProductSubCategoryRef;
  tags?: string[];
  price: number;
  images: string[];
  inStock: boolean;
  /** Optional; when present, product has variants and listing may show "from" price */
  variationOptions?: IMarketplaceVariationOption[];
  /** Optional; when present, one variant must have isDefault true */
  variants?: IMarketplaceProductVariant[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Get category display name from product (populated from API) */
export function getProductCategoryName(product: { category?: ProductCategoryRef }): string {
  return product.category?.name ?? 'Other';
}

/** Get category slug from product for URLs (populated from API) */
export function getProductCategorySlug(product: { category?: ProductCategoryRef }): string {
  return product.category?.slug ?? 'other';
}

/** Get subcategory display name from product (populated from API) */
export function getProductSubCategoryName(product: {
  subCategory?: ProductSubCategoryRef;
}): string {
  return product.subCategory?.name ?? 'Other';
}

export interface IMarketplaceVendor {
  _id: string;
  name: string;
  slug: string;
  storeName: string;
  storeDescription?: string;
  logo?: string;
  coverImage?: string;
  status: string;
  isVerified: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
  whatsapp?: string;
  address?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

export interface IMarketplaceOrderItem {
  product: string;
  productName?: string;
  quantity: number;
  price: number;
  totalPrice: number;
  /** Variant SKU when product has variants */
  sku?: string;
  /** Selected variant options for display (e.g. { Colour: 'Red', Size: 'M' }) */
  selectedOptions?: Record<string, string>;
}

export interface IMarketplaceOrder {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string; address?: string };
  vendor: string;
  vendorName?: string;
  vendorSlug?: string;
  items: IMarketplaceOrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt?: string;
}

// Populated order variants for dashboard views
export type PopulatedOrderProduct = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

export interface PopulatedMarketplaceOrderItem extends Omit<IMarketplaceOrderItem, 'product'> {
  product: PopulatedOrderProduct;
}

export interface PopulatedMarketplaceOrder
  extends Omit<IMarketplaceOrder, 'vendor' | 'items' | 'vendorName' | 'vendorSlug'> {
  vendor: PopulatedVendorSummary;
  items: PopulatedMarketplaceOrderItem[];
}

export interface IMarketplaceCategoriesRes {
  categories: IMarketplaceCategory[];
}

export interface IMarketplaceSubCategoriesRes {
  subcategories: IMarketplaceSubCategory[];
}
export type IMarketplaceVendorsRes = GetListRes<IMarketplaceVendor, 'vendors'>;
export type IMarketplaceVendorRes = IMarketplaceVendor;
export type IMarketplaceProductsListRes = GetListRes<IMarketplaceProduct, 'products'>;
export type IMarketplaceProductRes = IMarketplaceProduct;
export interface IMarketplaceBecomeVendorPayload {
  storeName: string;
  storeDescription?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
}
export interface IMarketplaceBecomeVendorRes {
  vendor: IMarketplaceVendor;
  message?: string;
}
export interface IMarketplacePlaceOrderPayload {
  customer: { name: string; email: string; phone: string; address?: string };
  items: Array<{
    productId: string;
    productName?: string;
    quantity: number;
    price: number;
    /** Required when product has variants; variant SKU (uppercase) */
    sku?: string;
  }>;
}
export interface IMarketplacePlaceOrderRes {
  order: PopulatedMarketplaceOrder;
}
export type IMarketplaceMyOrdersRes = GetListRes<PopulatedMarketplaceOrder, 'orders'>;

// Vendor dashboard
export type IVendorMeRes = IMarketplaceVendor;
export type IVendorProductsRes = GetListRes<IMarketplaceProduct, 'products'>;
export interface IVendorCreateProductPayload {
  name: string;
  description?: string;
  category?: string | null;
  subCategory?: string | null;
  tags?: string[];
  price: number;
  images?: string[];
  inStock?: boolean;
  isFeatured?: boolean;
  variationOptions?: IMarketplaceVariationOption[];
  variants?: Array<{
    options: Record<string, string>;
    price: number;
    inStock: boolean;
    isDefault?: boolean;
    sku?: string;
    image?: string;
  }>;
}
export interface IVendorUpdateProductPayload {
  name?: string;
  description?: string;
  category?: string | null;
  subCategory?: string | null;
  tags?: string[];
  price?: number;
  images?: string[];
  inStock?: boolean;
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  variationOptions?: IMarketplaceVariationOption[];
  variants?: Array<{
    options: Record<string, string>;
    price: number;
    inStock: boolean;
    isDefault?: boolean;
    sku?: string;
    image?: string;
  }>;
}
export type IVendorOrdersRes = GetListRes<PopulatedMarketplaceOrder, 'orders'>;
export interface IVendorUpdateSettingsPayload {
  storeName?: string;
  storeDescription?: string;
  email?: string;
  phone?: string;
  logo?: string;
  coverImage?: string;
  whatsapp?: string;
  address?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

export interface IVendorDashboardStatsRes {
  productsCount: number;
  pendingOrdersCount: number;
  totalPaidRevenue: number;
}
