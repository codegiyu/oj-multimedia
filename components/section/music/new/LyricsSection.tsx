import { FileText, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const lyricsItems = [
  {
    id: 1,
    title: 'Rise Above',
    artist: 'Grace Williams',
    excerpt: 'When the storms of life surround me, I will rise above...',
    theme: 'Hope & Perseverance',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'Unshaken Faith',
    artist: 'David Thompson',
    excerpt: 'Through every trial, through every test, my faith remains...',
    theme: 'Faith & Trust',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Morning Light',
    artist: 'Sarah Chen',
    excerpt: 'With every sunrise comes new mercy, new grace to see...',
    theme: 'Renewal & Grace',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
  },
  {
    id: 4,
    title: 'Grateful Heart',
    artist: 'Michael Rivers',
    excerpt: 'For every breath, for every moment, I give thanks...',
    theme: 'Gratitude',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
  },
];

export function LyricsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Lyrics & Meaning</h2>
            <p className="text-muted-foreground">Explore the stories behind the songs</p>
          </div>
          <Button variant="ghost" className="gap-2">
            Browse All Lyrics <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lyricsItems.map(item => (
            <div
              key={item.id}
              className="group flex gap-4 p-4 bg-card rounded-2xl border border-border hover:shadow-elegant transition-all duration-300 cursor-pointer">
              <img
                src={item.cover}
                alt={item.title}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.artist}</p>
                  </div>
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                    {item.theme}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground italic mt-2 line-clamp-2">
                  "{item.excerpt}"
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
                    <FileText className="w-3 h-3" />
                    Full Lyrics
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Song Meaning
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
