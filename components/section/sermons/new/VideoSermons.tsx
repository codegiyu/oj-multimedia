'use client';

import { Play, Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const videoSermons = [
  {
    id: 1,
    title: 'Living with Purpose: A Journey of Faith',
    pastor: 'Pastor David Chen',
    duration: '1:02:30',
    views: '25.4K',
    thumbnail: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=400&h=225&fit=crop',
    isLive: false,
    isNew: true,
  },
  {
    id: 2,
    title: 'Sunday Service - The Grace of God',
    pastor: 'Rev. Sarah Williams',
    duration: '1:15:00',
    views: '18.2K',
    thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=225&fit=crop',
    isLive: true,
    isNew: false,
  },
  {
    id: 3,
    title: 'Building Strong Foundations',
    pastor: 'Bishop James Moore',
    duration: '55:45',
    views: '31.8K',
    thumbnail: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=225&fit=crop',
    isLive: false,
    isNew: false,
  },
  {
    id: 4,
    title: 'The Power of Prayer',
    pastor: 'Pastor Grace Okonkwo',
    duration: '48:20',
    views: '22.1K',
    thumbnail: 'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?w=400&h=225&fit=crop',
    isLive: false,
    isNew: true,
  },
];

export const VideoSermons = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Video Sermons</h2>
            <p className="text-muted-foreground">Watch inspiring messages from our pastors</p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All Videos
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoSermons.map(sermon => (
            <Card
              key={sermon.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="icon" variant="play" className="w-14 h-14 rounded-full">
                    <Play className="w-6 h-6" />
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {sermon.duration}
                </div>
                <div className="absolute top-2 left-2 flex gap-2">
                  {sermon.isLive && (
                    <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
                  )}
                  {sermon.isNew && (
                    <Badge className="bg-primary text-primary-foreground">NEW</Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                  {sermon.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{sermon.pastor}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {sermon.views} views
                  </span>
                  <Button size="sm" variant="ghost" className="h-7 px-2">
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
