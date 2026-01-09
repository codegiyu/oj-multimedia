import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');

  return (
    <section className="py-16">
      <div className="regular-container mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground to-foreground/90 text-background">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

          {/* Sparkle decorations */}
          <div className="absolute top-8 right-12 text-primary/40">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute bottom-12 left-16 text-secondary/40">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="relative px-8 py-12 md:px-16 md:py-16">
            <div className="max-w-2xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-sm font-semibold rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                Stay Inspired
              </span>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Weekly Inspiration Delivered
              </h2>
              <p className="text-lg text-background/70 mb-8">
                Join 50,000+ subscribers receiving curated music, devotionals, and uplifting content
                every week.
              </p>

              {/* Form */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-background placeholder:text-background/50 focus:outline-none focus:border-primary focus:bg-white/15 transition-colors"
                />
                <Button variant="hero" size="lg" className="whitespace-nowrap">
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </div>

              <p className="text-xs text-background/50 mt-4">No spam, ever. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
