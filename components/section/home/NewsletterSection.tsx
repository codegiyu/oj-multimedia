'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call newsletter subscription API
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionContainer className="py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 md:p-12 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Connected</h2>
            <p className="text-lg text-white/90">
              Get daily devotionals, verse of the day, and inspiring content delivered to your inbox
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <RegularInput
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:border-white/50"
              wrapClassName="flex-1"
            />
            <RegularBtn
              type="submit"
              text="Subscribe"
              loading={loading}
              className="bg-white text-[#2563EB] hover:bg-white/90 font-semibold px-8"
            />
          </form>
        </Card>
      </div>
    </SectionContainer>
  );
};
