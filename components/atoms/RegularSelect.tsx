'use client';

import { type SelectOption } from '@/lib/types/general';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '@/lib/utils';
import { InputWrapper, useInputFieldA11y, useInputFieldId } from '../general/InputWrapper';
import { ComponentPropsWithRef, FocusEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  fromRadixSelectItemValue,
  resolveRadixSelectItemValue,
  toRadixSelectItemValue,
} from '@/lib/utils/radixSelectValues';

const LOAD_MORE_SENTINEL_VALUE = '__load_more__';
/** Radix SelectItem rejects `value=""`; map optional / placeholder options through this sentinel. */
const EMPTY_OPTION_SENTINEL = '__oj_select_empty__';

export interface RegularSelectProps extends Omit<ComponentPropsWithRef<'div'>, 'className'> {
  label?: string;
  subtext?: React.ReactNode;
  /** When true, the default "Clear" subtext button is not shown. Ignored if subtext is passed. */
  hideClearSubtext?: boolean;
  labelClassName?: string;
  value: string;
  name?: string;
  placeholder?: string;
  className?: string;
  onSelectChange: (value: string) => void;
  optionsTitle?: string;
  options: SelectOption[];
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  wrapClassName?: string;
  triggerClassName?: string;
  valueClassName?: string;
  hideCaretIfDisabled?: boolean;
  errors?: string[];
  /** Optional class for the dropdown content (e.g. max-h-60 for scrollable list). */
  contentClassName?: string;
  /** When true, a "load more" sentinel is shown and onLoadMore is used for infinite scroll. */
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

type RegularSelectControlProps = Omit<
  RegularSelectProps,
  | 'label'
  | 'subtext'
  | 'hideClearSubtext'
  | 'labelClassName'
  | 'wrapClassName'
  | 'errors'
  | 'required'
>;

function RegularSelectControl({
  value,
  name,
  placeholder = '',
  className = '',
  onSelectChange,
  optionsTitle,
  options,
  disabled = false,
  loading = false,
  triggerClassName = '',
  valueClassName = '',
  hideCaretIfDisabled,
  onFocus,
  onBlur,
  contentClassName = '',
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  ...props
}: RegularSelectControlProps) {
  const fieldId = useInputFieldId();
  const a11y = useInputFieldA11y();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!hasMore || !onLoadMore || loadingMore || !isDropdownOpen) {
      observerRef.current?.disconnect();
      observerRef.current = null;
      return;
    }
    const id = setTimeout(() => {
      const el = sentinelRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0]?.isIntersecting) onLoadMore();
        },
        { root: null, rootMargin: '100px', threshold: 0 }
      );
      observer.observe(el);
      observerRef.current = observer;
    }, 0);
    return () => {
      clearTimeout(id);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [hasMore, loadingMore, options.length, isDropdownOpen, onLoadMore]);

  const { itemsForSelect, rootSelectValue } = useMemo(() => {
    const emptyOpts = options.filter(o => o.value === '');
    const rest = options.filter(o => o.value !== '' && o.value != null);
    const hasEmptyPlaceholder = emptyOpts.length > 0;
    const itemsForSelect: SelectOption[] = hasEmptyPlaceholder
      ? [{ ...emptyOpts[0], value: EMPTY_OPTION_SENTINEL }, ...rest]
      : rest;

    let rootSelectValue: string | undefined;
    if (value === '') {
      rootSelectValue = hasEmptyPlaceholder ? EMPTY_OPTION_SENTINEL : undefined;
    } else {
      rootSelectValue = resolveRadixSelectItemValue(itemsForSelect, value);
    }

    return { itemsForSelect, rootSelectValue };
  }, [options, value]);

  return (
    <SelectGroup
      onFocus={(e: FocusEvent<HTMLDivElement>) => {
        if (onFocus) onFocus(e);
      }}
      onBlur={(e: FocusEvent<HTMLDivElement>) => {
        if (onBlur) onBlur(e);
      }}
      className={cn('w-full flex items-center', className)}
      {...props}>
      <Select
        value={rootSelectValue}
        onValueChange={v => {
          if (!v || v === LOAD_MORE_SENTINEL_VALUE) return;
          if (v === EMPTY_OPTION_SENTINEL) {
            onSelectChange('');
            return;
          }
          onSelectChange(fromRadixSelectItemValue(v));
        }}
        onOpenChange={open => setIsDropdownOpen(open === true)}
        name={name}>
        <SelectTrigger
          id={fieldId}
          disabled={disabled || loading}
          hidecaretifdisabled={hideCaretIfDisabled}
          aria-invalid={a11y?.hasError ? true : undefined}
          aria-describedby={a11y?.describedBy}
          className={cn(``, triggerClassName)}>
          <SelectValue
            className={cn('', valueClassName)}
            placeholder={
              loading ? (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="block text-start text-muted-foreground">{placeholder}</span>
              )
            }
          />
        </SelectTrigger>
        <SelectContent
          side="bottom"
          position="popper"
          className={cn(
            'bg-background rounded-[6px] border p-2 shadow-md outline-hidden overflow-y-auto',
            contentClassName
          )}>
          {optionsTitle && (
            <SelectLabel className="py-1 px-3 text-sm font-medium text-muted-foreground">
              {optionsTitle}
            </SelectLabel>
          )}
          {loading ? (
            <SelectItem
              value="__loading__"
              disabled
              className="overflow-hidden cursor-default opacity-70">
              <div className="flex w-full items-center gap-2 overflow-hidden">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground text-sm truncate">Loading options...</span>
              </div>
            </SelectItem>
          ) : itemsForSelect.length === 0 ? (
            <SelectItem
              value="__no_options__"
              disabled
              className="overflow-hidden cursor-default opacity-70">
              <div className="flex w-full items-center gap-3 overflow-hidden">
                <span className="text-muted-foreground text-sm truncate">No options available</span>
              </div>
            </SelectItem>
          ) : (
            <>
              {itemsForSelect.map(
                ({ text, altText, value: optValue, disabled: optDisabled = false }, idx) => {
                  const radixValue =
                    String(optValue) === EMPTY_OPTION_SENTINEL
                      ? EMPTY_OPTION_SENTINEL
                      : toRadixSelectItemValue(String(optValue), idx);

                  return (
                    <SelectItem
                      key={radixValue}
                      value={radixValue}
                      disabled={optDisabled}
                      className="overflow-hidden">
                      <div className="flex w-full items-center gap-3 overflow-hidden">
                        <span className={cn('text-foreground truncate', valueClassName)}>
                          {altText || text}
                        </span>
                      </div>
                    </SelectItem>
                  );
                }
              )}
              {hasMore && (
                <SelectItem
                  value={LOAD_MORE_SENTINEL_VALUE}
                  disabled
                  className="overflow-hidden cursor-default opacity-70 [&_button]:pointer-events-auto">
                  <div
                    ref={sentinelRef}
                    className="flex w-full items-center justify-center gap-2 overflow-hidden py-1">
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">Loading more...</span>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          onLoadMore?.();
                        }}
                        className="text-muted-foreground text-sm hover:text-foreground hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded">
                        Load more
                      </button>
                    )}
                  </div>
                </SelectItem>
              )}
            </>
          )}
        </SelectContent>
      </Select>
    </SelectGroup>
  );
}

export const RegularSelect = ({
  label = '',
  subtext,
  hideClearSubtext = false,
  labelClassName = '',
  wrapClassName = '',
  required,
  errors = [],
  ...controlProps
}: RegularSelectProps) => {
  const defaultClearSubtext =
    !hideClearSubtext && controlProps.value !== '' ? (
      <button
        type="button"
        onClick={e => {
          e.preventDefault();
          controlProps.onSelectChange('');
        }}
        className="text-xs font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
        Clear
      </button>
    ) : null;
  const effectiveSubtext = subtext !== undefined ? subtext : defaultClearSubtext;

  return (
    <InputWrapper
      wrapClassName={wrapClassName}
      label={label}
      subtext={effectiveSubtext}
      labelTextClassName={labelClassName}
      required={required}
      errors={errors}>
      <RegularSelectControl {...controlProps} />
    </InputWrapper>
  );
};
