'use client';

import { cn } from '@/lib/utils';
import { Textarea, type TextareaProps } from '../ui/textarea';
import { FocusEvent } from 'react';
import { InputWrapper, useInputFieldId } from '../general/InputWrapper';

export interface RegularTextareaProps extends TextareaProps {
  label?: string;
  subtext?: React.ReactNode;
  labelClassName?: string;
  wrapClassName?: string;
  errors?: string[];
}

function RegularTextareaField({
  className,
  placeholder,
  ref,
  onFocus,
  onBlur,
  id,
  ...props
}: TextareaProps) {
  const fieldId = useInputFieldId();

  return (
    <Textarea
      id={id ?? fieldId}
      placeholder={placeholder}
      className={cn('', className)}
      ref={ref}
      {...props}
      onFocus={(e: FocusEvent<HTMLTextAreaElement>) => {
        if (onFocus) onFocus(e);
      }}
      onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
        if (onBlur) onBlur(e);
      }}
    />
  );
}

export const RegularTextarea = ({
  label,
  subtext,
  labelClassName,
  wrapClassName,
  required,
  errors = [],
  ...fieldProps
}: RegularTextareaProps) => {
  return (
    <InputWrapper
      wrapClassName={wrapClassName}
      label={label}
      subtext={subtext}
      labelTextClassName={labelClassName}
      required={required}
      errors={errors}
      fieldId={fieldProps.id}>
      <RegularTextareaField {...fieldProps} />
    </InputWrapper>
  );
};
