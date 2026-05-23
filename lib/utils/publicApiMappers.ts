/**
 * Mappers from public API response shapes to frontend component props.
 * Backend: coverImage, views. Frontend: cover, plays.
 */

import type {
  PublicMusicListItem,
  PublicVideoListItem,
  PublicNewsListItem,
} from '@/lib/constants/endpoints';
import type { TrendingSong } from '@/components/section/music/TrendingSongs';
import type { ChartSong } from '@/components/section/music/TopMusicCharts';
import type { RecentUpload } from '@/components/section/music/RecentUploads';
import type { MusicItemWithArtist } from '@/lib/utils/music';
import type { TrendingVideo } from '@/components/section/video/TrendingVideos';
import type { FeaturedVideo } from '@/components/section/video/FeaturedVideos';
import type { RecentVideoUpload } from '@/components/section/video/RecentVideoUploads';
import type { ShortFormVideo } from '@/components/section/video/ShortFormVideos';
import type { VideoItemWithCreator } from '@/lib/utils/videos';
import type { FeaturedStory } from '@/components/section/news/FeaturedStories';
import type { NewsItem as NewsFeedItem } from '@/components/section/news/NewsFeed';
import type { TrendingStory } from '@/components/section/news/TrendingSidebar';
import type { VideoNewsItem } from '@/components/section/news/VideoNews';
import type { NewsItem as NewsDetailItem } from '@/lib/constants/news';
import type { FeaturedArtist } from '@/components/section/music/FeaturedArtists';
import type { FeaturedCreator } from '@/components/section/video/CreatorSpotlight';
import { mapToCommunityArtist } from '@/lib/utils/communityApiMappers';
import {
  filterCompleteMusic,
  filterCompleteNews,
  filterCompleteVideo,
  isCompleteMusic,
  isCompleteNewsArticle,
  isCompleteVideo,
} from '@/lib/utils/contentCompleteness';
import { resolveContentPrice } from '@/lib/services/contentDownload';

function toArtistSummary(item: PublicMusicListItem) {
  const a = item.artist;
  return a
    ? {
        _id: typeof a === 'string' ? a : typeof a._id === 'string' ? a._id : String(a._id),
        name: typeof a === 'string' ? 'Unknown' : (a.name ?? 'Unknown'),
      }
    : { _id: '', name: 'Unknown' };
}

function toCreatorSummary(item: PublicVideoListItem) {
  const c = item.artist;
  return c
    ? {
        _id: typeof c === 'string' ? c : typeof c._id === 'string' ? c._id : String(c._id),
        name: typeof c === 'string' ? 'Unknown' : (c.name ?? 'Unknown'),
      }
    : { _id: '', name: 'Unknown' };
}

export function mapPublicMusicToTrendingSong(item: PublicMusicListItem): TrendingSong {
  return {
    _id: String(item._id),
    title: item.title,
    artist: toArtistSummary(item),
    cover: item.coverImage ?? '',
    plays: String(item.views ?? 0),
    duration: (item as { duration?: string }).duration ?? '0:00',
    isNew: false,
    category: item.category,
  };
}

export function mapPublicMusicToChartSong(item: PublicMusicListItem, rank: number): ChartSong {
  return {
    _id: String(item._id),
    rank,
    title: item.title,
    artist: toArtistSummary(item),
    cover: item.coverImage ?? '',
    plays: String(item.views ?? 0),
    trend: (item as { trend?: 'up' | 'down' | 'same' }).trend ?? 'same',
    change: (item as { change?: number }).change ?? 0,
    category: item.category,
  };
}

export function mapPublicMusicToRecentUpload(item: PublicMusicListItem): RecentUpload {
  return {
    _id: String(item._id),
    title: item.title,
    artist: toArtistSummary(item),
    cover: item.coverImage ?? '',
    uploadedAt:
      typeof item.createdAt === 'string'
        ? item.createdAt
        : ((item.createdAt as Date)?.toISOString?.() ?? ''),
    genre: item.category ?? 'Music',
  };
}

export function mapPublicMusicToDetailItem(item: PublicMusicListItem): MusicItemWithArtist {
  const createdAt = item.createdAt;
  const releaseDate =
    typeof createdAt === 'string' ? createdAt : ((createdAt as Date)?.toISOString?.() ?? '');
  const raw = item as PublicMusicListItem & {
    downloadUrl?: string;
    isMonetizable?: boolean;
    price?: number;
    downloadPrice?: number;
  };
  const price = resolveContentPrice(raw);

  return {
    _id: String(item._id),
    slug: item.slug,
    title: item.title,
    description: item.description,
    lyrics: (item as { lyrics?: string }).lyrics,
    artist: toArtistSummary(item),
    cover: item.coverImage ?? '',
    plays: String(item.views ?? 0),
    category: (item.category ?? 'gospel') as MusicItemWithArtist['category'],
    coverImage: item.coverImage,
    audioUrl: item.audioUrl,
    videoUrl: item.videoUrl,
    downloadUrl: raw.downloadUrl,
    isMonetizable: Boolean(raw.isMonetizable),
    price,
    downloadPrice: price,
    duration: (item as { duration?: string }).duration,
    releaseDate,
  } as MusicItemWithArtist;
}

export function filterPublicMusicList(items: PublicMusicListItem[]): PublicMusicListItem[] {
  return filterCompleteMusic(
    items as unknown as Record<string, unknown>[]
  ) as PublicMusicListItem[];
}

export function filterPublicVideoList(items: PublicVideoListItem[]): PublicVideoListItem[] {
  return filterCompleteVideo(
    items as unknown as Record<string, unknown>[]
  ) as PublicVideoListItem[];
}

export function filterPublicNewsList(items: PublicNewsListItem[]): PublicNewsListItem[] {
  return filterCompleteNews(
    items as unknown as Record<string, unknown>[]
  ) as unknown as PublicNewsListItem[];
}

export function assertCompletePublicMusic(item: PublicMusicListItem): boolean {
  return isCompleteMusic(item as unknown as Record<string, unknown>);
}

export function assertCompletePublicVideo(item: PublicVideoListItem): boolean {
  return isCompleteVideo(item as unknown as Record<string, unknown>);
}

export function assertCompletePublicNews(item: PublicNewsListItem): boolean {
  return isCompleteNewsArticle(item as unknown as Record<string, unknown>);
}

function videoCategoryToLabel(cat: string | undefined): string {
  const map: Record<string, string> = {
    music: 'Music Videos',
    short: 'Short Clips',
    talks: 'Talks & Speeches',
    creative: 'Creative Content',
    inspirational: 'Inspirational',
    live: 'Live Performances',
    podcasts: 'Podcasts / Video Talks',
    sermon: 'Sermons',
  };
  return (cat && map[cat]) || cat || 'Creative Content';
}

export function mapPublicVideoToTrendingVideo(item: PublicVideoListItem): TrendingVideo {
  const createdAt = item.createdAt;
  const uploadedAt =
    typeof createdAt === 'string' ? createdAt : ((createdAt as Date)?.toISOString?.() ?? '');
  return {
    _id: String(item._id),
    title: item.title,
    creator: toCreatorSummary(item),
    thumbnail: item.thumbnail ?? '',
    views: String(item.views ?? 0),
    duration: item.duration ?? '0:00',
    uploadedAt,
    isNew: false,
  };
}

export function mapPublicVideoToFeaturedVideo(item: PublicVideoListItem): FeaturedVideo {
  return {
    _id: String(item._id),
    title: item.title,
    creator: toCreatorSummary(item),
    thumbnail: item.thumbnail ?? '',
    views: String(item.views ?? 0),
    duration: item.duration ?? '0:00',
    category: videoCategoryToLabel(item.category),
    featured: item.isFeatured ?? false,
  };
}

export function mapPublicVideoToRecentUpload(item: PublicVideoListItem): RecentVideoUpload {
  const createdAt = item.createdAt;
  const uploadedAt =
    typeof createdAt === 'string' ? createdAt : ((createdAt as Date)?.toISOString?.() ?? '');
  return {
    _id: String(item._id),
    title: item.title,
    creator: toCreatorSummary(item),
    thumbnail: item.thumbnail ?? '',
    uploadedAt,
    category: videoCategoryToLabel(item.category),
    views: String(item.views ?? 0),
    duration: item.duration ?? '0:00',
  };
}

export function mapPublicVideoToShortForm(item: PublicVideoListItem): ShortFormVideo {
  const likes = (item as { likes?: number }).likes ?? 0;
  return {
    _id: String(item._id),
    title: item.title,
    creator: toCreatorSummary(item),
    thumbnail: item.thumbnail ?? '',
    views: String(item.views ?? 0),
    duration: item.duration ?? '0:00',
    category: item.category ?? 'creative',
    likes: String(likes),
  };
}

export function mapPublicVideoToDetailItem(item: PublicVideoListItem): VideoItemWithCreator {
  const createdAt = item.createdAt;
  const uploadedAt =
    typeof createdAt === 'string' ? createdAt : ((createdAt as Date)?.toISOString?.() ?? '');
  const raw = item as PublicVideoListItem & {
    videoFileUrl?: string;
    embedUrl?: string;
    youtubeEmbedUrl?: string;
    downloadUrl?: string;
    isMonetizable?: boolean;
    price?: number;
    downloadPrice?: number;
  };
  const price = resolveContentPrice(raw);

  return {
    _id: String(item._id),
    slug: item.slug,
    title: item.title,
    description: item.description,
    creator: toCreatorSummary(item),
    thumbnail: item.thumbnail ?? '',
    views: String(item.views ?? 0),
    category: (item.category as VideoItemWithCreator['category']) ?? 'creative',
    videoUrl: item.videoUrl,
    videoFileUrl: raw.videoFileUrl,
    embedUrl: raw.embedUrl,
    youtubeEmbedUrl: raw.youtubeEmbedUrl,
    downloadUrl: raw.downloadUrl ?? raw.videoFileUrl,
    isMonetizable: Boolean(raw.isMonetizable),
    price,
    downloadPrice: price,
    duration: item.duration,
    uploadedAt,
  } as VideoItemWithCreator;
}

function newsDate(item: PublicNewsListItem): string {
  const c = item.createdAt;
  return typeof c === 'string' ? c : ((c as Date)?.toISOString?.() ?? '');
}

function newsCategoryDisplay(cat: string | undefined): string {
  const map: Record<string, string> = {
    'celebrity-news': 'Christian Celebrity News',
    'church-announcements': 'Church & Ministry Announcements',
    'inspirational-stories': 'Inspirational Stories',
    'scholarship-alerts': 'Scholarship Alerts',
    jobs: 'Jobs (NGO / Faith-based)',
    'movie-reviews': 'Christian Movie Reviews',
  };
  return (cat && map[cat]) ?? cat ?? 'News';
}

export function mapPublicNewsToFeaturedStory(item: PublicNewsListItem): FeaturedStory {
  return {
    _id: String(item._id),
    title: item.title,
    excerpt: item.excerpt ?? '',
    category: newsCategoryDisplay(item.category),
    image: item.coverImage ?? '',
    readTime: item.readTime ?? '0 min read',
    views: String(item.views ?? 0),
    comments: item.comments ?? 0,
    featured: true,
    author: item.author,
    date: newsDate(item),
  };
}

export function mapPublicNewsToFeedItem(item: PublicNewsListItem): NewsFeedItem {
  return {
    _id: String(item._id),
    title: item.title,
    excerpt: item.excerpt ?? '',
    category: newsCategoryDisplay(item.category),
    image: item.coverImage ?? '',
    readTime: item.readTime ?? '0 min read',
    views: String(item.views ?? 0),
    comments: item.comments ?? 0,
    likes: 0,
    author: item.author,
    date: newsDate(item),
  };
}

export function mapPublicNewsToTrendingStory(
  item: PublicNewsListItem,
  rank: number
): TrendingStory {
  return {
    _id: String(item._id),
    title: item.title,
    excerpt: item.excerpt,
    category: newsCategoryDisplay(item.category),
    readTime: item.readTime ?? '0 min read',
    rank,
    image: item.coverImage,
    views: String(item.views ?? 0),
    author: item.author,
    date: newsDate(item),
  };
}

export function mapPublicNewsToVideoNewsItem(item: PublicNewsListItem): VideoNewsItem {
  const duration = (item as { duration?: string }).duration ?? '0:00';
  return {
    _id: String(item._id),
    title: item.title,
    category: newsCategoryDisplay(item.category),
    duration,
    image: item.coverImage ?? '',
    views: String(item.views ?? 0),
    author: item.author,
    date: newsDate(item),
  };
}

/** `GET /public/artists` list item → music “Featured Artists” section */
export function mapPublicArtistToFeaturedArtist(item: Record<string, unknown>): FeaturedArtist {
  const a = mapToCommunityArtist(item);
  return {
    ...a,
    songs: a.songs ?? 0,
  };
}

/** `GET /public/artists` list item → videos “Creator Spotlight” section */
export function mapPublicArtistToFeaturedCreator(item: Record<string, unknown>): FeaturedCreator {
  const a = mapToCommunityArtist(item);
  const viewsRaw = item.views ?? item.totalViews;
  const viewsStr =
    viewsRaw == null ? '0' : typeof viewsRaw === 'number' ? String(viewsRaw) : String(viewsRaw);
  const videosRaw = item.videos;
  const videos =
    typeof videosRaw === 'number' && !Number.isNaN(videosRaw) ? videosRaw : Number(videosRaw) || 0;
  return {
    _id: a._id,
    name: a.name,
    category: a.genre || 'Creator',
    avatar: a.image,
    followers: a.followers,
    videos,
    views: viewsStr,
    verified: a.verified,
    latestVideo: undefined,
  };
}

export function mapPublicNewsToDetailItem(item: PublicNewsListItem): NewsDetailItem {
  const raw = item as PublicNewsListItem & {
    audioUrl?: string;
    videoFileUrl?: string;
    embedUrl?: string;
    downloadUrl?: string;
    youtubeEmbedUrl?: string;
  };
  return {
    _id: String(item._id),
    title: item.title,
    excerpt: item.excerpt,
    category: newsCategoryDisplay(item.category),
    image: item.coverImage ?? '',
    readTime: item.readTime ?? '0 min read',
    views: String(item.views ?? 0),
    comments: item.comments,
    author: item.author,
    date: newsDate(item),
    audioUrl: raw.audioUrl,
    videoFileUrl: raw.videoFileUrl,
    embedUrl: raw.embedUrl,
    downloadUrl: raw.downloadUrl,
    youtubeEmbedUrl: raw.youtubeEmbedUrl,
    fullStory: (item as { content?: string }).content
      ? { introduction: (item as { content?: string }).content }
      : undefined,
  } as NewsDetailItem;
}
