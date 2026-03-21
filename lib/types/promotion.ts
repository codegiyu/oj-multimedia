/**
 * Promotion & community content types (featured options, pricing, download categories, contact).
 * These are fetched from the backend and used in promote-your-content and resources pages.
 */

// --- Featured Options (Get Featured section) ---

/** Icon identifier for featured options. Maps to Lucide icons on the frontend. */
export type FeaturedOptionIconId =
  | 'home'
  | 'trending-up'
  | 'mail'
  | 'star'
  | 'music'
  | 'video'
  | 'megaphone';

export interface FeaturedOption {
  _id: string;
  title: string;
  duration: string;
  price: string;
  description: string;
  features: string[];
  /** Icon identifier; frontend maps to Lucide icon component */
  icon: FeaturedOptionIconId;
  displayOrder?: number;
}

export interface FeaturedOptionsRes {
  featuredOptions: FeaturedOption[];
}

// --- Promotion Pricing Options (Promote Your Song section) ---

export interface PromotionPricingOption {
  _id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  /** When true, show "Most Popular" badge */
  isFeatured?: boolean;
  displayOrder?: number;
}

export interface PromotionPricingOptionsRes {
  pricingOptions: PromotionPricingOption[];
}

// --- Resource Download Categories (Free Downloads section) ---

export interface ResourceDownloadCategory {
  _id: string;
  title: string;
  /** Display string for count, e.g. "12+", "50+" */
  count: string;
  description: string;
  /** Emoji or icon identifier */
  icon: string;
  /** Link href (relative or absolute) */
  href: string;
  displayOrder?: number;
}

export interface ResourceDownloadCategoriesRes {
  downloadCategories: ResourceDownloadCategory[];
}

// --- Promotion Contact (Contact Sponsorship section) ---

/** Icon identifier for contact methods. Maps to Lucide icons on the frontend. */
export type ContactMethodIconId = 'mail' | 'phone' | 'message-square' | 'whatsapp';

export interface ContactMethod {
  _id: string;
  method: string;
  value: string;
  /** mailto:, tel:, or https://wa.me/... */
  action: string;
  icon: ContactMethodIconId;
  displayOrder?: number;
}

export interface PromotionContactRes {
  contactMethods: ContactMethod[];
  partnershipBenefits: string[];
  /** Optional additional contact info (e.g. extra phone number) */
  additionalContact?: string;
}
