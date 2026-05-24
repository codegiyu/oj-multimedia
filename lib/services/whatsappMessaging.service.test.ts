import { describe, expect, it } from 'vitest';
import {
  buildWhatsAppHref,
  buildWhatsAppMessage,
  type AlbumRequestWhatsAppContext,
} from './whatsappMessaging.service';

describe('whatsappMessaging.service', () => {
  describe('paid_download', () => {
    it('formats purchase request with price and page', () => {
      const message = buildWhatsAppMessage({
        type: 'paid_download',
        data: {
          contentType: 'music',
          title: 'Amazing Grace',
          creatorName: 'Jane Artist',
          price: 500,
          pageUrl: 'https://oj.example.com/music/amazing-grace',
        },
      });

      expect(message).toContain('Hello OJ Multimedia team');
      expect(message).toContain('*Title:* Amazing Grace');
      expect(message).toContain('*Creator / author:* Jane Artist');
      expect(message).toContain('*Page:* https://oj.example.com/music/amazing-grace');
      expect(message).toContain('payment');
    });
  });

  describe('album_request', () => {
    const base: AlbumRequestWhatsAppContext = {
      requestType: 'edit',
      artistName: 'Test Artist',
      albumTitle: 'Greatest Hits',
      albumId: '507f1f77bcf86cd799439011',
      albumPageUrl: 'https://oj.example.com/music/albums/greatest-hits',
    };

    it('includes request type and artist for create requests', () => {
      const message = buildWhatsAppMessage({
        type: 'album_request',
        data: { requestType: 'create', artistName: 'Test Artist' },
      });

      expect(message).toContain('Create a new album');
      expect(message).toContain('*Artist profile:* Test Artist');
      expect(message).not.toContain('*Album title:*');
    });

    it('includes album context for edit and delete requests', () => {
      const edit = buildWhatsAppMessage({ type: 'album_request', data: base });
      expect(edit).toContain('Edit an existing album');
      expect(edit).toContain('*Album title:* Greatest Hits');
      expect(edit).toContain('*Album page:*');

      const del = buildWhatsAppMessage({
        type: 'album_request',
        data: { ...base, requestType: 'delete' },
      });
      expect(del).toContain('Delete an album');
    });
  });

  describe('artist_content_submit', () => {
    it('asks about publishing steps', () => {
      const message = buildWhatsAppMessage({ type: 'artist_content_submit' });

      expect(message).toContain('submit music or video');
      expect(message).toContain('next steps');
    });
  });

  describe('promotion_plan', () => {
    it('formats selected plan details', () => {
      const message = buildWhatsAppMessage({
        type: 'promotion_plan',
        data: {
          plan: {
            title: 'Featured Song',
            price: '₦8,000',
            description: 'Homepage banner placement',
            features: ['Homepage banner', 'Priority listing'],
          },
        },
      });

      expect(message).toContain('*Package:* Featured Song');
      expect(message).toContain('*Price:* ₦8,000');
      expect(message).toContain('- Homepage banner');
    });

    it('uses custom inquiry intro', () => {
      const message = buildWhatsAppMessage({
        type: 'promotion_plan',
        data: {
          inquiry: 'custom',
          plan: {
            title: 'Custom',
            price: 'TBD',
            description: 'Tailored package',
            features: [],
          },
        },
      });

      expect(message).toContain('custom song promotion package');
    });
  });

  describe('featured_plan', () => {
    it('formats featured placement with duration', () => {
      const message = buildWhatsAppMessage({
        type: 'featured_plan',
        data: {
          plan: {
            title: 'Homepage Slider Banner',
            duration: '1 Week',
            price: '₦10,000',
            description: 'Maximum visibility',
            features: ['Homepage banner placement'],
          },
        },
      });

      expect(message).toContain('*Placement:* Homepage Slider Banner');
      expect(message).toContain('*Duration:* 1 Week');
    });

    it('uses packages inquiry intro', () => {
      const message = buildWhatsAppMessage({
        type: 'featured_plan',
        data: {
          inquiry: 'packages',
          plan: {
            title: 'Combo',
            duration: 'Flexible',
            price: 'TBD',
            description: 'Multiple placements',
            features: [],
          },
        },
      });

      expect(message).toContain('featured placement package');
    });
  });

  describe('buildWhatsAppHref', () => {
    it('returns null when number is missing', () => {
      expect(buildWhatsAppHref(undefined, { type: 'artist_content_submit' })).toBeNull();
    });

    it('builds wa.me link with encoded message', () => {
      const href = buildWhatsAppHref('+234 913 667 0466', {
        type: 'artist_content_submit',
      });

      expect(href).toMatch(/^https:\/\/wa\.me\/2349136670466\?text=/);
      expect(decodeURIComponent(href!.split('text=')[1]!)).toContain('submit music or video');
    });
  });
});
