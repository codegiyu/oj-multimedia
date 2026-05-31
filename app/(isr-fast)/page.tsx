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
  type PollOption,
} from '@/components/section/home';
import type { CommunityHighlightItem } from '@/lib/utils/mergeCommunityHighlights';
import { mergeCommunityHighlights } from '@/lib/utils/mergeCommunityHighlights';
import { HomePageSkeleton } from '@/components/section/home/HomePageSkeleton';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import type {
  IPublicMusicListRes,
  IPublicVideosListRes,
  IPublicNewsListRes,
  IPublicArtistsListRes,
  IPublicPollsListRes,
  IPublicTestimoniesListRes,
  IMarketplaceProductsListRes,
  IPublicHomeAdvertsRes,
  IPublicPrayerRequestsListRes,
  IHomeAdvertItem,
  ICommunityCategoryCountsRes,
} from '@/lib/constants/endpoints';
import type { HomeDevotionalCard } from '@/components/section/home';
import { formatCompactNumber } from '@/lib/utils/general';
import {
  mapPublicMusicToHomeTrending,
  mapPublicVideoToHomeTrending,
} from '@/lib/utils/homeTrendingMappers';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import {
  LEGACY_HOME_MUSIC_GENRE_KEY,
  LEGACY_HOME_VIDEO_CATEGORY_KEY,
  PUBLIC_URL_KEYS,
} from '@/lib/constants/publicUrlKeys';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import {
  musicCategoryNavFallback,
  videoCategoryNavFallback,
} from '@/lib/constants/categoryNavFallbacks';

export const metadata = {
  title: 'Home - Discover Music, Charts & Latest Content',
  description:
    'Explore our dynamic homepage featuring music categories, top charts, recent uploads, download metrics, trending content, and discover new music and audio content. Stay engaged with our lively, ever-updating platform.',
};

type HomeSearchParams = Promise<{
  [PUBLIC_URL_KEYS.MUSIC_CATEGORY]?: string;
  [PUBLIC_URL_KEYS.VIDEO_CATEGORY]?: string;
  [PUBLIC_URL_KEYS.MARKETPLACE_CATEGORY]?: string;
  [LEGACY_HOME_MUSIC_GENRE_KEY]?: string;
  [LEGACY_HOME_VIDEO_CATEGORY_KEY]?: string;
}>;

const legacyGenreLabelToSlug: Record<string, string> = {
  Afrobeats: 'afrobeats',
  'Hip-Hop': 'hiphop',
  Pop: 'pop',
  'R&B': 'rnb',
  Gospel: 'gospel',
  Instrumental: 'instrumental',
};

const legacyVideoLabelToSlug: Record<string, string> = {
  'Music Videos': 'music',
  'Short Clips': 'short',
  Talks: 'talks',
  Dance: 'dance',
  Creative: 'creative',
};

function resolveHomeMusicCategoryParam(
  musicCategory?: string,
  legacyGenre?: string
): string | undefined {
  if (musicCategory) return musicCategory;
  if (!legacyGenre || legacyGenre.toLowerCase() === 'all') return undefined;
  return legacyGenreLabelToSlug[legacyGenre] ?? legacyGenre.toLowerCase();
}

function resolveHomeVideoCategoryParam(
  videoCategory?: string,
  legacyCategory?: string
): string | undefined {
  if (videoCategory) return videoCategory;
  if (!legacyCategory || legacyCategory.toLowerCase() === 'all') return undefined;
  return legacyVideoLabelToSlug[legacyCategory] ?? legacyCategory.toLowerCase();
}

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
  communityHighlights: CommunityHighlightItem[];
  pollOptions: PollOption[];
  pollTotalVotes: number;
  pollQuestion?: string;
  pollHref?: string;
  initialErrorMessage: string | null;
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
  musicCategorySlug: string;
  videoCategorySlug: string;
  marketplaceCategory?: string;
}): Promise<HomePageData> {
  const musicCategorySlug =
    filters.musicCategorySlug === ALL_CATEGORY_ID ? null : filters.musicCategorySlug;
  const videoCategorySlug =
    filters.videoCategorySlug === ALL_CATEGORY_ID ? null : filters.videoCategorySlug;

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
    type: 'recent',
    excludeCategory: 'sermon',
  });
  const latestSermonsQuery = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'recent',
    category: 'sermon',
  });
  const latestMoviesQuery = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'long-form',
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
  const [
    musicRes,
    videosRes,
    newsRes,
    chartsRes,
    artistsRes,
    marketplaceRes,
    pollsRes,
    testimoniesRes,
    prayerRequestsRes,
    homeAdvertsRes,
    latestMusicRes,
    latestSermonsRes,
    latestMoviesRes,
    featuredNewsRes,
    trendingNewsRes,
    communityRes,
  ] = await Promise.all([
    callPublicServerApi(
      'PUBLIC_GET_MUSIC',
      {
        query: `?${baseMusicQuery.toString()}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_VIDEOS',
      {
        query: `?${baseVideoQuery.toString()}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_NEWS',
      {
        query: `?${baseNewsQuery.toString()}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_MUSIC',
      {
        query: `?${baseChartsQuery.toString()}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_ARTISTS',
      {
        query: '?page=1&limit=4',
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'MARKETPLACE_GET_PRODUCTS',
      {
        query: `?${marketplaceQuery.toString()}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_POLLS',
      {
        query: '?status=active&page=1&limit=1',
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_TESTIMONIES',
      {
        query: '?type=latest&page=1&limit=4&status=published',
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_PRAYER_REQUESTS',
      {
        query: '?status=active&page=1&limit=4',
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi('PUBLIC_GET_HOME_ADVERTS', {}, ISR_PUBLIC_FETCH.fast),
    callPublicServerApi(
      'PUBLIC_GET_MUSIC',
      {
        query: `?${latestMusicQuery.toString()}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_MUSIC',
      {
        query: `?${latestSermonsQuery.toString()}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_VIDEOS',
      {
        query: `?${latestMoviesQuery.toString()}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_NEWS',
      {
        query: `?${featuredNewsQuery.toString()}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_NEWS',
      {
        query: `?${trendingNewsQuery.toString()}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi('PUBLIC_GET_COMMUNITY', {}, ISR_PUBLIC_FETCH.fast),
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

  const prayerRequestsData = (prayerRequestsRes.type === 'success'
    ? (prayerRequestsRes.data as IPublicPrayerRequestsListRes | undefined)
    : undefined) ?? { prayerRequests: [] as IPublicPrayerRequestsListRes['prayerRequests'] };

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

  const communityData = (communityRes.type === 'success'
    ? (communityRes.data as ICommunityCategoryCountsRes | undefined)
    : undefined) ?? { trendingDevotionals: [] as unknown[] };

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

  const trendingDevotionalRecords = (communityData.trendingDevotionals ?? []) as Record<
    string,
    unknown
  >[];

  const latestDevotionals: HomeDevotionalCard[] = trendingDevotionalRecords.slice(0, 8).map(d => ({
    _id: String(d._id ?? ''),
    title: String(d.title ?? ''),
    slug: String(d.slug ?? d._id ?? ''),
    excerpt: String(d.excerpt ?? d.description ?? ''),
    coverImage: typeof d.coverImage === 'string' ? d.coverImage : '',
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
    plays: formatCompactNumber((item as any).views as number | undefined),
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
    slug: product.slug,
    name: product.name,
    price: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(product.price),
    seller: product.vendorName ?? product.vendorPopulated?.storeName ?? 'Vendor',
    image: product.images?.[0] ?? '',
    vendorWhatsapp: product.vendorWhatsapp ?? product.vendorPopulated?.whatsapp,
  }));

  const activePoll = pollsData.polls[0];
  const pollOptions: PollOption[] =
    activePoll?.options?.map(option => ({
      _id: option._id,
      option: option.text,
      votes: option.percentage,
    })) ?? [];
  const pollTotalVotes = activePoll?.totalVotes ?? 0;
  const pollQuestion = activePoll?.question;
  const pollHref = activePoll
    ? `/community/polls-and-voting/${activePoll._id}`
    : '/community/polls-and-voting';

  const communityHighlights = mergeCommunityHighlights({
    testimonies: testimoniesData.testimonies as unknown as Record<string, unknown>[],
    devotionals: trendingDevotionalRecords.slice(0, 4),
    prayerRequests: prayerRequestsData.prayerRequests as unknown as Record<string, unknown>[],
    limit: 6,
  });

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
    communityHighlights,
    pollOptions,
    pollTotalVotes,
    pollQuestion,
    pollHref,
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
          musicCategory={params[PUBLIC_URL_KEYS.MUSIC_CATEGORY]}
          videoCategory={params[PUBLIC_URL_KEYS.VIDEO_CATEGORY]}
          legacyGenre={params[LEGACY_HOME_MUSIC_GENRE_KEY]}
          legacyVideoCategory={params[LEGACY_HOME_VIDEO_CATEGORY_KEY]}
          marketplaceCategory={params[PUBLIC_URL_KEYS.MARKETPLACE_CATEGORY]}
        />
      </Suspense>
    </MainLayout>
  );
}

async function HomePageServer({
  musicCategory,
  videoCategory,
  legacyGenre,
  legacyVideoCategory,
  marketplaceCategory,
}: {
  musicCategory?: string;
  videoCategory?: string;
  legacyGenre?: string;
  legacyVideoCategory?: string;
  marketplaceCategory?: string;
}) {
  const [musicCategorySlug, videoCategorySlug, musicCategoryOptions, videoCategoryOptions] =
    await Promise.all([
      normalizePublicCategoryByScope(
        'music',
        resolveHomeMusicCategoryParam(musicCategory, legacyGenre),
        ISR_PUBLIC_FETCH.fast
      ),
      normalizePublicCategoryByScope(
        'video',
        resolveHomeVideoCategoryParam(videoCategory, legacyVideoCategory),
        ISR_PUBLIC_FETCH.fast
      ),
      fetchPublicCategoryNav(
        'music',
        'All Genres',
        musicCategoryNavFallback,
        ISR_PUBLIC_FETCH.fast
      ),
      fetchPublicCategoryNav(
        'video',
        'All Categories',
        videoCategoryNavFallback,
        ISR_PUBLIC_FETCH.fast
      ),
    ]);

  const resolvedHomeData = await fetchHomeSections({
    musicCategorySlug,
    videoCategorySlug,
    marketplaceCategory,
  });

  return (
    <HomePageClient
      {...resolvedHomeData}
      musicCategoryOptions={musicCategoryOptions}
      videoCategoryOptions={videoCategoryOptions}
    />
  );
}
