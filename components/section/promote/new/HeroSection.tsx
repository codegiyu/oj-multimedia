import { Star, ArrowDown } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-primary/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Decorative blur elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl" />

      <div className="regular-container mx-auto relative px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Promote Your <span className="gradient-text">Content</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Reach thousands of listeners, grow your audience, and monetize your ministry content.
            Choose from our range of promotion options tailored for gospel artists and ministers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RegularBtn
              variant="hero"
              size="xl"
              onClick={() => {
                document.getElementById('promote-song')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto">
              Get Started
              <ArrowDown className="w-4 h-4 ml-2" />
            </RegularBtn>
          </div>
        </div>
      </div>
    </section>
  );
}
