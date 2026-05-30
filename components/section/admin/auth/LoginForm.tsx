'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { LogIn } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    actions: { login },
  } = useAuthStore(state => state);

  const { settings, ensureSettingsLoaded } = useSiteSettingsStore(state => ({
    settings: state.settings,
    ensureSettingsLoaded: state.actions.ensureSettingsLoaded,
  }));

  useEffect(() => {
    void ensureSettingsLoaded(['features']);
  }, [ensureSettingsLoaded]);

  const loginEnabled = settings?.features?.loginEnabled ?? true;

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    isValid,
    validateForm,
  } = useForm<typeof loginSchema>({
    formSchema: loginSchema,
    defaultFormValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values: LoginFormValues) => {
      const result = await login(values.email, values.password);

      if (result.success) {
        return true;
      } else {
        setFormErrors({ root: [result.error || 'Login failed'] });
        return false;
      }
    },
  });

  if (!loginEnabled) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          Sign-in is currently disabled. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          {formErrors.root[0]}
        </div>
      )}

      <div className="grid gap-6">
        <RegularInput
          label="Email or Username"
          name="email"
          type="text"
          autoComplete="username"
          required
          placeholder="Enter your email or username"
          value={formValues.email}
          onChange={handleInputChange}
          errors={errorsVisible ? (formErrors.email ?? []) : []}
          disabled={loading}
        />

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          value={formValues.password}
          onChange={handleInputChange}
          errors={errorsVisible ? (formErrors.password ?? []) : []}
          disabled={loading}
          subtext={
            <Link
              href="/admin/auth/request-password-reset"
              className="text-xs text-primary hover:underline disabled:text-muted-foreground">
              Forgot password?
            </Link>
          }
        />
      </div>

      <div className="space-y-2 mt-8">
        <RegularBtn
          type="submit"
          text={loading ? 'Signing in...' : 'Sign in'}
          className="w-full"
          disabled={loading || !isValid}
          loading={loading}
          onDisabledClick={validateForm}
          LeftIcon={LogIn}
          leftIconProps={{ className: 'h-5 w-5' }}
          size="full"
        />
      </div>
    </form>
  );
};
