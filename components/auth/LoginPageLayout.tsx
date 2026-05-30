import { LoginArtworkPanel } from '@/components/auth/LoginArtworkPanel';
import { LOGIN_ARTWORK_DESCRIPTION, LOGIN_ARTWORK_TITLE } from '@/components/auth/loginConstants';

interface LoginPageLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * UI-only layout for the auth login page. Used by the server page to wrap
 * the core client content and the Suspense fallback.
 */
export function LoginPageLayout({
  title = LOGIN_ARTWORK_TITLE,
  description = LOGIN_ARTWORK_DESCRIPTION,
  children,
}: LoginPageLayoutProps) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <LoginArtworkPanel title={title} description={description} logoHref="/" />
      {children}
    </div>
  );
}
