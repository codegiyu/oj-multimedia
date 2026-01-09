import { Music, DollarSign, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Button } from '@/components/ui/button';

const pricingOptions = [
  {
    title: 'Basic Listing',
    price: '₦5,000',
    description: 'Upload your song with basic listing on the platform',
    features: ['Song listing', 'Basic search visibility', 'Artist profile link'],
  },
  {
    title: 'Featured Song',
    price: '₦8,000',
    description: 'Get featured on the homepage banner',
    features: ['Homepage banner placement', 'Priority listing', 'Enhanced visibility'],
  },
  {
    title: 'Artist Spotlight',
    price: '₦7,000',
    description: 'Get featured in the artist spotlight section',
    features: ['Artist spotlight feature', 'Profile enhancement', 'Social media promotion'],
  },
];

export const PromoteYourSong = () => {
  return (
    <section id="promote-song" className="py-20 bg-background">
      <div className="regular-container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Music className="w-4 h-4" />
            Music Promotion
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">Promote Your Song</h2>
          <p className="text-lg text-muted-foreground">
            Reach a wider audience and grow your fanbase with our promotional packages
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {pricingOptions.map((option, index) => (
            <Card
              key={index}
              className={`hover:shadow-lg transition-all duration-300 border-border/50 relative ${
                index === 1 ? 'bg-primary text-primary-foreground scale-y-105' : ''
              }`}>
              {index === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardContent className="px-6 py-12">
                <div className="text-center mb-6">
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                      index === 1
                        ? 'bg-primary-foreground/20'
                        : 'bg-gradient-to-br from-primary to-primary/70'
                    }`}>
                    <Star
                      className={`w-7 h-7 ${index === 1 ? 'text-primary-foreground' : 'text-white'}`}
                    />
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      index === 1 ? 'text-primary-foreground' : 'text-foreground'
                    }`}>
                    {option.title}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span
                      className={`text-3xl font-bold ${
                        index === 1 ? 'text-primary-foreground' : 'text-foreground'
                      }`}>
                      {option.price}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${index === 1 ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {option.description}
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {option.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-2 text-sm ${
                        index === 1 ? 'text-primary-foreground' : 'text-foreground'
                      }`}>
                      <CheckCircle
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          index === 1 ? 'text-primary-foreground' : 'text-primary'
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={index === 1 ? 'secondary' : 'outline'}
                  size="lg">
                  Choose Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Need Custom Pricing?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact us to discuss a custom package that fits your needs
                  </p>
                </div>
              </div>
              <RegularBtn
                variant="cta"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                Contact Us
              </RegularBtn>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
