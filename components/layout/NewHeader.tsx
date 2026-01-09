'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Music,
  Mic2,
  BookOpen,
  Users,
  // Search,
  ChevronDown,
  LogIn,
  User,
  Heart,
  Settings,
  LogOut,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from './UserMenu';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegularBtn } from '../atoms/RegularBtn';

const navLinks = [
  { name: 'Music', href: '/music', icon: Music },
  { name: 'Sermons', href: '/sermons', icon: Mic2 },
  { name: 'Devotionals', href: '/devotionals', icon: BookOpen },
];

const communityDropdownLinks = [
  { name: 'News & Lifestyle', href: '/community/news-and-lifestyle' },
  { name: 'Promote Your Content', href: '/community/promote-your-content' },
  { name: 'Connect & Engage', href: '/community/connect-and-engage' },
  { name: 'Marketplace', href: '/marketplace' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text block">OJ Multimedia</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200">
                <link.icon className="w-4 h-4" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}

            {/* Community Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsCommunityOpen(true)}
              onMouseLeave={() => setIsCommunityOpen(false)}>
              <button className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200">
                <Users className="w-4 h-4" />
                <span className="font-medium">Community</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isCommunityOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isCommunityOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 animate-fade-in">
                  <div className="bg-card border border-border rounded-lg shadow-lg p-2">
                    <div className="flex flex-col gap-1">
                      {communityDropdownLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.href}
                          className="block px-4 py-3 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                          onClick={() => setIsCommunityOpen(false)}>
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button> */}
            <div className="hidden md:block">
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-up">
            <div className="flex flex-col gap-2">
              {/* Search Button */}
              {/* <button
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                onClick={() => setIsOpen(false)}>
                <Search className="w-5 h-5" />
                <span className="font-medium">Search</span>
              </button> */}

              {navLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}>
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}

              {/* Mobile Community Dropdown */}
              <div className="px-0">
                <button
                  onClick={() => setIsCommunityOpen(!isCommunityOpen)}
                  className="flex items-center justify-between w-full gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Community</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${isCommunityOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isCommunityOpen && (
                  <div className="mt-2 ml-4 grid gap-1 border-l-2 border-border pl-4">
                    {communityDropdownLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          setIsCommunityOpen(false);
                        }}>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile User Menu */}
              <div className="px-0 pt-2 border-t border-border mt-2">
                <UserMenuMobile onMenuClose={() => setIsOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Mobile User Menu Component
function UserMenuMobile({ onMenuClose }: { onMenuClose: () => void }) {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    onMenuClose();
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
        <RegularBtn
          size="full"
          variant="outline"
          className="flex items-center gap-3 w-full px-4 py-3"
          wrapClassName="mt-2"
          onClick={() => {
            setIsLoginModalOpen(true);
            // onMenuClose();
          }}>
          <LogIn className="w-5 h-5" />
          <span className="font-medium">Login</span>
        </RegularBtn>
        <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      </>
    );
  }

  return (
    <div className="px-0">
      {/* User Info Button - Clickable to toggle dropdown */}
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center justify-between w-full gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={user.avatar} alt={getUserName()} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-foreground truncate">{getUserName()}</p>
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Menu Items Dropdown */}
      {isUserMenuOpen && (
        <div className="mt-2 ml-4 grid gap-1 border-l-2 border-border pl-4">
          <Link
            href="/account"
            className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => {
              setIsUserMenuOpen(false);
              onMenuClose();
            }}>
            <User className="w-4 h-4" />
            <span>Account</span>
          </Link>
          <Link
            href="/account/favourites"
            className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => {
              setIsUserMenuOpen(false);
              onMenuClose();
            }}>
            <Heart className="w-4 h-4" />
            <span>My Favourites</span>
          </Link>
          <Link
            href="/account/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => {
              setIsUserMenuOpen(false);
              onMenuClose();
            }}>
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <div className="border-t border-border my-1" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors text-left">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
