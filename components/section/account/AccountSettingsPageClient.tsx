/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { z } from 'zod';
import { DashboardFormCard, DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { Label } from '@/components/ui/label';
import { User, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from '@/lib/hooks/use-form';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { callApi } from '@/lib/services/callApi';
import type { PopulatedUser } from '@/lib/constants/endpoints';
import { ImageUploadField } from '@/components/general/MediaUploadField';
import { base64UrlEncode } from '@/lib/services/storage';

const optionalStoredImageUrl = z
  .string()
  .optional()
  .refine(v => v == null || v === '' || /^https?:\/\/.+/i.test(v), 'Must be a valid image URL');

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email'),
  phoneNumber: z.string().optional(),
  avatar: optionalStoredImageUrl,
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

export interface AccountSettingsPageClientProps {
  initialUser: PopulatedUser | null;
  initialLoadError: string | null;
}

export function AccountSettingsPageClient({
  initialUser,
  initialLoadError,
}: AccountSettingsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAuthStore(state => state.actions.setUser);

  const profileDefaults = {
    firstName: initialUser?.firstName ?? '',
    lastName: initialUser?.lastName ?? '',
    email: initialUser?.email ?? '',
    phoneNumber: initialUser?.phoneNumber ?? '',
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
      const { data, error, message } = await callApi('USER_UPDATE_ME', {
        payload: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email || undefined,
          phoneNumber: values.phoneNumber || undefined,
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
      phoneNumber: initialUser.phoneNumber ?? prev.phoneNumber,
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
      if (data.user) setUser(data.user);
      toast.success('Password changed.');
      resetPasswordForm();
      return true;
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <DashboardPageHeader
        title="Account settings"
        description="Manage your profile and preferences"
      />

      {initialLoadError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
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
            We need your account details before you can edit settings.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={() => router.refresh()}>
              Retry
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `/auth/login?redirectTo=${encodeURIComponent(base64UrlEncode(pathname))}`
                )
              }>
              Go to login
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <DashboardFormCard
            title="Personal information"
            description="These details are used across your account and orders."
            icon={User}>
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
                <Label htmlFor="phoneNumber">Phone number</Label>
                <RegularInput
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={profileValues.phoneNumber ?? ''}
                  onChange={handleProfileInputChange}
                />
              </div>
              <ImageUploadField
                label="Profile photo"
                helperText="Upload a profile picture (optional)."
                entityType="user"
                entityId={initialUser._id}
                intent="avatar"
                value={profileValues.avatar ?? ''}
                onChange={url =>
                  setProfileFormValues(prev => ({
                    ...prev,
                    avatar: url,
                  }))
                }
              />
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
          </DashboardFormCard>

          <DashboardFormCard
            title="Security"
            description="Use a strong password that you do not reuse elsewhere."
            icon={Lock}>
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
          </DashboardFormCard>
        </div>
      )}
    </div>
  );
}
