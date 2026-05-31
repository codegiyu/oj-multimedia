'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Sparkles, BookOpen, Heart, HandHeart } from 'lucide-react';
import { FixedImage } from '@/components/general/FillImage';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { MultilinePreview } from '@/components/general/MultilinePreview';
import { DevotionalListThumbnail } from '@/components/section/community/devotionals/DevotionalListThumbnail';
import type { CommunityHighlightItem } from '@/lib/utils/mergeCommunityHighlights';
import { cn } from '@/lib/utils';

const kindStyles: Record<
  CommunityHighlightItem['kind'],
  { icon: typeof Heart; className: string }
> = {
  testimony: { icon: Heart, className: 'bg-primary/10 text-primary' },
  devotional: { icon: BookOpen, className: 'bg-secondary/10 text-secondary' },
  'prayer-request': { icon: HandHeart, className: 'bg-accent/10 text-accent' },
};

interface CommunityHighlightsPanelProps {
  highlights: CommunityHighlightItem[];
}

export function CommunityHighlightsPanel({ highlights }: CommunityHighlightsPanelProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-accent" />
        Latest content from community
      </h3>
      <div className="space-y-4">
        {highlights.length === 0 ? (
          <SectionEmptyState
            title="No community content yet"
            description="Join the community to share your story, devotionals, and prayer requests."
            icon={Sparkles}
            actionLabel="Visit community"
            actionHref="/community"
          />
        ) : (
          highlights.map((item, index) => {
            const style = kindStyles[item.kind];
            const Icon = style.icon;

            return (
              <Link key={`${item.kind}-${item._id}`} href={item.href} className="block">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex gap-4">
                    {item.kind === 'devotional' ? (
                      <DevotionalListThumbnail coverImage={item.coverImage} title={item.title} />
                    ) : item.avatar ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <FixedImage
                          imageContext="public"
                          src={item.avatar}
                          alt={item.author ?? item.title}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          'h-10 w-10 shrink-0 rounded-full flex items-center justify-center',
                          style.className
                        )}>
                        <Icon className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={cn(
                            'text-xs font-medium px-2 py-0.5 rounded-full',
                            style.className
                          )}>
                          {item.badge}
                        </span>
                        {item.metaLabel && (
                          <span className="text-xs text-muted-foreground">{item.metaLabel}</span>
                        )}
                      </div>
                      <p className="font-semibold text-sm line-clamp-1">{item.title}</p>
                      <MultilinePreview
                        text={item.preview}
                        className="text-muted-foreground mt-1 line-clamp-2 text-sm"
                      />
                      {item.author && (
                        <p className="text-xs text-muted-foreground mt-2">— {item.author}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
