'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/common/theme-toggle';
import { useAuthStore } from '@/stores/use-auth-store'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Science', href: '#science' },
  { label: 'Pricing', href: '#pricing' },
]

export function Header() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handleLogout() {
    logout()
    router.push('/')
    setMobileOpen(false)
  }

  const showAuthenticated = mounted && isAuthenticated

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 shadow-sm">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-3 sm:py-3.5 max-w-7xl mx-auto gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl sm:text-2xl font-bold tracking-tight text-primary shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          Memorize
        </Link>

        {/* Desktop nav links — only visible at lg+ */}
        <div className="hidden lg:flex gap-6 xl:gap-8 items-center flex-1 justify-center">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-body-base text-sm xl:text-base transition-all duration-300 hover:-translate-y-[1px]',
                i === 0
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right actions — lg+ */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
          <ThemeToggle />
          {!showAuthenticated ? (
            <>
              <Link
                href="/login"
                className="text-on-surface-variant text-sm hover:text-primary transition-colors whitespace-nowrap"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-fixed transition-all duration-300 whitespace-nowrap"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {/* Truncated email */}
              <span className="text-xs text-text-secondary max-w-[120px] xl:max-w-[180px] truncate">
                {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap"
              >
                Sign out
              </button>
            </div>
          )}
          <Link
            href={showAuthenticated ? '/dashboard' : '/login'}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold active:scale-90 transition-all duration-300 hover:bg-primary-fixed hover:scale-100 hover:shadow-[0_0_20px_rgba(107,216,203,0.5)] whitespace-nowrap"
          >
            {showAuthenticated ? 'Dashboard' : 'Start Session'}
          </Link>
        </div>

        {/* Mobile/Tablet: theme toggle + hamburger (shown below lg) */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet dropdown menu */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-outline-variant/20',
          mobileOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="px-4 sm:px-6 py-3 flex flex-col gap-1 bg-surface/95 backdrop-blur-md">
          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-3 rounded-lg text-on-surface-variant text-sm hover:text-primary hover:bg-surface-hover transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="my-2 h-px bg-outline-variant/20" />

          {/* Auth section */}
          {!showAuthenticated ? (
            <div className="flex flex-col gap-2 pb-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-lg text-on-surface-variant text-sm hover:text-primary hover:bg-surface-hover transition-all duration-200"
              >
                Sign in
              </Link>
              <div className="flex gap-2 px-1">
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center bg-primary/10 border border-primary/30 text-primary px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all duration-300"
                >
                  Sign up
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-fixed transition-all duration-300"
                >
                  Start Session
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pb-2">
              <div className="px-3 py-1 text-xs text-text-secondary truncate">
                {user?.name || user?.email}
              </div>
              <div className="flex gap-2 px-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-fixed transition-all duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex-1 text-center border border-outline-variant/50 text-text-secondary px-4 py-2.5 rounded-xl text-sm hover:text-primary hover:border-primary/50 transition-all duration-200"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
