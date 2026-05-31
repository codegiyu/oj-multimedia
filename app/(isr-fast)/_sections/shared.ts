import { cache } from 'react';
import type { IPublicNewsListRes } from '@/lib/constants/endpoints';
import type { NewsArticle } from '@/components/section/home';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import {
  musicCategoryNavFallback,
  videoCategoryNavFallback,
} from '@/lib/constants/categoryNavFallbacks';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';

export const HOME_ISR = ISR_PUBLIC_FETCH.fast;

export function mapArticleToNewsCard(article: IPublicNewsListRes['articles'][number]): NewsArticle {
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

export const getMusicCategoryNavForHome = cache(async () =>
  fetchPublicCategoryNav('music', 'All Genres', musicCategoryNavFallback, HOME_ISR)
);

export const getVideoCategoryNavForHome = cache(async () =>
  fetchPublicCategoryNav('video', 'All Categories', videoCategoryNavFallback, HOME_ISR)
);
