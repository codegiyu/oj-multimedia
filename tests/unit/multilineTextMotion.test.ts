import { describe, expect, it } from 'vitest';
import {
  multilineHeadingItem,
  multilineParagraphItem,
  multilineParagraphStaggerContainer,
  multilineTextInView,
} from '@/lib/constants/multilineTextMotion';

describe('multilineTextMotion', () => {
  it('exports stagger container with staggerChildren', () => {
    expect(multilineParagraphStaggerContainer.visible.transition.staggerChildren).toBe(0.08);
  });

  it('exports paragraph and heading item visible states', () => {
    expect(multilineParagraphItem.visible).toMatchObject({ opacity: 1, y: 0 });
    expect(multilineHeadingItem.visible).toMatchObject({ opacity: 1, y: 0 });
  });

  it('uses once viewport for editorial scroll-in', () => {
    expect(multilineTextInView.once).toBe(true);
  });
});
