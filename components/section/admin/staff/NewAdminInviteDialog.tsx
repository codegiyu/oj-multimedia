'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { callApi } from '@/lib/services/callApi';
import { toast } from '@/components/atoms/Toast';
import { useForm } from '@/lib/hooks/use-form';

const inviteFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  roleSlug: z.enum(['admin', 'super-admin']),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

const defaultFormValues: InviteFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  roleSlug: 'admin',
};

export function NewAdminInviteDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);

  const {
    formValues,
    formErrors,
    loading,
    handleInputChange,
    handleSubmit,
    isValid,
    validateForm,
    errorsVisible,
    resetForm,
    onChange,
  } = useForm({
    formSchema: inviteFormSchema,
    defaultFormValues,
    onSubmit: async (values: InviteFormValues) => {
      const { data, error, message } = await callApi('ADMIN_STAFF_INVITE', {
        payload: {
          email: values.email.trim(),
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          roleSlug: values.roleSlug,
        },
      });

      if (error || !data) {
        toast({
          title: 'Invite failed',
          description: message || 'Could not send the admin invitation.',
          variant: 'error',
        });
        return false;
      }

      toast({
        title: 'Admin invited',
        description: 'Invitation email sent successfully.',
        variant: 'success',
      });
      resetForm();
      setOpen(false);
      onSuccess?.();
      return true;
    },
  });

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Invite admin
        </button>
      }
      header={{
        title: 'Invite admin',
        description: 'Send an invitation email so they can set a password and access the console.',
      }}
      submitButton={{
        text: loading ? 'Sending invite...' : 'Send invitation',
        disabled: loading || !isValid,
        loading,
        onClick: e => {
          e?.preventDefault();
          void handleSubmit();
        },
        onDisabledClick: validateForm,
      }}
      cancelButton={{
        text: 'Cancel',
        onClick: () => setOpen(false),
      }}
      maxWidth="md">
      <div className="grid gap-6 py-2">
        <RegularInput
          label="First name"
          name="firstName"
          value={formValues.firstName}
          onChange={handleInputChange}
          required
          disabled={loading}
          errors={errorsVisible ? (formErrors.firstName ?? []) : []}
        />
        <RegularInput
          label="Last name"
          name="lastName"
          value={formValues.lastName}
          onChange={handleInputChange}
          required
          disabled={loading}
          errors={errorsVisible ? (formErrors.lastName ?? []) : []}
        />
        <RegularInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={formValues.email}
          onChange={handleInputChange}
          required
          disabled={loading}
          errors={errorsVisible ? (formErrors.email ?? []) : []}
        />
        <RegularSelect
          label="Role"
          name="roleSlug"
          value={formValues.roleSlug}
          onSelectChange={v => onChange('roleSlug', v)}
          options={[
            { text: 'Admin', value: 'admin' },
            { text: 'Super admin', value: 'super-admin' },
          ]}
          disabled={loading}
          errors={errorsVisible ? (formErrors.roleSlug ?? []) : []}
        />
      </div>
    </Modal>
  );
}
