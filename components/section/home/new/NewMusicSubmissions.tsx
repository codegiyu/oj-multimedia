import { Upload, Music, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const recentSubmissions = [
  {
    id: 1,
    title: 'Heavenly Praise',
    artist: 'Grace Ministries',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'Faithful One',
    artist: 'David Thompson',
    time: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Breakthrough',
    artist: 'Kingdom Sound',
    time: '1 day ago',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
  },
  {
    id: 4,
    title: 'Worship in Spirit',
    artist: 'Sarah Grace',
    time: '2 days ago',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
  },
];

export function NewMusicSubmissions() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
      <div className="regular-container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">New Music Submissions</h2>
              <p className="text-muted-foreground">Fresh tracks from emerging artists</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">View All</Button>
            <Button variant="hero" className="gap-2">
              <Upload className="w-4 h-4" />
              Submit Your Music
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {recentSubmissions.map(item => (
            <Card
              key={item.id}
              className="group hover:shadow-md transition-all duration-300 border-border/50 overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-semibold text-white mb-1 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-white/80">{item.artist}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.time}</span>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Music className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Card */}
        <Card className="border-border shadow-card bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Share Your Music With The World</h3>
                <p className="text-muted-foreground">
                  Join thousands of artists sharing their inspirational music. Upload your tracks
                  and reach a global audience.
                </p>
              </div>
              <Button variant="hero" size="lg" className="gap-2">
                <Upload className="w-5 h-5" />
                Submit Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
