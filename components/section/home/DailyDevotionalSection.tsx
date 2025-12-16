'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

export const DailyDevotionalSection = () => {
  // TODO: Fetch daily devotional from API
  const devotional = {
    title: 'Walking in Faith',
    excerpt:
      'Faith is not the absence of doubt, but the decision to trust God even when circumstances seem uncertain...',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    slug: 'walking-in-faith',
  };

  return (
    <SectionContainer className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Daily Devotional"
          text="Start your day with God's Word"
          icon={BookOpen}
        />
        <Card className="p-8 md:p-10">
          <div className="flex items-start gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#5730D5]" />
            <span className="text-sm font-medium text-muted-foreground">{devotional.date}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {devotional.title}
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {devotional.excerpt}
          </p>
          <RegularBtn
            linkProps={{ href: `/devotionals/${devotional.slug}` }}
            text="Read Full Devotional"
            RightIcon={ArrowRight}
            rightIconProps={{ className: 'size-4' }}
            className="w-fit"
          />
        </Card>
      </div>
    </SectionContainer>
  );
};

