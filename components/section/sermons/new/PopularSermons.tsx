'use client';

import { Play, Download, TrendingUp, Clock, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const popularSermons = [
  {
    id: 1,
    rank: 1,
    title: 'The Power of Persistent Prayer',
    pastor: 'Bishop James Moore',
    duration: '58:30',
    plays: '125.4K',
    trend: '+15%',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    type: 'audio',
  },
  {
    id: 2,
    rank: 2,
    title: 'Breaking Free from Fear',
    pastor: 'Pastor David Chen',
    duration: '45:15',
    plays: '98.2K',
    trend: '+22%',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    type: 'video',
  },
  {
    id: 3,
    rank: 3,
    title: "Living in God's Abundance",
    pastor: 'Rev. Sarah Williams',
    duration: '52:00',
    plays: '87.6K',
    trend: '+8%',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    type: 'audio',
  },
  {
    id: 4,
    rank: 4,
    title: 'The Heart of True Worship',
    pastor: 'Pastor Grace Okonkwo',
    duration: '41:45',
    plays: '76.3K',
    trend: '+18%',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    type: 'video',
  },
  {
    id: 5,
    rank: 5,
    title: "Navigating Life's Storms",
    pastor: 'Dr. Michael Thompson',
    duration: '49:20',
    plays: '65.1K',
    trend: '+5%',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    type: 'audio',
  },
];

export const PopularSermons = () => {
  return (
    <section className="py-16 bg-background">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Most Popular</h2>
              <p className="text-muted-foreground">Top sermons this month</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {popularSermons.map(sermon => (
            <Card
              key={sermon.id}
              className="group hover:shadow-md transition-all duration-300 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span
                      className={`text-2xl font-bold ${sermon.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {sermon.rank}
                    </span>
                  </div>

                  <div className="relative">
                    <img
                      src={sermon.image}
                      alt={sermon.pastor}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {sermon.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {sermon.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{sermon.pastor}</p>
                  </div>

                  <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {sermon.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Headphones className="w-4 h-4" />
                      {sermon.plays}
                    </span>
                    <span className="flex items-center gap-1 text-green-500 font-medium">
                      <TrendingUp className="w-4 h-4" />
                      {sermon.trend}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="play" className="rounded-full">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="hidden sm:flex">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
