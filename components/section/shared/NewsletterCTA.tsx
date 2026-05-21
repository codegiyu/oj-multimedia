'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight } from 'lucide-react';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { toast } from 'sonner';

export const NewsletterCTA = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    setSubmitting(true);
    try {
      // TODO: wire to newsletter subscription endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 md:p-12">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Stay in the loop</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Get the best stories in your inbox
            </h2>

            <p className="text-muted-foreground mb-8">
              Join thousands of readers who get our weekly digest of must-read stories,
              opportunities, and inspiration. No spam, just good content.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto text-left">
              <RegularInput
                type="email"
                name="newsletterEmail"
                label=""
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                wrapClassName="flex-1"
              />
              <RegularBtn
                type="submit"
                className="h-12 px-6 rounded-full gap-2 w-full sm:w-auto"
                text={submitting ? 'Subscribing...' : 'Subscribe'}
                RightIcon={ArrowRight}
                rightIconProps={{ className: 'w-4 h-4' }}
                disabled={submitting}
                loading={submitting}
                onDisabledClick={() => {
                  if (submitting) {
                    toast.info('Please wait, subscribing…');
                  }
                }}
              />
            </form>

            <p className="text-xs text-muted-foreground mt-4">
              By subscribing, you agree to receive our newsletter. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
