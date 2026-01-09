'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, User, Heart, Settings, LogOut, ChevronDown, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoginModal } from '@/components/auth/LoginModal';

export function UserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, actions } = useAuthStore(state => ({
    user: state.user,
    actions: state.actions,
  }));

  // Initialize session on mount
  useEffect(() => {
    if (!user) {
      actions.initSession();
    }
  }, [user, actions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await actions.logout();
    } catch (error) {
      // If logout fails, still clear session locally
      actions.clearSession();
      console.error('Logout failed:', error);
    }
    router.push('/');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return first + last || 'U';
  };

  const getUserName = () => {
    if (!user) return '';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
  };

  if (!user) {
    return (
      <>
        <Button variant="hero" size="sm" className="flex" onClick={() => setIsLoginModalOpen(true)}>
          <LogIn className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Login</span>
        </Button>
        <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      </>
    );
  }

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}>
      <button
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
        onClick={() => setIsOpen(!isOpen)}>
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.avatar} alt={getUserName()} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 pt-2 w-64 max-w-[calc(100vw-2rem)] animate-fade-in z-50">
          <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar} alt={getUserName()} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{getUserName()}</p>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href="/account"
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}>
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Account</span>
              </Link>
              <Link
                href="/account/favourites"
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}>
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span>My Favourites</span>
              </Link>
              <Link
                href="/account/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}>
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Settings</span>
              </Link>
              <div className="border-t border-border my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
