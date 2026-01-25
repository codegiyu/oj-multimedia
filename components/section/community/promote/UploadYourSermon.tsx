'use client';

import { motion } from 'framer-motion';
import { Mic, Video, Upload, CheckCircle, ArrowRight, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const sermonOptions = [
  {
    type: 'Audio Sermon',
    icon: Mic,
    price: '₦1,000',
    description: 'Upload your audio sermon (per sermon)',
    features: ['MP3, WAV format support', 'Basic listing', 'Download option'],
  },
  {
    type: 'Video Sermon',
    icon: Video,
    price: '₦2,000',
    description: 'Upload your video sermon with enhanced features',
    features: ['MP4, MOV format support', 'HD video support', 'Enhanced player'],
  },
  {
    type: 'Featured Placement',
    icon: DollarSign,
    price: '₦4,000',
    description: 'Get your sermon featured on the homepage',
    features: ['Homepage feature', 'Priority listing', 'Social media promotion'],
  },
];

export const UploadYourSermon = () => {
  return (
    <section id="upload-sermon" className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-secondary" />
          </div>
        </div>
        <h2 className="section-header mb-3">Upload Your Sermon</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Share your message with thousands of listeners worldwide. Set your price and earn from
          your ministry content.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {sermonOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}>
              <Card className="card-interactive">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{option.type}</h3>
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
                  <Button className="w-full" variant="outline" size="lg">
                    Upload Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Earn 80% Revenue Share</h3>
                  <p className="text-sm text-muted-foreground">Set your own pricing</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Our top speakers earn substantial monthly income from their sermon uploads. You set
                the price, we handle the distribution.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-r from-secondary/10 to-transparent border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Global Reach</h3>
                  <p className="text-sm text-muted-foreground">Access detailed analytics</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Reach thousands of listeners worldwide, track your performance with detailed
                analytics, and build your online ministry presence.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
