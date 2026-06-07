import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ArtistFollowButton } from '@/components/section/community/artists/ArtistFollowButton';

const callApiMock = vi.fn();
const toastErrorMock = vi.fn();

let authUser: { _id: string } | null = null;

vi.mock('@/lib/services/callApi', () => ({
  callApi: (...args: unknown[]) => callApiMock(...args),
}));

vi.mock('@/lib/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { user: { _id: string } | null }) => unknown) =>
    selector({ user: authUser }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

vi.mock('@/components/auth/LoginModal', () => ({
  LoginModal: ({ open }: { open: boolean }) => (open ? <div data-testid="login-modal" /> : null),
}));

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  authUser = null;
  callApiMock.mockReset();
  toastErrorMock.mockReset();
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

function clickFollowButton() {
  const button = container.querySelector('button');
  expect(button).toBeTruthy();

  act(() => {
    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

describe('ArtistFollowButton', () => {
  it('renders Follow when not following', () => {
    render(
      <ArtistFollowButton
        artistId="507f1f77bcf86cd799439011"
        initialIsFollowing={false}
        initialFollowerCount={10}
      />
    );

    expect(container.textContent).toContain('Follow');
    expect(container.textContent).not.toContain('Following');
  });

  it('opens login modal when unauthenticated user clicks', () => {
    render(<ArtistFollowButton artistId="507f1f77bcf86cd799439011" initialIsFollowing={false} />);

    clickFollowButton();

    expect(container.querySelector('[data-testid="login-modal"]')).toBeTruthy();
    expect(callApiMock).not.toHaveBeenCalled();
  });

  it('optimistically follows and calls USER_FOLLOW_ARTIST', async () => {
    authUser = { _id: 'user-1' };
    callApiMock.mockResolvedValue({
      data: { follow: { followers: 11 } },
      error: null,
      message: 'Artist followed.',
    });

    const onFollowChange = vi.fn();

    render(
      <ArtistFollowButton
        artistId="507f1f77bcf86cd799439011"
        initialIsFollowing={false}
        initialFollowerCount={10}
        onFollowChange={onFollowChange}
      />
    );

    await act(async () => {
      clickFollowButton();
      await Promise.resolve();
    });

    expect(callApiMock).toHaveBeenCalledWith('USER_FOLLOW_ARTIST', {
      query: '/507f1f77bcf86cd799439011',
    });
    expect(container.textContent).toContain('Following');
    expect(onFollowChange).toHaveBeenCalledWith({
      isFollowing: true,
      followerCount: 11,
    });
  });

  it('rolls back follow state and shows toast on API error', async () => {
    authUser = { _id: 'user-1' };
    callApiMock.mockResolvedValue({
      data: null,
      error: true,
      message: 'Could not follow artist',
    });

    render(
      <ArtistFollowButton
        artistId="507f1f77bcf86cd799439011"
        initialIsFollowing={false}
        initialFollowerCount={10}
      />
    );

    await act(async () => {
      clickFollowButton();
      await Promise.resolve();
    });

    expect(container.textContent).toContain('Follow');
    expect(toastErrorMock).toHaveBeenCalledWith('Could not follow artist');
  });
});
