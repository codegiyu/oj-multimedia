'use client';

import { FeaturedTestimonies } from './FeaturedTestimonies';
import { AllTestimonies } from './AllTestimonies';
import { ShareTestimony } from './ShareTestimony';

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
}

export const TestimoniesPageClient = ({ testimonies, featured }: TestimoniesData) => {
  return (
    <>
      <FeaturedTestimonies testimonies={featured} />
      <AllTestimonies testimonies={testimonies} />
      <ShareTestimony />
    </>
  );
};
