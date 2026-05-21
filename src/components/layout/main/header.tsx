'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/common/theme-toggle';
import { useAuthStore } from '@/stores/use-auth-store'
import { useRouter } from 'next/navigation'

export function Header() {
  const isAuthenticated = useAuthStore((s)=>s.isAuthenticated)
  const user = useAuthStore((s)=>s.user)
  const logout = useAuthStore((s)=>s.logout)
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  function handleLogout(){
    logout()
    router.push('/')
  }

  const showAuthenticated = mounted && isAuthenticated

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 shadow-sm">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-md max-w-7xl mx-auto">
        <Link href="/" className="font-display text-headline-lg-mobile font-bold tracking-tight text-primary">
          Memorize
        </Link>
        <div className="hidden md:flex gap-lg items-center">
          <Link className="text-primary font-bold border-b-2 border-primary pb-1 font-body-base text-body-base hover:text-primary-fixed hover:-translate-y-[1px] transition-all duration-300" href="#product">Product</Link>
          <Link className="text-on-surface-variant font-body-base text-body-base hover:text-primary hover:-translate-y-[1px] transition-all duration-300" href="#science">Science</Link>
          <Link className="text-on-surface-variant font-body-base text-body-base hover:text-primary hover:-translate-y-[1px] transition-all duration-300" href="#pricing">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!showAuthenticated ? (
            <>
              <Link href="/login" className="text-on-surface-variant">Sign in</Link>
              <Link href="/signup" className="bg-primary text-on-primary px-lg py-sm rounded-lg font-body-sm text-body-sm font-bold scale-95">Sign up</Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-sm text-text-secondary">{user?.name || user?.email}</div>
              <button onClick={handleLogout} className="text-sm text-on-surface-variant">Sign out</button>
            </div>
          )}

          <Link href={showAuthenticated ? '/dashboard' : '/login'} className="bg-primary text-on-primary px-lg py-sm rounded-lg font-body-sm text-body-sm font-bold scale-95 active:scale-90 transition-all duration-300 hover:bg-primary-fixed hover:scale-100 hover:shadow-[0_0_20px_rgba(107,216,203,0.5)]">
            Start Session
          </Link>
        </div>
      </div>
    </nav>
  );
}
