'use client';

import { useState, type ReactElement, cloneElement, isValidElement } from 'react';
import { CompanyWhatsAppModal } from '@/components/section/shared/CompanyWhatsAppModal';
import {
  getContentSubmitWhatsAppConfig,
  type ContentSubmitVariant,
} from '@/lib/services/contentSubmitWhatsApp';

export interface ContentSubmitWhatsAppTriggerProps {
  variant: ContentSubmitVariant;
  children: ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
}

export function ContentSubmitWhatsAppTrigger({
  variant,
  children,
}: ContentSubmitWhatsAppTriggerProps) {
  const [open, setOpen] = useState(false);
  const config = getContentSubmitWhatsAppConfig(variant);

  const child = isValidElement(children)
    ? cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
          children.props.onClick?.(e);
          if (!e.defaultPrevented) {
            setOpen(true);
          }
        },
      })
    : children;

  return (
    <>
      {child}
      <CompanyWhatsAppModal
        open={open}
        onOpenChange={setOpen}
        title={config.modalTitle}
        description={config.modalDescription}
        messagePayload={config.payload}
        summaryLines={config.summaryLines}
      />
    </>
  );
}

export function useContentSubmitWhatsApp(variant: ContentSubmitVariant) {
  const [open, setOpen] = useState(false);
  const config = getContentSubmitWhatsAppConfig(variant);

  const modal = (
    <CompanyWhatsAppModal
      open={open}
      onOpenChange={setOpen}
      title={config.modalTitle}
      description={config.modalDescription}
      messagePayload={config.payload}
      summaryLines={config.summaryLines}
    />
  );

  return { openSubmitModal: () => setOpen(true), modal };
}
