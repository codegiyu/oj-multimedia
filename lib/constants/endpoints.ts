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
} from '@/lib/types/server-models';
import type {
  CommunityHubData,
  DevotionalsListData,
  DevotionalDetailData,
  TestimoniesListData,
  TestimonyDetailData,
  PrayerRequestsListData,
  PrayerRequestDetailData,
  QuestionsListData,
  QuestionDetailData,
  PastorsListData,
  PastorListItem,
  PollsListData,
  PollDetailData,
  ArtistsListData,
  ArtistDetailData,
  ArtistListItem,
  ResourcesListData,
  ResourceDetail,
  PrayerRequestListItem,
  QuestionListItem,
  TestimonyListItem,
  PollListItem,
} from '@/lib/types/community';
import type {
  FeaturedOptionsRes,
  PromotionPricingOptionsRes,
  ResourceDownloadCategoriesRes,
  PromotionContactRes,
} from '@/lib/types/promotion';

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Utility type that converts backend-oriented types to client-friendly types.
 * Converts:
 * - mongoose.Types.ObjectId -> string
 * - Date -> string
 * Recursively applies to nested objects and arrays.
 * Preserves optional (undefined) and null types appropriately.
 */
// export type ClientFriendly<T> = T extends Date
//   ? string
//   : T extends mongoose.Types.ObjectId
//     ? string // MongoDB ObjectId
//     : T extends { toDate(): Date }
//       ? string // Firestore Timestamp
//       : T extends (infer U)[]
//         ? ClientFriendly<U>[]
//         : T extends readonly (infer U)[]
//           ? readonly ClientFriendly<U>[]
//           : T extends Record<string, any>
//             ? { [K in keyof T]: ClientFriendly<T[K]> }
//             : T;

// Client-friendly type aliases for backend types
export type ClientSiteSettings = ISiteSettings;
export type ClientAdmin = IAdmin;
export type ClientUser = IUser;
export type ClientArtistProfile = IArtistProfile;
export type ClientMusic = IMusic;
export type ClientVideo = IVideo;
export type ClientNewsArticle = INewsArticle;

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
  /** Vendor WhatsApp number; used to build "Chat with vendor" link (wa.me) */
  whatsapp?: string;
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

// User cart (marketplace)
export interface ICartProductSummary {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  images?: string[];
  vendorSlug?: string;
  vendorName?: string;
  /** Backend exposes vendor WhatsApp for chat links (named `whatsapp` in API); we keep vendorWhatsapp for backwards compatibility. */
  whatsapp?: string;
  vendorWhatsapp?: string;
  variationOptions?: IMarketplaceVariationOption[];
  variants?: IMarketplaceProductVariant[];
}

export interface ICartItem {
  productId: string;
  quantity: number;
  sku?: string;
  product: ICartProductSummary;
}

export interface ICartRes {
  items: ICartItem[];
  totalItems: number;
  subtotal: number;
}

export interface IUserCartAddPayload {
  productId: string;
  quantity: number;
  sku?: string;
}

export interface IUserCartUpdatePayload {
  productId: string;
  quantity: number;
  sku?: string;
}

export interface IUserCartBulkUpdatePayload {
  updates: Array<{ productId: string; quantity: number; sku?: string }>;
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

// Community (public) – list and detail types (from COMMUNITY-API-FRONTEND.md)
export type ICommunityCategoryCountsRes = CommunityHubData;

export type IPublicDevotionalsListRes = DevotionalsListData;
export type IPublicDevotionalItemRes = DevotionalDetailData;

export type IPublicTestimoniesListRes = TestimoniesListData;
export type IPublicTestimonyItemRes = TestimonyDetailData;

export type IPublicPrayerRequestsListRes = PrayerRequestsListData;
export type IPublicPrayerRequestItemRes = PrayerRequestDetailData;

export type IPublicQuestionsListRes = QuestionsListData;
export type IPublicQuestionItemRes = QuestionDetailData;

export type IPublicPastorsListRes = PastorsListData;

export type IPublicPollsListRes = PollsListData;
export type IPublicPollItemRes = PollDetailData;

export type IPublicArtistsListRes = ArtistsListData;
export type IPublicArtistItemRes = ArtistDetailData;

export type IPublicResourcesRes = ResourcesListData;

// Community mutation payloads and responses
export interface ISubmitPrayerRequestPayload {
  name?: string;
  email?: string;
  title: string;
  content: string;
  category?: string;
  urgent?: boolean;
}
export interface ISubmitPrayerRequestRes {
  prayerRequest: PrayerRequestListItem;
}

export interface ISubmitQuestionPayload {
  name?: string;
  email?: string;
  question: string;
  category?: string;
}
export interface ISubmitQuestionRes {
  question: QuestionListItem;
}

export interface ISubmitTestimonyPayload {
  name?: string;
  category?: string;
  content: string;
}
export interface ISubmitTestimonyRes {
  testimony: TestimonyListItem;
}

export interface IPollVotePayload {
  optionId: string;
}
export interface IPollVoteRes {
  poll: PollListItem;
}

export interface ICreatePollPayload {
  question: string;
  description?: string;
  category?: string;
  options: string[];
}
export interface ICreatePollRes {
  poll: PollListItem;
}

// Contact (public)
export interface ISubmitContactPayload {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
}
export interface ISubmitContactRes {
  message: string;
  contactSubmission: { _id: string; createdAt: string };
}

/** Full ContactSubmission document (backend model). Public API only returns _id + createdAt. */
export interface ContactSubmission {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

// Search (public)
export type SearchResultType =
  | 'music'
  | 'news'
  | 'video'
  | 'devotional'
  | 'testimony'
  | 'prayer-request'
  | 'question'
  | 'poll'
  | 'resource'
  | 'artist';

/**
 * Query params for GET /public/search.
 * Build query string as ?q=...&type=...&page=...&limit=...
 * - q: required for results; empty q returns empty results.
 * - type: optional; one of SearchResultType or 'community' (backend expands to all community types).
 * - page, limit: optional; default 1 and 24, limit max 50.
 */
export interface IPublicSearchQuery {
  q: string;
  type?: SearchResultType | 'community';
  page?: number;
  limit?: number;
}

export interface ISearchResultItem {
  _id: string;
  title: string;
  subtitle: string;
  type: SearchResultType;
  image?: string;
  meta: string;
}
export interface IPublicSearchRes {
  results: ISearchResultItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
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

  // User cart (marketplace)
  USER_CART_GET: EndpointDefinition<undefined, ICartRes, undefined>;
  USER_CART_ADD: EndpointDefinition<IUserCartAddPayload, ICartRes, undefined>;
  USER_CART_UPDATE: EndpointDefinition<
    IUserCartUpdatePayload | IUserCartBulkUpdatePayload,
    ICartRes,
    undefined
  >;
  USER_CART_REMOVE: EndpointDefinition<undefined, { success: boolean } | ICartRes, `/${string}`>;
  USER_CART_CLEAR: EndpointDefinition<undefined, { success: boolean } | ICartRes, undefined>;

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

  // Contact submissions (Admin)
  ADMIN_CONTACT_SUBMISSIONS_LIST: EndpointDefinition<
    undefined,
    GetListRes<ContactSubmission, 'contactSubmissions'>,
    `?${string}`
  >;

  // Admin content - Music
  ADMIN_MUSIC_LIST: EndpointDefinition<
    undefined,
    GetListRes<ArtistMusicListItem, 'music'>,
    `?${string}`
  >;
  ADMIN_MUSIC_ITEM: EndpointDefinition<undefined, IArtistMusicItemRes, `/${string}`>;
  ADMIN_MUSIC_CREATE: EndpointDefinition<
    IArtistCreateMusicPayload & { artistId: string },
    IArtistMusicItemRes,
    undefined
  >;
  ADMIN_MUSIC_UPDATE: EndpointDefinition<
    IArtistUpdateMusicPayload,
    IArtistMusicItemRes,
    `/${string}`
  >;
  ADMIN_MUSIC_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_MUSIC_APPROVE: EndpointDefinition<undefined, IArtistMusicItemRes, `/${string}`>;
  ADMIN_MUSIC_REJECT: EndpointDefinition<{ reason: string }, IArtistMusicItemRes, `/${string}`>;

  // Admin content - Videos
  ADMIN_VIDEOS_LIST: EndpointDefinition<
    undefined,
    GetListRes<ArtistVideoListItem, 'videos'>,
    `?${string}`
  >;
  ADMIN_VIDEO_ITEM: EndpointDefinition<undefined, IArtistVideoItemRes, `/${string}`>;
  ADMIN_VIDEO_CREATE: EndpointDefinition<
    IArtistCreateVideoPayload & { artistId: string },
    IArtistVideoItemRes,
    undefined
  >;
  ADMIN_VIDEO_UPDATE: EndpointDefinition<
    IArtistUpdateVideoPayload,
    IArtistVideoItemRes,
    `/${string}`
  >;
  ADMIN_VIDEO_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_VIDEO_APPROVE: EndpointDefinition<undefined, IArtistVideoItemRes, `/${string}`>;
  ADMIN_VIDEO_REJECT: EndpointDefinition<{ reason: string }, IArtistVideoItemRes, `/${string}`>;

  // Admin content - News
  ADMIN_NEWS_LIST: EndpointDefinition<
    undefined,
    GetListRes<PublicNewsListItem, 'news'>,
    `?${string}`
  >;
  ADMIN_NEWS_ITEM: EndpointDefinition<undefined, IPublicNewsItemRes, `/${string}`>;
  ADMIN_NEWS_CREATE: EndpointDefinition<Record<string, unknown>, IPublicNewsItemRes, undefined>;
  ADMIN_NEWS_UPDATE: EndpointDefinition<Record<string, unknown>, IPublicNewsItemRes, `/${string}`>;
  ADMIN_NEWS_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;

  // Admin content - Artists
  ADMIN_ARTISTS_LIST: EndpointDefinition<
    undefined,
    GetListRes<ArtistListItem, 'artists'>,
    `?${string}`
  >;
  ADMIN_ARTIST_ITEM: EndpointDefinition<undefined, ArtistDetailData, `/${string}`>;
  ADMIN_ARTIST_CREATE: EndpointDefinition<Record<string, unknown>, ArtistDetailData, undefined>;
  ADMIN_ARTIST_UPDATE: EndpointDefinition<Record<string, unknown>, ArtistDetailData, `/${string}`>;
  ADMIN_ARTIST_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;

  // Admin content - Pastors
  ADMIN_PASTORS_LIST: EndpointDefinition<undefined, PastorsListData, `?${string}`>;
  ADMIN_PASTOR_ITEM: EndpointDefinition<undefined, { pastor: PastorListItem }, `/${string}`>;
  ADMIN_PASTOR_CREATE: EndpointDefinition<
    Record<string, unknown>,
    { pastor: PastorListItem },
    undefined
  >;
  ADMIN_PASTOR_UPDATE: EndpointDefinition<
    Record<string, unknown>,
    { pastor: PastorListItem },
    `/${string}`
  >;
  ADMIN_PASTOR_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;

  // Admin content - Devotionals
  ADMIN_DEVOTIONALS_LIST: EndpointDefinition<undefined, DevotionalsListData, `?${string}`>;
  ADMIN_DEVOTIONAL_ITEM: EndpointDefinition<undefined, DevotionalDetailData, `/${string}`>;
  ADMIN_DEVOTIONAL_CREATE: EndpointDefinition<
    Record<string, unknown>,
    DevotionalDetailData,
    undefined
  >;
  ADMIN_DEVOTIONAL_UPDATE: EndpointDefinition<
    Record<string, unknown>,
    DevotionalDetailData,
    `/${string}`
  >;
  ADMIN_DEVOTIONAL_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_DEVOTIONAL_APPROVE: EndpointDefinition<undefined, DevotionalDetailData, `/${string}`>;
  ADMIN_DEVOTIONAL_REJECT: EndpointDefinition<
    { reason: string },
    DevotionalDetailData,
    `/${string}`
  >;

  // Admin content - Testimonies
  ADMIN_TESTIMONIES_LIST: EndpointDefinition<undefined, TestimoniesListData, `?${string}`>;
  ADMIN_TESTIMONY_ITEM: EndpointDefinition<undefined, TestimonyDetailData, `/${string}`>;
  ADMIN_TESTIMONY_CREATE: EndpointDefinition<
    Record<string, unknown>,
    TestimonyDetailData,
    undefined
  >;
  ADMIN_TESTIMONY_UPDATE: EndpointDefinition<
    Record<string, unknown>,
    TestimonyDetailData,
    `/${string}`
  >;
  ADMIN_TESTIMONY_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_TESTIMONY_APPROVE: EndpointDefinition<undefined, TestimonyDetailData, `/${string}`>;
  ADMIN_TESTIMONY_REJECT: EndpointDefinition<{ reason: string }, TestimonyDetailData, `/${string}`>;

  // Admin content - Prayer Requests
  ADMIN_PRAYER_REQUESTS_LIST: EndpointDefinition<undefined, PrayerRequestsListData, `?${string}`>;
  ADMIN_PRAYER_REQUEST_ITEM: EndpointDefinition<undefined, PrayerRequestDetailData, `/${string}`>;
  ADMIN_PRAYER_REQUEST_CREATE: EndpointDefinition<
    Record<string, unknown>,
    PrayerRequestDetailData,
    undefined
  >;
  ADMIN_PRAYER_REQUEST_UPDATE: EndpointDefinition<
    Record<string, unknown>,
    PrayerRequestDetailData,
    `/${string}`
  >;
  ADMIN_PRAYER_REQUEST_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_PRAYER_REQUEST_ANSWER: EndpointDefinition<
    { answer: string },
    PrayerRequestDetailData,
    `/${string}`
  >;

  // Admin content - Ask a Pastor
  ADMIN_ASK_PASTOR_LIST: EndpointDefinition<undefined, QuestionsListData, `?${string}`>;
  ADMIN_ASK_PASTOR_ITEM: EndpointDefinition<undefined, QuestionDetailData, `/${string}`>;
  ADMIN_ASK_PASTOR_UPDATE: EndpointDefinition<
    Record<string, unknown>,
    QuestionDetailData,
    `/${string}`
  >;
  ADMIN_ASK_PASTOR_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_ASK_PASTOR_ASSIGN_PASTOR: EndpointDefinition<
    { pastorId: string },
    QuestionDetailData,
    `/${string}`
  >;
  ADMIN_ASK_PASTOR_REJECT: EndpointDefinition<{ reason: string }, QuestionDetailData, `/${string}`>;

  // Admin content - Polls
  ADMIN_POLLS_LIST: EndpointDefinition<undefined, PollsListData, `?${string}`>;
  ADMIN_POLL_ITEM: EndpointDefinition<undefined, PollDetailData, `/${string}`>;
  ADMIN_POLL_CREATE: EndpointDefinition<Record<string, unknown>, PollDetailData, undefined>;
  ADMIN_POLL_UPDATE: EndpointDefinition<Record<string, unknown>, PollDetailData, `/${string}`>;
  ADMIN_POLL_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_POLL_OPEN: EndpointDefinition<undefined, PollDetailData, `/${string}`>;
  ADMIN_POLL_CLOSE: EndpointDefinition<{ reason?: string }, PollDetailData, `/${string}`>;

  // Admin content - Resources
  ADMIN_RESOURCES_LIST: EndpointDefinition<undefined, ResourcesListData, `?${string}`>;
  ADMIN_RESOURCE_ITEM: EndpointDefinition<undefined, { resource: ResourceDetail }, `/${string}`>;
  ADMIN_RESOURCE_CREATE: EndpointDefinition<
    Record<string, unknown>,
    { resource: ResourceDetail },
    undefined
  >;
  ADMIN_RESOURCE_UPDATE: EndpointDefinition<
    Record<string, unknown>,
    { resource: ResourceDetail },
    `/${string}`
  >;
  ADMIN_RESOURCE_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_RESOURCE_APPROVE: EndpointDefinition<undefined, { resource: ResourceDetail }, `/${string}`>;
  ADMIN_RESOURCE_REJECT: EndpointDefinition<
    { reason: string },
    { resource: ResourceDetail },
    `/${string}`
  >;

  // Admin content - Vendors, Products, Orders
  ADMIN_VENDORS_LIST: EndpointDefinition<
    undefined,
    GetListRes<IMarketplaceVendor, 'vendors'>,
    `?${string}`
  >;
  ADMIN_VENDOR_ITEM: EndpointDefinition<undefined, { vendor: IMarketplaceVendor }, `/${string}`>;
  ADMIN_VENDOR_CREATE: EndpointDefinition<
    Record<string, unknown>,
    { vendor: IMarketplaceVendor },
    undefined
  >;
  ADMIN_VENDOR_UPDATE: EndpointDefinition<
    Record<string, unknown>,
    { vendor: IMarketplaceVendor },
    `/${string}`
  >;
  ADMIN_VENDOR_APPROVE: EndpointDefinition<undefined, { vendor: IMarketplaceVendor }, `/${string}`>;
  ADMIN_VENDOR_REJECT: EndpointDefinition<
    { reason: string },
    { vendor: IMarketplaceVendor },
    `/${string}`
  >;

  ADMIN_PRODUCTS_LIST: EndpointDefinition<undefined, IMarketplaceProductsListRes, `?${string}`>;
  ADMIN_PRODUCT_ITEM: EndpointDefinition<undefined, { product: IMarketplaceProduct }, `/${string}`>;
  ADMIN_PRODUCT_CREATE: EndpointDefinition<
    Record<string, unknown>,
    { product: IMarketplaceProduct },
    undefined
  >;
  ADMIN_PRODUCT_UPDATE: EndpointDefinition<
    Record<string, unknown>,
    { product: IMarketplaceProduct },
    `/${string}`
  >;
  ADMIN_PRODUCT_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_PRODUCT_APPROVE: EndpointDefinition<
    undefined,
    { product: IMarketplaceProduct },
    `/${string}`
  >;
  ADMIN_PRODUCT_REJECT: EndpointDefinition<
    { reason: string },
    { product: IMarketplaceProduct },
    `/${string}`
  >;

  ADMIN_ORDERS_LIST: EndpointDefinition<
    undefined,
    GetListRes<PopulatedMarketplaceOrder, 'orders'>,
    `?${string}`
  >;
  ADMIN_ORDER_ITEM: EndpointDefinition<
    undefined,
    { order: PopulatedMarketplaceOrder },
    `/${string}`
  >;

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
  MARKETPLACE_GET_VENDORS: EndpointDefinition<
    undefined,
    IMarketplaceVendorsRes,
    `?${string}` | undefined
  >;
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
  MARKETPLACE_ORDER_WHATSAPP_LINK: EndpointDefinition<
    undefined,
    { whatsappLink: string | null; message: string },
    `/${string}`
  >;

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

  // Public community (read)
  PUBLIC_GET_COMMUNITY: EndpointDefinition<undefined, ICommunityCategoryCountsRes, undefined>;
  PUBLIC_GET_DEVOTIONALS: EndpointDefinition<undefined, IPublicDevotionalsListRes, `?${string}`>;
  PUBLIC_GET_DEVOTIONAL_ITEM: EndpointDefinition<undefined, IPublicDevotionalItemRes, `/${string}`>;
  PUBLIC_GET_TESTIMONIES: EndpointDefinition<undefined, IPublicTestimoniesListRes, `?${string}`>;
  PUBLIC_GET_TESTIMONY_ITEM: EndpointDefinition<undefined, IPublicTestimonyItemRes, `/${string}`>;
  PUBLIC_GET_PRAYER_REQUESTS: EndpointDefinition<
    undefined,
    IPublicPrayerRequestsListRes,
    `?${string}`
  >;
  PUBLIC_GET_PRAYER_REQUEST_ITEM: EndpointDefinition<
    undefined,
    IPublicPrayerRequestItemRes,
    `/${string}`
  >;
  PUBLIC_GET_ASK_A_PASTOR_QUESTIONS: EndpointDefinition<
    undefined,
    IPublicQuestionsListRes,
    `?${string}`
  >;
  PUBLIC_GET_ASK_A_PASTOR_QUESTION_ITEM: EndpointDefinition<
    undefined,
    IPublicQuestionItemRes,
    `/${string}`
  >;
  PUBLIC_GET_ASK_A_PASTOR_PASTORS: EndpointDefinition<
    undefined,
    IPublicPastorsListRes,
    `?${string}` | undefined
  >;
  PUBLIC_GET_POLLS: EndpointDefinition<undefined, IPublicPollsListRes, `?${string}`>;
  PUBLIC_GET_POLL_ITEM: EndpointDefinition<undefined, IPublicPollItemRes, `/${string}`>;
  PUBLIC_GET_ARTISTS: EndpointDefinition<undefined, IPublicArtistsListRes, `?${string}`>;
  PUBLIC_GET_ARTIST_ITEM: EndpointDefinition<undefined, IPublicArtistItemRes, `/${string}`>;
  PUBLIC_GET_RESOURCES: EndpointDefinition<undefined, IPublicResourcesRes, `?${string}`>;

  // Promotion content (public)
  PUBLIC_GET_FEATURED_OPTIONS: EndpointDefinition<undefined, FeaturedOptionsRes, undefined>;
  PUBLIC_GET_PROMOTION_PRICING_OPTIONS: EndpointDefinition<
    undefined,
    PromotionPricingOptionsRes,
    undefined
  >;
  PUBLIC_GET_RESOURCE_DOWNLOAD_CATEGORIES: EndpointDefinition<
    undefined,
    ResourceDownloadCategoriesRes,
    undefined
  >;
  PUBLIC_GET_PROMOTION_CONTACT: EndpointDefinition<undefined, PromotionContactRes, undefined>;

  // Public community (write)
  PUBLIC_SUBMIT_PRAYER_REQUEST: EndpointDefinition<
    ISubmitPrayerRequestPayload,
    ISubmitPrayerRequestRes,
    undefined
  >;
  PUBLIC_SUBMIT_QUESTION: EndpointDefinition<ISubmitQuestionPayload, ISubmitQuestionRes, undefined>;
  PUBLIC_SUBMIT_TESTIMONY: EndpointDefinition<
    ISubmitTestimonyPayload,
    ISubmitTestimonyRes,
    undefined
  >;
  PUBLIC_POLL_VOTE: EndpointDefinition<IPollVotePayload, IPollVoteRes, `/${string}`>;
  PUBLIC_CREATE_POLL: EndpointDefinition<ICreatePollPayload, ICreatePollRes, undefined>;

  // Contact & Search (public)
  PUBLIC_SUBMIT_CONTACT: EndpointDefinition<ISubmitContactPayload, ISubmitContactRes, undefined>;
  PUBLIC_SEARCH: EndpointDefinition<undefined, IPublicSearchRes, `?${string}`>;
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

  // User cart (marketplace)
  USER_CART_GET: { path: '/user/cart', method: 'GET' },
  USER_CART_ADD: { path: '/user/cart', method: 'POST' },
  USER_CART_UPDATE: { path: '/user/cart', method: 'PATCH' },
  USER_CART_REMOVE: { path: '/user/cart', method: 'DELETE' }, // /:productId
  USER_CART_CLEAR: { path: '/user/cart', method: 'DELETE' },

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

  ADMIN_CONTACT_SUBMISSIONS_LIST: { path: '/admin/contact-submissions', method: 'GET' },

  ADMIN_MUSIC_LIST: { path: '/admin/music', method: 'GET' },
  ADMIN_MUSIC_ITEM: { path: '/admin/music', method: 'GET' },
  ADMIN_MUSIC_CREATE: { path: '/admin/music', method: 'POST' },
  ADMIN_MUSIC_UPDATE: { path: '/admin/music', method: 'PATCH' },
  ADMIN_MUSIC_DELETE: { path: '/admin/music', method: 'DELETE' },
  ADMIN_MUSIC_APPROVE: { path: '/admin/music', method: 'POST' },
  ADMIN_MUSIC_REJECT: { path: '/admin/music', method: 'POST' },

  ADMIN_VIDEOS_LIST: { path: '/admin/videos', method: 'GET' },
  ADMIN_VIDEO_ITEM: { path: '/admin/videos', method: 'GET' },
  ADMIN_VIDEO_CREATE: { path: '/admin/videos', method: 'POST' },
  ADMIN_VIDEO_UPDATE: { path: '/admin/videos', method: 'PATCH' },
  ADMIN_VIDEO_DELETE: { path: '/admin/videos', method: 'DELETE' },
  ADMIN_VIDEO_APPROVE: { path: '/admin/videos', method: 'POST' },
  ADMIN_VIDEO_REJECT: { path: '/admin/videos', method: 'POST' },

  ADMIN_NEWS_LIST: { path: '/admin/news', method: 'GET' },
  ADMIN_NEWS_ITEM: { path: '/admin/news', method: 'GET' },
  ADMIN_NEWS_CREATE: { path: '/admin/news', method: 'POST' },
  ADMIN_NEWS_UPDATE: { path: '/admin/news', method: 'PATCH' },
  ADMIN_NEWS_DELETE: { path: '/admin/news', method: 'DELETE' },

  ADMIN_ARTISTS_LIST: { path: '/admin/artists', method: 'GET' },
  ADMIN_ARTIST_ITEM: { path: '/admin/artists', method: 'GET' },
  ADMIN_ARTIST_CREATE: { path: '/admin/artists', method: 'POST' },
  ADMIN_ARTIST_UPDATE: { path: '/admin/artists', method: 'PATCH' },
  ADMIN_ARTIST_DELETE: { path: '/admin/artists', method: 'DELETE' },

  ADMIN_PASTORS_LIST: { path: '/admin/pastors', method: 'GET' },
  ADMIN_PASTOR_ITEM: { path: '/admin/pastors', method: 'GET' },
  ADMIN_PASTOR_CREATE: { path: '/admin/pastors', method: 'POST' },
  ADMIN_PASTOR_UPDATE: { path: '/admin/pastors', method: 'PATCH' },
  ADMIN_PASTOR_DELETE: { path: '/admin/pastors', method: 'DELETE' },

  ADMIN_DEVOTIONALS_LIST: { path: '/admin/devotionals', method: 'GET' },
  ADMIN_DEVOTIONAL_ITEM: { path: '/admin/devotionals', method: 'GET' },
  ADMIN_DEVOTIONAL_CREATE: { path: '/admin/devotionals', method: 'POST' },
  ADMIN_DEVOTIONAL_UPDATE: { path: '/admin/devotionals', method: 'PATCH' },
  ADMIN_DEVOTIONAL_DELETE: { path: '/admin/devotionals', method: 'DELETE' },
  ADMIN_DEVOTIONAL_APPROVE: { path: '/admin/devotionals', method: 'POST' },
  ADMIN_DEVOTIONAL_REJECT: { path: '/admin/devotionals', method: 'POST' },

  ADMIN_TESTIMONIES_LIST: { path: '/admin/testimonies', method: 'GET' },
  ADMIN_TESTIMONY_ITEM: { path: '/admin/testimonies', method: 'GET' },
  ADMIN_TESTIMONY_CREATE: { path: '/admin/testimonies', method: 'POST' },
  ADMIN_TESTIMONY_UPDATE: { path: '/admin/testimonies', method: 'PATCH' },
  ADMIN_TESTIMONY_DELETE: { path: '/admin/testimonies', method: 'DELETE' },
  ADMIN_TESTIMONY_APPROVE: { path: '/admin/testimonies', method: 'POST' },
  ADMIN_TESTIMONY_REJECT: { path: '/admin/testimonies', method: 'POST' },

  ADMIN_PRAYER_REQUESTS_LIST: { path: '/admin/prayer-requests', method: 'GET' },
  ADMIN_PRAYER_REQUEST_ITEM: { path: '/admin/prayer-requests', method: 'GET' },
  ADMIN_PRAYER_REQUEST_CREATE: { path: '/admin/prayer-requests', method: 'POST' },
  ADMIN_PRAYER_REQUEST_UPDATE: { path: '/admin/prayer-requests', method: 'PATCH' },
  ADMIN_PRAYER_REQUEST_DELETE: { path: '/admin/prayer-requests', method: 'DELETE' },
  ADMIN_PRAYER_REQUEST_ANSWER: { path: '/admin/prayer-requests', method: 'POST' },

  ADMIN_ASK_PASTOR_LIST: { path: '/admin/ask-a-pastor/questions', method: 'GET' },
  ADMIN_ASK_PASTOR_ITEM: { path: '/admin/ask-a-pastor/questions', method: 'GET' },
  ADMIN_ASK_PASTOR_UPDATE: { path: '/admin/ask-a-pastor/questions', method: 'PATCH' },
  ADMIN_ASK_PASTOR_DELETE: { path: '/admin/ask-a-pastor/questions', method: 'DELETE' },
  ADMIN_ASK_PASTOR_ASSIGN_PASTOR: { path: '/admin/ask-a-pastor/questions', method: 'POST' },
  ADMIN_ASK_PASTOR_REJECT: { path: '/admin/ask-a-pastor/questions', method: 'POST' },

  ADMIN_POLLS_LIST: { path: '/admin/polls', method: 'GET' },
  ADMIN_POLL_ITEM: { path: '/admin/polls', method: 'GET' },
  ADMIN_POLL_CREATE: { path: '/admin/polls', method: 'POST' },
  ADMIN_POLL_UPDATE: { path: '/admin/polls', method: 'PATCH' },
  ADMIN_POLL_DELETE: { path: '/admin/polls', method: 'DELETE' },
  ADMIN_POLL_OPEN: { path: '/admin/polls', method: 'POST' },
  ADMIN_POLL_CLOSE: { path: '/admin/polls', method: 'POST' },

  ADMIN_RESOURCES_LIST: { path: '/admin/resources', method: 'GET' },
  ADMIN_RESOURCE_ITEM: { path: '/admin/resources', method: 'GET' },
  ADMIN_RESOURCE_CREATE: { path: '/admin/resources', method: 'POST' },
  ADMIN_RESOURCE_UPDATE: { path: '/admin/resources', method: 'PATCH' },
  ADMIN_RESOURCE_DELETE: { path: '/admin/resources', method: 'DELETE' },
  ADMIN_RESOURCE_APPROVE: { path: '/admin/resources', method: 'POST' },
  ADMIN_RESOURCE_REJECT: { path: '/admin/resources', method: 'POST' },

  ADMIN_VENDORS_LIST: { path: '/admin/vendors', method: 'GET' },
  ADMIN_VENDOR_ITEM: { path: '/admin/vendors', method: 'GET' },
  ADMIN_VENDOR_CREATE: { path: '/admin/vendors', method: 'POST' },
  ADMIN_VENDOR_UPDATE: { path: '/admin/vendors', method: 'PATCH' },
  ADMIN_VENDOR_APPROVE: { path: '/admin/vendors', method: 'POST' },
  ADMIN_VENDOR_REJECT: { path: '/admin/vendors', method: 'POST' },

  ADMIN_PRODUCTS_LIST: { path: '/admin/products', method: 'GET' },
  ADMIN_PRODUCT_ITEM: { path: '/admin/products', method: 'GET' },
  ADMIN_PRODUCT_CREATE: { path: '/admin/products', method: 'POST' },
  ADMIN_PRODUCT_UPDATE: { path: '/admin/products', method: 'PATCH' },
  ADMIN_PRODUCT_DELETE: { path: '/admin/products', method: 'DELETE' },
  ADMIN_PRODUCT_APPROVE: { path: '/admin/products', method: 'POST' },
  ADMIN_PRODUCT_REJECT: { path: '/admin/products', method: 'POST' },

  ADMIN_ORDERS_LIST: { path: '/admin/orders', method: 'GET' },
  ADMIN_ORDER_ITEM: { path: '/admin/orders', method: 'GET' },

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
  MARKETPLACE_ORDER_WHATSAPP_LINK: {
    path: '/marketplace/orders',
    method: 'GET',
  }, // /:orderId/whatsapp-link

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

  // Public community (read)
  PUBLIC_GET_COMMUNITY: { path: '/public/community', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_DEVOTIONALS: { path: '/public/devotionals', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_DEVOTIONAL_ITEM: {
    path: '/public/devotionals',
    method: 'GET',
    isNotAuthenticated: true,
  }, // /:idOrSlug
  PUBLIC_GET_TESTIMONIES: { path: '/public/testimonies', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_TESTIMONY_ITEM: {
    path: '/public/testimonies',
    method: 'GET',
    isNotAuthenticated: true,
  }, // /:idOrSlug
  PUBLIC_GET_PRAYER_REQUESTS: {
    path: '/public/prayer-requests',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_PRAYER_REQUEST_ITEM: {
    path: '/public/prayer-requests',
    method: 'GET',
    isNotAuthenticated: true,
  }, // /:idOrSlug
  PUBLIC_GET_ASK_A_PASTOR_QUESTIONS: {
    path: '/public/ask-a-pastor/questions',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_ASK_A_PASTOR_QUESTION_ITEM: {
    path: '/public/ask-a-pastor/questions',
    method: 'GET',
    isNotAuthenticated: true,
  }, // /:idOrSlug
  PUBLIC_GET_ASK_A_PASTOR_PASTORS: {
    path: '/public/ask-a-pastor/pastors',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_POLLS: { path: '/public/polls', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_POLL_ITEM: { path: '/public/polls', method: 'GET', isNotAuthenticated: true }, // /:idOrSlug
  PUBLIC_GET_ARTISTS: { path: '/public/artists', method: 'GET', isNotAuthenticated: true },
  PUBLIC_GET_ARTIST_ITEM: { path: '/public/artists', method: 'GET', isNotAuthenticated: true }, // /:idOrSlug
  PUBLIC_GET_RESOURCES: { path: '/public/resources', method: 'GET', isNotAuthenticated: true },

  // Promotion content (public)
  PUBLIC_GET_FEATURED_OPTIONS: {
    path: '/public/featured-options',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_PROMOTION_PRICING_OPTIONS: {
    path: '/public/promotion-pricing-options',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_RESOURCE_DOWNLOAD_CATEGORIES: {
    path: '/public/resource-download-categories',
    method: 'GET',
    isNotAuthenticated: true,
  },
  PUBLIC_GET_PROMOTION_CONTACT: {
    path: '/public/promotion-contact',
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Public community (write)
  PUBLIC_SUBMIT_PRAYER_REQUEST: {
    path: '/public/prayer-requests',
    method: 'POST',
    isNotAuthenticated: true,
  },
  PUBLIC_SUBMIT_QUESTION: {
    path: '/public/ask-a-pastor/questions',
    method: 'POST',
    isNotAuthenticated: true,
  },
  PUBLIC_SUBMIT_TESTIMONY: {
    path: '/public/testimonies',
    method: 'POST',
    isNotAuthenticated: true,
  },
  PUBLIC_POLL_VOTE: { path: '/public/polls', method: 'POST', isNotAuthenticated: true }, // /:idOrSlug/vote
  PUBLIC_CREATE_POLL: { path: '/public/polls', method: 'POST', isNotAuthenticated: true },

  // Contact & Search (public)
  PUBLIC_SUBMIT_CONTACT: { path: '/public/contact', method: 'POST', isNotAuthenticated: true },
  PUBLIC_SEARCH: { path: '/public/search', method: 'GET', isNotAuthenticated: true },
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
  /** When API populates vendor, includes whatsapp for "Chat with vendor" link */
  vendorPopulated?: PopulatedVendorSummary;
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
  /** Optional WhatsApp deep link built from current order state, when vendor has a WhatsApp number. */
  whatsappLink?: string | null;
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
  customer: { name: string; email: string; phone: string; address?: string; notes?: string };
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
  /** Optional: wa.me link to send order details to vendor (single-vendor order) */
  whatsappLink?: string | null;
  /** When cart spans multiple vendors, backend may return one order per vendor */
  orders?: PopulatedMarketplaceOrder[];
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
