/**
 * Mappers from community API response shapes to frontend component props.
 * API may use different field names; these normalize to UI types.
 */

import type { TestimonyItem } from '@/lib/constants/community/testimonies';
import type { PrayerRequestItem } from '@/lib/constants/community/prayer-requests';
import type { QuestionItem } from '@/lib/constants/community/questions';

function str(v: unknown): string {
  if (v == null) return '';
  return String(v);
}
function num(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}
function bool(v: unknown): boolean {
  return Boolean(v);
}

/** Format readingTime from API (number = minutes) or string */
function formatReadingTime(v: unknown): string {
  if (v == null) return '5 min';
  if (typeof v === 'number') return `${v} min`;
  return str(v);
}

/** Map API testimony detail to TestimonyDetailPageClient props */
export function mapToTestimonyDetail(item: Record<string, unknown>): TestimonyItem {
  const base = mapToTestimony(item);

  return {
    ...base,
    fullContent: str(item.fullContent ?? item.content),
    title: item.title != null ? str(item.title) : undefined,
    date: str(item.date ?? item.createdAt),
    tags: Array.isArray(item.tags) ? item.tags.map((t: unknown) => str(t)) : undefined,
    relatedScriptures: Array.isArray(item.relatedScriptures)
      ? item.relatedScriptures.map((s: unknown) => str(s))
      : undefined,
  };
}

/** Map API testimony item to FeaturedTestimonies / TestimoniesPageClient Testimony */
export function mapToTestimony(item: Record<string, unknown>): {
  _id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  category?: string;
} {
  return {
    _id: str(item._id),
    author: str(item.author ?? item.name),
    avatar: str(item.avatar ?? item.image),
    content: str(item.content),
    likes: num(item.likes),
    comments: num(item.comments),
    timeAgo: str(item.timeAgo ?? item.createdAt),
    category: item.category != null ? str(item.category) : undefined,
  };
}

/** Map API devotional item to TrendingDevotionals Devotional */
export function mapToDevotional(item: Record<string, unknown>): {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  views: number;
  category: string;
} {
  const author = item.author;
  const authorStr =
    typeof author === 'object' && author && 'name' in author
      ? str((author as { name?: unknown }).name)
      : str(author);
  return {
    _id: str(item._id),
    title: str(item.title),
    excerpt: str(item.excerpt ?? item.description),
    author: authorStr,
    readTime: formatReadingTime(item.readingTime ?? item.readTime),
    views: num(item.views),
    category: str(item.category),
  };
}

/** Map API discussion item to ActiveDiscussions Discussion */
export function mapToDiscussion(item: Record<string, unknown>): {
  _id: string;
  title: string;
  author: string;
  replies: number;
  participants: number;
  lastActive: string;
  trending: boolean;
} {
  return {
    _id: str(item._id),
    title: str(item.title),
    author: str(item.author ?? item.name),
    replies: num(item.replies),
    participants: num(item.participants),
    lastActive: str(item.lastActive ?? item.updatedAt ?? item.createdAt),
    trending: bool(item.trending),
  };
}

/** Map API prayer request detail to PrayerRequestDetailPageClient props */
export function mapToPrayerRequestDetail(item: Record<string, unknown>): PrayerRequestItem {
  const base = mapToPrayerRequest(item);

  return {
    ...base,
    fullContent: str(item.fullContent ?? item.content),
    date: str(item.date ?? item.createdAt),
    testimony: item.testimony != null ? str(item.testimony) : undefined,
    originalRequest: str(item.originalRequest ?? item.content),
    answeredDate: str(item.answeredDate ?? item.answeredAt),
    timeAgo: str(item.timeAgo ?? item.createdAt),
  };
}

/** Map API prayer request to PrayerRequestsPageClient PrayerRequest */
export function mapToPrayerRequest(item: Record<string, unknown>): {
  _id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  prayers: number;
  comments: number;
  timeAgo: string;
  urgent: boolean;
} {
  return {
    _id: str(item._id),
    title: str(item.title),
    content: str(item.content),
    author: str(item.author ?? item.name),
    category: str(item.category),
    prayers: num(item.prayers),
    comments: num(item.comments),
    timeAgo: str(item.timeAgo ?? item.createdAt),
    urgent: bool(item.urgent),
  };
}

/** Map API answered prayer to AnsweredPrayer */
export function mapToAnsweredPrayer(item: Record<string, unknown>): {
  _id: string;
  title: string;
  originalRequest: string;
  testimony: string;
  author: string;
  answeredDate: string;
  prayers: number;
} {
  return {
    _id: str(item._id),
    title: str(item.title),
    originalRequest: str(item.originalRequest ?? item.content),
    testimony: str(item.testimony ?? item.content),
    author: str(item.author ?? item.name),
    answeredDate: str(item.answeredDate ?? item.updatedAt ?? item.createdAt),
    prayers: num(item.prayers),
  };
}

/** Map API question detail to QuestionDetailPageClient props */
export function mapToQuestionDetail(item: Record<string, unknown>): QuestionItem {
  const base = mapToQuestion(item);
  const pastor = item.pastor as Record<string, unknown> | undefined;
  const pastorName =
    pastor && typeof pastor === 'object' && 'name' in pastor ? str(pastor.name) : str(item.pastor);

  return {
    ...base,
    fullQuestion: str(item.fullQuestion ?? item.question),
    date: str(item.date ?? item.createdAt),
    answer: item.answer != null ? str(item.answer) : undefined,
    pastor: pastorName || undefined,
    pastor_id: pastor?._id != null ? str(pastor._id) : undefined,
    answeredDate: str(item.answeredDate ?? item.answeredAt),
    helpful: num(item.helpful),
    answers: item.answer ? Math.max(1, num(item.answers)) : num(item.answers),
  };
}

/** Map API question to AskAPastorPageClient Question */
export function mapToQuestion(item: Record<string, unknown>): {
  _id: string;
  question: string;
  category: string;
  author: string;
  views: number;
  answers: number;
  timeAgo: string;
  urgent: boolean;
} {
  return {
    _id: str(item._id),
    question: str(item.question),
    category: str(item.category),
    author: str(item.author ?? item.name),
    views: num(item.views),
    answers: num(item.answers ?? (item.answer ? 1 : 0)),
    timeAgo: str(item.timeAgo ?? item.createdAt),
    urgent: bool(item.urgent),
  };
}

/** Map API answered question to AnsweredQuestion (pastor as display string for list) */
export function mapToAnsweredQuestion(item: Record<string, unknown>): {
  _id: string;
  question: string;
  answer: string;
  pastor: string;
  category: string;
  answeredDate: string;
  helpful: number;
} {
  const pastor = item.pastor as Record<string, unknown> | undefined;
  const pastorName =
    pastor && typeof pastor === 'object' && 'name' in pastor ? str(pastor.name) : str(item.pastor);
  return {
    _id: str(item._id),
    question: str(item.question),
    answer: str(item.answer),
    pastor: pastorName || 'Pastor',
    category: str(item.category),
    answeredDate: str(item.answeredDate ?? item.updatedAt ?? item.createdAt),
    helpful: num(item.helpful),
  };
}

/** Map API pastor to AvailablePastor */
export function mapToPastor(item: Record<string, unknown>): {
  _id: string;
  name: string;
  title: string;
  church: string;
  image: string;
  expertise: string[];
  questionsAnswered: number;
  rating: number;
} {
  const expertise = item.expertise ?? item.topics;
  const arr = Array.isArray(expertise) ? expertise : [];
  return {
    _id: str(item._id),
    name: str(item.name),
    title: str(item.title),
    church: str(item.church),
    image: str(item.image),
    expertise: arr.map((x: unknown) => str(x)),
    questionsAnswered: num(item.questionsAnswered),
    rating: num(item.rating),
  };
}

/** Map API poll option */
export function mapToPollOption(item: Record<string, unknown>): {
  _id: string;
  text: string;
  votes: number;
  percentage: number;
} {
  return {
    _id: str(item._id),
    text: str(item.text),
    votes: num(item.votes),
    percentage: num(item.percentage),
  };
}

/** Map API poll to PollsPageClient Poll */
export function mapToPoll(item: Record<string, unknown>): {
  _id: string;
  question: string;
  description?: string;
  options: Array<{ _id: string; text: string; votes: number; percentage: number }>;
  totalVotes: number;
  status: 'active' | 'closed';
  timeAgo: string;
  endDate?: string;
} {
  const options = (item.options as Record<string, unknown>[] | undefined) ?? [];
  return {
    _id: str(item._id),
    question: str(item.question),
    description: item.description != null ? str(item.description) : undefined,
    options: options.map(mapToPollOption),
    totalVotes: num(item.totalVotes),
    status: (item.status === 'closed' ? 'closed' : 'active') as 'active' | 'closed',
    timeAgo: str(item.timeAgo ?? item.createdAt),
    endDate: item.endDate != null ? str(item.endDate) : undefined,
  };
}

/** Map API artist to community artist card */
export function mapToCommunityArtist(item: Record<string, unknown>): {
  _id: string;
  name: string;
  image: string;
  genre: string;
  followers: string;
  verified: boolean;
  songs?: number;
} {
  return {
    _id: str(item._id),
    name: str(item.name),
    image: str(item.image),
    genre: str(item.genre),
    followers: str(item.followers ?? item.followersCount ?? 0),
    verified: bool(item.verified),
    songs: item.songs != null ? num(item.songs) : undefined,
  };
}

/** Map to DailyDevotional (devotionals main page) */
export function mapToDailyDevotional(item: Record<string, unknown>): {
  _id: string;
  title: string;
  verse: string;
  date: string;
  readingTime: string;
  category: string;
  excerpt: string;
  views: number;
} {
  return {
    _id: str(item._id),
    title: str(item.title),
    verse: str(item.verse),
    date: str(item.date ?? item.createdAt),
    readingTime: formatReadingTime(item.readingTime),
    category: str(item.category),
    excerpt: str(item.excerpt ?? item.description),
    views: num(item.views),
  };
}

/** Map to BibleStudy */
export function mapToBibleStudy(item: Record<string, unknown>): {
  _id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  participants: string;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
} {
  const status = str(item.status);
  const statusVal: 'Ongoing' | 'Completed' | 'Upcoming' =
    status === 'Completed' ? 'Completed' : status === 'Upcoming' ? 'Upcoming' : 'Ongoing';
  return {
    _id: str(item._id),
    title: str(item.title),
    description: str(item.description),
    lessons: num(item.lessons),
    duration: str(item.duration),
    participants: str(item.participants),
    status: statusVal,
  };
}

/** Map to PrayerPoint */
export function mapToPrayerPoint(item: Record<string, unknown>): {
  _id: string;
  title: string;
  category: string;
  points: number;
  readingTime: string;
  verse: string;
  excerpt: string;
} {
  return {
    _id: str(item._id),
    title: str(item.title),
    category: str(item.category),
    points: num(item.points),
    readingTime: item.readingTime != null ? formatReadingTime(item.readingTime) : '3 min',
    verse: str(item.verse),
    excerpt: str(item.excerpt ?? item.description),
  };
}

/** Map to LivingTip */
export function mapToLivingTip(item: Record<string, unknown>): {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  views: string;
  trending: boolean;
} {
  return {
    _id: str(item._id),
    title: str(item.title),
    category: str(item.category),
    excerpt: str(item.excerpt ?? item.description),
    views: str(item.views ?? 0),
    trending: bool(item.trending),
  };
}

/** Map to MarriageFamily */
export function mapToMarriageFamily(item: Record<string, unknown>): {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  articles: number;
} {
  return {
    _id: str(item._id),
    title: str(item.title),
    category: str(item.category),
    excerpt: str(item.excerpt ?? item.description),
    articles: num(item.articles),
  };
}

/** Map to resource Ebook (downloads as string for display) */
export function mapToEbook(item: Record<string, unknown>): {
  _id: string;
  title: string;
  description: string;
  downloads: string;
  cover: string;
  fileUrl?: string;
} {
  const fileUrl = str(item.fileUrl);

  return {
    _id: str(item._id),
    title: str(item.title),
    description: str(item.description),
    downloads: str(item.downloads ?? 0),
    cover: str(item.cover ?? item.coverImage),
    ...(fileUrl ? { fileUrl } : {}),
  };
}

/** Map to resource Template */
export function mapToTemplate(item: Record<string, unknown>): {
  _id: string;
  title: string;
  description: string;
  downloads: string;
  type: string;
} {
  return {
    _id: str(item._id),
    title: str(item.title),
    description: str(item.description),
    downloads: str(item.downloads ?? 0),
    type: str(item.templateType ?? item.type),
  };
}

/** Map to resource Beat */
export function mapToBeat(item: Record<string, unknown>): {
  _id: string;
  title: string;
  description: string;
  downloads: string;
  genre: string;
  cover?: string;
  fileUrl?: string;
} {
  const fileUrl = str(item.fileUrl);
  const cover = str(item.cover ?? item.coverImage);

  return {
    _id: str(item._id),
    title: str(item.title),
    description: str(item.description),
    downloads: str(item.downloads ?? 0),
    genre: str(item.genre),
    ...(cover ? { cover } : {}),
    ...(fileUrl ? { fileUrl } : {}),
  };
}

/** Map to resource Wallpaper */
export function mapToWallpaper(item: Record<string, unknown>): {
  _id: string;
  title: string;
  description: string;
  downloads: string;
  category: string;
  cover?: string;
  fileUrl?: string;
} {
  const fileUrl = str(item.fileUrl);
  const cover = str(item.cover ?? item.coverImage);

  return {
    _id: str(item._id),
    title: str(item.title),
    description: str(item.description),
    downloads: str(item.downloads ?? 0),
    category: str(item.category),
    ...(cover ? { cover } : {}),
    ...(fileUrl ? { fileUrl } : {}),
  };
}

/** Map to resource AffiliateProduct */
export function mapToAffiliateProduct(item: Record<string, unknown>): {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: string;
} {
  return {
    _id: str(item._id),
    title: str(item.title),
    description: str(item.description),
    category: str(item.category ?? item.productCategory),
    price: str(item.price),
  };
}
