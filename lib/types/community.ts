/**
 * Community API types and constants (aligned with COMMUNITY-API-FRONTEND.md).
 * Base URL for community endpoints: {API_BASE}/public
 */

// --- Constants (enums) ---

export const DEVOTIONAL_TYPES = [
  'daily',
  'latest',
  'popular',
  'bible-study',
  'prayer-points',
  'living-tips',
  'marriage-family',
] as const;
export type DevotionalType = (typeof DEVOTIONAL_TYPES)[number];

export const TESTIMONY_TYPES = ['all', 'featured', 'latest'] as const;
export type TestimonyType = (typeof TESTIMONY_TYPES)[number];

export const PRAYER_STATUS = ['active', 'answered'] as const;
export type PrayerStatus = (typeof PRAYER_STATUS)[number];

export const POLL_STATUS = ['active', 'closed'] as const;
export type PollStatus = (typeof POLL_STATUS)[number];

export const RESOURCE_TYPES = ['ebook', 'template', 'beat', 'wallpaper', 'affiliate'] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

// --- Pagination ---

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// --- Community hub ---

export interface DevotionalListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  author?: string;
  views?: number;
  plays?: number;
  /** Linked artist profile id or populated `{ _id, name }` from API. */
  artist?: string | { _id: string; name: string; slug?: string };
  ownerLocked?: boolean;
  ownerUserId?: string;
  status?: string;
  createdAt?: string;
  type?: string;
  verse?: string;
  date?: string;
  readingTime?: number;
  lessons?: string[];
  duration?: number;
}

export interface DevotionalDetail extends DevotionalListItem {
  content?: string;
  updatedAt?: string;
  coverImage?: string;
  ownerUserId?: string;
}

export interface DevotionalsListData {
  devotionals: DevotionalListItem[];
  pagination: Pagination;
}

export interface DevotionalDetailData {
  devotional: DevotionalDetail;
  relatedDevotionals?: DevotionalListItem[];
}

export interface TestimonyListItem {
  _id: string;
  author: string;
  avatar?: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  category?: string;
}

export interface TestimonyDetail extends TestimonyListItem {
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimoniesListData {
  testimonies: TestimonyListItem[];
  pagination: Pagination;
}

export interface TestimonyDetailData {
  testimony: TestimonyDetail;
}

export interface CommunityHubData {
  categoryCounts: Record<string, number>;
  featuredTestimonies?: TestimonyListItem[];
  trendingDevotionals?: DevotionalListItem[];
  activeDiscussions?: unknown[];
}

// --- Prayer requests ---

export interface PrayerRequestListItem {
  _id: string;
  title: string;
  content: string;
  author: string;
  category?: string;
  prayers: number;
  comments: number;
  timeAgo: string;
  urgent: boolean;
  testimony?: string;
  answeredDate?: string;
}

export interface PrayerRequestDetail extends PrayerRequestListItem {
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrayerRequestsListData {
  prayerRequests: PrayerRequestListItem[];
  pagination: Pagination;
}

export interface PrayerRequestDetailData {
  prayerRequest: PrayerRequestDetail;
}

// --- Ask a pastor ---

export interface PastorListItem {
  _id: string;
  name: string;
  title?: string;
  church?: string;
  image?: string;
  expertise?: string[];
  questionsAnswered?: number;
  rating?: number;
}

export interface PastorDetail extends PastorListItem {
  slug?: string;
  bio?: string;
}

export interface QuestionListItem {
  _id: string;
  question: string;
  category?: string;
  author: string;
  views: number;
  answers: number;
  timeAgo: string;
  urgent: boolean;
  answer?: string;
  answeredDate?: string;
  helpful?: number;
  pastor?: PastorDetail;
}

export interface QuestionDetail extends QuestionListItem {
  slug?: string;
  status: string;
  answeredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionsListData {
  questions: QuestionListItem[];
  pagination: Pagination;
}

export interface QuestionDetailData {
  question: QuestionDetail;
}

export interface PastorsListData {
  pastors: PastorListItem[];
  pagination: Pagination;
}

// --- Polls ---

export interface PollOption {
  _id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface PollListItem {
  _id: string;
  question: string;
  description?: string;
  options: PollOption[];
  totalVotes: number;
  status: 'active' | 'closed';
  timeAgo: string;
  endDate?: string;
}

export interface PollDetail extends PollListItem {
  slug?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PollsListData {
  polls: PollListItem[];
  pagination: Pagination;
}

export interface PollDetailData {
  poll: PollDetail;
}

// --- Artists ---

export interface ArtistListItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  genre?: string;
  followers?: number;
  verified?: boolean;
  songs?: number;
}

export interface ArtistDetail extends ArtistListItem {
  coverImage?: string;
  bio?: string;
  socials?: Record<string, string>;
}

export interface ArtistsListData {
  artists: ArtistListItem[];
  pagination: Pagination;
}

export interface ArtistDetailData {
  artist: ArtistDetail;
}

// --- Resources ---

export interface ResourceListItem {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  type: string;
  category?: string;
  coverImage?: string;
  downloads?: number;
  price?: number;
  isFree?: boolean;
}

export interface ResourceDetail extends ResourceListItem {
  fileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResourcesListData {
  resources: ResourceListItem[];
  pagination: Pagination;
}
