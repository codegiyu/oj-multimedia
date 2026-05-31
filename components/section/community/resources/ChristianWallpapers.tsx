'use client';

import { motion } from 'motion/react';
import { ImageIcon, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SectionComp } from '@/components/general/SectionComp';
import { EmptyState } from '@/components/section/news/EmptyState';
import { FillImage } from '@/components/general/FillImage';
import type { Wallpaper } from './ResourcesPageClient';
import { ResourceDownloadButton } from '@/components/section/shared/ResourceDownloadButton';

interface ChristianWallpapersProps {
  wallpapers: Wallpaper[];
}

export const ChristianWallpapers = ({ wallpapers }: ChristianWallpapersProps) => {
  return (
    <SectionComp
      id="wallpapers"
      icon={ImageIcon}
      iconColor="primary"
      heading="Christian Wallpapers"
      subtext="Download beautiful Christian wallpapers for your phone, tablet, and desktop"
      contentProps={{ enableAnimation: false }}>
      {wallpapers.length === 0 ? (
        <EmptyState
          title="No wallpapers yet"
          description="Christian wallpapers for your devices will be added here."
          icon={<ImageIcon className="w-12 h-12 text-muted-foreground" />}
          actionLabel="Browse resources"
          actionHref="/community/resources"
          showDefaultActions={false}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wallpapers.map((wallpaper, index) => (
          <motion.div
            key={wallpaper._id ?? index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <Card className="card-interactive">
              <CardContent className="p-0">
                <div className="aspect-[9/16] relative bg-muted rounded-t-xl overflow-hidden">
                  <FillImage
                    src={wallpaper.cover ?? ''}
                    alt={wallpaper.title}
                    imageContext="public"
                    sizes="(max-width: 768px) 50vw, 280px"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                      {wallpaper.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">{wallpaper.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {wallpaper.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Download className="w-4 h-4" />
                      <span>{wallpaper.downloads} downloads</span>
                    </div>
                  </div>
                  <ResourceDownloadButton
                    _id={wallpaper._id}
                    title={wallpaper.title}
                    fileUrl={wallpaper.fileUrl}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </div>
      )}
    </SectionComp>
  );
};
