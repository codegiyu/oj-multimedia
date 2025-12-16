'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { Newspaper, Calendar, Star, Briefcase, Film, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const NewsPageClient = () => {
  // TODO: Fetch data from API
  const categories = [
    { name: 'Celebrity News', icon: Star, slug: 'celebrity' },
    { name: 'Church & Ministry', icon: Newspaper, slug: 'ministry' },
    { name: 'Inspirational Stories', icon: Star, slug: 'inspirational' },
    { name: 'Scholarship Alerts', icon: GraduationCap, slug: 'scholarships' },
    { name: 'Jobs', icon: Briefcase, slug: 'jobs' },
    { name: 'Movie Reviews', icon: Film, slug: 'movies' },
  ];

  const latestNews = [
    {
      title: 'Gospel Artist Wins International Award',
      excerpt: 'Nigerian gospel artist receives recognition at the Global Gospel Music Awards...',
      date: '2 days ago',
      category: 'Celebrity News',
      slug: 'gospel-artist-wins-award',
    },
    {
      title: 'New Church Initiative Launches',
      excerpt: 'Major churches unite to launch community outreach program...',
      date: '3 days ago',
      category: 'Church & Ministry',
      slug: 'new-church-initiative',
    },
    {
      title: 'Christian Movie Premiere This Weekend',
      excerpt: 'Highly anticipated faith-based film set to premiere in theaters nationwide...',
      date: '5 days ago',
      category: 'Movie Reviews',
      slug: 'christian-movie-premiere',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <SectionContainer className="py-16 md:py-20 bg-gradient-to-br from-[#5730D5]/5 to-[#8A2BE2]/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5730D5]/10 mb-6">
            <Newspaper className="w-8 h-8 text-[#5730D5]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">News & Lifestyle</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Stay updated with Christian celebrity news, church announcements, inspirational stories, and more.
          </p>
        </div>
      </SectionContainer>

      {/* Categories */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Browse by Category"
            text="Explore news and content by topic"
            Icon={Newspaper}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow group">
                <Link href={`/news?category=${category.slug}`}>
                  <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-3 flex items-center justify-center group-hover:bg-[#5730D5]/20 transition-colors">
                    <category.icon className="w-6 h-6 text-[#5730D5]" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm group-hover:text-[#5730D5] transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Latest News */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <SectionHeading
              title="Latest News"
              text="Stay updated with the latest in Christian media"
              Icon={Newspaper}
            />
            <GhostBtn
              linkProps={{ href: '/news?sort=latest' }}
              className="hidden md:flex items-center gap-2 text-[#5730D5] hover:text-[#8A2BE2]">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </GhostBtn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((item, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Link href={`/news/${item.slug}`}>
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
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
};

