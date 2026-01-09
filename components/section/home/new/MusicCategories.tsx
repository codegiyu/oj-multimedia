import { Music, Mic, Heart, Globe, BookOpen, Piano } from 'lucide-react';

const categories = [
  {
    name: 'Inspirational',
    icon: Heart,
    color: 'from-primary to-orange-400',
    count: '12.5K songs',
  },
  {
    name: 'Worship',
    icon: Music,
    color: 'from-secondary to-teal-400',
    count: '8.2K songs',
  },
  {
    name: 'Afro-Inspirational',
    icon: Globe,
    color: 'from-accent to-pink-400',
    count: '5.8K songs',
  },
  {
    name: 'Gospel',
    icon: Mic,
    color: 'from-amber-500 to-yellow-400',
    count: '15.3K songs',
  },
  {
    name: 'Spoken Word',
    icon: BookOpen,
    color: 'from-violet-500 to-purple-400',
    count: '3.2K tracks',
  },
  {
    name: 'Instrumentals',
    icon: Piano,
    color: 'from-blue-500 to-cyan-400',
    count: '4.1K tracks',
  },
];

export function MusicCategories() {
  return (
    <section className="py-16">
      <div className="regular-container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Browse Categories</h2>
            <p className="text-muted-foreground">Find your perfect sound</p>
          </div>
          <a
            href="/categories"
            className="text-primary font-semibold hover:underline hidden sm:block">
            View All →
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <a
              key={category.name}
              href={`/category/${category.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-2xl aspect-square card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`}
              />

              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-4 text-primary-foreground">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <category.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-center mb-1">{category.name}</h3>
                <p className="text-xs opacity-80">{category.count}</p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
