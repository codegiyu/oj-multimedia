import { toast } from 'sonner';
import { toWhatsAppMeDigits } from '@/lib/utils/whatsappPhone';

export const VENDOR_NO_WHATSAPP_TOAST =
  'This vendor does not have a record of a WhatsApp number with us.';

export function hasVendorWhatsapp(value?: string | null): boolean {
  return toWhatsAppMeDigits(value) !== null;
}

export function notifyVendorWhatsappUnavailable(): void {
  toast.error(VENDOR_NO_WHATSAPP_TOAST);
}
