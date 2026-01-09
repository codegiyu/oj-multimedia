import { Music, Mic2, Store, Heart } from 'lucide-react';

const actions = [
  {
    icon: Music,
    title: 'Submit Your Song',
    description: 'Share your music with our growing community of listeners',
    color: 'from-primary to-orange-400',
    href: '/submit-song',
  },
  {
    icon: Mic2,
    title: 'Upload Sermon',
    description: 'Spread your message to thousands seeking inspiration',
    color: 'from-secondary to-teal-400',
    href: '/upload-sermon',
  },
  {
    icon: Store,
    title: 'Become a Vendor',
    description: 'Open your store and reach customers across the globe',
    color: 'from-violet-500 to-purple-400',
    href: '/become-vendor',
  },
  {
    icon: Heart,
    title: 'Prayer Request',
    description: 'Share your prayer needs with our supportive community',
    color: 'from-accent to-pink-400',
    href: '/prayer-request',
  },
];

export function CTASection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="regular-container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Join Our Community</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're a creator, artist, or just looking for inspiration, there's a place for
            you here
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-card p-6 card-hover text-center">
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} mb-5 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                  {action.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
