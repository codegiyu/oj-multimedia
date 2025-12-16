'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card } from '@/components/ui/card';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { Mic, Play, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const LatestSermonsSection = () => {
  // TODO: Fetch latest sermons from API
  const sermons = [
    {
      title: 'The Power of Faith',
      pastor: 'Pastor John Doe',
      duration: '45:30',
      coverImage: '/placeholder.svg',
      slug: 'the-power-of-faith',
    },
    {
      title: 'Walking in Purpose',
      pastor: 'Pastor Jane Smith',
      duration: '38:15',
      coverImage: '/placeholder.svg',
      slug: 'walking-in-purpose',
    },
    {
      title: 'Overcoming Trials',
      pastor: 'Pastor Michael Brown',
      duration: '52:20',
      coverImage: '/placeholder.svg',
      slug: 'overcoming-trials',
    },
  ];

  return (
    <SectionContainer className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <SectionHeading title="Latest Sermons" text="Fresh messages to inspire you" icon={Mic} />
          <GhostBtn
            linkProps={{ href: '/sermons' }}
            className="hidden md:flex items-center gap-2 text-[#5730D5] hover:text-[#8A2BE2]">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </GhostBtn>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon, idx) => (
            <Card key={idx} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/sermons/${sermon.slug}`}>
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5730D5]/20 to-[#8A2BE2]/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-[#5730D5] ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#5730D5] transition-colors">
                    {sermon.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">{sermon.pastor}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{sermon.duration}</span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
        <div className="mt-8 md:hidden">
          <GhostBtn
            linkProps={{ href: '/sermons' }}
            className="w-full flex items-center justify-center gap-2 text-[#5730D5]">
            <span>View All Sermons</span>
            <ArrowRight className="w-4 h-4" />
          </GhostBtn>
        </div>
      </div>
    </SectionContainer>
  );
};

