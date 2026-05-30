'use client';

import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import { toast } from '@/components/atoms/Toast';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { useForm } from '@/lib/hooks/use-form';

const requestPasswordResetFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type RequestPasswordResetFormValues = z.infer<typeof requestPasswordResetFormSchema>;

const defaultFormValues: RequestPasswordResetFormValues = {
  email: '',
};

export function RequestPasswordResetFormClient() {
  const router = useRouter();

  const {
    formValues,
    formErrors,
    loading,
    handleInputChange,
    handleSubmit: formHandleSubmit,
    isValid,
    validateForm,
    errorsVisible,
  } = useForm({
    formSchema: requestPasswordResetFormSchema,
    defaultFormValues,
    onSubmit,
  });

  async function onSubmit(values: RequestPasswordResetFormValues) {
    const { data, error, message } = await callApi('AUTH_REQUEST_PASSWORD_RESET', {
      payload: {
        email: values.email,
        scope: 'reset-password',
        accessType: 'console',
      },
    });

    if (error || !data) {
      toast({
        title: 'Request failed',
        description: message || 'Failed to send password reset email. Please try again.',
        variant: 'error',
      });
      return false;
    }

    router.push(
      `/admin/auth/reset-password-mail-notification?email=${encodeURIComponent(values.email)}`
    );
    return true;
  }

  return (
    <form onSubmit={formHandleSubmit} className="space-y-10">
      <div className="grid gap-6">
        <RegularInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          value={formValues.email}
          onChange={handleInputChange}
          required
          disabled={loading}
          autoComplete="email"
          errors={errorsVisible ? (formErrors.email ?? []) : []}
        />
      </div>

      <div className="space-y-2 mt-8">
        <RegularBtn
          type="submit"
          text={loading ? 'Sending...' : 'Send Reset Link'}
          className="w-full"
          disabled={loading || !isValid}
          loading={loading}
          onDisabledClick={validateForm}
        />
        <p className="text-center text-sm text-muted-foreground mt-4">
          Remember your password?{' '}
          <Link href="/admin/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
