/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQueryState, parseAsString } from 'nuqs';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { callApi } from '@/lib/services/callApi';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { toast } from '@/components/atoms/Toast';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import { useForm } from '@/lib/hooks/use-form';

const resetPasswordFormSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    scopeToken: z.string().min(1, 'Reset token is required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export type AdminPasswordSetupVariant = 'reset' | 'invite';

const COPY: Record<
  AdminPasswordSetupVariant,
  {
    cardTitle: string;
    cardDescription: string;
    submitLabel: string;
    loadingLabel: string;
    invalidTitle: string;
    invalidDescription: string;
    successTitle: string;
    successDescription: string;
  }
> = {
  reset: {
    cardTitle: 'Reset Your Password',
    cardDescription: 'Enter your new password to complete the reset process',
    submitLabel: 'Reset Password',
    loadingLabel: 'Resetting password...',
    invalidTitle: 'Invalid Reset Link',
    invalidDescription:
      "The password reset link you're using is missing required information. Please ensure you're using the complete link from the email that was sent to you.",
    successTitle: 'Password reset successful!',
    successDescription: 'Your password has been reset successfully. You are now logged in.',
  },
  invite: {
    cardTitle: 'Create Your Password',
    cardDescription: 'Set a password to activate your admin account',
    submitLabel: 'Create Password',
    loadingLabel: 'Creating password...',
    invalidTitle: 'Invalid Invite Link',
    invalidDescription:
      'This invite link is missing required information. Open the full link from your invitation email or ask an administrator to resend the invite.',
    successTitle: 'Account ready!',
    successDescription: 'Your password is set. You are now logged in to the admin console.',
  },
};

export function ResetPasswordPageClient({
  variant = 'reset',
}: {
  variant?: AdminPasswordSetupVariant;
}) {
  const copy = COPY[variant];
  const router = useRouter();
  const {
    actions: { setUser },
  } = useAuthStore(state => ({ actions: state.actions }));

  const [email] = useQueryState('email', parseAsString.withDefault(''));
  const [scopeToken] = useQueryState('scopeToken', parseAsString.withDefault(''));

  const isMissingParams = useMemo(() => {
    const isEmailValid = email && email.trim() !== '' && email.includes('@');
    const isScopeTokenValid = scopeToken && scopeToken.trim() !== '';
    return !isEmailValid || !isScopeTokenValid;
  }, [email, scopeToken]);

  const {
    formValues,
    formErrors,
    loading,
    handleInputChange,
    handleSubmit: formHandleSubmit,
    isValid,
    validateForm,
    errorsVisible,
    onChange,
  } = useForm({
    formSchema: resetPasswordFormSchema,
    defaultFormValues: {
      email: email || '',
      password: '',
      confirmPassword: '',
      scopeToken: scopeToken || '',
    },
    onSubmit,
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    const { data, error, message } = await callApi('AUTH_RESET_PASSWORD', {
      payload: {
        email: values.email,
        scopeToken: values.scopeToken,
        password: values.password,
        confirmPassword: values.confirmPassword,
      },
    });

    if (error || !data) {
      toast({
        title: variant === 'invite' ? 'Setup failed' : 'Reset failed',
        description:
          message ||
          (variant === 'invite'
            ? 'Failed to set your password. Please try again or request a new invite.'
            : 'Failed to reset password. Please try again.'),
        variant: 'error',
      });
      return false;
    }

    const { user } = data;

    await setUser(user ?? null, {
      pauseNavigatingAwayFromAuth: false,
    });

    toast({
      title: copy.successTitle,
      description: copy.successDescription,
      variant: 'success',
    });

    router.push('/admin/dashboard/home');
    return true;
  }

  useEffect(() => {
    if (email) onChange('email', email);
    if (scopeToken) onChange('scopeToken', scopeToken);
  }, [email, scopeToken]);

  return (
    <>
      <Dialog open={isMissingParams} modal={true}>
        <DialogContent
          className="sm:max-w-md"
          showCloseButton={false}
          onInteractOutside={e => e.preventDefault()}
          onEscapeKeyDown={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{copy.invalidTitle}</DialogTitle>
            <DialogDescription>{copy.invalidDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <RegularBtn
              text="Go to Login"
              onClick={() => router.push('/admin/auth/login')}
              className="w-full"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!isMissingParams && (
        <Card>
          <CardHeader className="space-y-0 border-b border-foreground/20 pt-6 pb-6">
            <CardTitle className="text-2xl">{copy.cardTitle}</CardTitle>
            <CardDescription>{copy.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-6">
            <form onSubmit={formHandleSubmit} className="space-y-10">
              <div className="grid gap-6">
                <PasswordInput
                  id="password"
                  name="password"
                  label="New Password"
                  placeholder="Enter your new password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  errors={errorsVisible ? (formErrors.password ?? []) : []}
                  subtext="Password must be at least 8 characters long."
                />
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  placeholder="Confirm your new password"
                  value={formValues.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  errors={errorsVisible ? (formErrors.confirmPassword ?? []) : []}
                />
              </div>

              <div className="space-y-2 mt-8">
                <RegularBtn
                  type="submit"
                  text={loading ? copy.loadingLabel : copy.submitLabel}
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
          </CardContent>
        </Card>
      )}
    </>
  );
}
