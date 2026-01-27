'use client';

import { motion } from 'framer-motion';
import { BarChart3, Plus, Send, X } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { toast } from '@/components/atoms/Toast';

export const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast({
        title: 'Question Required',
        description: 'Please enter your poll question before submitting.',
        variant: 'error',
      });
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: 'Options Required',
        description: 'Please provide at least 2 poll options.',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    toast({
      title: 'Poll Created!',
      description:
        'Your poll has been created successfully. It will be reviewed and published soon.',
      variant: 'success',
    });

    // Reset form
    setQuestion('');
    setDescription('');
    setCategory('');
    setOptions(['', '']);
  };

  return (
    <section
      id="create-poll"
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
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2 text-center">Create a Poll</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Have a question for the community? Create a poll and gather opinions from fellow
                believers.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="question" className="text-sm font-medium">
                    Poll Question *
                  </label>
                  <Input
                    id="question"
                    placeholder="What is your question?"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description (Optional)
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Add more context to your poll..."
                    rows={3}
                    className="resize-none"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
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
                      <SelectItem value="worship">Worship</SelectItem>
                      <SelectItem value="spiritual-growth">Spiritual Growth</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="devotionals">Devotionals</SelectItem>
                      <SelectItem value="sermons">Sermons</SelectItem>
                      <SelectItem value="ministry">Ministry</SelectItem>
                      <SelectItem value="prayer">Prayer</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Poll Options * (Minimum 2)</label>
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={e => updateOption(index, e.target.value)}
                        required={index < 2}
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {options.length < 6 && (
                    <Button type="button" variant="outline" onClick={addOption} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Creating...' : 'Create Poll'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
