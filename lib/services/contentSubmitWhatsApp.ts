import type { WhatsAppMessagePayload } from '@/lib/services/whatsappMessaging.service';

export type ContentSubmitVariant = 'music' | 'video' | 'beats' | 'general';

export interface ContentSubmitWhatsAppConfig {
  payload: WhatsAppMessagePayload;
  modalTitle: string;
  modalDescription: string;
  summaryLines: { label?: string; value: string; emphasis?: boolean }[];
}

const CONFIG: Record<ContentSubmitVariant, ContentSubmitWhatsAppConfig> = {
  music: {
    payload: { type: 'artist_music_submit' },
    modalTitle: 'Submit music for publishing',
    modalDescription:
      'Review the summary below, then continue on WhatsApp to send a pre-filled message to our team.',
    summaryLines: [
      { value: 'Music submission', emphasis: true },
      {
        label: 'What to include',
        value: 'Track files, cover art, title, artist name, and any release notes.',
      },
    ],
  },
  video: {
    payload: { type: 'artist_video_submit' },
    modalTitle: 'Submit video for publishing',
    modalDescription:
      'Review the summary below, then continue on WhatsApp to send a pre-filled message to our team.',
    summaryLines: [
      { value: 'Video submission', emphasis: true },
      {
        label: 'What to include',
        value: 'Video file, thumbnail, title, description, and category if known.',
      },
    ],
  },
  beats: {
    payload: { type: 'artist_beats_submit' },
    modalTitle: 'Submit beats for publishing',
    modalDescription:
      'Review the summary below, then continue on WhatsApp to send a pre-filled message to our team.',
    summaryLines: [
      { value: 'Beats / instrumentals', emphasis: true },
      {
        label: 'What to include',
        value: 'Audio files, artwork, tempo/key, and licensing notes if applicable.',
      },
    ],
  },
  general: {
    payload: { type: 'artist_content_submit' },
    modalTitle: 'Submit content for publishing',
    modalDescription:
      'Review the summary below, then continue on WhatsApp to send a pre-filled message to our team.',
    summaryLines: [
      { value: 'Music or video submission', emphasis: true },
      {
        label: 'Next step',
        value: 'Our team will reply with upload and review instructions.',
      },
    ],
  },
};

export function getContentSubmitWhatsAppConfig(
  variant: ContentSubmitVariant
): ContentSubmitWhatsAppConfig {
  return CONFIG[variant];
}
