'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/form/Button';
import { useTheme } from '@/hooks/useTheme';
import { Menu, X, Sun, Moon } from 'lucide-react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Product', href: '#product' },
    { label: 'Science', href: '#science' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-void/80 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center group-hover:shadow-glow transition-all">
              <span className="text-white font-display font-bold text-lg">M</span>
            </div>
            <span className="font-display font-bold text-lg text-text-primary hidden sm:inline">
              Memorize
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-text-secondary hover:text-text-primary transition-colors text-sm font-body"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-surface-raised transition-colors"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-text-secondary" />
              ) : (
                <Moon className="w-5 h-5 text-text-secondary" />
              )}
            </button>

            {/* CTA Button - Desktop */}
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex"
              asChild
            >
              <Link href="/login">Start Learning</Link>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-surface-raised transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border-subtle">
            <div className="flex flex-col gap-3 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary transition-colors text-sm font-body px-4 py-2 rounded hover:bg-surface-raised"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                variant="primary"
                size="sm"
                className="w-full mx-4"
                asChild
              >
                <Link href="/login">Start Learning</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
