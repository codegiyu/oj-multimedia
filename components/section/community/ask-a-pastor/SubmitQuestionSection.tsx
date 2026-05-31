'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { HelpCircle, Send, CheckCircle, Lock } from 'lucide-react';
import { useState } from 'react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { getErrorMessage } from '@/lib/utils/general';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/atoms/Toast';
import { SectionComp } from '@/components/general/SectionComp';
import { LoginModal } from '@/components/auth/LoginModal';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { ASK_A_PASTOR_CATEGORY_SELECT_OPTIONS } from '@/lib/constants/communityCategorySelectOptions';
import type { AvailablePastor } from './AskAPastorPageClient';

interface SubmitQuestionSectionProps {
  pastors?: AvailablePastor[];
}

export const SubmitQuestionSection = ({ pastors = [] }: SubmitQuestionSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPastorId = searchParams.get('pastor') ?? '';
  const user = useAuthStore(state => state.user);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [requestedPastorId, setRequestedPastorId] = useState('');
  const effectivePastorId = requestedPastorId || preselectedPastorId;
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const pastorOptions = [
    { value: '', text: 'Any available pastor' },
    ...pastors.map(p => ({ value: p._id, text: p.name })),
  ];

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
        isPrivate,
        requestedPastorId: effectivePastorId || undefined,
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
      description: isPrivate
        ? 'Your private question was submitted. Only you and assigned pastors can view it.'
        : 'Your question has been submitted successfully. Our pastors will review and answer it soon.',
      variant: 'success',
    });

    setName('');
    setCategory('');
    setQuestion('');
    setRequestedPastorId('');
    setIsPrivate(false);
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
                    options={ASK_A_PASTOR_CATEGORY_SELECT_OPTIONS}
                  />
                </div>

                {pastors.length > 0 ? (
                  <RegularSelect
                    label="Preferred pastor (optional)"
                    value={effectivePastorId}
                    onSelectChange={setRequestedPastorId}
                    placeholder="Any available pastor"
                    options={pastorOptions}
                  />
                ) : null}

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

                <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 px-4 py-3">
                  <div className="space-y-1">
                    <Label htmlFor="private-question" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Private question
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Only you and pastors can see private questions. They won&apos;t appear in
                      public lists.
                    </p>
                  </div>
                  <Switch
                    id="private-question"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
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
                  text={isSubmitting ? 'Submitting...' : 'Submit Question'}
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
                <li>• You can choose to remain anonymous or ask privately</li>
                <li>• All public questions are moderated before being published</li>
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
