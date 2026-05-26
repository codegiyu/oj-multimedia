import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DynamicIcon } from '@/components/general/DynamicIcon';
import { isSubPageLucideIconName } from '@/lib/lucide/subpage-icon-registry';

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

function render(ui: ReactElement) {
  act(() => {
    root.render(ui);
  });
}

describe('DynamicIcon', () => {
  it('renders a curated icon by name', () => {
    render(<DynamicIcon name="Star" props={{ className: 'test-star' }} />);

    const svg = container.querySelector('svg.test-star');
    expect(svg).toBeTruthy();
  });

  it('treats SubPageHero extras as curated names', () => {
    expect(isSubPageLucideIconName('DiscAlbum')).toBe(true);
    expect(isSubPageLucideIconName('Flame')).toBe(true);
    expect(isSubPageLucideIconName('HandHeart')).toBe(true);
  });

  it('rejects unknown icon names at the type guard', () => {
    expect(isSubPageLucideIconName('NotARealLucideIcon')).toBe(false);
  });
});
