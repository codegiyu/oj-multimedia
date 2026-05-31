import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Users } from 'lucide-react';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';

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

describe('SectionEmptyState', () => {
  it('renders title, description, and sized section icon', () => {
    render(
      <SectionEmptyState
        title="No featured artists yet"
        description="Artists will appear here when they join."
        icon={Users}
        actionLabel="Discover artists"
        actionHref="/community/artists"
      />
    );

    expect(container.querySelector('h3')?.textContent).toBe('No featured artists yet');
    expect(container.textContent).toContain('Artists will appear here when they join.');
    expect(container.querySelector('.lucide-users')).not.toBeNull();
    expect(container.querySelector('.lucide-users')?.classList.contains('w-12')).toBe(true);
  });

  it('omits category fallback actions by default', () => {
    render(<SectionEmptyState title="Nothing here" description="Check back soon." icon={Users} />);

    expect(container.textContent).not.toContain('View all categories');
  });

  it('can enable category fallback actions for filter contexts', () => {
    render(
      <SectionEmptyState
        title="No stories"
        description="Try another category."
        icon={Users}
        showDefaultActions
      />
    );

    expect(container.textContent).toContain('View all categories');
  });
});
