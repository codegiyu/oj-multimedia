'use client';

import { motion } from 'framer-motion';
import { Image, Download, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionComp } from '@/components/general/SectionComp';
import type { Wallpaper } from './ResourcesPageClient';

interface ChristianWallpapersProps {
  wallpapers: Wallpaper[];
}

export const ChristianWallpapers = ({ wallpapers }: ChristianWallpapersProps) => {
  return (
    <SectionComp
      id="wallpapers"
      icon={Image}
      iconColor="primary"
      heading="Christian Wallpapers"
      subtext="Download beautiful Christian wallpapers for your phone, tablet, and desktop"
      contentProps={{ enableAnimation: false }}>
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
                <div className="aspect-[9/16] bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-t-xl flex items-center justify-center relative overflow-hidden">
                  <Image className="w-16 h-16 text-primary/30" />
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
                  <Button className="w-full" variant="outline" size="sm">
                    Download
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
