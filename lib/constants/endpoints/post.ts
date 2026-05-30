import type { EntityType, UploadIntent } from '@/lib/types/server-models';
import { API_V1_PREFIX } from './types';
import type {
  Analytics,
  AppDetails,
  Branding,
  ContactInfo,
  FeatureFlags,
  LegalCompliance,
  Localization,
  SEODetails,
  Social,
} from '@/lib/types/site-settings';
import { ClientAdmin, ClientUser, PopulatedUser, PopulatedVendorSummary } from './types';

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
export type SiteSettingsUpdateItem =
  | { name: 'appDetails'; value: AppDetails }
  | { name: 'seo'; value: SEODetails }
  | { name: 'legal'; value: LegalCompliance }
  | { name: 'features'; value: FeatureFlags }
  | { name: 'analytics'; value: Analytics }
  | { name: 'localization'; value: Localization }
  | { name: 'branding'; value: Branding }
  | { name: 'contactInfo'; value: ContactInfo }
  | { name: 'socials'; value: Social[] };

export type SiteSettingsSliceName = SiteSettingsUpdateItem['name'];

export type SiteSettingsSliceValue = SiteSettingsUpdateItem['value'];

export interface ISiteSettingsUpdatePayload {
  settingsPayload: SiteSettingsUpdateItem[];
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
  /** Flat vendor WhatsApp from list/detail API (alternative to vendorPopulated.whatsapp) */
  vendorWhatsapp?: string;
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
  approvedAt?: string;
  rejectionReason?: string;
  rejectedAt?: string;
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
  approvedAt?: string;
  rejectionReason?: string;
  rejectedAt?: string;
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
export interface IVendorPatchOrderPayload {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}
export interface IVendorPatchOrderRes {
  order: PopulatedMarketplaceOrder;
}
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

function apiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || 'https://api.ojmultimedia.com').replace(/\/$/, '');
}

/** Public GET /api/v1/public/music/:idOrSlug/download — increments download count and redirects to file URL. */
export function getPublicMusicDownloadUrl(idOrSlug: string): string {
  const encoded = encodeURIComponent(idOrSlug);

  return `${apiBaseUrl()}${API_V1_PREFIX}/public/music/${encoded}/download`;
}

/** Public GET /api/v1/public/videos/:idOrSlug/download — same pattern as music. */
export function getPublicVideoDownloadUrl(idOrSlug: string): string {
  const encoded = encodeURIComponent(idOrSlug);

  return `${apiBaseUrl()}${API_V1_PREFIX}/public/videos/${encoded}/download`;
}
