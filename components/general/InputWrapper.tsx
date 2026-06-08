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

export function useInputFieldId(): string | undefined {
  return useContext(InputFieldIdContext);
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
        <div className="relative w-full">{children}</div>
      </InputFieldIdContext.Provider>
      {errors.length > 0 && (
        <p className={cn('text-xs md:text-sm text-red-500 mt-1')}>{errors[0]}</p>
      )}
    </div>
  );
};
