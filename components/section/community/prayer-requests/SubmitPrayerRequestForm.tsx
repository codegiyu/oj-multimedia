'use client';

import { useRouter } from 'next/navigation';
import { Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { getErrorMessage } from '@/lib/utils/general';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { PRAYER_CATEGORY_SELECT_OPTIONS } from '@/lib/constants/communityCategorySelectOptions';
import { toast } from '@/components/atoms/Toast';
import { LoginModal } from '@/components/auth/LoginModal';
import { useAuthStore } from '@/lib/store/useAuthStore';

interface SubmitPrayerRequestFormProps {
  onSuccess?: () => void;
  submitLabel?: string;
}

export function SubmitPrayerRequestForm({
  onSuccess,
  submitLabel = 'Submit Prayer Request',
}: SubmitPrayerRequestFormProps) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Fields Required',
        description: 'Please fill in the title and prayer request details.',
        variant: 'error',
      });
      return;
    }

    if (name.length > 200 || title.length > 200 || content.length > 2000) {
      toast({
        title: 'Length limit',
        description: 'Name and title max 200 characters; prayer details max 2000 characters.',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    const res = await callApi('PUBLIC_SUBMIT_PRAYER_REQUEST', {
      payload: {
        title: title.trim(),
        content: content.trim(),
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        category: category.trim() || undefined,
        urgent,
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
      title: 'Prayer Request Submitted!',
      description:
        'Your prayer request has been submitted successfully. Our community will join you in prayer.',
      variant: 'success',
    });

    setName('');
    setEmail('');
    setCategory('');
    setTitle('');
    setContent('');
    setUrgent(false);
    router.refresh();
    onSuccess?.();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <RegularInput
            id="prayer-name"
            name="name"
            label="Your Name (Optional)"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={200}
          />
          <RegularInput
            id="prayer-email"
            name="email"
            type="email"
            label="Email (Optional)"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <RegularSelect
          label="Category"
          value={category}
          onSelectChange={setCategory}
          placeholder="Select category"
          options={PRAYER_CATEGORY_SELECT_OPTIONS}
        />

        <RegularInput
          id="prayer-title"
          name="title"
          label="Prayer Request Title"
          placeholder="Brief title for your request"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          maxLength={200}
        />

        <RegularTextarea
          id="prayer-content"
          name="content"
          label="Prayer Request Details"
          placeholder="Share your prayer need here..."
          rows={6}
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          maxLength={2000}
          subtext={`${content.length}/2000 characters`}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="prayer-urgent"
            className="rounded"
            checked={urgent}
            onChange={e => setUrgent(e.target.checked)}
          />
          <label htmlFor="prayer-urgent" className="text-sm text-muted-foreground">
            Mark as urgent
          </label>
        </div>

        <RegularBtn
          type="submit"
          size="full"
          className="w-full gap-2"
          disabled={isSubmitting}
          loading={isSubmitting}
          RightIcon={Send}
          rightIconProps={{ className: 'w-4 h-4' }}
          text={isSubmitting ? 'Submitting...' : submitLabel}
        />
      </form>

      <div className="mt-6 flex items-start gap-3 rounded-xl bg-muted/40 border border-border/50 p-4">
        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Privacy & Guidelines</p>
          <p>• Your prayer requests are shared with our community.</p>
          <p>• Please be respectful and sensitive in your requests.</p>
          <p>• You can choose to remain anonymous.</p>
        </div>
      </div>

      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Sign in to submit a prayer request"
        description="Create an account or sign in to share your prayer need."
      />
    </>
  );
}
