'use client';

import { FeaturedTestimonies } from './FeaturedTestimonies';
import { AllTestimonies } from './AllTestimonies';
import { ShareTestimony } from './ShareTestimony';

export interface Testimony {
  id: number;
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
}

export const TestimoniesPageClient = ({ testimonies, featured }: TestimoniesData) => {
  return (
    <>
      <div className="container mx-auto px-4 pb-16">
        <FeaturedTestimonies testimonies={featured} />
        <AllTestimonies testimonies={testimonies} />
      </div>
      <ShareTestimony />
    </>
  );
};
