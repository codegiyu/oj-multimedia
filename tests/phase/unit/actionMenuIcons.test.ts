import { describe, expect, it } from 'vitest';
import { actionMenuIcons } from '@/lib/constants/actionMenuIcons';

describe('actionMenuIcons', () => {
  it('exports icons for admin row menu verbs', () => {
    expect(actionMenuIcons.edit).toBeDefined();
    expect(actionMenuIcons.delete).toBeDefined();
    expect(actionMenuIcons.approve).toBeDefined();
    expect(actionMenuIcons.reject).toBeDefined();
    expect(actionMenuIcons.suspend).toBeDefined();
    expect(actionMenuIcons.linkArtist).toBeDefined();
    expect(actionMenuIcons.unlinkPastor).toBeDefined();
    expect(actionMenuIcons.viewDetails).toBeDefined();
  });
});
