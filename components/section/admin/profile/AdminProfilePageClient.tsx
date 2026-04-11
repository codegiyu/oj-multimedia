/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { Label } from '@/components/ui/label';
import { User, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from '@/lib/hooks/use-form';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { callApi } from '@/lib/services/callApi';
import type { ClientAdmin } from '@/lib/constants/endpoints';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email'),
  avatar: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(values => values.newPassword === values.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

export interface AdminProfilePageClientProps {
  initialUser: ClientAdmin | null;
  initialLoadError: string | null;
}

export function AdminProfilePageClient({
  initialUser,
  initialLoadError,
}: AdminProfilePageClientProps) {
  const router = useRouter();
  const setUser = useAuthStore(state => state.actions.setUser);

  const profileDefaults: ProfileFormValues = {
    firstName: initialUser?.firstName ?? '',
    lastName: initialUser?.lastName ?? '',
    email: initialUser?.email ?? '',
    avatar: initialUser?.avatar ?? '',
  };

  const {
    formValues: profileValues,
    formErrors: profileErrors,
    loading: savingProfile,
    handleInputChange: handleProfileInputChange,
    handleSubmit: handleProfileSubmit,
    errorsVisible: profileErrorsVisible,
    validateForm: _validateProfileForm,
    isValid: isProfileValid,
    setFormValues: setProfileFormValues,
  } = useForm<typeof profileSchema>({
    formSchema: profileSchema,
    defaultFormValues: profileDefaults,
    async onSubmit(values: ProfileFormValues) {
      const { data, error, message } = await callApi('ADMIN_UPDATE_ME', {
        payload: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email || undefined,
          avatar: values.avatar || undefined,
        },
      });
      if (error || !data) {
        toast.error(message || 'Failed to update profile.');
        return false;
      }
      if (data.user) setUser(data.user);
      toast.success('Profile updated.');
      return true;
    },
  });

  useEffect(() => {
    if (!initialUser) return;
    setProfileFormValues(prev => ({
      ...prev,
      firstName: initialUser.firstName ?? prev.firstName,
      lastName: initialUser.lastName ?? prev.lastName,
      email: initialUser.email ?? prev.email,
      avatar: initialUser.avatar ?? prev.avatar,
    }));
  }, [initialUser]);

  const {
    formValues: passwordValues,
    formErrors: passwordErrors,
    loading: savingPassword,
    handleInputChange: handlePasswordInputChange,
    handleSubmit: handlePasswordSubmit,
    errorsVisible: passwordErrorsVisible,
    validateForm: _validatePasswordForm,
    isValid: isPasswordValid,
    resetForm: resetPasswordForm,
  } = useForm<typeof passwordSchema>({
    formSchema: passwordSchema,
    defaultFormValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    async onSubmit(values) {
      const { data, error, message } = await callApi('AUTH_CHANGE_PASSWORD', {
        payload: {
          currentPassword: values.currentPassword,
          password: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
      });
      if (error || !data) {
        toast.error(message || 'Failed to change password.');
        return false;
      }
      if (data.user) setUser(data.user as ClientAdmin);
      toast.success('Password changed.');
      resetPasswordForm();
      return true;
    },
  });

  return (
    <div className="mx-auto max-w-3xl w-full">
      <DashboardPageWrapper
        header={{
          title: 'My profile',
          description: 'Update your admin account details and password.',
        }}>
        {initialLoadError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4 mb-6">
            <span>{initialLoadError}</span>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => router.refresh()}>
              Retry
            </Button>
          </div>
        )}

        {!initialUser ? (
          <Card className="p-6 md:p-8 space-y-4 text-center">
            <p className="text-muted-foreground">
              We couldn&apos;t load your profile. Try again or sign back in.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => router.refresh()}>
                Retry
              </Button>
              <Button onClick={() => router.push('/admin/auth/login')}>Go to login</Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Personal information</CardTitle>
                </div>
                <CardDescription>
                  These details appear in the admin console and session.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <RegularInput
                        id="firstName"
                        name="firstName"
                        value={profileValues.firstName}
                        onChange={handleProfileInputChange}
                        required
                        errors={profileErrorsVisible ? (profileErrors.firstName ?? []) : []}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <RegularInput
                        id="lastName"
                        name="lastName"
                        value={profileValues.lastName}
                        onChange={handleProfileInputChange}
                        required
                        errors={profileErrorsVisible ? (profileErrors.lastName ?? []) : []}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <RegularInput
                      id="email"
                      type="email"
                      name="email"
                      value={profileValues.email}
                      onChange={handleProfileInputChange}
                      required
                      errors={profileErrorsVisible ? (profileErrors.email ?? []) : []}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL (optional)</Label>
                    <RegularInput
                      id="avatar"
                      name="avatar"
                      value={profileValues.avatar ?? ''}
                      onChange={handleProfileInputChange}
                      errors={profileErrorsVisible ? (profileErrors.avatar ?? []) : []}
                    />
                  </div>
                  <RegularBtn
                    type="submit"
                    variant="default"
                    className="bg-primary hover:bg-primary/90"
                    disabled={savingProfile || !isProfileValid}
                    loading={savingProfile}
                    onDisabledClick={() => {
                      if (!isProfileValid) {
                        _validateProfileForm();
                      } else if (savingProfile) {
                        toast.info('Please wait, saving profile…');
                      }
                    }}>
                    {savingProfile ? 'Saving…' : 'Save profile'}
                  </RegularBtn>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Security</CardTitle>
                </div>
                <CardDescription>
                  Use a strong password that you do not reuse elsewhere.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <RegularInput
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordValues.currentPassword}
                      onChange={handlePasswordInputChange}
                      required
                      errors={passwordErrorsVisible ? (passwordErrors.currentPassword ?? []) : []}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <RegularInput
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordValues.newPassword}
                        onChange={handlePasswordInputChange}
                        required
                        errors={passwordErrorsVisible ? (passwordErrors.newPassword ?? []) : []}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm new password</Label>
                      <RegularInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordValues.confirmPassword}
                        onChange={handlePasswordInputChange}
                        required
                        errors={passwordErrorsVisible ? (passwordErrors.confirmPassword ?? []) : []}
                      />
                    </div>
                  </div>
                  <RegularBtn
                    type="submit"
                    variant="outline"
                    className="min-w-[160px]"
                    disabled={savingPassword || !isPasswordValid}
                    loading={savingPassword}
                    onDisabledClick={() => {
                      if (!isPasswordValid) {
                        _validatePasswordForm();
                      } else if (savingPassword) {
                        toast.info('Please wait, changing password…');
                      }
                    }}>
                    {savingPassword ? 'Changing…' : 'Change password'}
                  </RegularBtn>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </DashboardPageWrapper>
    </div>
  );
}
