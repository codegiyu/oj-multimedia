'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card } from '@/components/ui/card';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

export const TrendingNewsSection = () => {
  // TODO: Fetch trending news from API
  const news = [
    {
      title: 'Gospel Artist Wins International Award',
      excerpt: 'Nigerian gospel artist receives recognition at the Global Gospel Music Awards...',
      date: '2 days ago',
      category: 'Music',
      slug: 'gospel-artist-wins-award',
    },
    {
      title: 'New Church Initiative Launches',
      excerpt: 'Major churches unite to launch community outreach program...',
      date: '3 days ago',
      category: 'Ministry',
      slug: 'new-church-initiative',
    },
    {
      title: 'Christian Movie Premiere This Weekend',
      excerpt: 'Highly anticipated faith-based film set to premiere in theaters nationwide...',
      date: '5 days ago',
      category: 'Entertainment',
      slug: 'christian-movie-premiere',
    },
  ];

  return (
    <SectionContainer className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <SectionHeading
            title="Trending Gospel News"
            text="Stay updated with the latest in Christian media"
            Icon={Newspaper}
          />
          <GhostBtn
            linkProps={{ href: '/news' }}
            className="hidden md:flex items-center gap-2 text-[#5730D5] hover:text-[#8A2BE2]">
            <span>View All News</span>
            <ArrowRight className="w-4 h-4" />
          </GhostBtn>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, idx) => (
            <Card key={idx} className="group hover:shadow-lg transition-shadow">
              <Link href={`/news/${item.slug}`}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 text-xs font-semibold bg-[#5730D5]/10 text-[#5730D5] rounded-full">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#5730D5] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{item.excerpt}</p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
        <div className="mt-8 md:hidden">
          <GhostBtn
            linkProps={{ href: '/news' }}
            className="w-full flex items-center justify-center gap-2 text-[#5730D5]">
            <span>View All News</span>
            <ArrowRight className="w-4 h-4" />
          </GhostBtn>
        </div>
      </div>
    </SectionContainer>
  );
};
