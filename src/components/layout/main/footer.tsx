'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-surface-container dark:bg-surface-container w-full py-xl border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-md max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="font-display text-headline-lg-mobile font-bold text-primary tracking-tight">
            Memorize
          </div>
          <div className="hidden sm:block font-data-mono text-[10px] text-outline-variant border border-outline-variant/30 px-1.5 py-0.5 rounded hover:border-primary/50 transition-colors cursor-default">SYS.CORE.ONLINE</div>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-md">
          <Link href="#" className="font-body-sm text-body-sm text-text-secondary hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100">Privacy Policy</Link>
          <Link href="#" className="font-body-sm text-body-sm text-text-secondary hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100">Terms of Service</Link>
          <Link href="#" className="font-body-sm text-body-sm text-text-secondary hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100">Scientific Documentation</Link>
          <Link href="#" className="font-body-sm text-body-sm text-text-secondary hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100">API Reference</Link>
        </div>
        <div className="font-body-sm text-[11px] text-secondary dark:text-secondary opacity-50 flex flex-col items-center md:items-end">
          <span>© 2024 Memorize. Precision Engineering for Human Cognition.</span>
          <span className="font-data-mono mt-1 opacity-70">BUILD_REV: 8.4.12</span>
        </div>
      </div>
    </footer>
  );
}
