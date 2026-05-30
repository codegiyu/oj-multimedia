'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGoogleLogin } from '@/lib/hooks/use-google-login';
import { LoginArtworkPanel } from '@/components/auth/LoginArtworkPanel';
import { LoginFormShell } from '@/components/auth/LoginFormShell';
import { LoginGoogleButton } from '@/components/auth/LoginGoogleButton';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function LoginModal({ open, onOpenChange, title, description }: LoginModalProps) {
  const { isGoogleScriptLoaded, loginLoading, handleGoogleLogin } = useGoogleLogin({
    enabled: open,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-4xl p-0 overflow-hidden border-border">
        <div className="grid md:grid-cols-2 min-h-[500px]">
          <LoginArtworkPanel title={title} description={description} />
          <LoginFormShell variant="modal">
            <LoginGoogleButton
              onClick={handleGoogleLogin}
              disabled={!isGoogleScriptLoaded}
              loading={loginLoading}
            />
          </LoginFormShell>
        </div>
      </DialogContent>
    </Dialog>
  );
}
