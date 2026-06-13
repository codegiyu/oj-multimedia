import { toast } from 'sonner';

export const VENDOR_NO_WHATSAPP_TOAST =
  'This vendor does not have a record of a WhatsApp number with us.';

export function hasVendorWhatsapp(value?: string | null): boolean {
  if (!value?.trim()) return false;

  return value.replace(/\D/g, '').length > 0;
}

export function notifyVendorWhatsappUnavailable(): void {
  toast.error(VENDOR_NO_WHATSAPP_TOAST);
}
