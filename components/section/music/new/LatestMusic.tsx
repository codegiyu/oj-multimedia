import { Play, Download, Heart, Clock, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

const latestSongs = [
  {
    id: 1,
    title: 'Rise Above',
    artist: 'Grace Williams',
    duration: '4:32',
    plays: '125K',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    isNew: true,
  },
  {
    id: 2,
    title: 'Unshaken Faith',
    artist: 'David Thompson',
    duration: '3:45',
    plays: '89K',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
    isNew: true,
  },
  {
    id: 3,
    title: 'Morning Light',
    artist: 'Sarah Chen',
    duration: '5:12',
    plays: '67K',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    isNew: false,
  },
  {
    id: 4,
    title: 'Grateful Heart',
    artist: 'Michael Rivers',
    duration: '4:08',
    plays: '54K',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    isNew: true,
  },
  {
    id: 5,
    title: 'Walk With Me',
    artist: 'Harmony Collective',
    duration: '3:58',
    plays: '43K',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    isNew: false,
  },
  {
    id: 6,
    title: 'New Beginnings',
    artist: 'Joy Adams',
    duration: '4:22',
    plays: '38K',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    isNew: true,
  },
];

export function LatestMusic() {
  return (
    <section className="py-16 bg-background">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Latest Music</h1>
            <p className="text-muted-foreground">Fresh releases from inspiring artists</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              All Genres
            </Button>
            <Button variant="outline" size="sm">
              This Week
            </Button>
            <Button variant="outline" size="sm">
              Most Popular
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestSongs.map(song => (
            <div
              key={song.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-elegant transition-all duration-300">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {song.isNew && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    NEW
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Button variant="play" size="icon" className="w-14 h-14">
                    <Play className="w-6 h-6 fill-current" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground truncate">{song.title}</h3>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {song.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Music className="w-3 h-3" />
                      {song.plays}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:text-primary">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg">
            Load More Music
          </Button>
        </div>
      </div>
    </section>
  );
}
