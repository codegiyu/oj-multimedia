import { Upload, Music, DollarSign, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  'Global audience reach',
  'Keep 85% of earnings',
  'Professional distribution',
  'Detailed analytics',
  'Direct fan connection',
  'Featured placement opportunities',
];

export function SubmitSong() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="regular-container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Monetize Your Music
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">Submit Your Song</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Share your inspirational music with our growing community. Upload your tracks, set
                your price, and start earning while spreading your message.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Your Music
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-elegant">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Music className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Artist Dashboard</h3>
                  <p className="text-muted-foreground text-sm">Manage your music empire</p>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Upload Songs</p>
                        <p className="text-xs text-muted-foreground">MP3, WAV, FLAC</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-orange" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Set Pricing</p>
                        <p className="text-xs text-muted-foreground">Free or Premium</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Get Verified</p>
                        <p className="text-xs text-muted-foreground">Build credibility</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                  Join 500+ artists already sharing their music
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
