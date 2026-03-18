import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { NewsDetailPageClient } from '@/components/section/news/NewsDetailPageClient';
import { callServerApi } from '@/lib/services/serverApi';
import { mapPublicNewsToDetailItem } from '@/lib/utils/publicApiMappers';
import type { NewsItem } from '@/lib/constants/news';

interface NewsStoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NewsStoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) {
    return {
      title: 'Story Not Found',
      description: 'The requested news story could not be found.',
    };
  }
  const res = await callServerApi('PUBLIC_GET_NEWS_ITEM', { query: `/${encodeURIComponent(id)}` });
  if (res.type === 'error') {
    return {
      title: 'Story Not Found',
      description: 'The requested news story could not be found.',
    };
  }
  const data = res.data;
  const newsItem = mapPublicNewsToDetailItem(data.article);
  const title = `${newsItem.title} - News & Lifestyle Updates`;
  const description = newsItem.excerpt || newsItem.title;
  const imageUrl = newsItem.image?.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_SITE_URL || ''}${newsItem.image}`
    : newsItem.image;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: newsItem.date,
      authors: newsItem.author ? [newsItem.author] : undefined,
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: newsItem.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function NewsStoryPage({ params }: NewsStoryPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) notFound();

  const res = await callServerApi('PUBLIC_GET_NEWS_ITEM', { query: `/${encodeURIComponent(id)}` });
  if (res.type === 'error') notFound();

  const data = res.data;
  const rawArticle = data.article;
  const newsItem = mapPublicNewsToDetailItem(rawArticle) as NewsItem;

  const categorySlug = rawArticle.category
    ? `&category=${encodeURIComponent(rawArticle.category)}`
    : '';
  const relatedRes = await callServerApi('PUBLIC_GET_NEWS', {
    query: `?limit=4&page=1&status=published&type=latest${categorySlug}`,
  });
  const relatedList = relatedRes.type === 'success' ? (relatedRes.data?.articles ?? []) : [];
  const relatedStories: NewsItem[] = relatedList
    .filter(a => String(a._id) !== id)
    .slice(0, 3)
    .map(a => mapPublicNewsToDetailItem(a) as NewsItem);

  return (
    <MainLayout>
      <NewsDetailPageClient newsItem={newsItem} relatedStories={relatedStories} />
    </MainLayout>
  );
}
