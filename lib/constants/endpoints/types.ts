/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ISiteSettings,
  IAdmin,
  IUser,
  IArtistProfile,
  IMusic,
  MusicAlbumSummary,
  IVideo,
  INewsArticle,
  IGospelVerse,
  ContentCategoryScope,
} from '@/lib/types/server-models';
import type {
  CommunityHubData,
  DevotionalsListData,
  DevotionalDetailData,
  AlbumsListData,
  AlbumDetailData,
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
import type { UsersListData, UserDetailData } from '@/lib/types/adminUsers';
import type {
  StaffListData,
  StaffDetailData,
  IAdminStaffInvitePayload,
  IAdminStaffInviteRes,
  IAdminStaffReinviteRes,
} from '@/lib/types/adminStaff';
import type {
  FeaturedOptionsRes,
  PromotionPricingOptionsRes,
  ResourceDownloadCategoriesRes,
  PromotionContactRes,
} from '@/lib/types/promotion';
import {
  GetListRes,
  IAuthChangePasswordPayload,
  IAuthChangePasswordRes,
  IAuthGoogleLoginPayload,
  IAuthGoogleLoginRes,
  IAuthLoginPayload,
  IAuthLoginRes,
  IAuthRequestOtpPayload,
  IAuthRequestOtpRes,
  IAuthRequestPasswordResetPayload,
  IAuthRequestPasswordResetRes,
  IAuthResetPasswordPayload,
  IAuthResetPasswordRes,
  IAuthSessionRes,
  IAuthVerifyOtpPayload,
  IAuthVerifyOtpRes,
  IDocumentDetailsRes,
  IDocumentsListRes,
  IDocumentVerifyPayload,
  IDocumentVerifyRes,
  IEmailLogDetailsRes,
  IEmailLogResendRes,
  IEmailLogsListRes,
  IMarketplaceBecomeVendorPayload,
  IMarketplaceBecomeVendorRes,
  IMarketplaceCategoriesRes,
  IMarketplaceMyOrdersRes,
  IMarketplacePlaceOrderPayload,
  IMarketplacePlaceOrderRes,
  IMarketplaceProduct,
  IMarketplaceProductRes,
  IMarketplaceProductsListRes,
  IMarketplaceProductVariant,
  IMarketplaceSubCategoriesRes,
  IMarketplaceVariationOption,
  IMarketplaceVendor,
  IMarketplaceVendorRes,
  IMarketplaceVendorsRes,
  INotificationCreatePayload,
  INotificationCreateRes,
  INotificationPreferencesRes,
  INotificationReadRes,
  INotificationsListRes,
  INotificationsReadAllPayload,
  INotificationUpdatePreferencesPayload,
  INotificationUpdatePushTokenPayload,
  INotificationUpdatePushTokenRes,
  ISiteSettingsUpdatePayload,
  IUploadPresignedUrlPayload,
  IUploadPresignedUrlRes,
  IVendorCreateProductPayload,
  IVendorDashboardStatsRes,
  IVendorMeRes,
  IVendorOrdersRes,
  IVendorProductsRes,
  IVendorUpdateProductPayload,
  IVendorUpdateSettingsPayload,
  PageAndSizeQuery,
  PopulatedMarketplaceOrder,
} from './post';

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Auth header names expected by backend middleware (header-first auth flow). */
export const AUTH_TOKEN_HEADERS = {
  access: 'oj-acc-token',
  refresh: 'oj-ref-token',
} as const;

/** Frontend-owned httpOnly cookies (set by Next route handlers for server-side forwarding). */
export const AUTH_CLIENT_COOKIES = {
  access: 'oj-acc-client',
  refresh: 'oj-ref-client',
} as const;

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

export interface IAdminMeRes {
  user: ClientAdmin;
}

export interface IAdminUpdateMePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
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

export type ContentFavoriteEntityType = 'music' | 'video' | 'news' | 'devotional';

export interface IUserContentFavoriteItem {
  _id: string;
  entityType: ContentFavoriteEntityType;
  entityId: string;
  createdAt: string;
  title: string;
  slug?: string;
  image?: string;
  subtitle?: string;
  href: string;
}

export type IUserFavoritesListRes = GetListRes<IUserContentFavoriteItem, 'items'>;

export interface IUserFavoritesAddPayload {
  entityType: ContentFavoriteEntityType;
  entityId: string;
}

export interface IUserFavoritesAddRes {
  item: IUserContentFavoriteItem;
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

export interface IContentMetricsBreakdown {
  views: number;
  plays: number;
  downloads: number;
}

export interface IArtistDashboardStatsRes {
  tracksCount: number;
  videosCount: number;
  totalPlays: number;
  totalViews?: number;
  totalDownloads?: number;
  music?: IContentMetricsBreakdown;
  video?: IContentMetricsBreakdown;
  devotionals?: { views: number; plays: number; downloads?: number };
  tracksAddedThisMonth?: number;
  playsDeltaPercent?: number | null;
}

export interface IAdminUserSearchItem {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  artistId?: string;
}

export interface IAdminUsersSearchRes {
  users: IAdminUserSearchItem[];
}

export type PublicContentEntityType = 'music' | 'video' | 'devotional' | 'news-article' | 'album';

export interface IPublicContentAnalyticsEventPayload {
  entityType: PublicContentEntityType;
  entityIdOrSlug: string;
  event: 'view' | 'play' | 'download';
  clientSessionId?: string;
}

export interface IAdminArtistDashboardStatsRes {
  tracksCount: number;
  videosCount: number;
  devotionalsCount?: number;
  totalViews: number;
  totalPlays: number;
  totalDownloads: number;
  music: IContentMetricsBreakdown;
  video: IContentMetricsBreakdown;
  devotionals?: { views: number; plays: number; downloads?: number };
  topMusic?: Array<{ _id: string; title: string; plays?: number; views?: number }>;
  topVideos?: Array<{ _id: string; title: string; plays?: number; views?: number }>;
}

export type IAdminCreateMusicPayload = IArtistCreateMusicPayload & {
  artistId?: string;
  ownerUserId?: string;
};

export type IAdminUpdateMusicPayload = IArtistUpdateMusicPayload & {
  ownerUserId?: string;
};

export type IAdminCreateVideoPayload = IArtistCreateVideoPayload & {
  artistId?: string;
  ownerUserId?: string;
};

export type IAdminUpdateVideoPayload = IArtistUpdateVideoPayload & {
  ownerUserId?: string;
};

/** Present on admin content list/detail when API supports owner locking. */
export type ContentOwnerApiFields = {
  ownerLocked?: boolean;
  ownerUserId?: string;
};

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

/** First-time artist profile for the authenticated user (`POST /artist/me`). */
export interface IArtistCreateMePayload {
  name: string;
  bio?: string;
  image?: string;
  coverImage?: string;
  genre?: string;
  socials?: IArtistUpdateMePayload['socials'];
}

export type { MusicAlbumSummary };

export type ArtistMusicListItem = Omit<ClientMusic, 'artist'> &
  ContentOwnerApiFields & {
    artist?: string | PopulatedArtistSummary;
    album?: MusicAlbumSummary;
  };

export type IArtistMusicListRes = GetListRes<ArtistMusicListItem, 'music'>;

export interface IArtistMusicItemRes {
  music: ArtistMusicListItem;
}

export interface IArtistCreateMusicPayload {
  title: string;
  description?: string;
  lyrics?: string;
  excerpt?: string;
  coverImage?: string;
  audioUrl?: string;
  videoUrl?: string;
  downloadUrl?: string;
  category?: string;
  isMonetizable?: boolean;
  price?: number;
  status?: 'draft' | 'published' | 'archived';
  albumId?: string | null;
}

export interface IArtistUpdateMusicPayload extends Partial<IArtistCreateMusicPayload> {
  status?: 'draft' | 'published' | 'archived';
}

export type ArtistVideoListItem = Omit<ClientVideo, 'artist'> &
  ContentOwnerApiFields & {
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
  videoFileUrl?: string;
  embedUrl?: string;
  category?: string;
  isMonetizable?: boolean;
  price?: number;
  status?: 'draft' | 'published' | 'archived';
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

export type PublicAlbumListItem = {
  _id: string;
  title: string;
  slug: string;
  coverImage?: string;
  excerpt?: string;
  description?: string;
  releaseDate?: string | null;
  artist?: string | { _id: string; name: string; slug?: string; image?: string };
  trackCount?: number;
  views?: number;
  plays?: number;
  isFeatured?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type PublicAlbumTrackItem = {
  _id: string;
  title: string;
  slug: string;
  coverImage?: string;
  excerpt?: string;
  displayOrder?: number;
  plays?: number;
  artist?: string | { _id: string; name?: string };
};

export type IPublicAlbumsListRes = GetListRes<PublicAlbumListItem, 'albums'>;
export interface IPublicAlbumItemRes {
  album: PublicAlbumListItem;
  tracks: PublicAlbumTrackItem[];
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

/** Admin news endpoints return `{ news }` (public detail uses `{ article }`). */
export interface IAdminNewsItemRes {
  news: PublicNewsListItem;
}

export interface IContentCategoryItem {
  _id: string;
  name: string;
  slug: string;
  scope: ContentCategoryScope;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHomeAdvertItem {
  _id: string;
  slot: 'after_hero' | 'before_cta';
  imageUrl: string;
  linkUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type IContentCategoriesListRes = GetListRes<IContentCategoryItem, 'categories'>;
export type IHomeAdvertsListRes = GetListRes<IHomeAdvertItem, 'adverts'>;
export interface IContentCategoryMutationRes {
  category: IContentCategoryItem;
}
export interface IAdminContentCategoryCreatePayload {
  name: string;
  scope: ContentCategoryScope;
  displayOrder?: number;
  isActive?: boolean;
}
export interface IAdminContentCategoryUpdatePayload {
  name?: string;
  scope?: ContentCategoryScope;
  displayOrder?: number;
  isActive?: boolean;
}
export interface IHomeAdvertMutationRes {
  advert: IHomeAdvertItem;
}
export interface IAdminHomeAdvertCreatePayload {
  slot: IHomeAdvertItem['slot'];
  imageUrl: string;
  linkUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}
export interface IAdminHomeAdvertUpdatePayload {
  slot?: IHomeAdvertItem['slot'];
  imageUrl?: string;
  linkUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}
export type IPublicContentCategoriesRes = { categories: IContentCategoryItem[] };
export type IPublicHomeAdvertsRes = { adverts: IHomeAdvertItem[] };

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
  | 'album'
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
 * Query params for GET /api/v1/public/search.
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
  USER_FAVORITES_LIST: EndpointDefinition<undefined, IUserFavoritesListRes, `?${string}`>;
  USER_FAVORITES_ADD: EndpointDefinition<IUserFavoritesAddPayload, IUserFavoritesAddRes, undefined>;
  USER_FAVORITES_REMOVE: EndpointDefinition<
    undefined,
    { success: boolean },
    `/${string}/${string}`
  >;

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

  ADMIN_GET_ME: EndpointDefinition<undefined, IAdminMeRes, undefined>;
  ADMIN_UPDATE_ME: EndpointDefinition<IAdminUpdateMePayload, IAdminMeRes, undefined>;

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

  ADMIN_STAFF_LIST: EndpointDefinition<undefined, StaffListData, `?${string}`>;
  ADMIN_STAFF_ITEM: EndpointDefinition<undefined, StaffDetailData, `/${string}`>;
  ADMIN_STAFF_INVITE: EndpointDefinition<IAdminStaffInvitePayload, IAdminStaffInviteRes, undefined>;
  ADMIN_STAFF_REINVITE: EndpointDefinition<undefined, IAdminStaffReinviteRes, `/${string}`>;

  ADMIN_USERS_SEARCH: EndpointDefinition<undefined, IAdminUsersSearchRes, `?${string}`>;
  ADMIN_USERS_LIST: EndpointDefinition<undefined, UsersListData, `?${string}`>;
  ADMIN_USER_ITEM: EndpointDefinition<undefined, UserDetailData, `/${string}`>;
  ADMIN_USER_UPDATE: EndpointDefinition<
    {
      accountStatus?: string;
      artistId?: string | null;
      vendorId?: string | null;
    },
    UserDetailData,
    `/${string}`
  >;
  ADMIN_USER_APPROVE_DELETION: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_USER_REJECT_DELETION: EndpointDefinition<undefined, UserDetailData, `/${string}`>;

  // Admin content - Music
  ADMIN_MUSIC_LIST: EndpointDefinition<
    undefined,
    GetListRes<ArtistMusicListItem, 'music'>,
    `?${string}`
  >;
  ADMIN_MUSIC_ITEM: EndpointDefinition<undefined, IArtistMusicItemRes, `/${string}`>;
  ADMIN_MUSIC_CREATE: EndpointDefinition<IAdminCreateMusicPayload, IArtistMusicItemRes, undefined>;
  ADMIN_MUSIC_UPDATE: EndpointDefinition<
    IAdminUpdateMusicPayload,
    IArtistMusicItemRes,
    `/${string}`
  >;
  ADMIN_MUSIC_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_MUSIC_APPROVE: EndpointDefinition<undefined, IArtistMusicItemRes, `/${string}`>;
  ADMIN_MUSIC_REJECT: EndpointDefinition<{ reason: string }, IArtistMusicItemRes, `/${string}`>;

  // Admin content - Albums
  ADMIN_ALBUMS_LIST: EndpointDefinition<undefined, AlbumsListData, `?${string}`>;
  ADMIN_ALBUM_ITEM: EndpointDefinition<undefined, AlbumDetailData, `/${string}`>;
  ADMIN_ALBUM_CREATE: EndpointDefinition<Record<string, unknown>, AlbumDetailData, undefined>;
  ADMIN_ALBUM_UPDATE: EndpointDefinition<Record<string, unknown>, AlbumDetailData, `/${string}`>;
  ADMIN_ALBUM_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;

  // Admin content - Videos
  ADMIN_VIDEOS_LIST: EndpointDefinition<
    undefined,
    GetListRes<ArtistVideoListItem, 'videos'>,
    `?${string}`
  >;
  ADMIN_VIDEO_ITEM: EndpointDefinition<undefined, IArtistVideoItemRes, `/${string}`>;
  ADMIN_VIDEO_CREATE: EndpointDefinition<IAdminCreateVideoPayload, IArtistVideoItemRes, undefined>;
  ADMIN_VIDEO_UPDATE: EndpointDefinition<
    IAdminUpdateVideoPayload,
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
  ADMIN_NEWS_ITEM: EndpointDefinition<undefined, IAdminNewsItemRes, `/${string}`>;
  ADMIN_NEWS_CREATE: EndpointDefinition<Record<string, unknown>, IAdminNewsItemRes, undefined>;
  ADMIN_NEWS_UPDATE: EndpointDefinition<Record<string, unknown>, IAdminNewsItemRes, `/${string}`>;
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
  ADMIN_ARTIST_DASHBOARD_STATS: EndpointDefinition<
    undefined,
    IAdminArtistDashboardStatsRes,
    `/${string}`
  >;

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

  // Admin content - Gospel verses (daily verse of the day)
  ADMIN_GOSPEL_VERSES_LIST: EndpointDefinition<
    undefined,
    GetListRes<IGospelVerse, 'gospelVerses'>,
    `?${string}`
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

  ADMIN_CONTENT_CATEGORIES_LIST: EndpointDefinition<
    undefined,
    IContentCategoriesListRes,
    `?${string}`
  >;
  ADMIN_CONTENT_CATEGORIES_CREATE: EndpointDefinition<
    IAdminContentCategoryCreatePayload,
    IContentCategoryMutationRes,
    undefined
  >;
  ADMIN_CONTENT_CATEGORIES_UPDATE: EndpointDefinition<
    IAdminContentCategoryUpdatePayload,
    IContentCategoryMutationRes,
    `/${string}`
  >;
  ADMIN_CONTENT_CATEGORIES_DELETE: EndpointDefinition<
    undefined,
    { success: boolean },
    `/${string}`
  >;

  ADMIN_HOME_ADVERTS_LIST: EndpointDefinition<undefined, IHomeAdvertsListRes, `?${string}`>;
  ADMIN_HOME_ADVERTS_CREATE: EndpointDefinition<
    IAdminHomeAdvertCreatePayload,
    IHomeAdvertMutationRes,
    undefined
  >;
  ADMIN_HOME_ADVERTS_UPDATE: EndpointDefinition<
    IAdminHomeAdvertUpdatePayload,
    IHomeAdvertMutationRes,
    `/${string}`
  >;
  ADMIN_HOME_ADVERTS_DELETE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;

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
  ARTIST_CREATE_ME: EndpointDefinition<IArtistCreateMePayload, IArtistMeRes, undefined>;
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
  PUBLIC_GET_ALBUMS: EndpointDefinition<undefined, IPublicAlbumsListRes, `?${string}`>;
  PUBLIC_GET_ALBUM_ITEM: EndpointDefinition<undefined, IPublicAlbumItemRes, `/${string}`>;
  PUBLIC_GET_VIDEOS: EndpointDefinition<undefined, IPublicVideosListRes, `?${string}`>;
  PUBLIC_GET_VIDEO_ITEM: EndpointDefinition<undefined, IPublicVideoItemRes, `/${string}`>;
  PUBLIC_GET_NEWS: EndpointDefinition<undefined, IPublicNewsListRes, `?${string}`>;
  PUBLIC_GET_NEWS_ITEM: EndpointDefinition<undefined, IPublicNewsItemRes, `/${string}`>;
  PUBLIC_GET_CONTENT_CATEGORIES: EndpointDefinition<
    undefined,
    IPublicContentCategoriesRes,
    `?${string}` | undefined
  >;
  PUBLIC_GET_HOME_ADVERTS: EndpointDefinition<undefined, IPublicHomeAdvertsRes, undefined>;

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
  PUBLIC_CONTENT_ANALYTICS_EVENT: EndpointDefinition<
    IPublicContentAnalyticsEventPayload,
    { ok?: boolean },
    undefined
  >;
}

/** Backend REST prefix; every `ENDPOINTS` path includes this segment. */
export const API_V1_PREFIX = '/api/v1' as const;
