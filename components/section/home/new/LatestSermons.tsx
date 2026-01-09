import { Play, Download, Clock, Headphones, Mic2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const latestSermons = [
  {
    id: 1,
    title: 'The Power of Persistent Prayer',
    pastor: 'Bishop James Moore',
    duration: '58:30',
    plays: '125.4K',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    type: 'audio',
  },
  {
    id: 2,
    title: 'Breaking Free from Fear',
    pastor: 'Pastor David Chen',
    duration: '45:15',
    plays: '98.2K',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    type: 'video',
  },
  {
    id: 3,
    title: "Living in God's Abundance",
    pastor: 'Rev. Sarah Williams',
    duration: '52:00',
    plays: '87.6K',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    type: 'audio',
  },
  {
    id: 4,
    title: 'The Heart of True Worship',
    pastor: 'Pastor Grace Okonkwo',
    duration: '41:45',
    plays: '76.3K',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    type: 'video',
  },
];

export function LatestSermons() {
  return (
    <section className="py-16 bg-background">
      <div className="regular-container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Mic2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Latest Sermons</h2>
              <p className="text-muted-foreground">Recently uploaded messages</p>
            </div>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestSermons.map(sermon => (
            <Card
              key={sermon.id}
              className="group hover:shadow-md transition-all duration-300 border-border/50 overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={sermon.image}
                  alt={sermon.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <Button variant="play" size="icon" className="rounded-full">
                    <Play className="w-5 h-5" />
                  </Button>
                </div>
                <Badge variant="secondary" className="absolute top-3 left-3 capitalize text-xs">
                  {sermon.type}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {sermon.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{sermon.pastor}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sermon.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Headphones className="w-3 h-3" />
                      {sermon.plays}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
