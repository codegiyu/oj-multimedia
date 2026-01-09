import { Quote, Share2, BookmarkPlus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function VerseOfTheDayWithDevotional() {
  return (
    <section className="py-16">
      <div className="regular-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Verse of the Day */}
          <div className="relative overflow-hidden rounded-3xl">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-800 via-secondary to-teal-900" />
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
            <div className="relative px-8 py-12 md:px-12 md:py-16 text-center text-secondary-foreground">
              <div className="max-w-lg mx-auto">
                {/* Quote Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                  <Quote className="w-8 h-8" />
                </div>

                {/* Label */}
                <p className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-4">
                  Verse of the Day
                </p>

                {/* Verse */}
                <blockquote className="text-xl md:text-2xl font-bold leading-relaxed mb-4">
                  "For I know the plans I have for you," declares the Lord, "plans to prosper you
                  and not to harm you, plans to give you hope and a future."
                </blockquote>

                {/* Reference */}
                <p className="text-base font-semibold opacity-90 mb-6">Jeremiah 29:11</p>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-secondary-foreground border-0">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-secondary-foreground border-0">
                    <BookmarkPlus className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Devotional */}
          <Card className="h-full border-border shadow-card">
            <CardContent className="h-full p-8">
              <div className="h-full flex flex-col justify-between">
                <div className="">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Daily Devotional</h3>
                      <p className="text-sm text-muted-foreground">Today's reflection</p>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold mb-3">Trusting in God's Plan</h4>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    When we face uncertainty, it's easy to worry about the future. But God's word
                    reminds us that He has a plan for our lives—a plan for our good, not for harm.
                    Even when we can't see the way forward, we can trust that God is working behind
                    the scenes.
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Today, take a moment to surrender your worries to God. Remember that His plans
                    are always better than our own, and His timing is perfect.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      <BookmarkPlus className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    Read Full Devotional
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
