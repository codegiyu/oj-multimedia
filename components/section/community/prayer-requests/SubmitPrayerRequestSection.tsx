'use client';

import { motion } from 'framer-motion';
import { HandHeart, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/atoms/Toast';

export const SubmitPrayerRequestSection = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Fields Required',
        description: 'Please fill in the title and prayer request details.',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    toast({
      title: 'Prayer Request Submitted!',
      description:
        'Your prayer request has been submitted successfully. Our community will join you in prayer.',
      variant: 'success',
    });

    // Reset form
    setName('');
    setCategory('');
    setTitle('');
    setContent('');
    setUrgent(false);
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <HandHeart className="w-5 h-5 text-primary" />
            </div>
            <h2 className="section-header">Submit a Prayer Request</h2>
          </div>
          <p className="text-muted-foreground">
            Share your prayer need with our community. We'll join you in prayer.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Your Name (Optional)
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healing">Healing</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                        <SelectItem value="spiritual">Spiritual</SelectItem>
                        <SelectItem value="protection">Protection</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Prayer Request Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Brief title for your request"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Prayer Request Details
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Share your prayer need here..."
                    rows={6}
                    className="resize-none"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="urgent"
                    className="rounded"
                    checked={urgent}
                    onChange={e => setUrgent(e.target.checked)}
                  />
                  <label htmlFor="urgent" className="text-sm text-muted-foreground">
                    Mark as urgent
                  </label>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Prayer Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-muted/30 rounded-2xl p-6 border border-border/50">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Privacy & Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your prayer requests are shared with our community</li>
                <li>• Please be respectful and sensitive in your requests</li>
                <li>• You can choose to remain anonymous</li>
                <li>• All requests are moderated before being published</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
