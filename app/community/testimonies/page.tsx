import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TestimoniesHero } from '@/components/section/community/testimonies/TestimoniesHero';
import {
  TestimoniesPageClient,
  type Testimony,
} from '@/components/section/community/testimonies/TestimoniesPageClient';
import { TestimoniesPageSkeleton } from '@/components/section/community/testimonies/TestimoniesPageSkeleton';
import { callServerApi } from '@/lib/services/serverApi';
import { mapToTestimony } from '@/lib/utils/communityApiMappers';
import type { Pagination } from '@/lib/types/community';

export const metadata: Metadata = {
  title: 'Testimonies - Stories of Faith & Transformation',
  description:
    "Read powerful testimonies from our community. Stories of healing, breakthrough, transformation, and God's faithfulness in the lives of believers.",
};

export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 12;

async function fetchTestimoniesData(page: number): Promise<{
  testimonies: Testimony[];
  featured: Testimony[];
  pagination: Pagination | null;
  initialErrorMessage: string | null;
}> {
  const [allRes, featuredRes] = await Promise.all([
    callServerApi('PUBLIC_GET_TESTIMONIES', {
      query: `?limit=${DEFAULT_LIMIT}&page=${page}&type=all` as `?${string}`,
    }),
    callServerApi('PUBLIC_GET_TESTIMONIES', {
      query: '?limit=3&page=1&type=featured' as `?${string}`,
    }),
  ]);
  const errorMessage =
    allRes.type === 'error' ? (allRes.error?.message ?? 'Failed to load testimonies') : null;
  const testimonies = (allRes.type === 'success' ? (allRes.data?.testimonies ?? []) : []).map(t =>
    mapToTestimony(t as unknown as Record<string, unknown>)
  ) as Testimony[];
  const featured = (
    featuredRes.type === 'success' ? (featuredRes.data?.testimonies ?? []) : []
  ).map(t => mapToTestimony(t as unknown as Record<string, unknown>)) as Testimony[];
  const pagination = allRes.type === 'success' ? (allRes.data?.pagination ?? null) : null;
  return {
    testimonies,
    featured: featured.length > 0 ? featured : testimonies.slice(0, 3),
    pagination,
    initialErrorMessage: errorMessage,
  };
}

interface TestimoniesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TestimoniesPage({ searchParams }: TestimoniesPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? '1'), 10) || 1);
  const testimoniesData = await fetchTestimoniesData(page);

  return (
    <MainLayout>
      <TestimoniesHero />
      <Suspense fallback={<TestimoniesPageSkeleton />}>
        <TestimoniesPageClient {...testimoniesData} />
      </Suspense>
    </MainLayout>
  );
}
