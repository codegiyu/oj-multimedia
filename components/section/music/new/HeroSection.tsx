import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Input } from '@/components/ui/input';
import { Music, Play, Search, Mic } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="pt-24 pb-12 bg-gradient-to-br from-primary/30 via-background to-primary/20">
      <div className="regular-container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Music className="w-4 h-4" />
            Inspiring Music
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Music & Songs</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover uplifting Christian music, worship songs, and gospel tracks from talented
            artists around the world. Audio, video, and lyrics to enhance your spiritual journey.
          </p>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search songs, artists, or lyrics..." className="pl-10 h-12" />
            </div>
            <RegularBtn className="h-12 px-6">Search</RegularBtn>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">3,200+</p>
                <p className="text-muted-foreground text-xs">Songs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Mic className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">450+</p>
                <p className="text-muted-foreground text-xs">Artists</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center">
                <Play className="w-5 h-5 text-orange" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">2.5M+</p>
                <p className="text-muted-foreground text-xs">Total Plays</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
