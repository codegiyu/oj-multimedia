import { LogIn } from 'lucide-react';

export const LOGIN_PAGE_TITLE = 'Welcome Back';
export const LOGIN_PAGE_DESCRIPTION = 'Sign in to continue to your account';

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
  title = LOGIN_PAGE_TITLE,
  description = LOGIN_PAGE_DESCRIPTION,
  children,
}: LoginPageLayoutProps) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left - Decorative */}
      <div className="hidden md:flex relative bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-accent/60" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse delay-500" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-bounce delay-700" />
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/10 rounded-full blur-xl animate-bounce delay-1000" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-elegant mb-8">
            <LogIn className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-center font-display">{title}</h2>
          <p className="text-white/90 text-center text-lg max-w-sm">{description}</p>
        </div>
      </div>

      {/* Right - Content slot */}
      <div className="flex flex-col justify-center py-10 px-6 sm:px-8 md:px-12 bg-card">
        <div className="w-full max-w-md mx-auto">
          <div className="md:hidden text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-elegant mb-4">
              <LogIn className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>

          <div className="hidden md:block mb-8">
            <h1 className="text-2xl font-bold font-display">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
