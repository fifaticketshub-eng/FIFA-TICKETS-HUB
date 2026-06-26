import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { getLoginUrl } from '@/const';
import { trpc } from '@/lib/trpc';
import { Menu, X, Moon, Sun, LogIn, LogOut } from 'lucide-react';
import siteLogo from '@/assets/logo.jpg';
import headerBackground from '@/assets/header1.png';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const utils = trpc.useUtils();
  const { data: user } = trpc.auth.me.useQuery();
  const isDark = theme === 'dark';
  const isAdmin = user?.role === 'admin';
  const loginUrl = getLoginUrl();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      setIsOpen(false);
      setLocation('/');
    },
  });

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/matches', label: 'Matches' },
    { href: '/packages', label: 'Categories' },
    { href: '/verify-ticket', label: 'Verify Ticket' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ];

  const headerOverlay = isDark
    ? 'linear-gradient(90deg, rgba(10, 31, 63, 0.62), rgba(10, 31, 63, 0.42))'
    : 'linear-gradient(90deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.36))';
  const headerClass = isDark
    ? 'text-white border-fifa-light-blue/40'
    : 'text-fifa-navy border-border';
  const navLinkClass = isDark
    ? 'px-4 py-2 text-white hover:bg-fifa-gold hover:text-fifa-navy rounded-lg transition-colors font-medium'
    : 'px-4 py-2 text-fifa-navy hover:bg-fifa-gold hover:text-fifa-navy rounded-lg transition-colors font-medium';
  const iconButtonClass = isDark
    ? 'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-fifa-gold hover:text-fifa-navy transition-colors'
    : 'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-fifa-navy/20 bg-white/70 text-fifa-navy hover:bg-fifa-gold hover:text-fifa-navy transition-colors';
  const mobileButtonClass = isDark
    ? 'md:hidden p-2 text-white hover:bg-fifa-gold hover:text-fifa-navy rounded-lg transition-colors'
    : 'md:hidden p-2 text-fifa-navy hover:bg-fifa-gold hover:text-fifa-navy rounded-lg transition-colors';
  const authButtonClass = isDark
    ? 'inline-flex border-white/30 bg-white/10 text-white hover:bg-fifa-gold hover:text-fifa-navy'
    : 'inline-flex border-fifa-navy/20 bg-white/70 text-fifa-navy hover:bg-fifa-gold hover:text-fifa-navy';

  const handleLogin = () => {
    if (loginUrl) {
      window.location.href = loginUrl;
    }
  };

  return (
    <nav
      className={`${headerClass} sticky top-0 z-50 border-b bg-cover bg-center bg-no-repeat shadow-lg`}
      style={{
        backgroundImage: `${headerOverlay}, url(${headerBackground})`,
      }}
    >
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
            aria-label="FIFA Ticket Hub home"
          >
            <img
              src={siteLogo}
              alt="FIFA Ticket Hub"
              className="h-16 w-auto max-w-[240px] rounded-md object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={iconButtonClass}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAdmin && (
              <Button asChild className="hidden sm:inline-block bg-fifa-gold text-fifa-navy hover:opacity-90">
                <Link href="/admin">
                  Admin
                </Link>
              </Button>
            )}

            {user ? (
              <Button
                type="button"
                variant="outline"
                className={authButtonClass}
                disabled={logout.isPending}
                onClick={() => logout.mutate()}
              >
                <LogOut size={16} />
                {logout.isPending ? 'Logging out...' : 'Logout'}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className={authButtonClass}
                disabled={!loginUrl}
                onClick={handleLogin}
              >
                <LogIn size={16} />
                Login
              </Button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={mobileButtonClass}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${navLinkClass} block`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className={`${navLinkClass} block`}
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {user && (
              <button
                type="button"
                className={`${navLinkClass} flex w-full items-center gap-2 text-left`}
                disabled={logout.isPending}
                onClick={() => logout.mutate()}
              >
                <LogOut size={16} />
                {logout.isPending ? 'Logging out...' : 'Logout'}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
