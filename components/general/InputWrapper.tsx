'use client';

import { cn } from '@/lib/utils';
import {
  ComponentPropsWithRef,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useId,
} from 'react';

const InputFieldIdContext = createContext<string | undefined>(undefined);

export type InputFieldA11yState = {
  fieldId: string;
  errorId: string;
  hasError: boolean;
  describedBy: string | undefined;
};

const InputFieldA11yContext = createContext<InputFieldA11yState | undefined>(undefined);

export function useInputFieldId(): string | undefined {
  return useContext(InputFieldIdContext);
}

export function useInputFieldA11y(): InputFieldA11yState | undefined {
  return useContext(InputFieldA11yContext);
}

export type InputWrapperProps = PropsWithChildren<{
  wrapClassName?: string;
  label?: string;
  subtext?: ReactNode;
  labelTextClassName?: string;
  required?: boolean;
  errors?: string[];
  fieldId?: string;
  otherLabelProps?: Omit<ComponentPropsWithRef<'label'>, 'className' | 'htmlFor'>;
}>;

export const InputWrapper = ({
  children,
  wrapClassName,
  label,
  subtext,
  labelTextClassName,
  otherLabelProps,
  required,
  errors = [],
  fieldId: fieldIdProp,
}: InputWrapperProps) => {
  const generatedId = useId();
  const fieldId = fieldIdProp ?? generatedId;
  const errorId = `${fieldId}-error`;
  const hasError = errors.length > 0;

  const a11yState: InputFieldA11yState = {
    fieldId,
    errorId,
    hasError,
    describedBy: hasError ? errorId : undefined,
  };

  return (
    <div className={cn(`w-full`, wrapClassName)}>
      {(label || subtext) && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          {label ? (
            <label
              htmlFor={fieldId}
              className={cn(
                'text-[0.75rem] leading-[1.2] font-medium text-foreground font-poppins',
                labelTextClassName
              )}
              {...otherLabelProps}>
              {label}
              {required ? ' *' : ''}
            </label>
          ) : null}
          {subtext ? <div className="text-xs font-medium text-primary">{subtext}</div> : null}
        </div>
      )}
      <InputFieldIdContext.Provider value={fieldId}>
        <InputFieldA11yContext.Provider value={a11yState}>
          <div className="relative w-full">{children}</div>
        </InputFieldA11yContext.Provider>
      </InputFieldIdContext.Provider>
      {hasError && (
        <p id={errorId} role="alert" className={cn('text-xs md:text-sm text-red-500 mt-1')}>
          {errors[0]}
        </p>
      )}
    </div>
  );
};
