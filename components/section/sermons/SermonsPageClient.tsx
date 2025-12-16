'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Mic, Play, Video, Headphones, Upload, User, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const SermonsPageClient = () => {
  // TODO: Fetch data from API
  const latestSermons = [
    {
      title: 'The Power of Faith',
      pastor: 'Pastor John Doe',
      duration: '45:30',
      slug: 'power-of-faith',
    },
    {
      title: 'Walking in Purpose',
      pastor: 'Pastor Jane Smith',
      duration: '38:15',
      slug: 'walking-in-purpose',
    },
  ];

  const topics = ['Faith', 'Family', 'Healing', 'Purpose', 'Prayer', 'Worship'];

  return (
    <MainLayout>
      {/* Hero Section */}
      <SectionContainer className="py-16 md:py-20 bg-gradient-to-br from-[#5730D5]/5 to-[#8A2BE2]/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5730D5]/10 mb-6">
            <Mic className="w-8 h-8 text-[#5730D5]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Sermons</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Listen to audio sermons, watch video messages, and explore sermons by topic and pastor.
          </p>
          <RegularBtn
            linkProps={{ href: '/promote' }}
            text="Upload Your Sermon"
            RightIcon={Upload}
            rightIconProps={{ className: 'size-4' }}
            className="bg-gradient-to-r from-[#5730D5] to-[#8A2BE2] text-white"
          />
        </div>
      </SectionContainer>

      {/* Latest Sermons */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="Latest Sermons" text="Fresh messages to inspire you" Icon={Mic} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {latestSermons.map((sermon, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-shadow">
                <Link href={`/sermons/${sermon.slug}`}>
                  <div className="relative aspect-video bg-muted overflow-hidden rounded-t-lg">
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
                    <span className="text-sm text-muted-foreground">{sermon.duration}</span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Sermons by Topic */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Sermons by Topic"
            text="Explore messages by theme"
            Icon={Headphones}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {topics.map((topic, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow group">
                <Link href={`/sermons?topic=${topic.toLowerCase()}`}>
                  <h3 className="font-semibold text-foreground group-hover:text-[#5730D5] transition-colors">
                    {topic}
                  </h3>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Features */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Explore More"
            text="Everything you need for spiritual growth"
            Icon={TrendingUp}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Audio Sermons</h3>
              <p className="text-sm text-muted-foreground">Listen to inspiring audio messages</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <Video className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Video Sermons</h3>
              <p className="text-sm text-muted-foreground">Watch powerful video messages</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <User className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Pastor Spotlight</h3>
              <p className="text-sm text-muted-foreground">
                Discover sermons from featured pastors
              </p>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
};
