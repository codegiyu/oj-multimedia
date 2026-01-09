import { Play, Heart, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { RegularBtn } from '@/components/atoms/RegularBtn';

export function FeaturedGospelSong() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
      <div className="regular-container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Gospel Song</h2>
            <p className="text-muted-foreground">Today's spotlight</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Album Art */}
              <div className="relative w-full lg:w-96 aspect-square bg-gradient-to-br from-primary/20 to-accent/20">
                <img
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop"
                  alt="Featured Song"
                  className="w-full h-full object-cover"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <RegularBtn
                    variant="play"
                    size="iconXl"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="play-button">
                    {isPlaying ? (
                      <Play className="w-8 h-8 ml-1" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </RegularBtn>
                </div>

                {/* Featured Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Featured Today
                  </span>
                </div>
              </div>

              {/* Song Info */}
              <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold mb-2">Rise Above</h3>
                  <p className="text-lg text-muted-foreground mb-4">Sarah Grace • Inspirational</p>
                  <p className="text-muted-foreground mb-6">
                    An uplifting anthem that reminds us of God's faithfulness and the power of hope
                    in challenging times. Let this song inspire you to rise above your
                    circumstances.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="hero" className="flex-1 min-w-[140px]">
                    <Play className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
