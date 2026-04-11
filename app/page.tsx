/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  HeroSection,
  HomePageClient,
  type TrendingMusicItem,
  type TrendingVideoItem,
  type ChartItem,
  type RisingArtist,
  type NewsArticle,
  type MarketplaceProduct,
  type CommunityPost,
  type PollOption,
} from '@/components/section/home';
import { HomePageSkeleton } from '@/components/section/home/HomePageSkeleton';
import { callServerApi } from '@/lib/services/serverApi';
import type {
  IPublicMusicListRes,
  IPublicVideosListRes,
  IPublicNewsListRes,
  IPublicArtistsListRes,
  IPublicPollsListRes,
  IPublicTestimoniesListRes,
  IMarketplaceProductsListRes,
  IPublicHomeAdvertsRes,
  IPublicDevotionalsListRes,
  IHomeAdvertItem,
} from '@/lib/constants/endpoints';
import type { HomeDevotionalCard } from '@/components/section/home';

export const metadata = {
  title: 'Home - Discover Music, Charts & Latest Content',
  description:
    'Explore our dynamic homepage featuring music categories, top charts, recent uploads, download metrics, trending content, and discover new music and audio content. Stay engaged with our lively, ever-updating platform.',
};

export const dynamic = 'force-dynamic';

type HomeSearchParams = Promise<{
  genre?: string;
  category?: string;
  marketplaceCategory?: string;
}>;

const formatNumber = (value?: number | null): string => {
  if (!value || Number.isNaN(value)) return '0';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
};

const genreToCategorySlug = (genre: string | undefined): string | null => {
  if (!genre || genre.toLowerCase() === 'all') return null;
  const map: Record<string, string> = {
    Afrobeats: 'afrobeats',
    'Hip-Hop': 'hiphop',
    Pop: 'pop',
    'R&B': 'rnb',
    Gospel: 'gospel',
    Instrumental: 'instrumental',
  };
  return map[genre] ?? null;
};

const videoCategoryToSlug = (category: string | undefined): string | null => {
  if (!category || category.toLowerCase() === 'all') return null;
  const map: Record<string, string> = {
    'Music Videos': 'music',
    'Short Clips': 'short',
    Talks: 'talks',
    Dance: 'dance',
    Creative: 'creative',
  };
  return map[category] ?? null;
};

interface HomePageData {
  advertsAfterHero: IHomeAdvertItem[];
  advertsBeforeCta: IHomeAdvertItem[];
  latestMusic: TrendingMusicItem[];
  latestSermons: TrendingMusicItem[];
  latestMovies: TrendingVideoItem[];
  latestDevotionals: HomeDevotionalCard[];
  featuredNews: NewsArticle[];
  trendingNews: NewsArticle[];
  trendingMusic: TrendingMusicItem[];
  trendingVideos: TrendingVideoItem[];
  chartData: ChartItem[];
  risingArtists: RisingArtist[];
  newsArticles: NewsArticle[];
  marketplaceProducts: MarketplaceProduct[];
  communityPosts: CommunityPost[];
  pollOptions: PollOption[];
  pollTotalVotes: number;
  initialErrorMessage: string | null;
}

function mapPublicMusicToHomeTrending(
  item: IPublicMusicListRes['music'][number]
): TrendingMusicItem {
  return {
    _id: item._id,
    title: item.title,
    artist: {
      _id: typeof item.artist === 'string' ? item.artist : (item.artist?._id ?? ''),
      name: typeof item.artist === 'string' ? 'Unknown' : (item.artist?.name ?? 'Unknown'),
    },
    cover: (item as { coverImage?: string }).coverImage ?? '',
    plays: formatNumber((item as { views?: number }).views),
    genre:
      (item as { genre?: string }).genre ?? (item as { category?: string }).category ?? 'Other',
    isNew: Boolean(
      item.createdAt &&
        Date.now() - new Date(item.createdAt as string).getTime() < 7 * 24 * 60 * 60 * 1000
    ),
  };
}

function mapPublicVideoToHomeTrending(
  item: IPublicVideosListRes['videos'][number]
): TrendingVideoItem {
  return {
    _id: item._id,
    title: item.title,
    creator:
      typeof (item as { artist?: unknown }).artist === 'string'
        ? 'Unknown'
        : ((item as { artist?: { name?: string } }).artist?.name ?? 'Unknown'),
    thumbnail: (item as { thumbnail?: string }).thumbnail ?? '',
    views: formatNumber((item as { views?: number }).views),
    duration: (item as { duration?: string }).duration ?? '--:--',
    category: (item as { category?: string }).category ?? 'Video',
  };
}

function mapArticleToNewsCard(article: IPublicNewsListRes['articles'][number]): NewsArticle {
  return {
    _id: article._id,
    title: article.title,
    excerpt: article.excerpt ?? '',
    category: (article as { category?: string }).category ?? 'General',
    time: article.readTime
      ? `${article.readTime} min read`
      : ((article as { createdAt?: string }).createdAt ?? ''),
    image: article.coverImage ?? '',
    featured: (article as { isFeatured?: boolean }).isFeatured ?? false,
  };
}

async function fetchHomeSections(filters: {
  genreQuery?: string;
  videoCategoryQuery?: string;
  marketplaceCategory?: string;
}): Promise<HomePageData> {
  const musicCategorySlug = genreToCategorySlug(filters.genreQuery);
  const videoCategorySlug = videoCategoryToSlug(filters.videoCategoryQuery);

  const baseMusicQuery = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'trending',
  });
  if (musicCategorySlug) baseMusicQuery.set('category', musicCategorySlug);

  const baseVideoQuery = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'trending',
  });
  if (videoCategorySlug) baseVideoQuery.set('category', videoCategorySlug);

  const baseNewsQuery = new URLSearchParams({
    limit: '6',
    page: '1',
    status: 'published',
    type: 'latest',
  });

  const baseChartsQuery = new URLSearchParams({
    limit: '10',
    page: '1',
    status: 'published',
    type: 'charts',
    period: 'weekly',
  });

  const marketplaceQuery = new URLSearchParams({
    limit: '4',
    page: '1',
  });
  if (filters.marketplaceCategory) {
    marketplaceQuery.set('category', filters.marketplaceCategory);
  }

  const latestMusicQuery = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'latest',
    excludeCategory: 'sermon',
  });
  const latestSermonsQuery = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'latest',
    category: 'sermon',
  });
  const latestMoviesQuery = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'latest',
    category: 'movie',
  });
  const featuredNewsQuery = new URLSearchParams({
    limit: '6',
    page: '1',
    status: 'published',
    type: 'featured',
  });
  const trendingNewsQuery = new URLSearchParams({
    limit: '6',
    page: '1',
    status: 'published',
    type: 'trending',
  });
  const devotionalsQuery = new URLSearchParams({
    limit: '8',
    page: '1',
    type: 'latest',
  });

  const [
    musicRes,
    videosRes,
    newsRes,
    chartsRes,
    artistsRes,
    marketplaceRes,
    pollsRes,
    testimoniesRes,
    homeAdvertsRes,
    latestMusicRes,
    latestSermonsRes,
    latestMoviesRes,
    featuredNewsRes,
    trendingNewsRes,
    devotionalsRes,
  ] = await Promise.all([
    callServerApi('PUBLIC_GET_MUSIC', {
      query: `?${baseMusicQuery.toString()}`,
    }),
    callServerApi('PUBLIC_GET_VIDEOS', {
      query: `?${baseVideoQuery.toString()}`,
    }),
    callServerApi('PUBLIC_GET_NEWS', {
      query: `?${baseNewsQuery.toString()}`,
    }),
    callServerApi('PUBLIC_GET_MUSIC', {
      query: `?${baseChartsQuery.toString()}`,
    }),
    callServerApi('PUBLIC_GET_ARTISTS', {
      query: '?page=1&limit=4',
    }),
    callServerApi('MARKETPLACE_GET_PRODUCTS', {
      query: `?${marketplaceQuery.toString()}`,
    }),
    callServerApi('PUBLIC_GET_POLLS', {
      query: '?status=active&page=1&limit=1',
    }),
    callServerApi('PUBLIC_GET_TESTIMONIES', {
      query: '?type=featured&page=1&limit=3&status=published',
    }),
    callServerApi('PUBLIC_GET_HOME_ADVERTS', {}),
    callServerApi('PUBLIC_GET_MUSIC', {
      query: `?${latestMusicQuery.toString()}`,
    }),
    callServerApi('PUBLIC_GET_MUSIC', {
      query: `?${latestSermonsQuery.toString()}`,
    }),
    callServerApi('PUBLIC_GET_VIDEOS', {
      query: `?${latestMoviesQuery.toString()}`,
    }),
    callServerApi('PUBLIC_GET_NEWS', {
      query: `?${featuredNewsQuery.toString()}`,
    }),
    callServerApi('PUBLIC_GET_NEWS', {
      query: `?${trendingNewsQuery.toString()}`,
    }),
    callServerApi('PUBLIC_GET_DEVOTIONALS', {
      query: `?${devotionalsQuery.toString()}`,
    }),
  ]);

  let initialErrorMessage: string | null = null;
  const firstError =
    musicRes.type === 'error'
      ? musicRes.error
      : videosRes.type === 'error'
        ? videosRes.error
        : newsRes.type === 'error'
          ? newsRes.error
          : chartsRes.type === 'error'
            ? chartsRes.error
            : artistsRes.type === 'error'
              ? artistsRes.error
              : marketplaceRes.type === 'error'
                ? marketplaceRes.error
                : pollsRes.type === 'error'
                  ? pollsRes.error
                  : testimoniesRes.type === 'error'
                    ? testimoniesRes.error
                    : null;
  if (firstError) {
    initialErrorMessage = firstError.message ?? 'Some sections failed to load.';
  }

  const musicData = (musicRes.type === 'success'
    ? (musicRes.data as IPublicMusicListRes | undefined)
    : undefined) ?? { music: [] as IPublicMusicListRes['music'] };

  const videosData = (videosRes.type === 'success'
    ? (videosRes.data as IPublicVideosListRes | undefined)
    : undefined) ?? { videos: [] as IPublicVideosListRes['videos'] };

  const newsData = (newsRes.type === 'success'
    ? (newsRes.data as IPublicNewsListRes | undefined)
    : undefined) ?? { articles: [] as IPublicNewsListRes['articles'] };

  const chartsData = (chartsRes.type === 'success'
    ? (chartsRes.data as IPublicMusicListRes | undefined)
    : undefined) ?? { music: [] as IPublicMusicListRes['music'] };

  const artistsData = (artistsRes.type === 'success'
    ? (artistsRes.data as IPublicArtistsListRes | undefined)
    : undefined) ?? { artists: [] as IPublicArtistsListRes['artists'] };

  const marketplaceData = (marketplaceRes.type === 'success'
    ? (marketplaceRes.data as IMarketplaceProductsListRes | undefined)
    : undefined) ?? { products: [] as IMarketplaceProductsListRes['products'] };

  const pollsData = (pollsRes.type === 'success'
    ? (pollsRes.data as IPublicPollsListRes | undefined)
    : undefined) ?? { polls: [] as IPublicPollsListRes['polls'] };

  const testimoniesData = (testimoniesRes.type === 'success'
    ? (testimoniesRes.data as IPublicTestimoniesListRes | undefined)
    : undefined) ?? { testimonies: [] as IPublicTestimoniesListRes['testimonies'] };

  const homeAdvertsData = (homeAdvertsRes.type === 'success'
    ? (homeAdvertsRes.data as IPublicHomeAdvertsRes | undefined)
    : undefined) ?? { adverts: [] as IHomeAdvertItem[] };

  const latestMusicData = (latestMusicRes.type === 'success'
    ? (latestMusicRes.data as IPublicMusicListRes | undefined)
    : undefined) ?? { music: [] as IPublicMusicListRes['music'] };

  const latestSermonsData = (latestSermonsRes.type === 'success'
    ? (latestSermonsRes.data as IPublicMusicListRes | undefined)
    : undefined) ?? { music: [] as IPublicMusicListRes['music'] };

  const latestMoviesData = (latestMoviesRes.type === 'success'
    ? (latestMoviesRes.data as IPublicVideosListRes | undefined)
    : undefined) ?? { videos: [] as IPublicVideosListRes['videos'] };

  const featuredNewsData = (featuredNewsRes.type === 'success'
    ? (featuredNewsRes.data as IPublicNewsListRes | undefined)
    : undefined) ?? { articles: [] as IPublicNewsListRes['articles'] };

  const trendingNewsData = (trendingNewsRes.type === 'success'
    ? (trendingNewsRes.data as IPublicNewsListRes | undefined)
    : undefined) ?? { articles: [] as IPublicNewsListRes['articles'] };

  const devotionalsData = (devotionalsRes.type === 'success'
    ? (devotionalsRes.data as IPublicDevotionalsListRes | undefined)
    : undefined) ?? { devotionals: [] as IPublicDevotionalsListRes['devotionals'] };

  const advertsAfterHero = homeAdvertsData.adverts.filter(a => a.slot === 'after_hero');
  const advertsBeforeCta = homeAdvertsData.adverts.filter(a => a.slot === 'before_cta');

  const latestMusic: TrendingMusicItem[] = latestMusicData.music.map(mapPublicMusicToHomeTrending);
  const latestSermons: TrendingMusicItem[] = latestSermonsData.music.map(
    mapPublicMusicToHomeTrending
  );
  const latestMovies: TrendingVideoItem[] = latestMoviesData.videos.map(
    mapPublicVideoToHomeTrending
  );
  const featuredNews: NewsArticle[] = featuredNewsData.articles.map(mapArticleToNewsCard);
  const trendingNewsRail: NewsArticle[] = trendingNewsData.articles.map(mapArticleToNewsCard);

  const latestDevotionals: HomeDevotionalCard[] = devotionalsData.devotionals.map(d => ({
    _id: d._id,
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt,
    coverImage: (d as { coverImage?: string }).coverImage,
  }));

  const trendingMusic: TrendingMusicItem[] = musicData.music.map(mapPublicMusicToHomeTrending);

  const trendingVideos: TrendingVideoItem[] = videosData.videos.map(mapPublicVideoToHomeTrending);

  const chartData: ChartItem[] = chartsData.music.map((item, index) => ({
    _id: item._id,
    rank: (item as any).chartPosition ?? (item as any).rank ?? index + 1,
    title: item.title,
    artist: {
      _id: typeof item.artist === 'string' ? item.artist : (item.artist?._id ?? ''),
      name: typeof item.artist === 'string' ? 'Unknown' : (item.artist?.name ?? 'Unknown'),
    },
    cover: (item as any).coverImage ?? (item as any).cover ?? '',
    plays: formatNumber((item as any).views as number | undefined),
    trend: ((item as any).trend as ChartItem['trend']) ?? 'same',
    change: (item as any).change,
  }));

  const risingArtists: RisingArtist[] = artistsData.artists.map(artist => ({
    _id: artist._id,
    name: artist.name,
    image: artist.image ?? '',
    genre: artist.genre,
    followers: artist.followers?.toString() ?? '0',
    verified: artist.verified ?? false,
  }));

  const newsArticles: NewsArticle[] = newsData.articles.map(mapArticleToNewsCard);

  const marketplaceProducts: MarketplaceProduct[] = marketplaceData.products.map(product => ({
    _id: product._id,
    name: product.name,
    price: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(product.price),
    seller: product.vendorName ?? product.vendorPopulated?.storeName ?? 'Vendor',
    image: product.images?.[0] ?? '',
  }));

  const activePoll = pollsData.polls[0];
  const pollOptions: PollOption[] =
    activePoll?.options?.map(option => ({
      option: option.text,
      votes: option.percentage,
    })) ?? [];
  const pollTotalVotes = activePoll?.totalVotes ?? 0;

  const communityPosts: CommunityPost[] = testimoniesData.testimonies.map(testimony => ({
    user: testimony.author ?? 'Community member',
    avatar: testimony.avatar ?? '/images/artist-1.jpg',
    content: testimony.content ?? '',
    likes: testimony.likes ?? 0,
    comments: testimony.comments ?? 0,
  }));

  return {
    advertsAfterHero,
    advertsBeforeCta,
    latestMusic,
    latestSermons,
    latestMovies,
    latestDevotionals,
    featuredNews,
    trendingNews: trendingNewsRail,
    trendingMusic,
    trendingVideos,
    chartData,
    risingArtists,
    newsArticles,
    marketplaceProducts,
    communityPosts,
    pollOptions,
    pollTotalVotes,
    initialErrorMessage,
  };
}

interface HomeProps {
  searchParams: HomeSearchParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  return (
    <MainLayout>
      <HeroSection />
      <Suspense fallback={<HomePageSkeleton />}>
        <HomePageServer
          genreQuery={params.genre}
          videoCategoryQuery={params.category}
          marketplaceCategory={params.marketplaceCategory}
        />
      </Suspense>
    </MainLayout>
  );
}

async function HomePageServer({
  genreQuery,
  videoCategoryQuery,
  marketplaceCategory,
}: {
  genreQuery?: string;
  videoCategoryQuery?: string;
  marketplaceCategory?: string;
}) {
  const homeData = await fetchHomeSections({
    genreQuery,
    videoCategoryQuery,
    marketplaceCategory,
  });

  return <HomePageClient {...homeData} />;
}
