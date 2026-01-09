import { Quote, Share2, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function VerseOfTheDay() {
  return (
    <section className="py-16">
      <div className="regular-container mx-auto">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-teal-500" />
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          {/* Content */}
          <div className="relative px-8 py-12 md:px-16 md:py-20 text-center text-secondary-foreground">
            <div className="max-w-3xl mx-auto">
              {/* Quote Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
                <Quote className="w-8 h-8" />
              </div>

              {/* Label */}
              <p className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-6">
                Verse of the Day
              </p>

              {/* Verse */}
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed mb-6">
                "For I know the plans I have for you," declares the Lord, "plans to prosper you and
                not to harm you, plans to give you hope and a future."
              </blockquote>

              {/* Reference */}
              <p className="text-lg font-semibold opacity-90 mb-8">Jeremiah 29:11</p>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-secondary-foreground border-0">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-secondary-foreground border-0">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
