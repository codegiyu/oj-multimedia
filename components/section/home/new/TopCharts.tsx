import { Play, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const chartSongs = [
  {
    rank: 1,
    title: 'Endless Grace',
    artist: 'Michael Johnson',
    plays: '2.5M',
    downloads: '45K',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop',
    trending: true,
  },
  {
    rank: 2,
    title: 'New Beginning',
    artist: 'Grace Williams',
    plays: '1.8M',
    downloads: '32K',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop',
    trending: true,
  },
  {
    rank: 3,
    title: 'Walk With Me',
    artist: 'The Collective',
    plays: '1.5M',
    downloads: '28K',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop',
    trending: false,
  },
  {
    rank: 4,
    title: 'Higher Ground',
    artist: 'David Chen',
    plays: '1.2M',
    downloads: '22K',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop',
    trending: true,
  },
  {
    rank: 5,
    title: 'Light The Way',
    artist: 'Emma Brooks',
    plays: '980K',
    downloads: '18K',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    trending: false,
  },
];

export function TopCharts() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="regular-container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Top 5 Weekly Charts</h2>
            <p className="text-muted-foreground">Most played this week</p>
          </div>
          <Button variant="outline">View Full Charts</Button>
        </div>

        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {chartSongs.map((song, index) => (
            <div
              key={song.rank}
              className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                index !== chartSongs.length - 1 ? 'border-b border-border' : ''
              }`}>
              {/* Rank */}
              <div className="w-10 text-center">
                <span
                  className={`text-xl font-bold ${song.rank <= 3 ? 'gradient-text' : 'text-muted-foreground'}`}>
                  {song.rank}
                </span>
              </div>

              {/* Image */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 group">
                <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{song.title}</h3>
                  {song.trending && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  {song.plays}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {song.downloads}
                </div>
              </div>

              {/* Actions */}
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Play className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
