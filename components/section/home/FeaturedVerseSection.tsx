'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card } from '@/components/ui/card';
import { BookOpen, Heart } from 'lucide-react';

export const FeaturedVerseSection = () => {
  // TODO: Fetch verse of the day from API
  const verse = {
    text: 'For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future.',
    reference: 'Jeremiah 29:11',
    translation: 'NIV',
  };

  return (
    <SectionContainer className="py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Verse of the Day"
          text="Daily inspiration from God's Word"
          Icon={BookOpen}
        />
        <Card className="p-8 md:p-12 bg-gradient-to-br from-[#5730D5]/5 to-[#8A2BE2]/5 border-[#5730D5]/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-[#5730D5]/10 shrink-0">
              <Heart className="w-6 h-6 text-[#5730D5]" />
            </div>
            <div className="flex-1">
              <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-4 italic">
                &ldquo;{verse.text}&rdquo;
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-lg font-semibold text-[#5730D5]">{verse.reference}</p>
                <span className="text-sm text-muted-foreground">{verse.translation}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </SectionContainer>
  );
};
