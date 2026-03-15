'use client';

import { motion } from 'framer-motion';
import { Heart, Send } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/atoms/Toast';

export const ShareTestimony = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: 'Testimony Required',
        description: 'Please share your testimony before submitting.',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    toast({
      title: 'Testimony Submitted!',
      description:
        'Your testimony has been submitted successfully. It will be reviewed and published soon.',
      variant: 'success',
    });

    // Reset form
    setName('');
    setCategory('');
    setContent('');
  };

  return (
    <section
      id="share-testimony"
      className="py-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
                Share Your Testimony
              </h3>
              <p className="text-muted-foreground mb-6 text-center">
                Your story matters! Share how God has worked in your life and inspire others in the
                community.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name (Optional)
                  </label>
                  <RegularInput
                    id="name"
                    name="name"
                    label=""
                    placeholder="You can remain anonymous"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healing">Healing</SelectItem>
                      <SelectItem value="purpose">Purpose</SelectItem>
                      <SelectItem value="prayer">Prayer</SelectItem>
                      <SelectItem value="marriage">Marriage</SelectItem>
                      <SelectItem value="provision">Provision</SelectItem>
                      <SelectItem value="deliverance">Deliverance</SelectItem>
                      <SelectItem value="salvation">Salvation</SelectItem>
                      <SelectItem value="blessing">Blessing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Your Testimony
                  </label>
                  <RegularTextarea
                    id="content"
                    name="content"
                    label=""
                    placeholder="Share your story here... How has God worked in your life?"
                    rows={8}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                  />
                </div>

                <RegularBtn
                  type="submit"
                  size="full"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  RightIcon={Send}
                  rightIconProps={{ className: 'w-4 h-4' }}
                  text={isSubmitting ? 'Submitting...' : 'Share Your Story'}
                  onDisabledClick={() => {
                    if (isSubmitting) {
                      toast({
                        title: 'Please wait',
                        description: 'Submitting your testimony…',
                        variant: 'info',
                      });
                    }
                  }}
                />
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
