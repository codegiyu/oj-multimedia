'use client';

import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { callApi } from '@/lib/services/callApi';
import { getErrorMessage } from '@/lib/utils/general';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { toast } from '@/components/atoms/Toast';
import { TESTIMONY_CATEGORY_SELECT_OPTIONS } from '@/lib/constants/communityCategorySelectOptions';
import { LoginModal } from '@/components/auth/LoginModal';
import { useAuthStore } from '@/lib/store/useAuthStore';

interface ShareTestimonyFormProps {
  onSuccess?: () => void;
  submitLabel?: string;
}

export function ShareTestimonyForm({
  onSuccess,
  submitLabel = 'Share Your Story',
}: ShareTestimonyFormProps) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!content.trim()) {
      toast({
        title: 'Testimony Required',
        description: 'Please share your testimony before submitting.',
        variant: 'error',
      });
      return;
    }

    if (name.length > 200 || content.length > 5000) {
      toast({
        title: 'Length limit',
        description: 'Name max 200 characters; testimony max 5000 characters.',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    const res = await callApi('PUBLIC_SUBMIT_TESTIMONY', {
      payload: {
        content: content.trim(),
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
      title: 'Testimony Submitted!',
      description:
        'Your testimony has been submitted successfully. It will be reviewed and published soon.',
      variant: 'success',
    });

    setName('');
    setCategory('');
    setContent('');
    router.refresh();
    onSuccess?.();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <RegularInput
          id="testimony-name"
          name="name"
          label="Your Name (Optional)"
          placeholder="You can remain anonymous"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={200}
        />

        <RegularSelect
          label="Category"
          value={category}
          onSelectChange={setCategory}
          placeholder="Select a category"
          options={TESTIMONY_CATEGORY_SELECT_OPTIONS}
        />

        <RegularTextarea
          id="testimony-content"
          name="content"
          label="Your Testimony"
          placeholder="Share your story here... How has God worked in your life?"
          rows={8}
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          maxLength={5000}
          subtext={`${content.length}/5000 characters`}
        />

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

      <div className="mt-6 rounded-xl bg-muted/40 border border-border/50 p-4 text-sm text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Guidelines</p>
        <p>• Share genuine experiences that may encourage others.</p>
        <p>• Keep your testimony respectful and appropriate for all ages.</p>
        <p>• Submissions may be reviewed before appearing publicly.</p>
      </div>

      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Sign in to share your testimony"
        description="Create an account or sign in to submit your story."
      />
    </>
  );
}
