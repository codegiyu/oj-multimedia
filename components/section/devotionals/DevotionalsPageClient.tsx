'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { BookOpen, Calendar, Heart, Users, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';

export const DevotionalsPageClient = () => {
  // TODO: Fetch data from API
  const dailyDevotionals = [
    { title: 'Walking in Faith', date: 'Today', slug: 'walking-in-faith' },
    { title: 'God\'s Promises', date: 'Yesterday', slug: 'gods-promises' },
    { title: 'Finding Peace', date: '2 days ago', slug: 'finding-peace' },
  ];

  const bibleStudySeries = [
    { title: 'The Book of Psalms', lessons: 12, slug: 'book-of-psalms' },
    { title: 'Walking with Jesus', lessons: 8, slug: 'walking-with-jesus' },
    { title: 'Faith in Action', lessons: 10, slug: 'faith-in-action' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <SectionContainer className="py-16 md:py-20 bg-gradient-to-br from-[#5730D5]/5 to-[#8A2BE2]/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5730D5]/10 mb-6">
            <BookOpen className="w-8 h-8 text-[#5730D5]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Devotionals</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Read daily devotionals, Bible study series, prayer points, and Christian living tips.
          </p>
        </div>
      </SectionContainer>

      {/* Daily Devotionals */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Daily Devotionals"
            text="Start each day with God's Word"
            Icon={Calendar}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyDevotionals.map((devotional, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Link href={`/devotionals/${devotional.slug}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4 text-[#5730D5]" />
                      <span className="text-sm font-medium text-muted-foreground">{devotional.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-[#5730D5] transition-colors">
                      {devotional.title}
                    </h3>
                    <GhostBtn className="text-sm text-[#5730D5] hover:text-[#8A2BE2]">
                      Read More <ArrowRight className="w-4 h-4 ml-1 inline" />
                    </GhostBtn>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Bible Study Series */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Bible Study Series"
            text="Deep dive into God's Word with structured studies"
            Icon={FileText}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bibleStudySeries.map((series, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Link href={`/devotionals/series/${series.slug}`}>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#5730D5] transition-colors">
                      {series.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{series.lessons} lessons</p>
                    <GhostBtn className="text-sm text-[#5730D5] hover:text-[#8A2BE2]">
                      Start Study <ArrowRight className="w-4 h-4 ml-1 inline" />
                    </GhostBtn>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Features Grid */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Explore More"
            text="Resources to strengthen your faith journey"
            Icon={Heart}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Prayer Points</h3>
              <p className="text-sm text-muted-foreground">Daily prayer points for spiritual growth</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Christian Living Tips</h3>
              <p className="text-sm text-muted-foreground">Practical advice for daily Christian living</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Marriage & Family</h3>
              <p className="text-sm text-muted-foreground">Biblical guidance for relationships</p>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
};

