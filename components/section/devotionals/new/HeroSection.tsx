import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Input } from '@/components/ui/input';
import { BookOpen, Play, Search, Heart } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="pt-24 pb-12 bg-gradient-to-br from-primary/30 via-background to-primary/20">
      <div className="regular-container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Daily Inspiration
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Devotionals & Bible Study
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Grow in your faith with daily devotionals, Bible study series, prayer points, and
            practical Christian living tips. Find guidance for marriage, family, and hear inspiring
            testimonies.
          </p>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search devotionals, topics, or Bible verses..."
                className="pl-10 h-12"
              />
            </div>
            <RegularBtn className="h-12 px-6">Search</RegularBtn>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">1,800+</p>
                <p className="text-muted-foreground text-xs">Devotionals</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">120+</p>
                <p className="text-muted-foreground text-xs">Bible Studies</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center">
                <Play className="w-5 h-5 text-orange" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">850K+</p>
                <p className="text-muted-foreground text-xs">Readers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
