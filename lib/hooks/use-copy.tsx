'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { toast } from '@/components/atoms/Toast';
import { cn } from '@/lib/utils';

export interface UseCopyOptions {
  /**
   * The text to copy to clipboard
   */
  text: string;
  /**
   * Optional title for share dialog
   */
  shareTitle?: string;
  /**
   * Optional text for share dialog
   */
  shareText?: string;
  /**
   * Success message title (default: 'Link Copied!')
   */
  successTitle?: string;
  /**
   * Success message description (default: 'Copied to clipboard.')
   */
  successDescription?: string;
  /**
   * Duration in milliseconds before clearing success state (default: 5000)
   */
  successDuration?: number;
  /**
   * Whether to use Web Share API if available (default: true)
   */
  useShareAPI?: boolean;
}

export interface UseCopyReturn {
  /**
   * Whether the copy was successful
   */
  isCopied: boolean;
  /**
   * Function to copy the text
   */
  copy: () => Promise<void>;
  /**
   * Function to copy with custom options
   */
  copyWithOptions: (options: Partial<UseCopyOptions>) => Promise<void>;
}

/**
 * Hook for copying text to clipboard with Web Share API fallback
 */
export function useCopy(options: UseCopyOptions): UseCopyReturn {
  const {
    text,
    shareTitle,
    shareText,
    successTitle = 'Link Copied!',
    successDescription = 'Copied to clipboard.',
    successDuration = 5000,
    useShareAPI = true,
  } = options;

  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    // Get current URL if text is empty (for SSR cases)
    const textToCopy = text || (typeof window !== 'undefined' ? window.location.href : '');

    if (!textToCopy) {
      return;
    }

    try {
      // Try Web Share API first if available and enabled
      if (useShareAPI && typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: shareTitle || '',
          text: shareText || textToCopy,
          url: textToCopy,
        });
        toast({
          title: 'Shared!',
          description: successDescription.replace('Copied to clipboard', 'Shared successfully'),
          variant: 'success',
        });
        setIsCopied(true);
      } else {
        // Fallback to clipboard API
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: successTitle,
          description: successDescription,
          variant: 'success',
        });
        setIsCopied(true);
      }
    } catch (error) {
      // User cancelled share or error occurred
      if (error instanceof Error && error.name !== 'AbortError') {
        // Try fallback to clipboard if share failed
        try {
          await navigator.clipboard.writeText(textToCopy);
          toast({
            title: successTitle,
            description: successDescription,
            variant: 'success',
          });
          setIsCopied(true);
        } catch {
          void 0;
        }
      }
    }
  };

  const copyWithOptions = async (overrideOptions: Partial<UseCopyOptions>) => {
    const mergedOptions = { ...options, ...overrideOptions };
    const {
      text: overrideText,
      shareTitle: overrideShareTitle,
      shareText: overrideShareText,
      successTitle: overrideSuccessTitle = successTitle,
      successDescription: overrideSuccessDescription = successDescription,
      useShareAPI: overrideUseShareAPI = useShareAPI,
    } = mergedOptions;

    try {
      if (overrideUseShareAPI && typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: overrideShareTitle || '',
          text: overrideShareText || overrideText,
          url: overrideText,
        });
        toast({
          title: 'Shared!',
          description: overrideSuccessDescription.replace(
            'Copied to clipboard',
            'Shared successfully'
          ),
          variant: 'success',
        });
        setIsCopied(true);
      } else {
        await navigator.clipboard.writeText(overrideText);
        toast({
          title: overrideSuccessTitle,
          description: overrideSuccessDescription,
          variant: 'success',
        });
        setIsCopied(true);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(overrideText);
          toast({
            title: overrideSuccessTitle,
            description: overrideSuccessDescription,
            variant: 'success',
          });
          setIsCopied(true);
        } catch {
          void 0;
        }
      }
    }
  };

  // Clear success state after duration
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, successDuration);

      return () => clearTimeout(timer);
    }
  }, [isCopied, successDuration]);

  return { isCopied, copy, copyWithOptions };
}

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  /**
   * The text to copy
   */
  text: string;
  /**
   * Optional title for share dialog
   */
  shareTitle?: string;
  /**
   * Optional text for share dialog
   */
  shareText?: string;
  /**
   * Success message title
   */
  successTitle?: string;
  /**
   * Success message description
   */
  successDescription?: string;
  /**
   * Duration in milliseconds before clearing success state
   */
  successDuration?: number;
  /**
   * Whether to use Web Share API if available
   */
  useShareAPI?: boolean;
  /**
   * Button display type: 'text' | 'icon' | 'text-icon'
   */
  displayType?: 'text' | 'icon' | 'text-icon';
  /**
   * Custom icon component (default: Copy or Check when copied)
   */
  icon?: React.ComponentType<{ className?: string }>;
  /**
   * Custom text to display (default: 'Copy' or 'Copied!')
   */
  buttonText?: string;
  /**
   * Custom text to display when copied (default: 'Copied!')
   */
  copiedText?: string;
}

/**
 * Copy button component with multiple variants
 */
export function CopyButton({
  text,
  shareTitle,
  shareText,
  successTitle,
  successDescription,
  successDuration,
  useShareAPI,
  displayType = 'text-icon',
  icon: Icon,
  buttonText = 'Copy',
  copiedText = 'Copied!',
  className,
  children,
  ...buttonProps
}: CopyButtonProps) {
  const { isCopied, copy } = useCopy({
    text,
    shareTitle,
    shareText,
    successTitle,
    successDescription,
    successDuration,
    useShareAPI,
  });

  const DisplayIcon = Icon || (isCopied ? Check : Copy);
  const displayText = isCopied ? copiedText : buttonText;

  if (displayType === 'icon') {
    return (
      <Button onClick={copy} className={cn(className)} aria-label={displayText} {...buttonProps}>
        <DisplayIcon className="w-4 h-4" />
      </Button>
    );
  }

  if (displayType === 'text') {
    return (
      <Button onClick={copy} className={cn(className)} {...buttonProps}>
        {children || displayText}
      </Button>
    );
  }

  // text-icon variant (default)
  return (
    <Button onClick={copy} className={cn(className)} {...buttonProps}>
      <DisplayIcon className="w-4 h-4" />
      {children || displayText}
    </Button>
  );
}

/**
 * Share button component (alias for CopyButton with Share2 icon)
 */
export function ShareButton({
  icon: Icon = Share2,
  buttonText = 'Share',
  copiedText = 'Shared!',
  ...props
}: CopyButtonProps) {
  return (
    <CopyButton
      {...props}
      icon={Icon}
      buttonText={buttonText}
      copiedText={copiedText}
      useShareAPI={true}
    />
  );
}
