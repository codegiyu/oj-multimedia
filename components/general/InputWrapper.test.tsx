import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InputWrapper } from '@/components/general/InputWrapper';

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

describe('InputWrapper', () => {
  it('uses a div root so parent space-y utilities apply between fields', () => {
    render(
      <InputWrapper label="Email">
        <input data-testid="field" />
      </InputWrapper>
    );

    const wrapper = container.firstElementChild;
    expect(wrapper?.tagName).toBe('DIV');
    expect(wrapper?.querySelector('label')).not.toBeNull();
  });

  it('renders errors outside the label element', () => {
    render(
      <InputWrapper label="Email" errors={['Required field']}>
        <input data-testid="field" />
      </InputWrapper>
    );

    const label = container.querySelector('label');
    const error = container.querySelector('p.text-red-500');

    expect(label?.contains(error)).toBe(false);
    expect(error?.textContent).toBe('Required field');
  });
});
