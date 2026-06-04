'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-surface-container dark:bg-surface-container w-full py-8 sm:py-10 md:py-12 border-t border-outline-variant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        {/* Top row: logo + links */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="font-display text-xl sm:text-2xl font-bold text-primary tracking-tight">
              Memorize
            </div>
            <div className="hidden sm:block font-data-mono text-[10px] text-outline-variant border border-outline-variant/30 px-1.5 py-0.5 rounded hover:border-primary/50 transition-colors cursor-default">
              SYS.CORE.ONLINE
            </div>
          </div>

          {/* Footer links */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
            <Link href="#" className="font-body-sm text-xs sm:text-sm text-text-secondary hover:text-primary transition-colors opacity-80 hover:opacity-100">
              Privacy Policy
            </Link>
            <Link href="#" className="font-body-sm text-xs sm:text-sm text-text-secondary hover:text-primary transition-colors opacity-80 hover:opacity-100">
              Terms of Service
            </Link>
            <Link href="#" className="font-body-sm text-xs sm:text-sm text-text-secondary hover:text-primary transition-colors opacity-80 hover:opacity-100">
              Scientific Documentation
            </Link>
            <Link href="#" className="font-body-sm text-xs sm:text-sm text-text-secondary hover:text-primary transition-colors opacity-80 hover:opacity-100">
              API Reference
            </Link>
          </div>
        </div>

        {/* Bottom: copyright */}
        <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <span className="font-body-sm text-[11px] text-text-secondary opacity-50">
            © 2024 Memorize. Precision Engineering for Human Cognition.
          </span>
          <span className="font-data-mono text-[11px] text-text-secondary opacity-40">
            BUILD_REV: 8.4.12
          </span>
        </div>
      </div>
    </footer>
  );
}
