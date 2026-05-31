'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SectionContainer } from '@/components/general/SectionContainer';
import {
  ContactInfoDetailsSkeleton,
  SocialsLinksSkeleton,
  MapSectionSkeleton,
} from './ContactSectionSkeletons';

export const ContactPageSkeleton = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <SectionContainer className="bg-card">
              <div className="max-w-xl">
                <div className="text-center mb-8">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-8 w-64 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full max-w-md mx-auto" />
                </div>
                <div className="grid gap-6">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-11 w-32" />
                </div>
              </div>
            </SectionContainer>
          </div>
          <div className="lg:col-span-2">
            <SectionContainer className="bg-secondary h-full">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-56 mb-8" />
              <ContactInfoDetailsSkeleton />
              <SocialsLinksSkeleton />
            </SectionContainer>
          </div>
        </div>
      </div>
      <SectionContainer className="py-0">
        <MapSectionSkeleton />
      </SectionContainer>
    </section>
  );
};
