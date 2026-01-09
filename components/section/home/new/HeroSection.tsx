import { Play, Pause, Heart, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { RegularBtn } from '@/components/atoms/RegularBtn';

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Blue-ish background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-primary/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Decorative blur elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-3xl" />

      <div className="regular-container mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Featured Song Card */}
          <div className="flex-1 w-full max-w-3xl">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-card rounded-2xl shadow-card overflow-hidden">
                {/* Album Art */}
                <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-accent/20">
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
                        <Pause className="w-8 h-8" />
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
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-1">Rise Above</h3>
                  <p className="text-muted-foreground mb-4">Sarah Grace • Inspirational</p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <Button variant="hero" className="flex-1">
                      <Play className="w-4 h-4" />
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

          {/* Hero Text */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6 animate-fade-up">
              ✨ Your Daily Dose of Inspiration
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-up"
              style={{ animationDelay: '0.1s' }}>
              Discover Music That <span className="gradient-text">Uplifts Your Soul</span>
            </h1>
            <p
              className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 animate-fade-up"
              style={{ animationDelay: '0.2s' }}>
              Explore thousands of inspirational songs, powerful sermons, and uplifting content from
              creators around the world.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up"
              style={{ animationDelay: '0.3s' }}>
              <RegularBtn
                variant="hero"
                size="xl"
                className="w-full sm:w-auto"
                wrapClassName="w-full sm:w-auto">
                Start Listening
              </RegularBtn>
              <RegularBtn
                variant="outline"
                size="xl"
                className="w-full sm:w-auto"
                wrapClassName="w-full sm:w-auto">
                Submit Your Music
              </RegularBtn>
            </div>

            {/* Stats */}
            <div
              className="flex items-center justify-center lg:justify-start gap-8 mt-10 animate-fade-up"
              style={{ animationDelay: '0.4s' }}>
              <div>
                <p className="text-3xl font-bold gradient-text">50K+</p>
                <p className="text-sm text-muted-foreground">Songs</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-bold gradient-text">10K+</p>
                <p className="text-sm text-muted-foreground">Artists</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-bold gradient-text">1M+</p>
                <p className="text-sm text-muted-foreground">Listeners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
