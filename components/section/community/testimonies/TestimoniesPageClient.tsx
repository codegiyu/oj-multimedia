'use client';

import { useRouter } from 'next/navigation';
import { FeaturedTestimonies } from './FeaturedTestimonies';
import { AllTestimonies } from './AllTestimonies';
import { ShareTestimony } from './ShareTestimony';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { Heart } from 'lucide-react';
import type { Pagination } from '@/lib/types/community';

export interface Testimony {
  _id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  category?: string;
}

export interface TestimoniesData {
  testimonies: Testimony[];
  featured: Testimony[];
  pagination: Pagination | null;
  initialErrorMessage?: string | null;
}

export const TestimoniesPageClient = ({
  testimonies,
  featured,
  pagination = null,
  initialErrorMessage = null,
}: TestimoniesData) => {
  const router = useRouter();
  const hasAnyContent = testimonies.length > 0 || featured.length > 0;

  if (initialErrorMessage && !hasAnyContent) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load testimonies"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Heart className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <FeaturedTestimonies testimonies={featured} />
      <AllTestimonies testimonies={testimonies} pagination={pagination} />
      <ShareTestimony />
    </>
  );
};
