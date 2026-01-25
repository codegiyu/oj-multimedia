'use client';

import { Upload, DollarSign, Mic, Video, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';

const benefits = [
  'Reach thousands of listeners worldwide',
  'Set your own pricing for premium content',
  'Earn 80% of all sermon sales',
  'Access detailed analytics and insights',
  'Build your online ministry presence',
];

export const UploadSermon = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-secondary/20 via-background to-primary/10">
      <div className="regular-container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <DollarSign className="w-4 h-4" />
              Monetize Your Ministry
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Share Your Message with the World
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Upload your sermons and reach a global audience. Set your price, share your message,
              and earn from your ministry content.
            </p>

            <ul className="grid gap-3 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <RegularBtn size="lg" variant="cta" className="group">
                <Upload className="w-5 h-5 mr-2" />
                Upload Sermon
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </RegularBtn>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-all duration-300 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Mic className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Audio Sermons</h3>
                <p className="text-sm text-muted-foreground">
                  MP3, WAV, and other audio formats supported
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Video Sermons</h3>
                <p className="text-sm text-muted-foreground">
                  MP4, MOV, and other video formats supported
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Earn While You Preach</h3>
                    <p className="text-sm text-muted-foreground">
                      Our top speakers earn $5,000+ monthly
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">80%</p>
                    <p className="text-xs text-muted-foreground">Revenue Share</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
