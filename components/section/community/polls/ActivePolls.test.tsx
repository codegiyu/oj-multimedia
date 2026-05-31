import { act, type ComponentProps, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivePolls } from '@/components/section/community/polls/ActivePolls';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: ComponentProps<'div'>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: ComponentProps<'button'>) => (
      <button type="button" {...props}>
        {children}
      </button>
    ),
  },
}));

vi.mock('@/components/general/SectionComp', () => ({
  SectionComp: ({ children, heading }: { children: React.ReactNode; heading: string }) => (
    <section>
      <h2>{heading}</h2>
      {children}
    </section>
  ),
}));

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

describe('ActivePolls', () => {
  it('shows section empty state when there are no active polls', () => {
    render(<ActivePolls polls={[]} />);

    expect(container.querySelector('h3')?.textContent).toBe('No active polls');
    expect(container.textContent).toContain('Create a poll');
  });

  it('renders poll cards when data is present', () => {
    render(
      <ActivePolls
        polls={[
          {
            _id: 'poll-1',
            question: 'Favorite worship style?',
            options: [
              { _id: 'a', text: 'Contemporary', votes: 10, percentage: 60 },
              { _id: 'b', text: 'Traditional', votes: 7, percentage: 40 },
            ],
            totalVotes: 17,
            status: 'active',
            timeAgo: '2 days ago',
          },
        ]}
      />
    );

    expect(container.textContent).toContain('Favorite worship style?');
    expect(container.textContent).not.toContain('No active polls');
  });
});
