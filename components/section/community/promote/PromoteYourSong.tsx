'use client';

import { motion } from 'framer-motion';
import { Music, DollarSign, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionComp } from '@/components/general/SectionComp';

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
    <SectionComp
      id="promote-song"
      icon={Music}
      iconColor="accent"
      heading="Promote Your Song"
      subtext="Reach a wider audience and grow your fanbase with our promotional packages"
      contentProps={{ enableAnimation: false }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {pricingOptions.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <Card
              className={`card-interactive relative ${
                index === 1 ? 'border-primary border-2' : ''
              }`}>
              {index === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                      index === 1
                        ? 'bg-primary/20'
                        : 'bg-gradient-to-br from-primary/20 to-primary/10'
                    }`}>
                    <Star className={`w-7 h-7 ${index === 1 ? 'text-primary' : 'text-primary'}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{option.title}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-3xl font-bold text-foreground">{option.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={index === 1 ? 'default' : 'outline'} size="lg">
                  Choose Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
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
              <Button
                variant="accent"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </SectionComp>
  );
};
