import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { NewsDetailPageClient } from '@/components/section/news/NewsDetailPageClient';
import { getNewsItemById, getRelatedNewsItems } from '@/lib/utils/news';

interface NewsStoryPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the news story page
export async function generateMetadata({ params }: NewsStoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const newsItem = id ? getNewsItemById(id) : undefined;

  if (!newsItem) {
    return {
      title: 'Story Not Found',
      description: 'The requested news story could not be found.',
    };
  }

  const title = `${newsItem.title} - News & Lifestyle Updates`;
  const description = newsItem.excerpt || newsItem.title;
  const imageUrl = newsItem.image.startsWith('/')
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
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: newsItem.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function NewsStoryPage({ params }: NewsStoryPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Validate ID
  if (!id) {
    notFound();
  }

  // Get news item
  const newsItem = getNewsItemById(id);

  // Return 404 if not found
  if (!newsItem) {
    notFound();
  }

  // Get related stories
  const relatedStories = getRelatedNewsItems(id, newsItem.category, 3);

  return (
    <MainLayout>
      <NewsDetailPageClient newsItem={newsItem} relatedStories={relatedStories} />
    </MainLayout>
  );
}
