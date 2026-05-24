import { act, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { useForm } from '@/lib/hooks/use-form';

const testSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

type TestFormValues = z.infer<typeof testSchema>;
type TestFormApi = ReturnType<typeof useForm<typeof testSchema>>;

function FormHarness({
  onSubmit,
  apiRef,
}: {
  onSubmit: (values: TestFormValues) => Promise<boolean>;
  apiRef: { current: TestFormApi | null };
}) {
  const form = useForm({
    formSchema: testSchema,
    defaultFormValues: { name: '', email: '' },
    onSubmit,
    noFocusOnFirstField: true,
  });

  useEffect(() => {
    apiRef.current = form;

    return () => {
      apiRef.current = null;
    };
  }, [apiRef, form]);

  return null;
}

describe('useForm handleSubmit', () => {
  let container: HTMLDivElement;
  let root: Root;
  let formApiRef: { current: TestFormApi | null };

  beforeEach(() => {
    formApiRef = { current: null };
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const renderHarness = (onSubmit: (values: TestFormValues) => Promise<boolean>) => {
    act(() => {
      root.render(<FormHarness onSubmit={onSubmit} apiRef={formApiRef} />);
    });
  };

  const formApi = () => {
    if (!formApiRef.current) {
      throw new Error('Form harness did not mount');
    }

    return formApiRef.current;
  };

  it('shows field errors after invalid submit', async () => {
    renderHarness(vi.fn().mockResolvedValue(true));

    await act(async () => {
      await formApi().handleSubmit();
    });

    expect(formApi().errorsVisible).toBe(true);
    expect(formApi().formErrors.name).toContain('Name is required');
    expect(formApi().formErrors.email).toContain('Email is required');
  });

  it('hides field errors after successful submit when errors were visible', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    renderHarness(onSubmit);

    await act(async () => {
      await formApi().handleSubmit();
    });

    expect(formApi().errorsVisible).toBe(true);

    await act(async () => {
      formApi().onChange('name', 'Jane Doe');
      formApi().onChange('email', 'jane@example.com');
    });

    await act(async () => {
      await formApi().handleSubmit();
    });

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(formApi().errorsVisible).toBe(false);
    expect(formApi().formErrors.name).toEqual([]);
    expect(formApi().formErrors.email).toEqual([]);
  });

  it('keeps errors visible after failed submit callback', async () => {
    renderHarness(vi.fn().mockResolvedValue(false));

    await act(async () => {
      formApi().onChange('name', 'Jane Doe');
      formApi().onChange('email', 'jane@example.com');
    });

    await act(async () => {
      await formApi().handleSubmit();
    });

    expect(formApi().errorsVisible).toBe(true);
  });

  it('resetForm clears values and hides errors', async () => {
    renderHarness(vi.fn().mockResolvedValue(true));

    await act(async () => {
      await formApi().handleSubmit();
    });

    await act(async () => {
      formApi().onChange('name', 'Jane Doe');
      formApi().resetForm();
    });

    expect(formApi().formValues.name).toBe('');
    expect(formApi().errorsVisible).toBe(false);
    expect(formApi().formErrors.name).toEqual([]);
  });
});
