'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card } from '@/components/ui/card';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { Play, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const TopChartsSection = () => {
  // TODO: Fetch top charts from API
  const charts = [
    { rank: 1, title: 'Amazing Grace', artist: 'John Doe', plays: '125K' },
    { rank: 2, title: 'Heaven is Here', artist: 'Jane Smith', plays: '98K' },
    { rank: 3, title: 'Faithful God', artist: 'Michael Brown', plays: '87K' },
    { rank: 4, title: 'Victory Song', artist: 'Sarah Johnson', plays: '76K' },
    { rank: 5, title: 'Praise Him', artist: 'David Williams', plays: '65K' },
  ];

  return (
    <SectionContainer className="py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <SectionHeading
            title="Top 5 Weekly Charts"
            text="Most played gospel songs this week"
            Icon={TrendingUp}
          />
          <GhostBtn
            linkProps={{ href: '/music' }}
            className="hidden md:flex items-center gap-2 text-[#2563EB] hover:text-[#3B82F6]">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </GhostBtn>
        </div>
        <Card className="p-6">
          <div className="grid gap-4">
            {charts.map((song, idx) => (
              <Link
                key={idx}
                href={`/music/${song.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2563EB]/10 text-[#2563EB] font-bold shrink-0">
                  {song.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-[#2563EB] transition-colors truncate">
                    {song.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{song.plays}</p>
                    <p className="text-xs text-muted-foreground">plays</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <div className="mt-8 md:hidden">
          <GhostBtn
            linkProps={{ href: '/music' }}
            className="w-full flex items-center justify-center gap-2 text-[#2563EB]">
            <span>View All Music</span>
            <ArrowRight className="w-4 h-4" />
          </GhostBtn>
        </div>
      </div>
    </SectionContainer>
  );
};
