import {
  Home,
  TrendingUp,
  Mail,
  Star,
  Music,
  Video,
  Megaphone,
  Phone,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import type { FeaturedOptionIconId, ContactMethodIconId } from '@/lib/types/promotion';

const FEATURED_ICON_MAP: Record<FeaturedOptionIconId, LucideIcon> = {
  home: Home,
  'trending-up': TrendingUp,
  mail: Mail,
  star: Star,
  music: Music,
  video: Video,
  megaphone: Megaphone,
};

const CONTACT_ICON_MAP: Record<ContactMethodIconId, LucideIcon> = {
  mail: Mail,
  phone: Phone,
  'message-square': MessageSquare,
  whatsapp: MessageSquare, // WhatsApp uses MessageSquare icon
};

export function getFeaturedIcon(iconId: FeaturedOptionIconId): LucideIcon {
  return FEATURED_ICON_MAP[iconId] ?? Star;
}

export function getContactIcon(iconId: ContactMethodIconId): LucideIcon {
  return CONTACT_ICON_MAP[iconId] ?? Mail;
}
