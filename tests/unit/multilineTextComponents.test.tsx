import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MultilineText } from '@/components/general/MultilineText';
import { MultilinePreview } from '@/components/general/MultilinePreview';
import { StructuredProseContent } from '@/components/general/StructuredProseContent';

/** Admin/public spot-check sample: line break inside para, blank line between paragraphs. */
const SPOT_CHECK_TEXT = 'Line1\nLine2\n\nLine3';

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );

  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
  vi.unstubAllGlobals();
});

function render(ui: ReactElement) {
  act(() => {
    root.render(ui);
  });
}

describe('MultilineText', () => {
  it('renders two paragraphs for spot-check textarea content', () => {
    render(<MultilineText text={SPOT_CHECK_TEXT} paragraphClassName="text-base" />);

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]?.textContent).toBe('Line1Line2');
    expect(paragraphs[0]?.querySelectorAll('br')).toHaveLength(1);
    expect(paragraphs[1]?.textContent).toBe('Line3');
  });

  it('renders nothing for empty text', () => {
    render(<MultilineText text="   " />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('animate mode still outputs one p per paragraph', () => {
    render(<MultilineText animate text={SPOT_CHECK_TEXT} />);
    expect(container.querySelectorAll('p')).toHaveLength(2);
  });
});

describe('MultilinePreview', () => {
  it('shows only the first paragraph as a single line', () => {
    render(<MultilinePreview text={SPOT_CHECK_TEXT} />);
    const p = container.querySelector('p');
    expect(p?.textContent).toBe('Line1 Line2');
  });

  it('returns null when text is empty', () => {
    render(<MultilinePreview text="" />);
    expect(container.querySelector('p')).toBeNull();
  });
});

describe('StructuredProseContent', () => {
  it('renders string content with paragraph splits', () => {
    render(<StructuredProseContent content={SPOT_CHECK_TEXT} />);
    expect(container.querySelectorAll('p')).toHaveLength(2);
  });

  it('renders structured sections with heading and paragraphs', () => {
    render(
      <StructuredProseContent
        content={{
          introduction: 'Intro',
          sections: [
            {
              heading: 'Section A',
              paragraphs: [SPOT_CHECK_TEXT],
            },
          ],
          conclusion: 'The end',
        }}
      />
    );

    expect(container.querySelector('h2')?.textContent).toBe('Section A');
    expect(container.querySelectorAll('p').length).toBeGreaterThanOrEqual(3);
  });

  it('animate mode renders stagger container with paragraph blocks', () => {
    render(<StructuredProseContent animate content={SPOT_CHECK_TEXT} />);
    expect(container.querySelectorAll('p')).toHaveLength(2);
  });
});
