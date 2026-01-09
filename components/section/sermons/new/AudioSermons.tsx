import { Play, Download, Clock, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const audioSermons = [
  {
    id: 1,
    title: 'Finding Peace in Troubled Times',
    pastor: 'Pastor David Chen',
    duration: '45:30',
    plays: '12.5K',
    date: 'Jan 5, 2026',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    title: 'The Power of Forgiveness',
    pastor: 'Rev. Sarah Williams',
    duration: '38:15',
    plays: '9.8K',
    date: 'Jan 3, 2026',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
  {
    id: 3,
    title: 'Walking by Faith',
    pastor: 'Bishop James Moore',
    duration: '52:00',
    plays: '15.2K',
    date: 'Jan 1, 2026',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
  {
    id: 4,
    title: 'Purpose-Driven Living',
    pastor: 'Pastor Grace Okonkwo',
    duration: '41:45',
    plays: '8.3K',
    date: 'Dec 29, 2025',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
  },
  {
    id: 5,
    title: 'Overcoming Fear with Faith',
    pastor: 'Dr. Michael Thompson',
    duration: '35:20',
    plays: '11.1K',
    date: 'Dec 27, 2025',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
  },
  {
    id: 6,
    title: 'The Heart of Worship',
    pastor: 'Pastor Emily Rose',
    duration: '48:10',
    plays: '7.6K',
    date: 'Dec 25, 2025',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
];

export const AudioSermons = () => {
  return (
    <section className="py-16 bg-background">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Audio Sermons</h2>
            <p className="text-muted-foreground">Listen to powerful messages anytime, anywhere</p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All Audio
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audioSermons.map(sermon => (
            <Card
              key={sermon.id}
              className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative">
                    <img
                      src={sermon.image}
                      alt={sermon.pastor}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="play" className="w-10 h-10 rounded-full">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {sermon.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{sermon.pastor}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {sermon.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Headphones className="w-3 h-3" />
                        {sermon.plays}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">{sermon.date}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8">
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8">
                      <Download className="w-3 h-3" />
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
