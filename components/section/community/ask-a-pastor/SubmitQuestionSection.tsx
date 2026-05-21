'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { HelpCircle, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { getErrorMessage } from '@/lib/utils/general';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { Card, CardContent } from '@/components/ui/card';

const QUESTION_CATEGORY_OPTIONS = [
  { value: 'faith', text: 'Faith' },
  { value: 'relationships', text: 'Relationships' },
  { value: 'spiritual-growth', text: 'Spiritual Growth' },
  { value: 'finance', text: 'Finance' },
  { value: 'bible-study', text: 'Bible Study' },
  { value: 'prayer', text: 'Prayer' },
  { value: 'other', text: 'Other' },
];
import { toast } from '@/components/atoms/Toast';
import { SectionComp } from '@/components/general/SectionComp';
import { LoginModal } from '@/components/auth/LoginModal';
import { useAuthStore } from '@/lib/store/useAuthStore';

export const SubmitQuestionSection = () => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!question.trim()) {
      toast({
        title: 'Question Required',
        description: 'Please enter your question before submitting.',
        variant: 'error',
      });
      return;
    }
    if (name.length > 200 || question.length > 2000) {
      toast({
        title: 'Length limit',
        description: 'Name max 200 characters; question max 2000 characters.',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    const res = await callApi('PUBLIC_SUBMIT_QUESTION', {
      payload: {
        question: question.trim(),
        name: name.trim() || undefined,
        category: category.trim() || undefined,
      },
    });

    setIsSubmitting(false);

    if (res.error) {
      toast({
        title: 'Submission failed',
        description: getErrorMessage(res.error),
        variant: 'error',
      });
      return;
    }

    toast({
      title: 'Question Submitted!',
      description:
        'Your question has been submitted successfully. Our pastors will review and answer it soon.',
      variant: 'success',
    });

    setName('');
    setCategory('');
    setQuestion('');
    router.refresh();
  };

  return (
    <SectionComp
      id="submit-question"
      icon={HelpCircle}
      iconColor="secondary"
      heading="Ask a Question"
      subtext="Submit your question to our pastors. They'll provide biblical guidance and answers."
      contentProps={{ enableAnimation: false }}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <RegularInput
                    id="name"
                    name="name"
                    label="Your Name (Optional)"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={200}
                  />
                  <RegularSelect
                    label="Category"
                    value={category}
                    onSelectChange={setCategory}
                    placeholder="Select category"
                    options={QUESTION_CATEGORY_OPTIONS}
                  />
                </div>

                <RegularTextarea
                  id="question"
                  name="question"
                  label="Your Question"
                  placeholder="Ask your question here... Be as specific as possible to get the best answer."
                  rows={6}
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  required
                  maxLength={2000}
                />

                <RegularBtn
                  type="submit"
                  size="full"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  RightIcon={Send}
                  rightIconProps={{ className: 'w-4 h-4' }}
                  text={isSubmitting ? 'Submitting...' : 'Submit Question'}
                  onDisabledClick={() => {
                    if (isSubmitting) {
                      toast({
                        title: 'Please wait',
                        description: 'Submitting your question…',
                        variant: 'info',
                      });
                    }
                  }}
                />
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
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </SectionComp>
  );
};
