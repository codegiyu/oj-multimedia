'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Send, CheckCircle } from 'lucide-react';
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

export const SubmitQuestionSection = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast({
        title: 'Question Required',
        description: 'Please enter your question before submitting.',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    toast({
      title: 'Question Submitted!',
      description:
        'Your question has been submitted successfully. Our pastors will review and answer it soon.',
      variant: 'success',
    });

    // Reset form
    setName('');
    setCategory('');
    setQuestion('');
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
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="section-header">Ask a Question</h2>
          </div>
          <p className="text-muted-foreground">
            Submit your question to our pastors. They'll provide biblical guidance and answers.
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
                        <SelectItem value="faith">Faith</SelectItem>
                        <SelectItem value="relationships">Relationships</SelectItem>
                        <SelectItem value="spiritual-growth">Spiritual Growth</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="bible-study">Bible Study</SelectItem>
                        <SelectItem value="prayer">Prayer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="question" className="text-sm font-medium">
                    Your Question
                  </label>
                  <Textarea
                    id="question"
                    placeholder="Ask your question here... Be as specific as possible to get the best answer."
                    rows={6}
                    className="resize-none"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Question'}
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
              <h3 className="font-semibold mb-2">Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be respectful and specific in your questions</li>
                <li>• Questions are answered by experienced pastors</li>
                <li>• You can choose to remain anonymous</li>
                <li>• All questions are moderated before being published</li>
                <li>• Answers are based on biblical principles and pastoral wisdom</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
